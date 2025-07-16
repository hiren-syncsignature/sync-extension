# SyncSignature Email Signature Manager - AI Development Context

## Project Overview
**SyncSignature** is a Chrome extension that automatically manages and inserts email signatures for Gmail and Outlook users. The extension connects to a SaaS platform (app.syncsignature.com) to sync signatures across devices and provides seamless integration with popular email clients.

### Core Purpose
- Automatically insert email signatures in Gmail and Outlook compose windows
- Synchronize signatures from a centralized SaaS platform
- Provide a user-friendly popup interface for signature management
- Maintain consistent branding across all email communications

## Architecture & Technology Stack

### Frontend Technologies
- **React 18** with TypeScript for popup UI
- **Vite** as build tool and development server
- **Tailwind CSS** for styling with custom animations
- **Chrome Extension Manifest V3** for extension capabilities

### Extension Components
- **Popup UI** (`src/main.tsx`, `src/App.tsx`) - Main interface for managing signatures
- **Content Script** (`src/content/index.ts`) - Handles DOM manipulation in email clients
- **Background Script** (`src/background/index.ts`) - Manages authentication and signature syncing
- **Storage Layer** (`src/utils/storage.ts`) - Chrome storage API wrapper

### Key Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "tailwindcss-animate": "^1.0.7",
  "@crxjs/vite-plugin": "^2.0.0-beta.18",
  "@types/chrome": "0.0.246"
}
```

## Core Functionality

### 1. Email Client Integration
**Target Platforms:**
- Gmail (mail.google.com)
- Outlook Web (outlook.live.com, outlook.office.com)

**Signature Insertion Logic:**
- Monitors DOM mutations for compose windows
- Uses specific selectors for each email client
- Prevents duplicate insertions with `WeakSet` tracking
- Injects signatures as HTML content with custom styling

### 2. Authentication & User Management
**Authentication Flow:**
- Users authenticate on app.syncsignature.com
- Extension extracts user token from localStorage
- Background script monitors for login state changes
- Automatic token refresh on tab updates

### 3. Signature Synchronization
**Data Flow:**
- Fetches signatures from `server.syncsignature.com`
- Caches signatures locally with 30-minute TTL
- Stores selected signature for automatic insertion
- Handles offline scenarios with cached data

### 4. Storage Management
**Chrome Storage Usage:**
- `userObject`: User authentication data
- `signatures`: Array of available signatures
- `selectedSignature`: Currently active signature
- `signaturesTimestamp`: Cache invalidation timestamp

## File Structure & Responsibilities

### Core Files
```
src/
├── background/
│   └── index.ts           # Service worker, auth, API sync
├── content/
│   └── index.ts           # DOM manipulation, signature injection
├── components/
│   ├── Header.tsx         # UI header with refresh functionality
│   ├── UserInfo.tsx       # User account information display
│   ├── SignatureList.tsx  # Signature selection interface
│   ├── ErrorAlert.tsx     # Error message display
│   └── Toast.tsx          # Status notifications
├── utils/
│   ├── storage.ts         # Chrome storage API wrapper
│   ├── api.ts             # Server communication
│   ├── messaging.ts       # Tab communication utilities
│   └── logger.ts          # Logging utilities
└── types/
    └── index.ts           # TypeScript type definitions
```

### Key Type Definitions
```typescript
interface UserObject {
  id: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

interface SelectedSignature {
  index: number;
  content: string;
  timestamp: number;
}

interface Signature {
  html: string;
  [key: string]: any;
}
```

## Development Workflow & Standards

### Code Quality Standards
- **TypeScript**: Strict typing with minimal `any` usage
- **ESLint**: Configured for React and TypeScript
- **Error Handling**: Comprehensive try-catch blocks with user feedback
- **Async/Await**: Consistent promise handling throughout

### Build & Development
```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# Linting
npm run lint
```

### Security Considerations
- Content Security Policy compliant
- Secure token storage using Chrome APIs
- CORS-enabled API communications
- Input sanitization for HTML signatures

## Extension Permissions & Capabilities

### Required Permissions
```json
{
  "permissions": ["activeTab", "storage"],
  "host_permissions": [
    "https://mail.google.com/*",
    "https://server.syncsignature.com/*",
    "https://app.syncsignature.com/*",
    "https://outlook.live.com/*",
    "https://outlook.office.com/*"
  ]
}
```

### Content Script Injection
- Matches Gmail and Outlook domains
- Injects signature functionality automatically
- Handles dynamic content loading

## API Integration

### Server Communication
**Base URL**: `server.syncsignature.com` (via environment variable)
**Authentication**: Token-based via query parameters
**Response Format**: JSON with `html` array containing signatures

### Error Handling
- Network timeout management
- Graceful degradation with cached data
- User-friendly error messages
- Retry mechanisms for failed requests

## UI/UX Design Principles

### Visual Design
- **Glass morphism** aesthetic with backdrop blur
- **Smooth animations** using Tailwind CSS
- **Responsive layout** adapting to content
- **Color scheme**: Primary blues with accent colors

### User Experience
- **Non-intrusive**: Minimal popup interface
- **Instant feedback**: Toast notifications for actions
- **Offline capable**: Works with cached signatures
- **Error recovery**: Clear error messages with retry options

## Testing & Quality Assurance

### Testing Strategy
- Manual testing across Gmail and Outlook
- Extension installation and update testing
- Network failure scenario testing
- Multi-signature management testing

### Performance Considerations
- Efficient DOM mutation monitoring
- Debounced API calls to prevent rate limiting
- Minimal memory footprint with WeakSet usage
- Cached data with intelligent refresh logic

## Deployment & Distribution

### Build Process
1. TypeScript compilation
2. Vite bundling with Chrome extension plugin
3. Manifest validation
4. Asset optimization

### Distribution
- Chrome Web Store (primary)
- Direct installation via developer mode
- Enterprise distribution capabilities

## Common Development Patterns

### State Management
- React hooks for local state
- Chrome storage for persistence
- Event-driven updates across components

### Error Boundaries
- Comprehensive error catching
- User-friendly error display
- Logging for debugging

### Async Operations
- Promise-based storage operations
- Proper error propagation
- Loading states for better UX

## Environment Configuration

### Development Environment
```bash
# Environment variables
VITE_APP_SERVER=https://server.syncsignature.com/api/signatures

# Development server
npm run dev
```

### Production Build
- Optimized bundle size
- Source map generation
- Asset compression

## Troubleshooting & Common Issues

### Common Problems
1. **Signature not inserting**: Check content script injection
2. **Authentication failures**: Verify token storage
3. **API timeouts**: Check network connectivity
4. **UI loading issues**: Verify React component state

### Debug Tools
- Chrome DevTools for extension debugging
- Console logging with categorized messages
- Network tab for API monitoring
- Storage inspection for data persistence

---

## Development Guidelines for AI Assistants

### Code Modification Approach
1. **Maintain existing patterns**: Follow established TypeScript and React conventions
2. **Preserve error handling**: Keep comprehensive try-catch blocks
3. **Test thoroughly**: Verify changes across Gmail and Outlook
4. **Update types**: Maintain TypeScript type definitions
5. **Follow security practices**: Validate all inputs and API communications

### When Adding Features
- Consider Chrome extension limitations
- Maintain backward compatibility
- Update manifest permissions if needed
- Test across all supported email clients
- Document new functionality

### When Debugging
- Check browser console for errors
- Verify Chrome storage contents
- Monitor network requests
- Test in incognito mode
- Validate manifest configuration

This context provides comprehensive understanding of the SyncSignature extension architecture, development practices, and technical implementation details for effective AI-assisted development.