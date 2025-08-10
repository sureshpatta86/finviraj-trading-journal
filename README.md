# 📈 Finviraj Trading Journal

A sophisticated, modern trading journal application built with Next.js 14, featuring premium glassmorphism UI and comprehensive trading analytics.

![Trading Journal Dashboard](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-14.2.31-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-blue)

## ✨ Features

### 🔐 Authentication System
- **Secure Email/Password Authentication** with NextAuth.js
- **Premium Glassmorphism UI** with purple cyber theme
- **Password Strength Validation** with real-time feedback
- **Smooth Animations** powered by Framer Motion
- **Auto Sign-in** after successful registration

### 📊 Trading Analytics (Coming Soon)
- **Trade Tracking** - Record and monitor all your trades
- **Performance Analytics** - Detailed profit/loss analysis
- **Portfolio Overview** - Real-time portfolio statistics
- **Risk Management** - Track risk metrics and position sizing
- **Journal Notes** - Add detailed notes to each trade

### 🎨 Design System
- **Glassmorphism Effects** with backdrop blur
- **Dark Theme** with purple and blue gradients
- **Responsive Design** optimized for all devices
- **Micro-interactions** and smooth transitions
- **Modern Typography** with clear hierarchy

## 🚀 Tech Stack

### Frontend
- **Next.js 14.2.31** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Database
- **NextAuth.js** - Authentication solution
- **Drizzle ORM** - Type-safe database toolkit
- **MySQL** - Relational database
- **bcryptjs** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## Getting Started

### Prerequisites

- Node.js 18+ 

## 🛠️ Installation

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager
- MySQL database

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/sureshpatta86/finviraj-trading-journal.git
   cd finviraj-trading-journal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/trading_journal"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # Optional: Google OAuth (for future use)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Database Setup**
   ```bash
   # Generate database migrations
   npm run db:generate
   
   # Apply migrations
   npm run db:migrate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
```

## 🗂️ Project Structure

```
finviraj-trading-journal/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Authentication pages
│   │   │   ├── signin/        # Sign-in page
│   │   │   └── signup/        # Sign-up page
│   │   ├── api/               # API routes
│   │   │   └── auth/          # NextAuth API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable components
│   │   └── ui/               # UI components
│   ├── lib/                  # Utility functions
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── db.ts             # Database connection
│   │   └── utils.ts          # Helper utilities
│   └── middleware.ts         # Next.js middleware
├── drizzle/                  # Database schema and migrations
├── public/                   # Static assets
└── docs/                     # Documentation
```

## 🔧 Configuration

### Database Schema
The application uses Drizzle ORM with the following main tables:
- `users` - User account information
- `trades` - Trading records (planned)
- `portfolios` - Portfolio data (planned)
- `sessions` - User sessions

### Authentication Flow
1. **Registration** - Users create accounts with email/password
2. **Validation** - Real-time form validation with Zod schemas
3. **Security** - Passwords hashed with bcryptjs
4. **Sessions** - Managed by NextAuth.js with JWT tokens

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup and authentication
- [x] Premium UI design system
- [x] Database schema design
- [x] User registration and login

### Phase 2: Core Features (In Progress)
- [ ] Trade entry and management
- [ ] Basic portfolio tracking
- [ ] Trade categories and tags
- [ ] Data export functionality

### Phase 3: Analytics (Planned)
- [ ] Performance dashboard
- [ ] Profit/loss charts
- [ ] Risk analysis tools
- [ ] Trading statistics

### Phase 4: Advanced Features (Future)
- [ ] Mobile app
- [ ] Real-time market data integration
- [ ] Social trading features
- [ ] Advanced analytics and reporting

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Drizzle Team** - Type-safe ORM
- **Community** - All contributors and supporters

## 📞 Support

- 📧 Email: support@finviraj.com
- 🐛 Issues: [GitHub Issues](https://github.com/sureshpatta86/finviraj-trading-journal/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/sureshpatta86/finviraj-trading-journal/discussions)

---

**Built with ❤️ by the Finviraj Team**

*Making trading journal management simple, beautiful, and powerful.*

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
