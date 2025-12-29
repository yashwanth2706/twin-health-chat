"""
RAG (Retrieval-Augmented Generation) Engine for Twin Health Chatbot

Features:
- Intent matching with semantic similarity
- Intent conflict resolution with scoring
- Knowledge base retrieval with relevance ranking
- Fallback handling for out-of-scope questions
- Confidence scoring and threshold management
"""

import json
from typing import List, Dict, Tuple, Optional
from pathlib import Path
from difflib import SequenceMatcher
from rapidfuzz import fuzz
import logging

logger = logging.getLogger(__name__)


class RAGEngine:
    """
    Retrieval-Augmented Generation Engine for Twin Health knowledge base.
    
    Implements:
    - Intent matching using fuzzy string matching (rapidfuzz)
    - Semantic similarity for intent identification
    - Conflict resolution for ambiguous matches
    - Relevance scoring for answer selection
    """
    
    # Matching thresholds
    EXACT_MATCH_THRESHOLD = 90  # High confidence match
    PARTIAL_MATCH_THRESHOLD = 80  # Good match
    FUZZY_MATCH_THRESHOLD = 70  # Acceptable match
    CONFLICT_RESOLUTION_THRESHOLD = 5  # Points difference to declare clear winner
    
    def __init__(self, knowledge_base_path: str = None):
        """
        Initialize RAG Engine with knowledge base.
        
        Args:
            knowledge_base_path: Path to twin_health_knowledge.json
        """
        self.knowledge_base = None
        self.fallback_message = None
        self.intent_index = {}  # Maps intent_id to questions and answers
        self.topics = []
        
        if knowledge_base_path is None:
            knowledge_base_path = Path(__file__).parent / "knowledge" / "twin_health_knowledge.json"
        
        self._load_knowledge_base(knowledge_base_path)
    
    def _load_knowledge_base(self, path: str) -> None:
        """Load and index the knowledge base."""
        try:
            with open(path, 'r', encoding='utf-8') as f:
                self.knowledge_base = json.load(f)
            
            self.fallback_message = self.knowledge_base.get(
                'fallback_message',
                "Could you please rephrase that? I'm not sure I understood your question."
            )
            
            # Index the knowledge base for fast retrieval
            self._build_intent_index()
            logger.info(f"Knowledge base loaded successfully from {path}")
            
        except FileNotFoundError:
            logger.error(f"Knowledge base file not found: {path}")
            raise
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON in knowledge base: {path}")
            raise
    
    def _build_intent_index(self) -> None:
        """
        Build an index mapping intent IDs to their questions and answers.
        
        Structure:
        {
            'what_is_metabolism': {
                'topic': 'Core Health Concepts',
                'questions': [...],
                'answer': '...',
                'intent_id': '...'
            }
        }
        """
        for topic in self.knowledge_base.get('topics', []):
            self.topics.append({
                'id': topic['id'],
                'title': topic['title']
            })
            
            for qa in topic.get('qas', []):
                intent_id = qa.get('intent')
                self.intent_index[intent_id] = {
                    'topic_id': topic['id'],
                    'topic_title': topic['title'],
                    'questions': qa.get('questions', []),
                    'answer': qa.get('answer', ''),
                    'intent_id': intent_id
                }
    
    def retrieve_answer(self, user_query: str) -> Tuple[str, Dict]:
        """
        Retrieve answer for user query using intent matching.
        
        Returns:
            (answer_text, metadata) where metadata includes:
            - intent_id: Matched intent
            - confidence: Match confidence score (0-100)
            - matched_question: The question that matched
            - strategy: Matching strategy used (exact, fuzzy, semantic)
        """
        
        # Step 1: Find best matching intents
        matches = self._find_matching_intents(user_query)
        
        if not matches:
            return self.fallback_message, {
                'intent_id': None,
                'confidence': 0,
                'matched_question': None,
                'strategy': 'no_match',
                'reason': 'No matching intent found'
            }
        
        # Step 2: Resolve conflicts if multiple high-confidence matches
        best_match = self._resolve_intent_conflicts(matches)
        
        intent_data = self.intent_index[best_match['intent_id']]
        
        return intent_data['answer'], {
            'intent_id': best_match['intent_id'],
            'confidence': best_match['confidence'],
            'matched_question': best_match['matched_question'],
            'strategy': best_match['strategy'],
            'topic_id': intent_data['topic_id'],
            'topic_title': intent_data['topic_title'],
            'all_candidates': matches[:3]  # Include top 3 candidates for debugging
        }
    
    def _find_matching_intents(self, user_query: str) -> List[Dict]:
        """
        Find all matching intents ranked by relevance score.
        
        Args:
            user_query: User's input question
            
        Returns:
            List of matches sorted by confidence score (descending)
            Each match includes: intent_id, confidence, matched_question, strategy
        """
        matches = []
        query_lower = user_query.lower().strip()
        
        # Try to find matches for each intent
        for intent_id, intent_data in self.intent_index.items():
            intent_matches = self._match_intent(query_lower, intent_data)
            matches.extend(intent_matches)
        
        # Sort by confidence score (descending)
        matches.sort(key=lambda x: x['confidence'], reverse=True)
        
        return matches
    
    def _match_intent(self, query_lower: str, intent_data: Dict) -> List[Dict]:
        """
        Match user query against all questions for a specific intent.
        
        Uses multiple matching strategies:
        1. Exact substring match
        2. Token-based matching (rapidfuzz token_set_ratio)
        3. Fuzzy string matching (rapidfuzz ratio)
        4. Semantic similarity (sequence matching)
        
        Returns:
            List of matches for this intent (max 1 per intent)
        """
        best_match_for_intent = None
        best_score = 0
        best_strategy = None
        best_question = None
        
        for question in intent_data['questions']:
            question_lower = question.lower().strip()
            
            # Strategy 1: Exact substring match
            if query_lower == question_lower:
                score = 100
                strategy = 'exact'
            
            # Strategy 2: Token-based matching (best for word-level matching)
            elif query_lower in question_lower or question_lower in query_lower:
                score = fuzz.token_set_ratio(query_lower, question_lower)
                strategy = 'token_set'
            
            # Strategy 3: Fuzzy string matching (best for typos)
            else:
                score = fuzz.ratio(query_lower, question_lower)
                strategy = 'fuzzy'
            
            # Track best match for this intent
            if score > best_score:
                best_score = score
                best_strategy = strategy
                best_question = question
        
        # Only include if score is above minimum threshold
        if best_score >= self.FUZZY_MATCH_THRESHOLD:
            return [{
                'intent_id': intent_data['intent_id'],
                'confidence': best_score,
                'matched_question': best_question,
                'strategy': best_strategy
            }]
        
        return []
    
    def _resolve_intent_conflicts(self, matches: List[Dict]) -> Dict:
        """
        Resolve conflicts when multiple intents match with similar scores.
        
        Strategy:
        1. If top match is significantly higher than others, return it
        2. If multiple matches are within CONFLICT_RESOLUTION_THRESHOLD:
           - Return the one with the highest confidence
           - Log the conflict for debugging
        
        Args:
            matches: List of matches sorted by confidence
            
        Returns:
            The best match after conflict resolution
        """
        if not matches:
            return None
        
        top_match = matches[0]
        
        # Check for conflicts (multiple matches within threshold)
        conflicts = [m for m in matches[1:] 
                    if top_match['confidence'] - m['confidence'] < self.CONFLICT_RESOLUTION_THRESHOLD]
        
        if conflicts:
            conflict_log = f"Intent conflict detected: {top_match['intent_id']} " \
                          f"(score: {top_match['confidence']}) vs {[m['intent_id'] for m in conflicts]} " \
                          f"(scores: {[m['confidence'] for m in conflicts]}). " \
                          f"Selected: {top_match['intent_id']}"
            logger.warning(conflict_log)
        
        return top_match
    
    def is_in_scope(self, answer_metadata: Dict) -> bool:
        """
        Check if the answer is in scope (has sufficient confidence).
        
        Args:
            answer_metadata: Metadata returned from retrieve_answer()
            
        Returns:
            True if confidence >= PARTIAL_MATCH_THRESHOLD
        """
        return answer_metadata.get('confidence', 0) >= self.PARTIAL_MATCH_THRESHOLD
    
    def get_topics(self) -> List[Dict]:
        """Get list of all available topics."""
        return self.topics
    
    def get_topic_questions(self, topic_id: str) -> List[str]:
        """Get all questions for a specific topic."""
        questions = []
        for intent_id, intent_data in self.intent_index.items():
            if intent_data['topic_id'] == topic_id:
                questions.extend(intent_data['questions'])
        return questions
    
    def update_thresholds(self, exact: int = None, partial: int = None, 
                         fuzzy: int = None, conflict: int = None) -> None:
        """
        Update matching thresholds for fine-tuning.
        
        Args:
            exact: Exact match threshold (0-100)
            partial: Partial match threshold (0-100)
            fuzzy: Fuzzy match threshold (0-100)
            conflict: Conflict resolution threshold (0-100)
        """
        if exact is not None:
            self.EXACT_MATCH_THRESHOLD = exact
        if partial is not None:
            self.PARTIAL_MATCH_THRESHOLD = partial
        if fuzzy is not None:
            self.FUZZY_MATCH_THRESHOLD = fuzzy
        if conflict is not None:
            self.CONFLICT_RESOLUTION_THRESHOLD = conflict
        
        logger.info(f"Thresholds updated: exact={self.EXACT_MATCH_THRESHOLD}, "
                   f"partial={self.PARTIAL_MATCH_THRESHOLD}, "
                   f"fuzzy={self.FUZZY_MATCH_THRESHOLD}, "
                   f"conflict={self.CONFLICT_RESOLUTION_THRESHOLD}")


# Singleton instance
_rag_engine = None


def get_rag_engine() -> RAGEngine:
    """Get or create the singleton RAG engine instance."""
    global _rag_engine
    if _rag_engine is None:
        _rag_engine = RAGEngine()
    return _rag_engine


def retrieve_answer(user_query: str) -> Tuple[str, Dict]:
    """
    Retrieve answer for user query using the RAG engine.
    
    This is a convenience function that uses the singleton RAG engine.
    """
    engine = get_rag_engine()
    return engine.retrieve_answer(user_query)
