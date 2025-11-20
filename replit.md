# AlugaFácil - Rental Management Platform

## Overview

AlugaFácil is a SaaS platform for managing rental properties with automated contract generation, tenant onboarding, payment processing, and complete rental lifecycle management. The platform serves landlords who need to manage properties and tenants who need to complete onboarding and make payments.

**Key Features:**
- Property management for landlords ✅ (Frontend + Backend + Database schema ready)
- Automated contract generation using AI (Schema ready, implementation pending)
- Tenant onboarding with document collection (Schema ready, basic onboarding for role selection implemented)
- Payment scheduling and processing via Mercado Pago (Schema ready, implementation pending)
- Property inspection management (initial and final) (Schema ready, implementation pending)
- Multi-role support (landlord, tenant, guarantor) ✅ (Fully implemented)

**Current Implementation Status (November 20, 2025):**
- ✅ Database schema fully implemented and synchronized
- ✅ Custom email/password authentication system with session persistence
- ✅ Session management bug fixed: cookies now properly configured and persisted
- ✅ User authentication flow: Landing → Register/Login → Role Onboarding → Dashboard
- ✅ Role-based access control (landlord vs tenant dashboards) with deterministic cache updates
- ✅ Backend API routes for properties, contracts, payments (CRUD operations)
- ✅ Frontend prototypes for all main pages
- ✅ Secure password hashing with bcrypt (salt rounds = 12)
- ✅ Comprehensive error handling for duplicate email/CPF constraints
- ✅ Production-ready CORS configuration with origin allowlist support
- ✅ Debug logging system with environment-based toggling
- 🚧 Object Storage integration prepared but not yet connected to UI
- 🚧 OpenAI contract generation prepared but not yet implemented
- 🚧 Mercado Pago integration schema ready but not yet implemented

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React with TypeScript using Vite as the build tool

**UI Design System:** Material Design 3 principles implemented through shadcn/ui components built on Radix UI primitives. The design emphasizes clarity over decoration with a professional, trustworthy aesthetic suitable for financial and legal workflows.

**State Management:** TanStack Query (React Query) for server state management with aggressive caching strategy (staleTime: Infinity) to minimize unnecessary refetches.

**Routing:** Wouter for lightweight client-side routing with role-based navigation (landlord vs tenant dashboards).

**Styling:** Tailwind CSS with custom design tokens defined via CSS variables for consistent theming. Typography uses Inter font from Google Fonts. The system supports light/dark mode theming stored in localStorage.

**Component Strategy:** Shadcn/ui pattern where components are copied into the project rather than installed as dependencies, allowing full customization. Components follow a card-based layout system with progressive disclosure patterns.

### Backend Architecture

**Server Framework:** Express.js with TypeScript running on Node.js

**API Design:** RESTful API structure with authentication middleware protecting all endpoints except the landing page. Endpoints follow `/api/*` convention.

**Authentication:** Custom email/password authentication system with bcrypt hashing (12 salt rounds). Session management uses PostgreSQL-backed sessions via express-session and connect-pg-simple with 7-day session TTL and explicit cookie configuration (name: "alugafacil.sid", path: "/", sameSite: "lax"). Authentication state is synchronized between server sessions and client-side React Query cache with deterministic refetch strategy.

**Database ORM:** Drizzle ORM for type-safe database queries and schema management. Schema definitions use Zod for runtime validation through drizzle-zod integration.

**Development/Production Build:** Development uses Vite middleware mode for HMR. Production bundles client with Vite and server with esbuild as ESM modules.

### Data Storage

**Database:** PostgreSQL (via Neon serverless with WebSocket support)

**Schema Design:**
- **users** - Stores user profiles with role (landlord/tenant/fiador), email, passwordHash, CPF, phone, and names
- **properties** - Property listings with status (available/rented/maintenance)
- **contracts** - Contract lifecycle tracking with status flow (draft→generated→signed→active→terminated)
- **payments** - Payment schedule with status tracking (pending→paid→overdue→canceled)
- **documents** - File metadata for uploaded documents (identity, proof of income, contracts)
- **onboardingData** - JSONB storage for tenant onboarding form data
- **tenantSettings** - Landlord-specific settings including Mercado Pago credentials
- **sessions** - Required for express-session persistence with connect-pg-simple

**Key Design Decisions:**
- Enum types for status fields ensure data consistency
- JSONB columns for flexible data (onboarding forms, settings) reduce schema rigidity
- Indexed timestamps and foreign keys for query performance
- Decimal type for monetary values to avoid floating-point precision issues

### Authentication & Authorization

**Provider:** Custom email/password authentication system (replaced Replit Auth)

**Session Storage:** PostgreSQL-backed sessions with server-side session validation using express-session and connect-pg-simple

**Password Security:** Bcrypt hashing with salt rounds = 12 for secure password storage

**Authorization Pattern:** Role-based access control (RBAC) with user roles stored in database. Middleware `isAuthenticated` checks session validity before allowing access to protected routes. Client-side routing redirects based on user role and onboarding completion status.

**Authentication Endpoints:**
- POST /api/auth/register - Create new user account with email/password
- POST /api/auth/login - Authenticate user and create session
- POST /api/auth/logout - Destroy session and log out user
- GET /api/auth/user - Get current authenticated user (protected)

**Error Handling:** 
- Duplicate email/CPF constraints return 409 status with user-friendly Portuguese messages
- Invalid credentials return 401 with appropriate message
- Form validation errors return 400 with specific field errors

**User Flow:**
1. Unauthenticated users see landing page with "Entrar" and "Criar Conta" buttons
2. Registration creates account and automatically logs in user
3. New users without role are redirected to `/onboarding` to select landlord/tenant
4. Authenticated users with roles access their respective dashboards

### External Dependencies

**Payment Gateway:** Mercado Pago integration planned (credentials stored in tenantSettings table per landlord). Payment webhooks will confirm payment status automatically.

**AI Contract Generation:** Planned integration for generating customized rental contracts based on property and tenant data using AI prompts.

**Document Storage:** File uploads for property images, tenant documents, and signed contracts (storage mechanism to be implemented).

**Email/WhatsApp Notifications:** Planned for payment reminders, contract renewals, and important updates (provider not yet selected).

**Potential Future Integrations:**
- Electronic signature service for digital contract signing
- Credit/background check services for tenant verification
- Cloud storage (S3, Cloudflare R2) for document management

### Development Environment

**Replit-Specific Features:**
- Vite plugin for runtime error overlay and dev banner
- Cartographer plugin for enhanced debugging
- Auto-provisioned PostgreSQL database via DATABASE_URL environment variable
- Session secret management via environment variables