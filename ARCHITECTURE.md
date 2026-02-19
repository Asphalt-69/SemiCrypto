# SemiCrypto Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER (Next.js 14)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Page Layer (App Router)                      │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  / (Landing)  │ /login  │ /register  │ /otp │ /dashboard │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Feature Modules (Domain-Based)                  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Auth    │  Trading   │  Portfolio  │  Chat  │ Dashboard  │  │
│  │  Feature │  Feature   │  Feature    │ Feature│ Feature    │  │
│  └──────────────────────────────────────────────────────────┘  │
│         ↓          ↓          ↓           ↓         ↓           │
│  ┌────────┬──────────┬──────────┬────────┬────────────────┐    │
│  │Components│Components│Components│Components│Components   │    │
│  │  Hooks   │  Hooks   │  Hooks   │  Hooks │  Hooks       │    │
│  │  Types   │  Types   │  Types   │  Types │  Types       │    │
│  │  Store   │  Store   │  Store   │  Store │  Store       │    │
│  │Constants │Constants │Constants │Constants│           │    │
│  └────────┴──────────┴──────────┴────────┴────────────────┘    │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        Zustand State Management Layer                     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  auth.store  │  trading.store  │  portfolio.store  │   │  │
│  │  ui.store    │  chat.store                           │   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │      Service Layer (API Isolated - NO SIDEBAR)            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ApiClient (Axios + Interceptors + Deduplication)        │  │
│  │     ↓        ↓        ↓         ↓        ↓               │  │
│  │  AuthSvc  TradingSvc  PortfolioSvc  ChatSvc             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │     HTTP Client (Axios with Interceptors)                │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  • Request Deduplication (prevents spam)                 │  │
│  │  • Token Attachment (Authorization header)              │  │
│  │  • Error Normalization (consistent format)              │  │
│  │  • Retry Logic (exponential backoff, max 3 retries)    │  │
│  │  • Timeout: 30 seconds (configurable per endpoint)      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓ HTTP
            ┌───────────────────────────────────┐
            │   BACKEND API Layer (Node/Express) │
            ├───────────────────────────────────┤
            │  POST /auth/login                  │
            │  POST /auth/register               │
            │  POST /auth/verify-otp             │
            │  GET  /stocks/search               │
            │  GET  /stocks/{ticker}             │
            │  POST /orders/create               │
            │  GET  /portfolio/overview          │
            │  GET  /chat/messages/{userId}      │
            └───────────────────────────────────┘
                            ↓
            ┌───────────────────────────────────┐
            │      Database Layer                │
            ├───────────────────────────────────┤
            │  Users  │  Orders  │  Messages     │
            │  Stocks │ Portfolio │ Chat Rooms  │
            └───────────────────────────────────┘
```

---

## Data Flow Diagram

### User Login Flow

```
┌─────────────┐
│  User Input │
│ Email/Pass  │
└──────┬──────┘
       ↓
┌──────────────────────┐
│ React Component       │
│ (LoginForm)          │
│ • Validation (ZOD)   │
│ • Error display      │
└──────┬───────────────┘
       ↓
┌──────────────────────┐
│ Call Service         │
│ AuthService.login()  │
└──────┬───────────────┘
       ↓
┌──────────────────────────────────┐
│ ApiClient                        │
│ • Create axios request           │
│ • Deduplicate if identical       │
│ • Set auth headers               │
│ • Retry on 5xx (exponential)     │
└──────┬───────────────────────────┘
       ↓
┌──────────────────────┐
│ Backend              │
│ POST /auth/login     │
└──────┬───────────────┘
       ↓
┌──────────────────────────┐
│ Success Response         │
│ { user, token, refresh } │
└──────┬───────────────────┘
       ↓
