# Finviraj Trading Journal

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

Finviraj Trading Journal is a Next.js 14 trading journal application with TypeScript, featuring glassmorphism UI and comprehensive trading analytics. The app uses NextAuth.js for authentication, Drizzle ORM for database management, and MySQL for data storage.

## Working Effectively

### Environment Setup
- **Node.js Version Required**: Node.js 18.0 or later (verified working with v20.19.4)
- **Package Manager**: npm (verified working with v10.8.2)

### Bootstrap, Build, and Test the Repository
1. **Install Dependencies**:
   ```bash
   npm install
   ```
   - Takes ~2.5 minutes. NEVER CANCEL. Set timeout to 180+ seconds.
   - May show deprecation warnings - these are normal and do not affect functionality.

2. **Environment Configuration**:
   ```bash
   cp .env.example .env.local
   ```
   - Edit `.env.local` with your configuration:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=trading_journal
     DB_PORT=3306
     
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_SECRET=your-secret-key-here
     
     # Optional: Google OAuth
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     
     JWT_SECRET=your-jwt-secret-here
     ```

3. **Database Setup** (Requires MySQL):
   ```bash
   npm run db:generate  # Generate database migrations (~0.5 seconds)
   npm run db:migrate   # Apply migrations (requires MySQL connection)
   ```

4. **Development Server**:
   ```bash
   npm run dev
   ```
   - Starts in ~1.5 seconds on http://localhost:3000
   - **KNOWN ISSUE**: Google Fonts may fail to load due to network restrictions - this does NOT affect functionality
   - App will run normally with fallback fonts

5. **Build for Production**:
   ```bash
   npm run build
   ```
   - Takes ~19 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
   - **IMPORTANT**: Build may fail with ESLint errors. To ignore ESLint during build testing, temporarily add to `next.config.js`:
     ```js
     eslint: { ignoreDuringBuilds: true }
     ```

6. **Linting**:
   ```bash
   npm run lint
   ```
   - Takes ~3 seconds
   - **FIRST RUN**: Will prompt for ESLint configuration - select "Strict (recommended)"
   - Currently has ESLint errors - this is normal in development

### Database Operations

1. **Generate Migrations**:
   ```bash
   npm run db:generate
   ```
   - Reads schema from `src/lib/schema.ts`
   - Creates migration files in `drizzle/` directory

2. **Apply Migrations**:
   ```bash
   npm run db:migrate
   ```
   - **REQUIRES**: MySQL database connection
   - **FAILS**: Without proper database credentials

3. **Database Studio**:
   ```bash
   npm run db:studio
   ```
   - **REQUIRES**: MySQL database with valid password
   - Opens Drizzle Studio for database management

## Validation

### Manual Testing Scenarios
1. **Authentication Flow**:
   - Navigate to http://localhost:3000
   - Click "Sign In" or "Sign Up"
   - Test form validation (try invalid emails, short passwords)
   - Verify navigation between signin/signup pages
   - **NOTE**: Actual authentication requires database connection

2. **UI/UX Testing**:
   - Verify glassmorphism design loads correctly
   - Test dark/light theme toggle
   - Check responsive design on different screen sizes
   - Verify smooth animations and transitions

3. **Navigation Testing**:
   - Test all navigation links (Home, About, Feedback)
   - Verify protected routes redirect to signin when not authenticated
   - Check middleware protection is working

### Build Validation
- **ALWAYS** run `npm run lint` before committing - CI will fail with linting errors
- **ALWAYS** test `npm run build` with your changes
- **ALWAYS** verify `npm run dev` starts successfully

## Common Tasks

### Debugging Build Issues
1. **Google Fonts Network Error**:
   - Expected in restricted environments
   - Temporarily comment out Google Fonts in `src/app/layout.tsx`:
     ```tsx
     // import { Inter } from 'next/font/google'
     // const inter = Inter({ subsets: ['latin'] })
     ```
   - Use `className="font-sans"` instead of `className={inter.className}`

2. **ESLint Build Failures**:
   - Add to `next.config.js` for testing: `eslint: { ignoreDuringBuilds: true }`
   - Fix actual ESLint errors before production deployment

3. **Database Connection Issues**:
   - Check MySQL is running and credentials are correct
   - Verify `.env.local` file exists and has proper values
   - Test connection string format in `drizzle.config.ts`

### TypeScript Configuration
- **Target**: ES2018 (required for Drizzle database generation)
- **Issue**: If `npm run db:generate` fails with ES5 target errors, tsconfig.json target should be "ES2018"

## Key Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── auth/               # Authentication pages (signin, signup)
│   ├── api/                # API routes
│   │   └── auth/           # NextAuth.js API routes
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Homepage
├── components/             # Reusable components
│   └── ui/                # UI components (shadcn/ui)
├── lib/                   # Utility functions
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # Database connection
│   ├── schema.ts          # Drizzle ORM schema
│   └── validations.ts     # Form validation schemas
└── middleware.ts          # Route protection middleware
```

### Important Files
- `package.json` - Scripts and dependencies
- `drizzle.config.ts` - Database configuration
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Styling configuration
- `src/lib/schema.ts` - Database schema (users, trades, portfolios, etc.)
- `src/middleware.ts` - Route protection logic

## Environment Requirements

### Required Services
- **MySQL Database**: Required for authentication and data storage
- **Node.js 18+**: Runtime environment
- **Internet Access**: For Google Fonts (optional) and package installation

### Optional Services
- **Google OAuth**: For social authentication (requires API credentials)

## Development Notes

### Known Issues
1. **Google Fonts**: May fail in restricted network environments
2. **ESLint**: Current codebase has linting errors
3. **Database**: All database operations require MySQL connection
4. **No Test Suite**: No test infrastructure currently implemented

### Performance Expectations
- **npm install**: ~2.5 minutes
- **npm run dev**: ~1.5 seconds to start
- **npm run build**: ~19 seconds (without ESLint errors)
- **npm run lint**: ~3 seconds
- **npm run db:generate**: ~0.5 seconds

### NEVER CANCEL Commands
- `npm install` - Set timeout to 180+ seconds
- `npm run build` - Set timeout to 60+ seconds
- Any database migration commands - Set timeout to 60+ seconds