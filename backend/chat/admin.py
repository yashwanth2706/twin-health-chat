from django.contrib import admin
from .models import ChatSession, Message


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'user_name', 'user_email', 'user_phone', 'message_count', 'session_duration', 'created_at']
    search_fields = ['session_id', 'user_name', 'user_email', 'user_phone']
    list_filter = ['created_at', 'updated_at']
    readonly_fields = ['session_id', 'created_at', 'updated_at', 'session_duration']

    def message_count(self, obj):
        count = obj.messages.count()
        return count
    message_count.short_description = 'Total Messages'

    def session_duration(self, obj):
        duration_seconds = (obj.updated_at - obj.created_at).total_seconds()
        duration_minutes = int(duration_seconds / 60)
        return f"{duration_minutes} mins"
    session_duration.short_description = 'Session Duration'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'session', 'is_bot', 'created_at', 'get_preview']
    search_fields = ['content', 'session__session_id']
    list_filter = ['is_bot', 'created_at']
    readonly_fields = ['created_at']

    def get_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    
    get_preview.short_description = 'Message Preview'
