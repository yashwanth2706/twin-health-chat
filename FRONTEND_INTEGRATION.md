# Frontend Integration with Django Backend

This guide explains how to integrate the React frontend with the Django backend API.

## Backend Setup

Before running the frontend, make sure the Django backend is running:

```bash
cd backend
./run.sh
# Or manually:
# source venv/bin/activate
# python manage.py runserver
```

The backend will run on `http://localhost:8000`

## Frontend Configuration

### Update API Base URL

In your frontend, create or update a file `src/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/chat';

export const chatAPI = {
  createSession: async (userDetails?: any) => {
    const response = await fetch(`${API_BASE_URL}/sessions/create_session/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_details: userDetails }),
    });
    return response.json();
  },

  sendMessage: async (sessionId: string, message: string, userDetails?: any) => {
    const response = await fetch(`${API_BASE_URL}/message/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
        user_details: userDetails,
      }),
    });
    return response.json();
  },

  getSession: async (sessionId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/sessions/get_session/?session_id=${sessionId}`
    );
    return response.json();
  },

  updateUserDetails: async (sessionId: string, userDetails: any) => {
    const response = await fetch(
      `${API_BASE_URL}/sessions/update_user_details/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_details: userDetails,
        }),
      }
    );
    return response.json();
  },
};
```

## ChatWidget Component Integration

Update `src/components/chat/ChatWidget.tsx` to use the backend API:

```typescript
import { useState, useRef, useEffect } from "react";
import { chatAPI } from "@/lib/api";
// ... other imports

const ChatWidget = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Welcome to Twin Health! 👋\n\nBefore we proceed, I'd like to collect your Name, Email, and Phone number.",
      isBot: true,
      timestamp: formatTime(new Date(Date.now() - 300000)),
      showForm: true,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session on component mount
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      const response = await chatAPI.createSession();
      setSessionId(response.session_id);
    } catch (error) {
      console.error("Failed to create chat session:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const handleSendMessage = async (content: string) => {
    if (!sessionId) return;

    // Add user message to UI immediately
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: formatTime(new Date()),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Show typing indicator
    setIsTyping(true);

    try {
      // Send message to backend
      const response = await chatAPI.sendMessage(
        sessionId,
        content,
        userDetails || undefined
      );

      // Add bot response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.bot_response,
        isBot: true,
        timestamp: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Failed to get response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        isBot: true,
        timestamp: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleUserDetailsSubmit = async (details: UserDetails) => {
    setUserDetails(details);

    if (sessionId) {
      try {
        await chatAPI.updateUserDetails(sessionId, details);
      } catch (error) {
        console.error("Failed to update user details:", error);
      }
    }

    // Remove the form from the initial message
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === "1" ? { ...msg, showForm: false } : msg
      )
    );

    // Add confirmation message
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      content: `Thank you, ${details.name}! 🎉\n\nI'm here to help you on your journey to reverse diabetes and achieve metabolic wellness. How can I assist you today?`,
      isBot: true,
      timestamp: formatTime(new Date()),
    };
    setMessages((prev) => [...prev, confirmationMessage]);
  };

  // ... rest of the component
};

export default ChatWidget;
```

## Environment Variables

For development, create a `.env` file in the frontend root:

```
REACT_APP_API_BASE_URL=http://localhost:8000/api/chat
```

## Running Both Frontend and Backend

### Terminal 1 - Backend:
```bash
cd backend
./run.sh
```

### Terminal 2 - Frontend:
```bash
npm run dev
# or
bun dev
```

## API Response Format

### Send Message Response:
```json
{
  "user_message": "How can I reverse diabetes?",
  "bot_response": "Twin Health helps you reverse diabetes by...",
  "timestamp": "2025-12-26T12:00:00Z",
  "session_id": "uuid-string"
}
```

### Error Response:
```json
{
  "error": "Failed to get response from Gemini: error details"
}
```

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
1. Make sure the backend is running on port 8000
2. Check that `http://localhost:5173` is in `CORS_ALLOWED_ORIGINS` in `backend/config/settings.py`
3. Make sure the frontend is running on port 5173

### API Connection Errors
- Verify the backend URL in your API configuration
- Check that the backend is running (`python manage.py runserver`)
- Look at the browser console for detailed error messages

### Gemini API Errors
- Make sure `GEMINI_API_KEY` is set in the backend `.env` file
- Verify the API key is valid in [Google AI Studio](https://aistudio.google.com)
- Check that you have sufficient API quota

## Production Deployment

For production, update the API base URL:

```typescript
// In src/lib/api.ts or environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-api-domain.com/api/chat';
```

Set the environment variable in your deployment:
```bash
REACT_APP_API_BASE_URL=https://your-api-domain.com/api/chat
```
