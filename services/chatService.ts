import ApiClient from './api';
import { API_ENDPOINTS } from '@/constants/api';
import { ChatMessage, ChatUser } from '@/features/chat/store/chat.store';

interface MessagesResponse {
  messages: ChatMessage[];
  total: number;
}

interface SendMessageResponse {
  messageId: string;
  timestamp: string;
}

interface UsersResponse {
  users: ChatUser[];
}

class ChatService {
  /**
   * Get chat messages with a specific user
   */
  static async getMessages(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<ChatMessage[]> {
    try {
      const url = `${API_ENDPOINTS.CHAT.GET_MESSAGES.replace('{userId}', userId)}?limit=${limit}&offset=${offset}`;
      const response = await ApiClient.request<MessagesResponse>('GET', url);
      return response.messages;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send a message
   */
  static async sendMessage(
    recipientId: string,
    content: string
  ): Promise<SendMessageResponse> {
    try {
      const response = await ApiClient.request<SendMessageResponse>(
        'POST',
        API_ENDPOINTS.CHAT.SEND_MESSAGE,
        {
          recipientId,
          content,
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get list of chat users
   */
  static async getUsers(): Promise<ChatUser[]> {
    try {
      const response = await ApiClient.request<UsersResponse>(
        'GET',
        API_ENDPOINTS.CHAT.GET_USERS
      );
      return response.users;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update typing status
   */
  static async updateTypingStatus(isTyping: boolean): Promise<{ status: string }> {
    try {
      const response = await ApiClient.request<{ status: string }>(
        'POST',
        API_ENDPOINTS.CHAT.TYPING_STATUS,
        { isTyping }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default ChatService;
