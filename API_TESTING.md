# API Testing Guide

Quick reference for testing the Twin Health Chat API endpoints.

## Using cURL

### 1. Create a Chat Session
```bash
curl -X POST http://localhost:8000/api/chat/sessions/create_session/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_details": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    }
  }'
```

Save the `session_id` from the response for the next requests.

### 2. Send a Message
```bash
curl -X POST http://localhost:8000/api/chat/message/ \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "your-session-id-here",
    "message": "How can I reverse diabetes?",
    "user_details": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    }
  }'
```

### 3. Get Chat Session (View all messages)
```bash
curl http://localhost:8000/api/chat/sessions/get_session/?session_id=your-session-id-here
```

### 4. Update User Details
```bash
curl -X POST http://localhost:8000/api/chat/sessions/update_user_details/ \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "your-session-id-here",
    "user_details": {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+0987654321"
    }
  }'
```

## Using Postman

### Import Collection
Create a new Postman collection with these requests:

#### Request 1: Create Session
- **Method:** POST
- **URL:** `http://localhost:8000/api/chat/sessions/create_session/`
- **Headers:**
  - `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "user_details": {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890"
  }
}
```

#### Request 2: Send Message
- **Method:** POST
- **URL:** `http://localhost:8000/api/chat/message/`
- **Headers:**
  - `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "session_id": "{{session_id}}",
  "message": "Hello, how can you help me?",
  "user_details": {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890"
  }
}
```

#### Request 3: Get Session
- **Method:** GET
- **URL:** `http://localhost:8000/api/chat/sessions/get_session/?session_id={{session_id}}`

## Using Python

```python
import requests
import json

BASE_URL = "http://localhost:8000/api/chat"

# Create session
create_session_response = requests.post(
    f"{BASE_URL}/sessions/create_session/",
    json={
        "user_details": {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1234567890"
        }
    }
)

session_data = create_session_response.json()
session_id = session_data['session_id']
print(f"Created session: {session_id}")

# Send message
message_response = requests.post(
    f"{BASE_URL}/message/",
    json={
        "session_id": session_id,
        "message": "How can I reverse diabetes?",
        "user_details": {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1234567890"
        }
    }
)

bot_response = message_response.json()
print(f"Bot Response: {bot_response['bot_response']}")

# Get full session
session_response = requests.get(
    f"{BASE_URL}/sessions/get_session/",
    params={"session_id": session_id}
)

full_session = session_response.json()
print(f"Total messages in session: {len(full_session['messages'])}")
```

## Using JavaScript/Fetch

```javascript
const BASE_URL = "http://localhost:8000/api/chat";

async function testAPI() {
  try {
    // Create session
    const createRes = await fetch(`${BASE_URL}/sessions/create_session/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_details: {
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890"
        }
      })
    });

    const sessionData = await createRes.json();
    const sessionId = sessionData.session_id;
    console.log("Session created:", sessionId);

    // Send message
    const messageRes = await fetch(`${BASE_URL}/message/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        message: "How can I reverse diabetes?",
        user_details: {
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890"
        }
      })
    });

    const messageData = await messageRes.json();
    console.log("Bot response:", messageData.bot_response);

    // Get full session
    const sessionRes = await fetch(
      `${BASE_URL}/sessions/get_session/?session_id=${sessionId}`
    );

    const fullSession = await sessionRes.json();
    console.log("Messages in session:", fullSession.messages);

  } catch (error) {
    console.error("Error:", error);
  }
}

testAPI();
```

## Expected Responses

### Success Response (Create Session)
```json
{
  "id": 1,
  "session_id": "123e4567-e89b-12d3-a456-426614174000",
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "user_phone": "+1234567890",
  "messages": [],
  "created_at": "2025-12-26T03:15:00Z",
  "updated_at": "2025-12-26T03:15:00Z"
}
```

### Success Response (Send Message)
```json
{
  "user_message": "How can I reverse diabetes?",
  "bot_response": "Twin Health helps you reverse diabetes by addressing the root cause of metabolic dysfunction. Our Whole Body Digital Twin™ technology provides personalized guidance...",
  "timestamp": "2025-12-26T03:16:00Z",
  "session_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Error Response
```json
{
  "error": "Failed to get response from Gemini: API key not set"
}
```

## Common Issues

### 400 Bad Request
- Missing required fields in request body
- Invalid JSON format
- Missing `session_id` in message request

### 404 Not Found
- Invalid or non-existent `session_id`
- Wrong endpoint URL

### 500 Internal Server Error
- Gemini API key not configured
- API quota exceeded
- Backend server error

## Django Admin Testing

1. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

2. Visit: `http://localhost:8000/admin/`

3. View:
   - Chat Sessions
   - Messages
   - User details

## Tips

- Save `session_id` from the first response to reuse in subsequent requests
- Each message maintains conversation history with the Gemini model
- User details are optional but recommended for personalization
- Use the same session ID to continue conversations
- The API is stateless - session state is stored in the database
