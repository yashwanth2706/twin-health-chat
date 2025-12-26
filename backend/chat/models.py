from django.db import models
from django.utils import timezone


class ChatSession(models.Model):
    """Model to store chat sessions"""
    session_id = models.CharField(max_length=255, unique=True)
    user_name = models.CharField(max_length=255, blank=True, null=True)
    user_email = models.EmailField(blank=True, null=True)
    user_phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Session {self.session_id} - {self.user_name or 'Anonymous'}"

    class Meta:
        ordering = ['-created_at']


class Message(models.Model):
    """Model to store messages in a chat session"""
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    is_bot = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{'Bot' if self.is_bot else 'User'}: {self.content[:50]}"

    class Meta:
        ordering = ['created_at']
