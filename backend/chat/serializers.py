from rest_framework import serializers
from .models import ChatSession, Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'content', 'is_bot', 'created_at']
        read_only_fields = ['id', 'created_at']


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = ['id', 'session_id', 'user_name', 'user_email', 'user_phone', 'messages', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ChatMessageRequestSerializer(serializers.Serializer):
    """Serializer for receiving chat messages from the frontend"""
    session_id = serializers.CharField(max_length=255)
    message = serializers.CharField(max_length=5000)
    user_details = serializers.JSONField(required=False)


class ChatResponseSerializer(serializers.Serializer):
    """Serializer for sending chat responses to the frontend"""
    user_message = serializers.CharField()
    bot_response = serializers.CharField()
    timestamp = serializers.DateTimeField()
