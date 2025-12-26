# Twin Health Django Backend

A Django REST API for the Twin Health chatbot with Gemini AI integration.

## Setup Instructions

### Prerequisites
- Python 3.8+
- pip

### Installation

1. **Navigate to the backend directory:**
```bash
cd backend
```

2. **Create and activate virtual environment:**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create .env file with your Gemini API key:**
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

5. **Run migrations:**
```bash
python manage.py migrate
```

6. **Create superuser (optional, for Django admin):**
```bash
python manage.py createsuperuser
```

7. **Run the development server:**
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Chat Endpoints

#### 1. Create a Chat Session
- **Endpoint:** `POST /api/chat/sessions/create_session/`
- **Description:** Creates a new chat session
- **Request Body:**
```json
{
  "user_details": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```
- **Response:**
```json
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

#### 2. Send a Message (Get Gemini Response)
- **Endpoint:** `POST /api/chat/message/`
- **Description:** Sends a message and receives a response from Gemini
- **Request Body:**
```json
{
  "session_id": "uuid-string",
  "message": "How can I reverse diabetes?",
  "user_details": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```
- **Response:**
```json
{
  "user_message": "How can I reverse diabetes?",
  "bot_response": "Twin Health helps you reverse diabetes by...",
  "timestamp": "2025-12-26T12:00:00Z",
  "session_id": "uuid-string"
}
```

#### 3. Get Chat Session
- **Endpoint:** `GET /api/chat/sessions/get_session/?session_id=uuid-string`
- **Description:** Retrieves a chat session with all its messages
- **Response:**
```json
{
  "id": 1,
  "session_id": "uuid-string",
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "user_phone": "+1234567890",
  "messages": [
    {
      "id": 1,
      "content": "How can I reverse diabetes?",
      "is_bot": false,
      "created_at": "2025-12-26T12:00:00Z"
    },
    {
      "id": 2,
      "content": "Twin Health helps...",
      "is_bot": true,
      "created_at": "2025-12-26T12:00:01Z"
    }
  ],
  "created_at": "2025-12-26T12:00:00Z",
  "updated_at": "2025-12-26T12:00:01Z"
}
```

#### 4. Update User Details
- **Endpoint:** `POST /api/chat/sessions/update_user_details/`
- **Description:** Updates user details for an existing session
- **Request Body:**
```json
{
  "session_id": "uuid-string",
  "user_details": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+0987654321"
  }
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```
DEBUG=True
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
```

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click on "Get API Key"
3. Create a new API key in your Google Cloud project
4. Add it to your `.env` file

## Models

### ChatSession
- `session_id` - Unique identifier for the chat session
- `user_name` - Name of the user
- `user_email` - Email of the user
- `user_phone` - Phone number of the user
- `created_at` - Timestamp of session creation
- `updated_at` - Timestamp of last update

### Message
- `session` - Foreign key to ChatSession
- `content` - Message content
- `is_bot` - Boolean flag (True if message is from bot)
- `created_at` - Timestamp of message

## Django Admin

Access the Django admin at `http://localhost:8000/admin/`

You can view and manage:
- Chat Sessions
- Messages

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Frontend dev server)
- `http://localhost:3000`
- `http://localhost:8000`

Update `CORS_ALLOWED_ORIGINS` in `config/settings.py` for production.

## Production Deployment

1. Set `DEBUG = False` in `.env`
2. Update `SECRET_KEY` to a secure random value
3. Add your domain to `ALLOWED_HOSTS`
4. Use a production database (PostgreSQL recommended)
5. Use Gunicorn or similar WSGI server
6. Configure HTTPS/SSL
7. Set up environment variables properly

## Development

### Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Create Superuser
```bash
python manage.py createsuperuser
```

### Run Server
```bash
python manage.py runserver 0.0.0.0:8000
```

### Run Tests
```bash
python manage.py test
```

## Troubleshooting

### CORS Issues
Make sure your frontend URL is in `CORS_ALLOWED_ORIGINS` in settings.py

### Gemini API Errors
- Verify your API key is correct and has proper permissions
- Check that you're using a supported model name
- Ensure you have sufficient quota

### Database Errors
Run migrations:
```bash
python manage.py migrate
```
