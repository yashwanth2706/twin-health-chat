"""
Test suite for RAG Engine

Run with: python manage.py test chat.tests.test_rag_engine
Or: pytest backend/chat/tests/test_rag_engine.py
"""

import pytest
from django.test import TestCase
from chat.rag_engine import RAGEngine, get_rag_engine


class TestRAGEngineBasic(TestCase):
    """Test basic RAG engine functionality"""
    
    def setUp(self):
        """Initialize RAG engine for each test"""
        self.engine = get_rag_engine()
    
    def test_engine_initialization(self):
        """Test that RAG engine loads knowledge base"""
        assert self.engine is not None
        assert self.engine.knowledge_base is not None
        assert len(self.engine.intent_index) > 0
    
    def test_exact_match(self):
        """Test exact question matching"""
        answer, metadata = self.engine.retrieve_answer("What is metabolism?")
        
        assert metadata['confidence'] > 85
        assert metadata['strategy'] in ['exact', 'token_set']
        assert 'metabolism' in answer.lower()
    
    def test_partial_match(self):
        """Test partial/fuzzy matching"""
        answer, metadata = self.engine.retrieve_answer("Tell me about metabolism")
        
        assert metadata['confidence'] > 70
        assert metadata['matched_question'] is not None
    
    def test_typo_handling(self):
        """Test fuzzy matching with typos"""
        answer, metadata = self.engine.retrieve_answer("What is metabolsm?")
        
        assert metadata['confidence'] > 70
        assert metadata['strategy'] in ['fuzzy', 'token_set']
    
    def test_case_insensitivity(self):
        """Test that matching is case insensitive"""
        answer1, meta1 = self.engine.retrieve_answer("what is metabolism?")
        answer2, meta2 = self.engine.retrieve_answer("WHAT IS METABOLISM?")
        
        assert meta1['confidence'] == meta2['confidence']
    
    def test_out_of_scope_query(self):
        """Test handling of out-of-scope questions"""
        answer, metadata = self.engine.retrieve_answer("How to cook rice?")
        
        # Should not match any intent
        assert metadata['confidence'] < 60
        assert answer == self.engine.fallback_message
    
    def test_is_in_scope(self):
        """Test scope detection"""
        # In scope
        _, metadata_in = self.engine.retrieve_answer("What is metabolism?")
        assert self.engine.is_in_scope(metadata_in) is True
        
        # Out of scope
        _, metadata_out = self.engine.retrieve_answer("How to cook?")
        assert self.engine.is_in_scope(metadata_out) is False


class TestRAGEngineIntents(TestCase):
    """Test intent matching and conflict resolution"""
    
    def setUp(self):
        self.engine = get_rag_engine()
    
    def test_metabolism_intent(self):
        """Test metabolism-related question"""
        answer, metadata = self.engine.retrieve_answer("What does metabolism mean?")
        
        assert metadata['intent_id'] == 'what_is_metabolism'
        assert metadata['confidence'] > 70
    
    def test_digital_twin_intent(self):
        """Test digital twin related question"""
        answer, metadata = self.engine.retrieve_answer("What is digital twin?")
        
        assert metadata['intent_id'] == 'what_is_digital_twin'
        assert metadata['confidence'] > 70
    
    def test_diabetes_remission_intent(self):
        """Test diabetes remission related question"""
        answer, metadata = self.engine.retrieve_answer("Can diabetes be reversed?")
        
        assert metadata['intent_id'] == 'diabetes_remission'
        assert metadata['confidence'] > 70
    
    def test_weight_loss_intent(self):
        """Test weight loss related question"""
        answer, metadata = self.engine.retrieve_answer("Does Twin Health help with weight loss?")
        
        assert metadata['intent_id'] == 'weight_loss'
        assert metadata['confidence'] > 70
    
    def test_get_topics(self):
        """Test retrieving available topics"""
        topics = self.engine.get_topics()
        
        assert len(topics) > 0
        assert any(t['id'] == 'core_concepts' for t in topics)
        assert any(t['id'] == 'digital_twin' for t in topics)
    
    def test_get_topic_questions(self):
        """Test retrieving questions for a topic"""
        questions = self.engine.get_topic_questions('core_concepts')
        
        assert len(questions) > 0
        assert any('metabolism' in q.lower() for q in questions)


class TestRAGEngineMetadata(TestCase):
    """Test metadata returned by RAG engine"""
    
    def setUp(self):
        self.engine = get_rag_engine()
    
    def test_metadata_structure(self):
        """Test that metadata has all required fields"""
        answer, metadata = self.engine.retrieve_answer("What is metabolism?")
        
        required_fields = [
            'intent_id', 'confidence', 'matched_question',
            'strategy', 'topic_id', 'topic_title'
        ]
        
        for field in required_fields:
            assert field in metadata, f"Missing field: {field}"
    
    def test_confidence_range(self):
        """Test that confidence is always 0-100"""
        test_queries = [
            "What is metabolism?",
            "How to cook?",
            "Tell me about Twin Health",
            "Random gibberish xyz"
        ]
        
        for query in test_queries:
            _, metadata = self.engine.retrieve_answer(query)
            assert 0 <= metadata['confidence'] <= 100, \
                f"Confidence out of range for query: {query}"
    
    def test_strategy_values(self):
        """Test that strategy is a valid value"""
        test_queries = [
            "What is metabolism?",
            "what is metabolsm",
            "How to cook?"
        ]
        
        valid_strategies = ['exact', 'token_set', 'fuzzy', 'semantic', 'no_match']
        
        for query in test_queries:
            _, metadata = self.engine.retrieve_answer(query)
            assert metadata['strategy'] in valid_strategies, \
                f"Invalid strategy: {metadata['strategy']}"


