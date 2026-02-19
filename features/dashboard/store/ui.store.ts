import { create } from 'zustand';
import { Notification } from '@/types/global.types';

interface UiStore {
  sidebarOpen: boolean;
  currentPage: string;
  notifications: Notification[];
  connectionStatus: 'connected' | 'connecting' | 'disconnected';

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setConnectionStatus: (status: 'connected' | 'connecting' | 'disconnected') => void;
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: true,
  currentPage: '/dashboard',
  notifications: [],
  connectionStatus: 'disconnected',

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setCurrentPage: (page) => set({ currentPage: page }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 10), // Keep last 10
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),

  setConnectionStatus: (status) => set({ connectionStatus: status }),
}));
