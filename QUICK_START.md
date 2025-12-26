# Quick Reference Card

## 🚀 Start the Application (2 Terminals)

### Terminal 1: Backend
```bash
cd backend && source venv/bin/activate && ./run.sh
```
Runs on: `http://localhost:8000`

### Terminal 2: Frontend
```bash
npm run dev
```
Runs on: `http://localhost:5173`

---

## 🔗 What's Connected

| Frontend | → | Backend | → | Gemini |
|----------|---|---------|---|--------|
| ChatWidget.tsx | API Calls | Django REST API | Gemini Calls | AI Responses |

---

## 📝 Key Files

| File | What It Does |
|------|--------------|
| `src/lib/api.ts` | API client for backend calls |
| `src/components/chat/ChatWidget.tsx` | Chat interface (uses backend) |
| `backend/chat/views.py` | API endpoints (calls Gemini) |
| `.env.local` | Frontend config (backend URL) |
| `backend/.env` | Backend config (API keys) |

---

## 🔌 API Endpoints

```bash
# Create session (on page load)
POST /api/chat/sessions/create_session/

# Send message to Gemini
POST /api/chat/message/

# Get conversation history
GET /api/chat/sessions/get_session/?session_id=<id>

# Update user details
POST /api/chat/sessions/update_user_details/
```

---

## 📊 Database Tables

**ChatSession:**
- session_id, user_name, user_email, user_phone

**Message:**
- content, is_bot (true/false), created_at

View in admin: `http://localhost:8000/admin/`

---

## ⚙️ Configuration

**Frontend (.env.local):**
```
VITE_API_BASE_URL=http://localhost:8000/api/chat
```

**Backend (.env):**
```
GEMINI_API_KEY=your-api-key
DEBUG=True
SECRET_KEY=your-secret
```

---

## 🧪 Test It

1. Start both servers (see above)
2. Open `http://localhost:5173`
3. Enter name, email, phone
4. Ask: "How can I reverse diabetes?"
5. Get Gemini's response!

---

## 🐛 Quick Fixes

**Backend not responding?**
```bash
cd backend && ./run.sh
```

**CORS error?**
- Check backend is running on :8000
- Check frontend is on :5173
- Check `.env.local` has correct URL

**No Gemini response?**
- Check `GEMINI_API_KEY` in `backend/.env`
- Check API quota in Google Cloud Console

**Port in use?**
```bash
lsof -ti:8000 | xargs kill -9   # Kill port 8000
lsof -ti:5173 | xargs kill -9   # Kill port 5173
```

---

## 📖 Full Guides

- **Running:** `RUN_BOTH.md`
- **Integration:** `INTEGRATION_COMPLETE.md`
- **Backend Setup:** `BACKEND_SETUP.md`
- **API Testing:** `API_TESTING.md`
- **Backend Docs:** `backend/README.md`

---

## 💾 Useful Commands

```bash
# Create superuser (view conversations in admin)
cd backend && python manage.py createsuperuser

# View database
sqlite3 backend/db.sqlite3

# Run migrations
cd backend && python manage.py migrate

# Make migrations (after model changes)
cd backend && python manage.py makemigrations

# Django shell
cd backend && python manage.py shell
```

---

## 🎯 Flow

```
User Enters Message
    ↓
Frontend: fetch('/api/chat/message/', {...})
    ↓
Backend: Receives request
    ↓
Gemini: Process & respond
    ↓
Backend: Save to DB, return response
    ↓
Frontend: Display response
    ↓
User Sees AI Reply ✨
```

---

## ✅ Status

- [x] Backend: Django + REST Framework
- [x] Frontend: React + TypeScript
- [x] API: Connected & Working
- [x] Gemini: Integrated
- [x] Database: SQLite (ready)
- [x] CORS: Configured
- [x] Errors: Handled

**All systems go! 🚀**
