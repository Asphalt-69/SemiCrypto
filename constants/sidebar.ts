import {
  LayoutDashboard,
  TrendingUp,
  MessageCircle,
  Settings,
  LogOut,
} from 'lucide-react';

export const SIDEBAR_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'trading',
    label: 'Trading',
    href: '/trading',
    icon: TrendingUp,
  },
  {
    id: 'chat',
    label: 'Chat',
    href: '/chat',
    icon: MessageCircle,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    id: 'logout',
    label: 'Logout',
    href: '#',
    icon: LogOut,
    divider: true,
  },
];

export const BRAND = {
  NAME: 'SemiCrypto',
  TAGLINE: 'Premium Trading Platform',
  DESCRIPTION: 'Experience the future of fintech trading',
};

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
  SLOWER: 500,
};

export const ANIMATION_DELAYS = {
  STAGGER_SMALL: 50,
  STAGGER_MEDIUM: 100,
  STAGGER_LARGE: 150,
};
