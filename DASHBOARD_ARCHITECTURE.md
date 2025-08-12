# Dashboard Architecture

## Overview
The Finviraj Trading Journal now features a comprehensive dashboard with sidebar navigation for authenticated users.

## Dashboard Structure

### Main Layout Components
- **DashboardLayout**: Main layout wrapper with sidebar and header
- **DashboardHeader**: Top navigation with logo, user info, and actions
- **DashboardSidebar**: Collapsible sidebar with navigation sections
- **DashboardOverview**: Main dashboard content with stats and quick actions

### Navigation Sections

#### 1. Trading Section
- **Trade Log** (`/dashboard/trades`) - View and manage all trading activities
- **Trade Calendar** (`/dashboard/calendar`) - Trading schedule and market events
- **Fund Manager** (`/dashboard/funds`) - Manage trading funds and allocations
- **Analytics** (`/dashboard/analytics`) - Performance analysis and insights
- **AI Insights** (`/dashboard/ai-insights`) - AI-powered trading recommendations (New feature)

#### 2. Account Section
- **User Profile** (`/dashboard/profile`) - Personal information and preferences
- **Settings** (`/dashboard/settings`) - Application settings and configuration

#### 3. Support Section
- **Help & FAQ** (`/dashboard/help`) - Documentation and support
- **Feedback** (`/dashboard/feedback`) - Send feedback and suggestions

## Features

### Dashboard Header
- **Left Side**: 
  - Mobile menu button (on mobile/tablet)
  - Finviraj Trading logo
- **Right Side**:
  - Search button
  - Notifications bell (with indicator)
  - "Add Trade" button (primary CTA)
  - Theme toggle
  - User avatar with dropdown menu

### Sidebar Navigation
- **Responsive Design**: 
  - Desktop: Always visible (272px width)
  - Mobile/Tablet: Overlay with backdrop
- **Collapsible Sections**: Each navigation section can be expanded/collapsed
- **Active State**: Current page highlighted
- **Badge Support**: "New" badge for AI Insights feature

### Dashboard Overview
- **Welcome Section**: Personalized greeting and quick actions
- **Statistics Cards**: Portfolio value, P&L, win rate, active trades
- **Recent Trades**: List of latest trading activities
- **Quick Actions**: Shortcuts to common tasks

## Routing
- Main dashboard: `/dashboard`
- All dashboard pages are protected by authentication middleware
- Unauthenticated users redirected to sign-in page

## Authentication Flow
1. User signs in via `/auth/signin`
2. After successful authentication, can access `/dashboard`
3. Home page (`/`) shows "Dashboard" button for authenticated users
4. Clicking "Dashboard" redirects to `/dashboard` route

## Mobile Responsiveness
- Sidebar collapses to overlay on screens < 1024px
- Header adapts to smaller screens (hiding some elements)
- Touch-friendly navigation and interactions
- Responsive grid layouts for dashboard content

## Future Enhancements
All dashboard pages currently show "Coming Soon" placeholders. Individual features will be implemented with:
- Real-time data integration
- Interactive charts and analytics
- Trade management functionality
- AI-powered insights and recommendations
