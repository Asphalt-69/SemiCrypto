import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

interface ChatStore {
  messages: ChatMessage[];
  users: ChatUser[];
  activeUserId: string | null;
  isTyping: boolean;
  typingUsers: string[];

  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setUsers: (users: ChatUser[]) => void;
  setActiveUser: (userId: string | null) => void;
  setIsTyping: (typing: boolean) => void;
  addTypingUser: (userId: string) => void;
  removeTypingUser: (userId: string) => void;
  clearChat: () => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  users: [],
  activeUserId: null,
  isTyping: false,
  typingUsers: [],

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setUsers: (users) => set({ users }),

  setActiveUser: (userId) => set({ activeUserId: userId }),

  setIsTyping: (typing) => set({ isTyping: typing }),

  addTypingUser: (userId) =>
    set((state) => {
      if (!state.typingUsers.includes(userId)) {
        return { typingUsers: [...state.typingUsers, userId] };
      }
      return state;
    }),

  removeTypingUser: (userId) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter((id) => id !== userId),
    })),

  clearChat: () =>
    set({
      messages: [],
      users: [],
      activeUserId: null,
      isTyping: false,
      typingUsers: [],
    }),

  clearMessages: () => set({ messages: [] }),
}));