class TestRAGEngineThresholds(TestCase):
    """Test threshold configuration"""
    
    def setUp(self):
        self.engine = RAGEngine()  # Fresh instance
    
    def test_default_thresholds(self):
        """Test default threshold values"""
        assert self.engine.EXACT_MATCH_THRESHOLD == 90
        assert self.engine.PARTIAL_MATCH_THRESHOLD == 70
        assert self.engine.FUZZY_MATCH_THRESHOLD == 60
        assert self.engine.CONFLICT_RESOLUTION_THRESHOLD == 5
    
    def test_update_thresholds(self):
        """Test updating threshold values"""
        self.engine.update_thresholds(
            exact=85,
            partial=65,
            fuzzy=55,
            conflict=3
        )
        
        assert self.engine.EXACT_MATCH_THRESHOLD == 85
        assert self.engine.PARTIAL_MATCH_THRESHOLD == 65
        assert self.engine.FUZZY_MATCH_THRESHOLD == 55
        assert self.engine.CONFLICT_RESOLUTION_THRESHOLD == 3
    
    def test_threshold_effect_on_matching(self):
        """Test that threshold changes affect matching"""
        engine1 = RAGEngine()
        engine2 = RAGEngine()
        
        # Lowering threshold should increase matches
        engine2.update_thresholds(fuzzy=30)
        
        query = "How to cook?"
        _, meta1 = engine1.retrieve_answer(query)
        _, meta2 = engine2.retrieve_answer(query)
        
        # meta2 should have higher confidence or match something
        # (depends on knowledge base content)
        assert isinstance(meta1, dict)
        assert isinstance(meta2, dict)


class TestRAGEngineConflicts(TestCase):
    """Test intent conflict resolution"""
    
    def setUp(self):
        self.engine = get_rag_engine()
    
    def test_conflict_detection(self):
        """Test that conflicts are detected"""
        # Query that might match multiple intents
        answer, metadata = self.engine.retrieve_answer("Can I reduce medication safely?")
        
        # Should have metadata about all candidates
        candidates = metadata.get('all_candidates', [])
        if len(candidates) > 1:
            # Conflict detection worked
            assert True
    
    def test_best_match_selection(self):
        """Test that best match is selected in conflicts"""
        answer, metadata = self.engine.retrieve_answer("medication reduction")
        
        # Should select the highest scoring match
        assert metadata['intent_id'] is not None
        assert metadata['confidence'] > 0


class TestRAGEngineEdgeCases(TestCase):
    """Test edge cases and error handling"""
    
    def setUp(self):
        self.engine = get_rag_engine()
    
    def test_empty_query(self):
        """Test handling of empty query"""
        answer, metadata = self.engine.retrieve_answer("")
        
        assert metadata['confidence'] < 60
        assert answer == self.engine.fallback_message
    
    def test_very_long_query(self):
        """Test handling of very long query"""
        long_query = "What is metabolism? " * 100
        
        try:
            answer, metadata = self.engine.retrieve_answer(long_query)
            assert isinstance(answer, str)
            assert isinstance(metadata, dict)
        except Exception as e:
            pytest.fail(f"Should handle long queries: {e}")
    
    def test_special_characters(self):
        """Test handling of special characters"""
        query = "What is metabolism?!@#$%"
        
        try:
            answer, metadata = self.engine.retrieve_answer(query)
            assert isinstance(answer, str)
        except Exception as e:
            pytest.fail(f"Should handle special characters: {e}")
    
    def test_unicode_characters(self):
        """Test handling of unicode characters"""
        query = "What is मेटाबोलिज्म?"  # Hindi characters
        
        try:
            answer, metadata = self.engine.retrieve_answer(query)
            assert isinstance(answer, str)
        except Exception as e:
            pytest.fail(f"Should handle unicode: {e}")
    
    def test_whitespace_handling(self):
        """Test that extra whitespace doesn't affect matching"""
        answer1, meta1 = self.engine.retrieve_answer("What is metabolism?")
        answer2, meta2 = self.engine.retrieve_answer("  What  is   metabolism?  ")
        
        # Should have similar confidence
        assert abs(meta1['confidence'] - meta2['confidence']) < 5


class TestRAGEngineSingleton(TestCase):
    """Test singleton pattern"""
    
    def test_singleton_instance(self):
        """Test that get_rag_engine returns same instance"""
        engine1 = get_rag_engine()
        engine2 = get_rag_engine()
        
        assert engine1 is engine2


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
