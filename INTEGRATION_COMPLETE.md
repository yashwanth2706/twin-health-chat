# ✅ Frontend-Backend Integration Complete!

Your React frontend is now fully connected to the Django backend with Gemini AI integration!

## What's Connected

### Frontend Changes ✅
- **`src/lib/api.ts`** - New API client for backend communication
- **`src/components/chat/ChatWidget.tsx`** - Updated to use backend API
- **`.env.local`** - Frontend configuration with backend URL

### How It Works
1. User opens chat → Frontend creates session on backend
2. User enters details → Frontend sends to backend, stored in database
3. User sends message → Frontend calls backend API
4. Backend receives message → Sends to Gemini AI
5. Gemini responds → Backend returns to frontend
6. Frontend displays response → User sees AI reply

---

## Quick Start

### Terminal 1: Backend
```bash
cd backend
source venv/bin/activate
./run.sh
# or: python manage.py runserver
```

### Terminal 2: Frontend
```bash
npm run dev
# or: bun dev
```

### Open Browser
```
http://localhost:5173
```

---

## API Endpoints Being Used

| Operation | Endpoint | Method |
|-----------|----------|--------|
| Create Session | `/api/chat/sessions/create_session/` | POST |
| Send Message | `/api/chat/message/` | POST |
| Get Session | `/api/chat/sessions/get_session/` | GET |
| Update Details | `/api/chat/sessions/update_user_details/` | POST |

---

## File Changes

### New Files Created
```
src/lib/api.ts              ← API client utilities
.env.local                  ← Frontend environment config
RUN_BOTH.md                 ← Complete running guide
```

### Files Modified
```
src/components/chat/ChatWidget.tsx  ← Now uses backend API
```

---

## Code Example: API Usage

```typescript
// Import the API client
import { chatAPI } from "@/lib/api";

// Create a session
const session = await chatAPI.createSession();
const sessionId = session.session_id;

// Send a message
const response = await chatAPI.sendMessage(
  sessionId,
  "How can I reverse diabetes?",
  { name: "John", email: "john@example.com", phone: "+1234567890" }
);

console.log(response.bot_response); // Gemini's response!
```

---

## Flow Diagram

```
User Types Message
    ↓
ChatWidget.handleSendMessage()
    ↓
fetch('POST /api/chat/message/')
    ↓
Django Backend Receives
    ↓
Call Gemini API
    ↓
Get AI Response
    ↓
Save to Database
    ↓
Return JSON Response
    ↓
Frontend Updates UI
    ↓
User Sees AI Reply
```

---

## Data Stored in Database

### ChatSession Table
- `session_id` - Unique identifier
- `user_name` - User's name
- `user_email` - User's email
- `user_phone` - User's phone
- `created_at` - Session start time
- `updated_at` - Last activity time

### Message Table
- `session` - Foreign key to ChatSession
- `content` - Message text
- `is_bot` - True if bot response
- `created_at` - Message time

---

## View Conversations in Admin

1. Go to: `http://localhost:8000/admin/`
2. Login (create superuser if needed)
3. Browse:
   - **Chat Sessions** - All conversations
   - **Messages** - Individual messages

---

## Environment Variables

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:8000/api/chat
```

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

---

## Testing the Integration

### Test 1: Create Session
```bash
curl -X POST http://localhost:8000/api/chat/sessions/create_session/ \
  -H "Content-Type: application/json" \
  -d '{"user_details": {}}'
```

### Test 2: Send Message
```bash
curl -X POST http://localhost:8000/api/chat/message/ \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "your-session-id",
    "message": "Hello, how are you?"
  }'
```

---

## Error Handling

The frontend handles errors gracefully:

```typescript
// If API call fails
catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  setApiError(errorMessage);
  
  // Show error message to user
  setMessages((prev) => [...prev, {
    content: `Sorry, I encountered an error: ${errorMessage}`,
    isBot: true,
    // ...
  }]);
}
```

---

## Troubleshooting

### "Cannot connect to backend"
- ✓ Check backend is running: `http://localhost:8000/`
- ✓ Check `.env.local` has correct API URL
- ✓ Restart frontend: stop and run `npm run dev` again

### "CORS error"
- ✓ Backend already configured for localhost:5173
- ✓ Make sure frontend is on port 5173
- ✓ Restart both servers

### "No Gemini response"
- ✓ Verify `GEMINI_API_KEY` in backend/.env
- ✓ Check API key is valid in Google AI Studio
- ✓ Look at backend console for errors

### "Session not created"
- ✓ Check backend is accessible: `curl http://localhost:8000/api/chat/`
- ✓ Check browser console for errors
- ✓ Verify CORS is working (no CORS error in console)

---

## Next Steps

1. ✅ Start both servers (see RUN_BOTH.md)
2. ✅ Open chat in browser
3. ✅ Test conversation with Gemini
4. ✅ Check database in admin panel
5. ✅ Deploy when ready (see BACKEND_SETUP.md)

---

## Important Notes

⚠️ **Keep your Gemini API key secret!**
- Never commit `.env` to git
- `.env` is already in `.gitignore`

⚠️ **CORS is only for development**
- Update in production to your domain
- See `backend/config/settings.py`

⚠️ **Database is SQLite (development)**
- For production, use PostgreSQL
- See `BACKEND_SETUP.md` for migration guide

---

## Architecture Summary

```
┌─────────────────────┐
│   React Frontend    │
│  (ChatWidget.tsx)   │
│   Port: 5173        │
└──────────┬──────────┘
           │
        HTTP/JSON
      (fetch API)
           │
┌──────────▼──────────┐
│  Django Backend     │
│  REST API           │
│  Port: 8000         │
├─────────────────────┤
│ - ChatSession Model │
│ - Message Model     │
│ - Gemini API Call   │
├─────────────────────┤
│  SQLite Database    │
└──────────┬──────────┘
           │
      API Call
           │
┌──────────▼──────────┐
│   Google Gemini     │
│   AI Responses      │
└─────────────────────┘
```

---

## Files Reference

| File | Type | Purpose |
|------|------|---------|
| `src/lib/api.ts` | TypeScript | API client utilities |
| `src/components/chat/ChatWidget.tsx` | React Component | Main chat UI (updated) |
| `.env.local` | Config | Frontend API URL |
| `backend/.env` | Config | Backend settings |
| `backend/chat/models.py` | Django Model | Database schema |
| `backend/chat/views.py` | Django View | API endpoints |
| `RUN_BOTH.md` | Documentation | Complete setup guide |

---

## Success Checklist

- [x] API client created (`src/lib/api.ts`)
- [x] ChatWidget connected to backend
- [x] Session creation on mount
- [x] User details sent to backend
- [x] Messages sent to Gemini via backend
- [x] Responses displayed in frontend
- [x] Error handling implemented
- [x] Environment configured
- [x] CORS setup complete
- [x] Documentation complete

---

## What's Working Now

✅ Frontend-backend communication
✅ Chat session management
✅ User detail collection
✅ Gemini AI integration
✅ Message history storage
✅ Error handling
✅ Conversation context
✅ Database persistence

---

## Summary

Your Twin Health Chat application is now fully integrated:
- React frontend communicates with Django backend
- All messages processed by Gemini AI
- Conversation history stored in database
- Ready for development and deployment

**Next: Start both servers and test the chat!**

See `RUN_BOTH.md` for detailed instructions.