┌──────────────────────────────┐
│ Zustand Store                │
│ setUser(user)                │
│ setTokens(token, refresh)    │
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│ Component Re-render          │
│ Display dashboard            │
│ localStorage persists state  │
└──────────────────────────────┘
```

---

## State Management Architecture

```
┌────────────────────────────────────────────────────────┐
│              Zustand State Management                   │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐  ┌─────────────────────┐        │
│  │   Auth Store     │  │   UI Store          │        │
│  ├──────────────────┤  ├─────────────────────┤        │
│  │ user: User       │  │ sidebarOpen: bool   │        │
│  │ token: string    │  │ currentPage: str    │        │
│  │ refreshToken: str│  │ notifications: []   │        │
│  │ isAuthenticated  │  │ connectionStatus    │        │
│  │ preferences: {}  │  │ theme: 'dark'|light │        │
│  │                  │  │                     │        │
│  │ Methods:         │  │ Methods:            │        │
│  │ • setUser()      │  │ • toggleSidebar()   │        │
│  │ • setTokens()    │  │ • setCurrentPage()  │        │
│  │ • logout()       │  │ • addNotification() │        │
│  │ • setTheme()     │  │ • setConnStatus()   │        │
│  └──────────────────┘  └─────────────────────┘        │
│                                                         │
│  ┌──────────────────┐  ┌─────────────────────┐        │
│  │ Trading Store    │  │ Portfolio Store     │        │
│  ├──────────────────┤  ├─────────────────────┤        │
│  │ selectedStock    │  │ holdings: {}        │        │
│  │ watchlist: []    │  │ transactions: []    │        │
│  │ pendingOrders: {}│  │ cash: number        │        │
│  │ execHistory: []  │  │ totalValue: number  │        │
│  │ timeframe: '1D'  │  │ metrics: {}         │        │
│  │                  │  │                     │        │
│  │ Methods:         │  │ Methods:            │        │
│  │ • selectStock()  │  │ • setHoldings()     │        │
│  │ • addToWatchlist │  │ • addTransaction()  │        │
│  │ • placeOrder()   │  │ • updateHolding()   │        │
│  │ • setTimeframe() │  │ • setMetrics()      │        │
│  └──────────────────┘  └─────────────────────┘        │
│                                                         │
│  ┌────────────────────────────┐                        │
│  │    Chat Store              │                        │
│  ├────────────────────────────┤                        │
│  │ messages: ChatMessage[]    │                        │
│  │ users: ChatUser[]          │                        │
│  │ activeUserId: string       │                        │
│  │ isTyping: bool             │                        │
│  │ typingUsers: string[]      │                        │
│  │                            │                        │
│  │ Methods:                   │                        │
│  │ • addMessage()             │                        │
│  │ • setActiveUser()          │                        │
│  │ • addTypingUser()          │                        │
│  └────────────────────────────┘                        │
│                                                         │
│  localStorage Persistence:                             │
│  • Auth state persists (tokens, user)                 │
│  • Preferences saved (theme, notifications)           │
│  • Restored on page reload                            │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
<RootLayout>
│
├─ <Providers>  (Auth, Toast, etc.)
│  │
│  └─ <Root Routes>
│     │
│     ├─ <LandingPage>
│     │  ├─ HeroSection
│     │  ├─ FeaturesShowcase
│     │  └─ Footer
│     │
│     ├─ <AuthLayout>
│     │  │
│     │  ├─ <LoginPage>
│     │  │  ├─ EmailInput
│     │  │  ├─ PasswordInput
│     │  │  ├─ LoginButton
│     │  │  └─ SocialButtons
│     │  │
│     │  ├─ <RegisterPage>
│     │  │  ├─ NameInput
│     │  │  ├─ EmailInput
│     │  │  ├─ PasswordInput
│     │  │  ├─ PasswordStrengthMeter
│     │  │  └─ RegisterButton
│     │  │
│     │  └─ <OtpPage>
│     │     ├─ OtpInputs (6 boxes)
│     │     ├─ ResendButton
│     │     └─ CountdownTimer
│     │
│     └─ <ProtectedLayout>
│        │
│        └─ <DashboardLayout>
│           ├─ Sidebar (collapsible)
│           ├─ Navbar
│           │  ├─ ProfileDropdown
│           │  ├─ SearchBar
│           │  └─ NotificationBell
│           │
│           └─ <Pages>
│              ├─ DashboardPage
│              ├─ TradingPage
│              ├─ PortfolioPage
│              ├─ ChatPage
│              └─ SettingsPage
```

---

## API Integration Points

### Service Layer Entry Points

```
┌─────────────────────────────────────────┐
│          Service Classes                 │
├─────────────────────────────────────────┤
│                                         │
│ AuthService                             │
│ ├─ login(email, password)               │
│ ├─ register(email, password, name)      │
│ ├─ verifyOtp(email, otp)                │
│ ├─ resendOtp(email)                     │
│ ├─ refreshToken(token)                  │
│ └─ logout()                             │
│                                         │
│ TradingService                          │
│ ├─ searchStocks(query)                  │
│ ├─ getStock(ticker)                     │
│ ├─ getPrice(ticker)                     │
│ ├─ getOHLC(ticker, timeframe)           │
│ ├─ placeOrder(order)                    │
│ ├─ getOrderHistory()                    │
│ └─ cancelOrder(orderId)                 │
│                                         │
│ PortfolioService                        │
│ ├─ getPortfolioOverview()               │
│ ├─ getTransactions()                    │
│ └─ getMetrics()                         │
│                                         │
│ ChatService                             │
│ ├─ getMessages(userId)                  │
│ ├─ sendMessage(userId, content)         │
│ ├─ getUsers()                           │
│ └─ updateTypingStatus(isTyping)         │
│                                         │
└─────────────────────────────────────────┘
       ↓ All call through
