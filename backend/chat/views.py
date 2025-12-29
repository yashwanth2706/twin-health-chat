from django.shortcuts import render
from django.conf import settings
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
import google as genai
from datetime import datetime
import uuid
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging
from typing import Dict, Optional

from .models import ChatSession, Message
from .serializers import ChatSessionSerializer, ChatMessageRequestSerializer
from .prompts.system_prompt import system_prompt
from .rag_engine import get_rag_engine

logger = logging.getLogger(__name__)

# Gets the Gemini API Key from the environment variable `GEMINI_API_KEY`.
client = genai.Client(api_key=settings.GEMINI_API_KEY)

@method_decorator(csrf_exempt, name="dispatch")
class ChatSessionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing chat sessions"""
    queryset = ChatSession.objects.all()
    serializer_class = ChatSessionSerializer
    lookup_field = 'session_id'

    @action(detail=False, methods=['post'])
    def create_session(self, request):
        """Create a new chat session"""
        session_id = str(uuid.uuid4())
        user_data = request.data.get('user_details', {})
        
        session = ChatSession.objects.create(
            session_id=session_id,
            user_name=user_data.get('name'),
            user_email=user_data.get('email'),
            user_phone=user_data.get('phone')
        )
        
        serializer = self.get_serializer(session)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def get_session(self, request):
        """Get a chat session by session_id"""
        session_id = request.query_params.get('session_id')
        if not session_id:
            return Response(
                {'error': 'session_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            session = ChatSession.objects.get(session_id=session_id)
            serializer = self.get_serializer(session)
            return Response(serializer.data)
        except ChatSession.DoesNotExist:
            return Response(
                {'error': 'Session not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def update_user_details(self, request):
        """Update user details for a session"""
        session_id = request.data.get('session_id')
        user_details = request.data.get('user_details', {})
        
        try:
            session = ChatSession.objects.get(session_id=session_id)
            session.user_name = user_details.get('name', session.user_name)
            session.user_email = user_details.get('email', session.user_email)
            session.user_phone = user_details.get('phone', session.user_phone)
            session.save()
            
            serializer = self.get_serializer(session)
            return Response(serializer.data)
        except ChatSession.DoesNotExist:
            return Response(
                {'error': 'Session not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def all_sessions(self, request):
        """Get all sessions with user details and message summaries"""
        sessions = ChatSession.objects.all().order_by('-created_at')
        
        sessions_data = []
        for session in sessions:
            messages = Message.objects.filter(session=session).order_by('created_at')
            
            # Build chat history with truncation
            chat_history = []
            for msg in messages:
                sender = "User" if not msg.is_bot else "Bot"
                content = msg.content
                
                # Truncate question to 100 chars
                if not msg.is_bot:
                    truncated_content = content[:100] + "..." if len(content) > 100 else content
                else:
                    # Truncate bot response to 200 chars
                    truncated_content = content[:200] + "..." if len(content) > 200 else content
                
                chat_history.append({
                    "sender": sender,
                    "content": truncated_content,
                    "timestamp": msg.created_at.isoformat()
                })
            
            # Calculate session duration
            created = session.created_at
            updated = session.updated_at
            duration_minutes = int((updated - created).total_seconds() / 60)
            
            sessions_data.append({
                "session_id": session.session_id,
                "user_name": session.user_name or "N/A",
                "user_email": session.user_email or "N/A",
                "user_phone": session.user_phone or "N/A",
                "created_at": created.isoformat(),
                "updated_at": updated.isoformat(),
                "duration_minutes": duration_minutes,
                "chat_history": chat_history,
                "total_messages": len(messages)
            })
        
        return Response(sessions_data)

@method_decorator(csrf_exempt, name="dispatch")
class ChatMessageAPIView(APIView):
    """API endpoint for sending messages and getting responses from Gemini"""

    def post(self, request):
        """Send a message and get a response from Gemini"""
        serializer = ChatMessageRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        session_id = serializer.validated_data['session_id']
        user_message = serializer.validated_data['message']
        user_details = serializer.validated_data.get('user_details')
        
        # Get or create session
        session, created = ChatSession.objects.get_or_create(
            session_id=session_id,
            defaults={
                'user_name': user_details.get('name') if user_details else None,
                'user_email': user_details.get('email') if user_details else None,
                'user_phone': user_details.get('phone') if user_details else None,
            }
        )
        
        # If session exists but user details provided, update them
        if user_details and not created:
            session.user_name = user_details.get('name', session.user_name)
            session.user_email = user_details.get('email', session.user_email)
            session.user_phone = user_details.get('phone', session.user_phone)
            session.save()
        
        # Save user message
        Message.objects.create(
            session=session,
            content=user_message,
            is_bot=False
        )
        
        # Get bot response from Gemini
        try:
            bot_response = self._get_gemini_response(user_message, session)
            
            # Save bot message
            Message.objects.create(
                session=session,
                content=bot_response,
                is_bot=True
            )
            
            response_data = {
                'user_message': user_message,
                'bot_response': bot_response,
                'timestamp': datetime.now(),
                'session_id': session_id
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {'error': f'Failed to get response from Gemini: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _get_gemini_response(self, user_message, session):
        """
        Get response with RAG (Retrieval-Augmented Generation).
        
        Process:
        1. Retrieve answer from knowledge base using RAG engine
        2. Check if answer is in scope (high confidence)
        3. Validate contextual alignment between user question and KB match
        4. Return KB answer if high confidence AND contextually aligned
        5. Use Gemini for low confidence or misaligned matches
        """
        
        try:
            # Step 1: Try to retrieve answer from knowledge base
            rag_engine = get_rag_engine()
            kb_answer, metadata = rag_engine.retrieve_answer(user_message)
            
            # Log retrieval attempt
            logger.info(f"RAG Query: '{user_message[:100]}...' | Intent: {metadata.get('intent_id')} | "
                       f"Confidence: {metadata.get('confidence')} | Strategy: {metadata.get('strategy')}")
            
            # Step 2: Check if answer is in scope (high confidence threshold)
            if rag_engine.is_in_scope(metadata):
                # Step 3: Validate contextual alignment with the matched question
                is_contextually_aligned = self._validate_contextual_alignment(
                    user_message, 
                    metadata.get('matched_question', ''),
                    metadata.get('confidence', 0)
                )
                
                if is_contextually_aligned:
                    # High confidence AND contextually aligned - return KB answer
                    logger.info(f"In-scope and contextually aligned answer returned "
                              f"(confidence: {metadata['confidence']})")
                    return self._format_knowledge_base_answer(kb_answer, metadata)
                else:
                    # High confidence but NOT contextually aligned - use Gemini
                    logger.warning(f"High confidence match but contextually misaligned. "
                                 f"Matched: '{metadata.get('matched_question')}' vs "
                                 f"User: '{user_message}'. Using Gemini for context-aware response.")
                    return self._get_gemini_followup(user_message, session, metadata)
            
            # Step 4: Out of scope - use Gemini for guidance
            logger.info(f"Out-of-scope query (confidence: {metadata['confidence']}). Using Gemini.")
            return self._get_gemini_followup(user_message, session, metadata)
            
        except Exception as e:
            logger.error(f"RAG engine error: {str(e)}. Falling back to Gemini.")
            return self._get_gemini_followup(user_message, session, None)
    
    def _validate_contextual_alignment(self, user_query: str, matched_question: str, confidence: float) -> bool:
        """
        Validate that the matched KB question is contextually aligned with the user's query.
        
        This prevents false positives where the RAG engine finds a high-scoring match
        that isn't actually answering what the user asked.
        
        Strategy:
        1. For high confidence (>=90): Always trust the match
        2. For medium-high confidence (80-89): Apply strict contextual validation
        3. For medium confidence (70-79): Apply moderate validation
        
        Validation checks:
        - Semantic similarity of key topics
        - Word overlap and semantic meaning
        - Query intent alignment
        
        Args:
            user_query: User's original question
            matched_question: Question that matched from KB
            confidence: Confidence score from RAG matching
            
        Returns:
            True if contextually aligned, False otherwise
        """
        from difflib import SequenceMatcher
        from rapidfuzz import fuzz
        
        user_query_lower = user_query.lower().strip()
        matched_question_lower = matched_question.lower().strip()
        
        # Step 1: Exact match or very high confidence - always trust
        if confidence >= 90:
            logger.debug(f"Very high confidence ({confidence}%). Skipping contextual validation.")
            return True
        
        # Step 2: Extract key semantic tokens (excluding common words)
        stop_words = {'the', 'a', 'an', 'is', 'are', 'am', 'do', 'does', 'did', 'will', 'would', 
                     'can', 'could', 'should', 'may', 'might', 'must', 'have', 'has', 'had',
                     'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
        
        user_tokens = set(word for word in user_query_lower.split() if word not in stop_words and len(word) > 2)
        matched_tokens = set(word for word in matched_question_lower.split() if word not in stop_words and len(word) > 2)
        
        # Calculate token overlap
        if user_tokens and matched_tokens:
            token_overlap = len(user_tokens & matched_tokens) / len(user_tokens | matched_tokens)
        else:
            token_overlap = 0
        
        # Step 3: Apply threshold based on confidence level
        if confidence >= 80:
            # Medium-high confidence: stricter validation needed
            alignment_threshold = 0.4  # At least 40% semantic overlap required
        else:
            # Medium confidence (70-79): moderate validation
            alignment_threshold = 0.3  # At least 30% semantic overlap required
        
        # Step 4: Additional fuzzy alignment check
        fuzzy_alignment_score = fuzz.token_set_ratio(user_query_lower, matched_question_lower) / 100.0
        
        # Combined alignment score (weighted)
        combined_alignment = (token_overlap * 0.5) + (fuzzy_alignment_score * 0.5)
        
        is_aligned = combined_alignment >= alignment_threshold
        
        logger.debug(f"Contextual alignment check: confidence={confidence}, "
                    f"token_overlap={token_overlap:.2f}, fuzzy_score={fuzzy_alignment_score:.2f}, "
                    f"combined={combined_alignment:.2f}, threshold={alignment_threshold}, "
                    f"aligned={is_aligned}")
        
        return is_aligned
    
    def _format_knowledge_base_answer(self, answer: str, metadata: Dict) -> str:
        """
        Format knowledge base answer based on confidence level.
        
        Confidence Levels:
        - >= 90 (EXACT_MATCH): Send answer directly to user
        - >= 80 (PARTIAL_MATCH): Send answer directly to user
        - >= 70 (FUZZY_MATCH) or less: Send to chatbot with KB context block
        
        Args:
            answer: The answer from knowledge base
            metadata: Metadata about the match
            
        Returns:
            Formatted answer string
        """
        confidence = metadata.get('confidence', 0)
        matched_question = metadata.get('matched_question', '')
        intent_id = metadata.get('intent_id', '')
        strategy = metadata.get('strategy', '')
        
        # High confidence (EXACT or PARTIAL MATCH) - Direct answer to user
        if confidence >= 80:
            logger.info(f"High confidence match ({confidence}%). Sending direct KB answer to user.")
            return answer
        
        # Lower confidence (FUZZY MATCH or less) - Include knowledge base block
        else:
            logger.info(f"Lower confidence match ({confidence}%). Including KB context block.")
            
            kb_context_block = f"""Based on our knowledge base, here's what I found:

