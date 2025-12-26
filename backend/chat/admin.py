from django.contrib import admin
from .models import ChatSession, Message


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'user_name', 'user_email', 'created_at', 'updated_at']
    search_fields = ['session_id', 'user_name', 'user_email']
    list_filter = ['created_at', 'updated_at']
    readonly_fields = ['session_id', 'created_at', 'updated_at']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'session', 'is_bot', 'created_at', 'get_preview']
    search_fields = ['content', 'session__session_id']
    list_filter = ['is_bot', 'created_at']
    readonly_fields = ['created_at']

    def get_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    
    get_preview.short_description = 'Message Preview'
