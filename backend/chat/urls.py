from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatSessionViewSet, ChatMessageAPIView

# Create router for ViewSets
router = DefaultRouter()
router.register(r'sessions', ChatSessionViewSet, basename='chat-session')

app_name = 'chat'

urlpatterns = [
    path('', include(router.urls)),
    path('message/', ChatMessageAPIView.as_view(), name='send-message'),
]