**Knowledge Base Match:**
- Confidence: {confidence}%
- Matched Intent: {intent_id}
- Matched Question: "{matched_question}"
- Detection Strategy: {strategy}

**Answer:**
{answer}

---
*This answer is from Twin Health's knowledge base. If you need more details, feel free to ask follow-up questions!*"""
            
            return kb_context_block
    
    def _get_gemini_followup(self, user_message: str, session, rag_metadata: Optional[Dict]) -> str:
        """
        Get Gemini response for out-of-scope or follow-up questions.
        
        Args:
            user_message: User's question
            session: Chat session
            rag_metadata: Optional metadata from RAG attempt
            
        Returns:
            Gemini response
        """
        
        # Build conversation context from previous messages
        conversation_history = []
        previous_messages = Message.objects.filter(session=session).order_by('created_at')[:20]
        
        for msg in previous_messages:
            role = "user" if not msg.is_bot else "model"
            conversation_history.append({
                "role": role,
                "parts": [msg.content]
            })
        
        # Enhanced system prompt with RAG context
        enhanced_prompt = system_prompt
        
        if rag_metadata and rag_metadata.get('confidence', 0) > 0:
            # User's query is somewhat related to Twin Health but didn't match exactly
            enhanced_prompt += f"\n\nNote: User's question has partial relevance to Twin Health " \
                              f"(intent: {rag_metadata.get('intent_id')}). " \
                              f"Provide helpful context while staying focused on Twin Health if applicable."
        else:
            # Completely out of scope
            enhanced_prompt += "\n\nNote: User's question appears to be outside the scope of Twin Health. " \
                              "Politely redirect to Twin Health topics or suggest contacting the team."
        
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash-lite",
                contents=enhanced_prompt + "\n\nUser: " + user_message,
            )
            return response.text
        
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise
