// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/chat';

interface UserDetails {
  name: string;
  email: string;
  phone: string;
}

interface SessionResponse {
  id: number;
  session_id: string;
  user_name: string | null;
  user_email: string | null;
  user_phone: string | null;
  messages: any[];
  created_at: string;
  updated_at: string;
}

interface MessageResponse {
  user_message: string;
  bot_response: string;
  timestamp: string;
  session_id: string;
}

interface ErrorResponse {
  error: string;
}

export const chatAPI = {
  /**
   * Create a new chat session
   */
  async createSession(userDetails?: Partial<UserDetails>): Promise<SessionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/create_session/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_details: userDetails || {} }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  /**
   * Send a message and get Gemini response
   */
  async sendMessage(
    sessionId: string,
    message: string,
    userDetails?: Partial<UserDetails>
  ): Promise<MessageResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/message/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: message,
          user_details: userDetails || {},
        }),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.error || `Failed to send message: ${response.statusText}`);
      }

      const data: MessageResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  /**
   * Get a chat session with all messages
   */
  async getSession(sessionId: string): Promise<SessionResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sessions/get_session/?session_id=${encodeURIComponent(sessionId)}`
      );

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.error || `Failed to get session: ${response.statusText}`);
      }

      const data: SessionResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting session:', error);
      throw error;
    }
  },

  /**
   * Update user details for an existing session
   */
  async updateUserDetails(
    sessionId: string,
    userDetails: Partial<UserDetails>
  ): Promise<SessionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/update_user_details/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_details: userDetails,
        }),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.error || `Failed to update user details: ${response.statusText}`);
      }

      const data: SessionResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating user details:', error);
      throw error;
    }
  },
};
