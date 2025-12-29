# Twin Health Chat Bot

AI-powered chatbot integrated with landing page for user engagement, lead capture, and intelligent health information retrieval.

**Status:** ✅ Production Ready | **Version:** 1.0 | **Last Updated:** Dec 29, 2025

## 🎯 Features

- **RAG-Powered Intelligence**: Retrieves answers from knowledge base using fuzzy matching with semantic validation
- **Contextual Alignment Validation**: Prevents returning wrong KB answers by validating semantic alignment
- **Gemini AI Fallback**: Seamlessly falls back to Google Gemini for out-of-scope questions
- **Session Tracking**: Comprehensive user session management with data collection
- **Real-time Chat**: Live messaging with typing indicators and auto-scroll
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Admin Dashboard**: Django admin interface for monitoring sessions and user interactions
- **Knowledge Base Management**: Organized health information with 35+ intents across 13 topics

## 🛠️ Tech Stack

### Frontend
- **Vite** - Lightning-fast build tool
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library

### Backend
- **Django 6.0** - Web framework
- **Django REST Framework** - API development
- **Google Gemini 2.5 Flash Lite** - LLM
- **SQLite** - Database
- **RapidFuzz** - Fuzzy string matching
- **Python 3.9+** - Language

### RAG Engine
- **RapidFuzz 3.6.0** - Multi-strategy matching (exact, token-set, fuzzy)
- **Custom Knowledge Base** - JSON-based with 35+ intents
- **Intent Matching** - Semantic similarity with conflict resolution
- **Contextual Validation** - Alignment checking before KB answer delivery

## 📋 Prerequisites

- Node.js 16+ or Bun
- Python 3.9+
- pip or conda
- Git

## 🚀 Quick Start

### Backend Setup

#### 1. Clone Repository
```bash
git clone https://github.com/yashwanth2706/twin-health-chat.git
cd twin-health-chat
```

#### 2. Create Python Virtual Environment
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Set Environment Variables
Create a `.env` file in the `backend` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com
```

Get your Gemini API key from: https://aistudio.google.com/apikey

#### 5. Run Migrations
```bash
python manage.py migrate
```

#### 6. Create Superuser (for Django Admin)
```bash
python manage.py createsuperuser
```

#### 7. Start Backend Server
```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`

### Frontend Setup

#### 1. Install Node Dependencies
```bash
# From root directory
npm install
# or with Bun
bun install
```

#### 2. Create Frontend Environment File
Create `.env` file in root directory:
```env
VITE_API_URL=http://localhost:8000/api
```

#### 3. Start Development Server
```bash
npm run dev
# or with Bun
bun run dev
```

Frontend will be available at: `http://localhost:5173`

## 📁 Project Structure

```
twin-health-chat/
├── backend/
│   ├── chat/
│   │   ├── rag_engine.py          # RAG engine with fuzzy matching
│   │   ├── views.py               # API endpoints with alignment validation
│   │   ├── models.py              # Database models
│   │   ├── serializers.py         # DRF serializers
│   │   ├── knowledge/
│   │   │   └── twin_health_knowledge.json  # KB with 35+ intents
│   │   ├── prompts/
│   │   │   └── system_prompt.py   # Gemini system prompt
│   │   └── tests/
│   │       └── test_rag_engine.py # RAG engine tests (25+ cases)
│   ├── config/
│   │   ├── settings.py            # Django settings
│   │   ├── urls.py                # URL routing
│   │   └── wsgi.py                # WSGI config
│   ├── manage.py
│   ├── db.sqlite3                 # SQLite database
│   └── requirements.txt
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatWidget.tsx     # Main chat component
│   │   │   ├── ChatHeader.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── WelcomeScreen.tsx
│   │   │   └── TypingIndicator.tsx
│   │   └── landing/               # Landing page components
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── api.ts                 # API client
│   │   └── utils.ts
│   ├── pages/
│   │   └── Index.tsx              # Main page
│   ├── App.tsx
│   └── main.tsx
├── CONTEXTUAL_ALIGNMENT_VALIDATION.md   # Technical details
├── CONTEXTUAL_ALIGNMENT_VISUAL_GUIDE.md # Visual guide
├── CONTEXTUAL_ALIGNMENT_TESTS.md        # Test cases
├── COMPLETE_FEATURE_SUMMARY.md          # Feature summary
├── QUICK_REFERENCE.md                   # Quick reference
└── README.md
```

## 🔌 API Endpoints

### Chat API

**Create Session**
```bash
POST /api/chat/sessions/create_session/
Content-Type: application/json

{
  "user_details": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

**Send Message**
```bash
POST /api/chat/message/
Content-Type: application/json