┌─────────────────────────────────────────┐
│      ApiClient (Axios Wrapper)          │
├─────────────────────────────────────────┤
│                                         │
│ ApiClient.request<T>(                  │
│   method: string,                      │
│   url: string,                         │
│   data?: any,                          │
│   config?: AxiosConfig                 │
│ ): Promise<T>                          │
│                                         │
│ Features:                              │
│ • Request deduplication                │
│ • Token attachment (auth header)       │
│ • Exponential backoff retry            │
│ • Error normalization                  │
│ • Timeout management                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## Authentication Flow

```
Unauthenticated User
    ↓
    └─→ User visits app
        ↓
        └─→ Check localStorage for token
            ├─ Token found → Restore auth state
            │               ↓
            │           Authenticated
            │
            └─ No token → Show login page
                ↓
            User enters credentials
                ↓
            POST /auth/login
                ↓
            Backend validates
                ├─ Invalid → Error message
                │
                └─ Valid → Return user + tokens
                    ↓
                Show OTP page
                    ↓
                User enters 6-digit code
                    ↓
                POST /auth/verify-otp
                    ↓
                OTP valid → Return user + tokens
                    ↓
                Store in Zustand + localStorage
                    ↓
                Redirect to /dashboard
                    ↓
            Authenticated User
                ↓
            All API calls include token in header:
            Authorization: Bearer {accessToken}
                ↓
            401 Response → Token expired
                ↓
            POST /auth/refresh-token
                ↓
            Refresh successful → Update token + retry original request
                ↓
            Refresh failed → Logout + redirect to /login
```

---

## Error Handling Pipeline

```
API Error Occurs
    ↓
┌─────────────────────────────┐
│  Axios Interceptor          │
│  (Response Interceptor)     │
└────────┬────────────────────┘
         ↓
    Check Status Code
         ├─ 401 Unauthorized
         │  └─ Attempt token refresh
         │     ├─ Success → Retry original request
         │     └─ Fail → Logout + Redirect /login
         │
         ├─ 403 Forbidden
         │  └─ PermissionError → Show toast
         │
         ├─ 422 Validation Error
         │  └─ Extract field errors → Display in form
         │
         ├─ 5xx Server Error
         │  └─ Retry with exponential backoff
         │     (up to 3 times, max 10s delay)
         │
         └─ Network Error
            └─ TimeoutError → Show retry button
                ↓
            User clicks retry
                ↓
            Retry request
                ↓
            Success or Fail
         ↓
┌─────────────────────────────┐
│  Normalize Error Format     │
│ {                           │
│   code: string              │
│   message: string (user-friendly)     │
│   details?: object          │
│ }                           │
└────────┬────────────────────┘
         ↓
    Component handles error
         ├─ Show error toast
         ├─ Log to Sentry (prod)
         ├─ Display field-level errors
         └─ Offer retry action
```

---

## Performance Optimization Strategy

```
┌─────────────────────────────────────────────┐
│    Performance Optimization Layers          │
├─────────────────────────────────────────────┤
│                                             │
│ 1. Code Splitting                           │
│    ├─ Entry bundle: ~80KB                   │
│    ├─ Trading bundle: ~280KB (lazy load)    │
│    ├─ Portfolio bundle: ~200KB (lazy load)  │
│    └─ Chart libs separated                  │
│                                             │
│ 2. Request Optimization                     │
│    ├─ Deduplication (5s window)             │
│    ├─ Debounced search (300ms)              │
│    ├─ Batch polling requests                │
│    └─ Query caching per endpoint             │
│                                             │
│ 3. State Optimization                       │
│    ├─ Memoized selectors                    │
│    ├─ useCallback for handlers              │
│    ├─ React.memo on expensive components    │
│    └─ Virtualized lists (10K+ items)        │
│                                             │
│ 4. Rendering Optimization                   │
│    ├─ SSG for static pages                  │
│    ├─ ISR for data-heavy pages              │
│    ├─ Skeleton loading states               │
│    └─ Progressive hydration                 │
│                                             │
│ 5. Animation Optimization                   │
│    ├─ GPU-accelerated transforms            │
│    ├─ Will-change CSS property              │
│    ├─ Disable animations for prefers-reduced-motion │
│    └─ Debounced scroll events               │
│                                             │
│ 6. Bundle Optimization                      │
│    ├─ Tree-shaking unused code              │
│    ├─ CSS inlining                          │
│    ├─ Image optimization                    │
│    └─ Minification & compression            │
│                                             │
└─────────────────────────────────────────────┘

Target Metrics:
├─ LCP: < 2.5s
├─ FID: < 100ms
├─ CLS: < 0.1
├─ Bundle: < 500KB gzipped
└─ Time to Interactive: < 3.5s
```

