<<<<<<< HEAD

# GitHub Copilot Instructions for lad-platform-frontend

## Project Architecture

- **Framework:** Next.js (TypeScript, App Router)
- **Styling:** Tailwind CSS, shadcn/ui components
- **Forms & Validation:** React Hook Form + Zod
- **Internationalization:** next-intl setup (`src/messages/` for message files, see `en.json`, `ar.json`)
- **State Management:** Custom hooks and stores (see `src/hooks/`, `src/features/*/store/`)
- **API Layer:** Centralized in `src/lib/api.ts` and `src/lib/apiClient.ts`
- **Component Organization:**
  - UI and layout components in `src/components/`
  - Feature modules in `src/features/`
  - Shared utilities in `src/shared/`

## Developer Workflows

- **Start Dev Server:** `npm run dev` (see README)
- **Build:** Use VS Code build task or `msbuild` for legacy .NET integration
- **Lint/Format:** Auto-format on save, lint via code actions (`source.fixAll`)
- **Auto-save:** Files save on focus change
- **Commit Messages:** Use detailed, emoji-rich messages (see `.vscode/settings.json`)

## Patterns & Conventions

- **Type Safety:** Always use TypeScript types and Zod schemas for API/data validation dont ever use type of any
- **Form Handling:** Use React Hook Form with Zod for all forms; validation schemas live in feature folders
- **Styling:** Use Tailwind utility classes; shadcn/ui for consistent design
- **Internationalization:** Use next-intl's `useTranslations` and message files in `src/messages/` (`en.json`, `ar.json`).
- **Component Structure:** Prefer functional components, colocate styles and tests
- **API Calls:** Centralize fetch logic in `src/lib/apiClient.ts`; avoid direct fetch in components
- **Error Handling:** Use `toast.error` for user-facing errors

## Integration Points

- **External APIs:** All requests go through `apiClient.ts`
- **State/Store:** Use custom hooks for feature-specific state
- **VS Code Tasks:** Build task uses `msbuild` for .NET interop if present

## Examples

- **Form Example:** See `src/features/profile/components/contractor/ContractorOperational.tsx` for React Hook Form + Zod usage
- **Internationalization Example:** See usage of `useTranslations` from next-intl in components, and message files in `src/messages/en.json`, `src/messages/ar.json`.
- **API Example:** See `src/lib/api.ts` and `src/lib/apiClient.ts`

## References

- For code style, see `.cursor/rules/docs.mdc` and referenced files
- For onboarding, see `README.md`

---

# If you are unsure about a pattern, check the relevant feature folder or shared utility. Ask for feedback if conventions are unclear or missing.

# LAD Platform - Copilot Instructions

## Architecture Overview

LAD is a Next.js 15 platform using App Router with TypeScript, serving as a construction industry marketplace connecting service providers (contractors, engineers, suppliers) with service seekers (individuals, organizations).

### Core Structure

- **Feature-based architecture**: `src/features/[feature-name]/` contains components, hooks, services, store, types, constants, utils
- **Shared resources**: `src/shared/` for cross-feature components and utilities
- **Route groups**: `(auth)`, `(marketing)`, `dashboard/` with role-based nested routes
- **Role-specific dashboards**: `/dashboard/contractor/`, `/engineering_office/`, etc.

## Technology Stack & Patterns

### State Management

- **Zustand** for client state with feature-specific stores (`authStore`, `registrationStore`)
- Stores include devtools middleware and handle optimistic updates with error states
- Use selectors for derived state: `const { user, isAuthenticated } = useAuthStore()`

### Internationalization (i18n)

- **next-intl** without URL routing, cookie-based locale storage (`NEXT_LOCALE`)
- Support for English/Arabic with RTL layout: `getTextDirection(locale)`
- Namespaced translations: `useTranslations('auth')`
- Client locale detection: `getLocaleFromClient()`, server: `getServerLocale()`

### API & Data Flow

- Axios-based API client with standardized response wrapper in `lib/apiClient.ts`
- Token-based authentication using `tokenStorage` utility
- All API responses follow `ApiResponse<T>` interface with success/data/message pattern

### Component Patterns

- Use `function` keyword for components, not `const`
- Shadcn UI + Radix components for consistent design system
- File structure: exported component → subcomponents → helpers → static content → types
- Export types from feature-specific `types/index.ts` files

### Routing & Auth

- Role-based routing with middleware redirects
- Authentication state managed via `AuthProvider` wrapper
- Protected routes check `tokenStorage.isAuthenticated()`
- Role-specific dashboard layouts in nested route folders

## Development Workflows

### Running the Project

```bash
npm run dev --turbopack  # Development with Turbo
npm run build           # Production build
npm run lint           # ESLint (currently disabled in builds)
```

### Path Aliases

```typescript
"@/*": ["./src/*"]           // General src imports
"@auth/*": ["./src/features/auth/*"]  // Auth feature
"@shared/*": ["./src/shared/*"]       // Shared resources
```

### Form Handling

- react-hook-form with Zod validation schemas
- Schemas stored in `constants/` directories within features
- Shadcn Form components for consistent styling
- Password visibility toggles in auth forms

### Styling Conventions

- Mobile-first Tailwind CSS approach
- Custom utility classes in `globals.css` for repeated patterns
- Semantic color tokens: `text-primary`, `bg-background`, `border-border`
- Consistent spacing: `gap-4`, `p-4`, `m-4` over arbitrary values
- Dark mode support with `dark:` prefixes

## Critical Workflows

### User Registration Flow

- Multi-step registration managed by `authStore` with role-specific data buckets
- Role flow metadata in `auth/constants/roleFlowMeta.ts` defines steps per role
- Dynamic form fields based on selected role (contractor, engineer, supplier, etc.)
- Email/phone verification integrated into registration process

### Dashboard Structure

- Role-based dashboard routes: `/dashboard/[role]/`
- Shared dashboard layout with responsive sidebar navigation
- User avatar dropdown with profile completion progress
- Profile management with tabbed interface (desktop) / accordion (mobile)

### Authentication Patterns

- Token storage with refresh capability in localStorage
- Auth state persistence across page reloads
- Logout clears all stored data and redirects to login
- Role-based access control for dashboard sections

## File Naming & Organization

- Use kebab-case for directories: `features/auth`, `components/common`
- Named exports for components and utilities
- Group related functionality in feature folders
- Separate concerns: components, hooks, services, store, types per feature

Reference the existing Cursor rules in `.cursor/` for additional TypeScript, React, and code quality conventions.

## Product Management Implementation Rules

### **Constants Organization Strategy**

- Global constants → `src/constants/` (shared across features: currencies, common statuses, app-wide configs)
- Feature-specific constants → `src/features/[feature]/constants/` (API endpoints, feature labels, validation rules)
- UI constants → component-level or shared/ui/ (design tokens, component variants)
- Always export from feature `constants/index.ts` for clean imports
- Use SCREAMING_SNAKE_CASE for constant objects and values

### **Form Handling & Validation Strategy**

- **Form Library**: Use `react-hook-form` with `@hookform/resolvers/zod` for all forms
- **Validation**: Use `zod` schemas with proper TypeScript inference `z.infer<typeof Schema>`
- **Form Components**: Import from `@/shared/components/ui/form` (NOT `@/components/ui/form`)
- **Input Components**: Mix of `@/components/ui/` and `@/shared/components/ui/` - check project structure
- **Form Pattern**: `useForm<z.infer<typeof ValidationSchema>>({ resolver: zodResolver(ValidationSchema) })`
- **Field Rendering**: Use proper TypeScript typing for field render functions
- **File Inputs**: Use hidden inputs with proper accessibility labels
- **Multilingual**: Use `useTranslations()` for form labels and validation messages

### **Component Import Strategy**

- **Shared UI**: `@/shared/components/ui/` for form, card, select, badge components
- **Base UI**: `@/components/ui/` for button, input, textarea, switch components
- **Mixed Usage**: Check existing files for component location patterns
- **Form Imports**: Always use `@/shared/components/ui/form` for Form components
- **Consistency**: Follow existing project patterns for component imports

### **API Response Models & Type Safety**

- Create TypeScript interfaces for all API response objects in `types/api.ts`
- Model interfaces should match exact API structure for intellisense
- Use generic ApiResponse<T> wrapper for consistent error handling
- Include pagination meta types: `PaginationMeta`, `ApiListResponse<T>`
- Response models enable safe property access: `response.data.products[0].name_ar`
- Avoid inline type assertions - prefer proper model interfaces

### **State Management - Optimistic Updates**

- Use Zustand stores with optimistic update patterns for instant UI feedback
- Update local state immediately, rollback on API failure
- Pattern: `optimisticUpdate(localUpdate, apiCall, rollbackUpdate)`
- Cache management: Keep local state in sync with server without full refresh
- No unnecessary API calls after CRUD operations - use selective updates

### **Animation System**

- All animations in `src/shared/components/animations/` for global reuse
- Use framer-motion for complex animations (already installed)
- Consistent timing: fast(200ms), normal(300ms), slow(500ms)
- Stagger patterns for list animations with `motionVariants`
- Reusable motion variants for common animation patterns

### **Error Handling & User Feedback**

- Use global `ErrorState` component from `src/shared/components/ui/ErrorState.tsx`
- Always provide retry functionality for failed operations
- Toast notifications for success/error feedback using `toast` from "sonner"
- Graceful degradation for offline scenarios
- Loading states with contextual retry buttons

### **Skeleton Strategy**

- Reusable skeletons → `src/shared/components/ui/` (used across features)
- Feature-specific skeletons → `src/features/[feature]/components/` (single use)
- Use `ShimmerSkeleton` for animated loading with variants: card, text, circular
- Match skeleton structure exactly to component layout for smooth transitions

### **API Integration Patterns**

- Always use `request()` from `@/lib/apiClient` for consistent error handling
- Service classes in `src/features/[feature]/services/` with class-based methods
- Handle FormData uploads with `Content-Type: multipart/form-data` header
- Implement retry mechanisms with exponential backoff for failed requests

### **Product Card UX Patterns**

- Action layout: 3-dots dropdown (MoreHorizontal) + eye icon (top-right corner)
- Hover effects: scale(1.02) + shadow elevation with smooth transitions
- Loading overlays for optimistic updates with backdrop blur
- Consistent badge usage for status/labels with proper semantic colors

### **Responsive Design Standards**

- Grid layouts: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Card spacing: `gap-6` for desktop, `gap-4` for mobile
- Action buttons: stack vertically on mobile, inline on desktop
- Mobile-first approach with proper touch targets (min 44px)

### **Color Usage & Theming**

- Primary actions: `bg-design-main` (#ac8852) and `bg-design-main-dark` (#794f10)
- Success states: `bg-s-5` (#8abf35) for positive feedback
- Warning states: `bg-w-5` (#fcd22a) for attention items
- Destructive actions: `bg-d-5` (#ff5459) for delete/remove actions
- Use CSS variables for consistent theming across light/dark modes

### **Navigation & Routing Best Practices**

- Nested routes maintain sidebar active state automatically
- Use Next.js App Router with proper folder structure
- Implement breadcrumb navigation for deep nested pages
- Handle route parameters with strict TypeScript interfaces
- Preserve scroll position for better UX during navigation

> > > > > > > a863edc82822621db1bd99916eca319efae4b6dd