{
  "session_id": "uuid-here",
  "message": "What is the price of Twin Health?",
  "user_details": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

**Get Session**
```bash
GET /api/chat/sessions/get_session/?session_id=uuid-here
```

**Update User Details**
```bash
POST /api/chat/sessions/update_user_details/
Content-Type: application/json

{
  "session_id": "uuid-here",
  "user_details": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "0987654321"
  }
}
```

**Get All Sessions** (Admin)
```bash
GET /api/chat/sessions/all_sessions/
```

## 🧠 RAG Engine Architecture

### How It Works

1. **User Query** → Sent to RAG engine
2. **Intent Matching** → Three-strategy matching:
   - Exact match (90%+ confidence)
   - Token-set matching (word order flexible)
   - Fuzzy matching (typo tolerant)
3. **Conflict Resolution** → If multiple intents match within 5 points, select best
4. **Alignment Validation** → NEW! Check if matched KB question is semantically aligned
5. **Decision**:
   - High confidence (≥80%) + Aligned → Return KB answer
   - High confidence (≥80%) + Misaligned → Use Gemini
   - Low confidence (<80%) → Use Gemini

### Confidence Thresholds

```
EXACT_MATCH_THRESHOLD = 90      # Very high confidence
PARTIAL_MATCH_THRESHOLD = 80    # High confidence
FUZZY_MATCH_THRESHOLD = 70      # Acceptable match
```

### Alignment Validation

**Formula:**
```
Alignment Score = (Token Overlap × 0.5) + (Fuzzy Score × 0.5)
```

**Thresholds:**
- 80-89% confidence: Require 40% semantic overlap
- 70-79% confidence: Require 30% semantic overlap
- 90%+ confidence: Skip validation (exact matches trusted)

**Example:**
```
User: "How do I use the app?"
KB Match: "What is the mobile app?" (82% confidence)
Token Overlap: 20%
Fuzzy Score: 45%
Combined: 32.5% < 40% threshold
Result: Use Gemini (contextually misaligned)
```

## 📚 Knowledge Base

### Organization
- **13 Topics**: Core concepts, outcomes, eligibility, pricing, etc.
- **35+ Intents**: Each with multiple question variations
- **JSON Structure**: Easy to update and maintain

### Topics Covered
- Core Health Concepts
- Digital Twin Technology
- Health Outcomes
- Program Features
- Eligibility & Requirements
- Pricing & Refunds
- User Support
- And more...

### Example Intent
```json
{
  "intent": "pricing_information",
  "questions": [
    "What is the price?",
    "What is the price of Twin Health program?",
    "How much does Twin Health cost?",
    "What are the pricing details?"
  ],
  "answer": "Twin Health pricing varies based on program duration, device count, coaching level, region, and enrollment type..."
}
```

## 🔍 Monitoring & Debugging

### View RAG Decisions in Logs

**Check Alignment Scores:**
```bash
grep "Contextual alignment check" logs/django.log
```

**See Misaligned Cases:**
```bash
grep "contextually misaligned" logs/django.log
```

**Monitor KB vs Gemini Usage:**
```bash
echo "KB answers: $(grep -c 'KB answer returned' logs/django.log)"
echo "Gemini responses: $(grep -c 'Using Gemini' logs/django.log)"
```

### Django Admin

Access at: `http://localhost:8000/admin`

Features:
- View all chat sessions
- See user details (name, email, phone)
- Track message count per session
- Monitor session duration
- View message history with timestamps

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
python manage.py test chat.tests.test_rag_engine
```

### Run Specific Test Class
```bash
python manage.py test chat.tests.test_rag_engine.TestRAGEngineBasic
```

### View Test Coverage
```bash
# Install coverage
pip install coverage

# Run with coverage
coverage run --source='chat' manage.py test
coverage report
```

## 📦 Building for Production

### Backend
```bash
# Collect static files
python manage.py collectstatic

# Use gunicorn for production
pip install gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Frontend
```bash
# Build production bundle
npm run build

# Serve with nginx or your preferred server
npm run preview
```

## 🔐 Security

### Environment Variables
- Never commit `.env` files
- Use environment variables for sensitive data
- Set `DEBUG=False` in production
- Use HTTPS in production

### CORS Configuration
Update `backend/config/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com"
]
```

### Database Security
- Use strong password for superuser
- Regular backups of SQLite database
- In production, migrate to PostgreSQL

## 📖 Documentation

### Contextual Alignment Feature
- `CONTEXTUAL_ALIGNMENT_VALIDATION.md` - Technical deep dive
- `CONTEXTUAL_ALIGNMENT_VISUAL_GUIDE.md` - Decision trees and examples
- `CONTEXTUAL_ALIGNMENT_TESTS.md` - Test cases and scenarios

### RAG Engine
- `RAG_IMPLEMENTATION.md` - Architecture and design
- `RAG_DEPENDENCIES.md` - Dependency analysis

### Knowledge Base
- `KB_UPDATE_PRICING.md` - Pricing information update

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### CORS Errors
- Check `CORS_ALLOWED_ORIGINS` in Django settings
- Ensure frontend URL is in allowed origins
- Clear browser cache and cookies

### RAG Engine Not Retrieving Answers
- Check knowledge base file exists: `backend/chat/knowledge/twin_health_knowledge.json`
- Verify JSON syntax is valid
- Check logs for "Knowledge base loaded" message

### Gemini API Errors
- Verify API key is correct and active
- Check API quota hasn't been exceeded
- Ensure internet connection is working

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary. All rights reserved.

## 📞 Support

For issues and questions:
- Open an GitHub issue
- Contact the development team
- Check documentation in `/CONTEXTUAL_ALIGNMENT_*.md` files
 
**Last Updated:** December 29, 2025  
**Version:** 1.0
