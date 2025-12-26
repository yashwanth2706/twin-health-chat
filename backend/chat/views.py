from django.shortcuts import render
from django.conf import settings
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from google import genai
from datetime import datetime
import uuid
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import ChatSession, Message
from .serializers import ChatSessionSerializer, ChatMessageRequestSerializer

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
        """Get response from Gemini API with context from previous messages"""
        
        # Build conversation context from previous messages
        conversation_history = []
        previous_messages = Message.objects.filter(session=session).order_by('created_at')[:20]  # Last 20 messages
        
        for msg in previous_messages:
            role = "user" if not msg.is_bot else "model"
            conversation_history.append({
                "role": role,
                "parts": [msg.content]
            })
            
        system_prompt = """You are a helpful health assistant for Twin Health, a platform dedicated to helping people reverse diabetes, 
        obesity, and PCOD by healing the root cause of metabolism. 

        Key information about Twin Health:
        - We have 50,000+ members who have benefitted
        - We use India's Whole Body Digital Twin™ technology
        - We focus on healing the root cause of metabolic issues
        - We provide personalized guidance for reversing diabetes, obesity, and PCOD

        When users ask about health topics:
        1. Be empathetic and supportive
        2. Provide general health information
        3. Encourage them to consult with healthcare professionals for medical advice
        4. Share relevant Twin Health program benefits when appropriate
        5. Answer questions about how our platform can help them

        Always maintain a friendly, professional tone."""
                
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=system_prompt + "\n\nUser: " + user_message,
        )
        # model = genai.GenerativeModel(settings.GEMINI_MODEL)
        
        # System prompt for Twin Health chatbot
        
        # Create new chat session with Gemini
        # chat = model.start_chat(history=conversation_history)
        
        # Send the user message and get response
        # response = chat.send_message(user_message)
        
        return response.text
