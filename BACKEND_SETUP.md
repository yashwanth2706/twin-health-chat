# Twin Health Chat - Complete Setup Guide

A full-stack application combining a React frontend with a Django backend integrated with Google Gemini AI.

## 📁 Project Structure

```
twin-health-chat/
├── src/                          # Frontend (React + TypeScript)
│   ├── components/
│   │   └── chat/                # Chat widget components
│   ├── pages/
│   ├── lib/
│   └── App.tsx
├── backend/                       # Django backend
│   ├── config/                   # Django project settings
│   ├── chat/                     # Chat app with Gemini integration
│   │   ├── models.py            # ChatSession, Message models
│   │   ├── views.py             # API views with Gemini
│   │   ├── serializers.py       # DRF serializers
│   │   ├── urls.py              # API routes
│   │   ├── admin.py             # Django admin
│   │   └── migrations/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   └── run.sh
├── FRONTEND_INTEGRATION.md       # Frontend integration guide
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+ (for frontend)
- Bun or npm (for package management)
- Google Gemini API Key

### Step 1: Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API key
cat > .env << EOF
DEBUG=True
SECRET_KEY=django-insecure-dev-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
EOF

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Step 2: Frontend Setup

```bash
cd ..  # Go back to project root

# Install dependencies
npm install  # or: bun install

# Create environment file
echo "REACT_APP_API_BASE_URL=http://localhost:8000/api/chat" > .env.local

# Start development server
npm run dev  # or: bun dev
```

The frontend will be available at `http://localhost:5173`

### Step 3: Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key"
3. Create a new API key in your Google Cloud project
4. Add it to `backend/.env`:
   ```
   GEMINI_API_KEY=your-api-key-here
   ```

## 📚 Backend API Endpoints

### Create Chat Session
```
POST /api/chat/sessions/create_session/

Request:
{
  "user_details": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}

Response:
{
  "id": 1,
  "session_id": "uuid-string",
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "user_phone": "+1234567890",
  "messages": [],
  "created_at": "2025-12-26T12:00:00Z",
  "updated_at": "2025-12-26T12:00:00Z"
}
```

### Send Message (Get Gemini Response)
```
POST /api/chat/message/

Request:
{
  "session_id": "uuid-string",
  "message": "How can I reverse diabetes?",
  "user_details": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}

Response:
{
  "user_message": "How can I reverse diabetes?",
  "bot_response": "Twin Health helps you reverse diabetes by...",
  "timestamp": "2025-12-26T12:00:00Z",
  "session_id": "uuid-string"
}
```

### Get Chat Session
```
GET /api/chat/sessions/get_session/?session_id=uuid-string

Response:
{
  "id": 1,
  "session_id": "uuid-string",
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "user_phone": "+1234567890",
  "messages": [...],
  "created_at": "2025-12-26T12:00:00Z",
  "updated_at": "2025-12-26T12:00:00Z"
}
```

### Update User Details
```
POST /api/chat/sessions/update_user_details/

Request:
{
  "session_id": "uuid-string",
  "user_details": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+0987654321"
  }
}
```

## 🛠️ Development

### Backend Development

```bash
cd backend
source venv/bin/activate

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Access Django admin at http://localhost:8000/admin

# Run tests
python manage.py test

# Start server with auto-reload
python manage.py runserver
```

### Frontend Development

```bash
# Install new packages
npm install package-name

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Environment Variables

### Backend (.env)
```
DEBUG=True                              # Set to False in production
SECRET_KEY=your-secret-key             # Change in production
GEMINI_API_KEY=your-gemini-api-key    # Required
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (.env.local)
```
REACT_APP_API_BASE_URL=http://localhost:8000/api/chat
```

## 📝 Models

### ChatSession
- `session_id` - Unique identifier (UUID)
- `user_name` - User's name
- `user_email` - User's email
- `user_phone` - User's phone number
- `created_at` - Session creation timestamp
- `updated_at` - Last update timestamp

### Message
- `session` - Foreign key to ChatSession
- `content` - Message text
- `is_bot` - Boolean (True if from bot)
- `created_at` - Message creation timestamp

## 🚢 Deployment

### Backend (Django)

1. **Set environment variables:**
   ```bash
   DEBUG=False
   SECRET_KEY=generate-secure-random-key
   GEMINI_API_KEY=your-api-key
   ALLOWED_HOSTS=yourdomain.com
   ```

2. **Database:** Use PostgreSQL for production
   ```
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'your_db_name',
           'USER': 'your_db_user',
           'PASSWORD': 'your_password',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Collect static files:**
   ```bash
   python manage.py collectstatic
   ```

5. **Use Gunicorn:**
   ```bash
   gunicorn config.wsgi:application --bind 0.0.0.0:8000
   ```

### Frontend (React)

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy to hosting (Vercel, Netlify, AWS, etc.)**

3. **Update API URL:**
   ```
   REACT_APP_API_BASE_URL=https://your-api-domain.com/api/chat
   ```

## 🧪 Testing

### Backend Tests
```bash
cd backend
source venv/bin/activate
python manage.py test
```

### Frontend Tests
```bash
npm test
```

## 📖 Additional Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [Google Generative AI Python SDK](https://github.com/google-gemini/generative-ai-python)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## 🐛 Troubleshooting

### CORS Errors
- Ensure frontend URL is in `CORS_ALLOWED_ORIGINS` in `backend/config/settings.py`
- Check that both frontend and backend are running

### Gemini API Errors
- Verify API key is valid
- Check API quota in Google Cloud Console
- Ensure the model name is correct (default: `gemini-pro`)

### Database Errors
```bash
cd backend
source venv/bin/activate
python manage.py migrate
```

### Port Already in Use
```bash
# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

## 📝 Notes

- The app uses SQLite by default (development). Switch to PostgreSQL for production.
- Gemini API responses are cached in the database for reference.
- CORS is configured for local development. Update for production domains.
- The chat widget opens after the landing page loads with a smooth animation.

## 📄 License

This project is proprietary software for Twin Health.

## 👥 Support

For issues or questions, please refer to the documentation or contact the development team.
