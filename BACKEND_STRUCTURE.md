# Backend Directory Structure

```
backend/
├── config/                          # Django Project Configuration
│   ├── __init__.py
│   ├── asgi.py                     # ASGI configuration (for async)
│   ├── wsgi.py                     # WSGI configuration (for servers)
│   ├── settings.py                 # ✅ Project settings (CORS, REST Framework, Gemini)
│   └── urls.py                     # ✅ Main URL routing to chat app
│
├── chat/                            # Chat Application
│   ├── migrations/
│   │   ├── __init__.py
│   │   └── 0001_initial.py         # ✅ Database schema
│   ├── __init__.py
│   ├── admin.py                    # ✅ Django admin configuration
│   ├── apps.py
│   ├── models.py                   # ✅ ChatSession & Message models
│   ├── serializers.py              # ✅ DRF serializers for API
│   ├── tests.py
│   ├── urls.py                     # ✅ Chat app routes
│   └── views.py                    # ✅ API views with Gemini integration
│
├── venv/                            # Python Virtual Environment (auto-created)
│   └── [dependencies installed here]
│
├── manage.py                        # Django management commands
├── requirements.txt                 # ✅ Python dependencies
├── .env                            # ✅ Environment variables (YOUR API KEY HERE)
├── .env.example                    # ✅ Example environment template
├── .gitignore                      # ✅ Git ignore rules
├── run.sh                          # ✅ Startup script
└── README.md                       # ✅ Backend documentation
```

## Files You MUST Configure

| File | Action | Details |
|------|--------|---------|
| `backend/.env` | Add API Key | `GEMINI_API_KEY=your-key-here` |

## Files You Created

| File | Purpose |
|------|---------|
| `chat/models.py` | Database models for sessions and messages |
| `chat/views.py` | API endpoints with Gemini AI integration |
| `chat/serializers.py` | Data serializers for API responses |
| `chat/urls.py` | Chat application URL routing |
| `chat/admin.py` | Django admin interface configuration |
| `config/settings.py` | Django project settings (CORS, DRF, etc.) |
| `config/urls.py` | Main URL routing |
| `requirements.txt` | Python dependencies |
| `.env` | Environment variables |

## Key Components

### Models (Database)
```python
# ChatSession - One per user conversation
- session_id (unique UUID)
- user_name, user_email, user_phone
- created_at, updated_at

# Message - Individual messages in a session
- session (foreign key)
- content (text)
- is_bot (boolean)
- created_at
```

### Views (API Endpoints)
```python
ChatSessionViewSet:
- POST /sessions/create_session/ → Create new session
- GET /sessions/get_session/ → Get session with messages
- POST /sessions/update_user_details/ → Update user info

ChatMessageAPIView:
- POST /message/ → Send message, get Gemini response
```

### Serializers (Data Format)
```python
ChatSessionSerializer → Full session with messages
MessageSerializer → Individual message
ChatMessageRequestSerializer → Incoming message format
ChatResponseSerializer → Bot response format
```

## Installation & Setup

### 1. Virtual Environment (already created)
```bash
cd backend
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows
```

### 2. Dependencies (already installed)
```bash
pip install -r requirements.txt
```

### 3. Database (already migrated)
```bash
python manage.py migrate
```

### 4. Configure Gemini API (YOU MUST DO THIS)
```bash
# Edit backend/.env and add:
GEMINI_API_KEY=your-api-key-from-google-ai-studio
```

### 5. Start Server
```bash
./run.sh
# or: python manage.py runserver
```

## API Endpoints

### 1. Create Chat Session
```
POST /api/chat/sessions/create_session/
```
- Input: User details (name, email, phone)
- Output: Session object with session_id

### 2. Send Message (Get AI Response)
```
POST /api/chat/message/
```
- Input: session_id, message text, user details
- Output: User message + Bot response from Gemini

### 3. Get Full Session
```
GET /api/chat/sessions/get_session/?session_id=<id>
```
- Output: Complete session with all messages

### 4. Update User Details
```
POST /api/chat/sessions/update_user_details/
```
- Input: session_id, updated user details
- Output: Updated session object

## Database Schema

### ChatSession Table
```sql
id (Primary Key)
session_id (Unique UUID)
user_name (String)
user_email (Email)
user_phone (Phone)
created_at (Timestamp)
updated_at (Timestamp)
```

### Message Table
```sql
id (Primary Key)
session_id (Foreign Key → ChatSession)
content (Text)
is_bot (Boolean)
created_at (Timestamp)
```

## Configuration Files

### settings.py
- Django configuration
- CORS setup for frontend
- REST Framework settings
- Gemini API configuration
- Database settings
- Installed apps

### .env
```
DEBUG=True
SECRET_KEY=your-secret
GEMINI_API_KEY=your-api-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

### requirements.txt
```
Django==6.0
djangorestframework==3.16.1
django-cors-headers==4.9.0
google-generativeai==0.8.6
python-dotenv==1.2.1
gunicorn==23.0.0
```

## Django Admin

Access at: `http://localhost:8000/admin/`

### Available Models
- **ChatSession** - View/edit user sessions
- **Message** - View conversation messages
- **User** - Django user management
- **Groups** - User groups

## Testing the API

### Using cURL
```bash
# Create session
curl -X POST http://localhost:8000/api/chat/sessions/create_session/ \
  -H "Content-Type: application/json" \
  -d '{"user_details": {"name": "John", "email": "john@example.com", "phone": "+1234567890"}}'

# Send message
curl -X POST http://localhost:8000/api/chat/message/ \
  -H "Content-Type: application/json" \
  -d '{"session_id": "your-session-id", "message": "Hello!"}'
```

See `API_TESTING.md` for more examples.

## Troubleshooting

### Issue: ModuleNotFoundError
```bash
# Activate virtual environment
source venv/bin/activate
```

### Issue: CORS Error
- Check `CORS_ALLOWED_ORIGINS` in settings.py
- Add frontend URL: `http://localhost:5173`

### Issue: Gemini API Error
- Add `GEMINI_API_KEY` to `.env`
- Check API quota in Google Cloud Console

### Issue: Database Error
```bash
python manage.py migrate
```

## Production Checklist

- [ ] Change `DEBUG=False`
- [ ] Generate strong `SECRET_KEY`
- [ ] Update `ALLOWED_HOSTS` for your domain
- [ ] Switch to PostgreSQL database
- [ ] Set up environment variables
- [ ] Run migrations on production DB
- [ ] Configure HTTPS/SSL
- [ ] Use Gunicorn server
- [ ] Set up static files
- [ ] Configure proper logging

## Summary

✅ Backend is fully set up and ready
✅ All models, views, and endpoints created
✅ Gemini AI integration configured
✅ Admin interface ready
✅ Database migrations applied
❌ You need to add your Gemini API key to `.env`

**Next Step:** Add your Gemini API key and start the server!