---

## WebSocket Architecture (Phase 2)

```
┌──────────────────────────────────┐
│    WebSocket Integration         │
│        (Ready for Phase 2)        │
├──────────────────────────────────┤
│                                  │
│  ┌─────────────────────────┐    │
│  │ WebSocketProvider       │    │
│  │ (Context at app root)   │    │
│  └────────┬────────────────┘    │
│           ↓                      │
│  ┌─────────────────────────┐    │
│  │ usePriceSubscription()  │    │
│  │ useChatSubscription()   │    │
│  │ useOrderUpdates()       │    │
│  │ useTypingIndicator()    │    │
│  └─────────┬───────────────┘    │
│            ↓                     │
│  ┌──────────────────────────┐   │
│  │ Event Handlers:          │   │
│  │ • PRICE_UPDATE           │   │
│  │ • ORDER_FILLED           │   │
│  │ • CHAT_MESSAGE           │   │
│  │ • TYPING_INDICATOR       │   │
│  │ • CONNECTION_STATUS      │   │
│  └──────────────────────────┘   │
│            ↓                     │
│  ┌──────────────────────────┐   │
│  │ Auto-Reconnection:       │   │
│  │ • Exponential backoff    │   │
│  │ • Heartbeat/ping-pong    │   │
│  │ • Graceful degradation   │   │
│  │ • Fallback to polling    │   │
│  └──────────────────────────┘   │
│                                  │
└──────────────────────────────────┘
```

---

## Deployment Architecture

```
Git Repository (GitHub)
    ↓
Push to main branch
    ↓
┌─────────────────────────────┐
│  GitHub Actions             │
│  (CI/CD Pipeline - Ready)   │
├─────────────────────────────┤
│ 1. Lint & Type Check        │
│ 2. Build Production          │
│ 3. Run Test Suite            │
│ 4. Deploy to Staging         │
│ 5. Smoke Tests               │
│ 6. Deploy to Production      │
└────────┬────────────────────┘
         ↓
    ┌────────────────────┐
    │ Vercel (Hosting)   │
    │ (Recommended)      │
    └────────┬───────────┘
             ↓
    ┌────────────────────┐
    │ Production Domain  │
    │ semicrypto.com     │
    └────────────────────┘

Edge Locations:
├─ Global CDN
├─ Image Optimization
├─ Automatic Caching
└─ Analytics
```

---

## Testing Strategy

```
Testing Pyramid:
        /\
       /  \         E2E Tests (Playwright)
      /────\        • Login flow
     /      \       • Trading flow
    /────────\      • Portfolio flow
   /          \     • Chat flow
  /____________\

        /\
       /  \         Integration Tests (Vitest)
      /────\        • Service layer
     /      \       • Store interactions
    /────────\      • API error handling
   /          \
  /____________\

        /\
       /  \         Unit Tests (Vitest)
      /────\        • Validators
     /      \       • Formatters
    /────────\      • Helper functions
   /          \
  /____________\
```

---

## Version Control & Branching

```
main (production)
  ├─ v0.1.0 (Phase 1 - Current)
  └─ Tags for releases
  
develop (staging)
  ├─ feature/auth-integration
  ├─ feature/trading-page
  ├─ feature/portfolio-charts
  └─ feature/chat-websocket

feature branches
  └─ feature/{feature-name}
     └─ Merge to develop after review
```

---

## Summary

**Current Status:** Phase 1 ✅ Complete

SemiCrypto is architected as a **production-grade, scalable fintech frontend** with:
- Feature-based modular architecture
- Fully isolated API service layer
- TypeScript strict mode
- Zustand state management
- Framer Motion + GSAP animations
- Real-time WebSocket ready (Phase 2)
- 100% testable and maintainable code

Ready for Phase 2 backend integration and real user testing.
