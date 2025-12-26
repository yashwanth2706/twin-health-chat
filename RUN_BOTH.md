# Running Frontend + Backend Together

This guide explains how to run the React frontend and Django backend simultaneously.

## Prerequisites

✅ Backend setup complete (Django, Gemini API key configured)
✅ Frontend dependencies installed
✅ Both servers can run on localhost

## Quick Start (2 Terminals)

### Terminal 1: Start Backend
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

Expected output:
```
Starting development server at http://127.0.0.1:8000/
```

**OR use the startup script:**
```bash
cd backend
./run.sh
```

### Terminal 2: Start Frontend
```bash
npm run dev
```

**OR with bun:**
```bash
bun dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Access the Application

Open your browser and go to: **http://localhost:5173**

The frontend will automatically connect to the backend at `http://localhost:8000/api/chat`

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Your Browser                          │
│              http://localhost:5173                       │
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │         React Frontend (ChatWidget)              │  │
│  │  - User interface                                │  │
│  │  - Form validation                               │  │
│  │  - Message display                               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                   HTTP Requests
                    JSON (fetch)
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│            Django Backend (REST API)                     │
│         http://localhost:8000/api/chat                  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │  ChatSessionViewSet                              │  │
│  │  - Create sessions                               │  │
│  │  - Update user details                           │  │
│  │  - Manage conversations                          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │  ChatMessageAPIView                              │  │
│  │  - Receive user messages                         │  │
│  │  - Call Gemini API                               │  │
│  │  - Return AI responses                           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │  SQLite Database                                 │  │
│  │  - Chat sessions                                 │  │
│  │  - Messages                                      │  │
│  │  - User details                                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                   HTTPS API Call
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Google Gemini API                           │
│     (AI responses for chat messages)                    │
└─────────────────────────────────────────────────────────┘
```

---

## How It Works

### 1. Page Load
- Frontend initializes (React mounts ChatWidget)
- Backend session is created automatically
- Session ID is stored in component state

### 2. User Details Collection
- User enters name, email, phone
- Frontend validates inputs
- Backend stores user details in database

### 3. Chat Conversation
- User sends message
- Frontend sends request to backend: `POST /api/chat/message/`
- Backend receives message
- Backend calls Gemini API
- Gemini processes message with context
- Backend returns AI response
- Frontend displays response to user

### 4. Conversation History
- All messages stored in database
- Accessible via Django admin at `http://localhost:8000/admin/`

---

## API Endpoints Used by Frontend

### 1. Create Session (on component mount)
```
POST /api/chat/sessions/create_session/
```
- Response: `{ session_id, user_name, user_email, user_phone, ... }`

### 2. Update User Details (after form submission)
```
POST /api/chat/sessions/update_user_details/
```
- Body: `{ session_id, user_details: { name, email, phone } }`
- Response: Updated session object

### 3. Send Message (on user input)
```
POST /api/chat/message/
```
- Body: `{ session_id, message, user_details }`
- Response: `{ user_message, bot_response, timestamp, session_id }`

---

## Environment Configuration

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:8000/api/chat
```

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-api-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

---

## Troubleshooting

### "Cannot connect to backend"
```bash
# Check if backend is running
curl http://localhost:8000/api/chat/sessions/

# If not, start it:
cd backend
./run.sh
```

### CORS Error in Browser Console
The backend is configured to accept requests from `http://localhost:5173`

If you see CORS errors:
1. Verify backend is running on port 8000
2. Check `CORS_ALLOWED_ORIGINS` in `backend/config/settings.py`
3. Restart both servers

### "Port 8000 already in use"
```bash
# Kill the process using port 8000
lsof -ti:8000 | xargs kill -9

# Then restart backend
cd backend
./run.sh
```

### "Port 5173 already in use"
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Then restart frontend
npm run dev
```

### No response from Gemini
1. Check `GEMINI_API_KEY` in `backend/.env`
2. Verify API key is valid in Google AI Studio
3. Check API quota in Google Cloud Console
4. Look at backend console for error messages

### Database errors
```bash
cd backend
source venv/bin/activate
python manage.py migrate
```

---

## Viewing Conversations in Admin

1. Create superuser (if not done):
   ```bash
   python manage.py createsuperuser
   ```

2. Visit: `http://localhost:8000/admin/`

3. Login with superuser credentials

4. Navigate to:
   - **Chat Sessions** - View all user conversations
   - **Messages** - View individual messages
   - Filter by session ID, user, or date

---

## File Structure

```
project/
├── frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   └── api.ts              ← API client
│   │   ├── components/
│   │   │   └── chat/
│   │   │       └── ChatWidget.tsx   ← Updated to use backend
│   │   └── ...
│   ├── .env.local                  ← Frontend config
│   └── package.json
│
└── backend/
    ├── config/
    │   ├── settings.py             ← CORS configured
    │   └── urls.py
    ├── chat/
    │   ├── models.py               ← ChatSession, Message
    │   ├── views.py                ← API views with Gemini
    │   ├── serializers.py
    │   └── urls.py
    ├── manage.py
    ├── .env                        ← Backend config
    ├── requirements.txt
    └── db.sqlite3                  ← Database (auto-created)
```

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/lib/api.ts` | API client utilities for backend calls |
| `src/components/chat/ChatWidget.tsx` | Main component (now uses backend) |
| `backend/chat/views.py` | API endpoints (handles Gemini calls) |
| `backend/config/settings.py` | Django config (CORS, Gemini key) |
| `.env.local` | Frontend configuration |
| `backend/.env` | Backend configuration |

---

## Development Workflow

1. **Backend changes?**
   - Django auto-reloads
   - No need to restart

2. **Frontend changes?**
   - Vite auto-hot-reloads
   - No need to refresh (most of the time)

3. **Database schema changes?**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Added new Python packages?**
   ```bash
   pip install package-name
   pip freeze > requirements.txt
   ```

---

## Production Deployment

For production, you'll need to:

1. **Backend**
   - Use PostgreSQL instead of SQLite
   - Set `DEBUG=False`
   - Generate strong `SECRET_KEY`
   - Use Gunicorn server
   - Configure HTTPS

2. **Frontend**
   - Build: `npm run build`
   - Deploy static files to CDN or hosting
   - Update `VITE_API_BASE_URL` to production backend URL

See `BACKEND_SETUP.md` for full deployment instructions.

---

## Quick Reference

```bash
# Start everything
Terminal 1:
cd backend && source venv/bin/activate && ./run.sh

Terminal 2:
npm run dev

# Check backend
curl http://localhost:8000/api/chat/

# Check frontend
http://localhost:5173

# View admin
http://localhost:8000/admin/

# View databases
sqlite3 backend/db.sqlite3

# Stop servers
Ctrl+C in both terminals
```

---

## Summary

✅ Frontend and backend communicate via REST API
✅ All messages sent to Django backend
✅ Gemini AI powers the responses
✅ User details and history stored in database
✅ CORS configured for local development
✅ Ready for frontend/backend development

You're all set! Start both servers and test the chat. 🚀
