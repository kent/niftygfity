# NiftyGifty Development Guidelines

## Overview
NiftyGifty is a gift planning application built as a monorepo with a Rails API backend and Next.js frontend.

## Architecture

### Monorepo Structure
```
niftygifty/
├── apps/
│   ├── api/          # Rails 8 API-only backend
│   └── web/          # Next.js 16 frontend
├── packages/
│   └── types/        # Shared TypeScript types
├── package.json      # Root workspace config
└── turbo.json        # Turborepo config
```

### Technology Stack
- **Backend**: Rails 8.1, SQLite, Devise + JWT, Blueprinter
- **Frontend**: Next.js 16, React 19, Tailwind CSS, shadcn/ui
- **Shared**: TypeScript types package

## Core Principles

### 1. Don't Repeat Yourself (DRY)

**Types**: All shared types live in `packages/types/src/index.ts`. Before creating a new type:
1. Search the types package first
2. If it exists, import it: `import type { Holiday } from "@niftygifty/types"`
3. Only create new types if they don't exist

**Services**: API calls are centralized in service classes:
- `apps/web/src/services/auth.service.ts`
- `apps/web/src/services/holidays.service.ts`
- `apps/web/src/services/people.service.ts`
- `apps/web/src/services/gifts.service.ts`
- `apps/web/src/services/gift-statuses.service.ts`

**Components**: Reuse shadcn/ui components from `apps/web/src/components/ui/`

### 2. Service Layer Pattern

Components should NEVER make direct API calls. Always use services:

```typescript
// In a component
import { holidaysService } from "@/services";

// Fetch data
const holidays = await holidaysService.getAll();

// Create
const newHoliday = await holidaysService.create({ name: "Christmas", date: "2025-12-25" });

// Update
await holidaysService.update(id, { name: "Updated Name" });

// Delete
await holidaysService.delete(id);
```

### 3. Type Synchronization

Rails Blueprints and TypeScript types must stay in sync:

**Rails Blueprint** (`apps/api/app/blueprints/holiday_blueprint.rb`):
```ruby
class HolidayBlueprint < ApplicationBlueprint
  fields :name, :date, :created_at, :updated_at
end
```

**TypeScript Type** (`packages/types/src/index.ts`):
```typescript
export interface Holiday extends BaseEntity {
  name: string;
  date: string;
  created_at: string;
  updated_at: string;
}
```

### 4. Authentication Flow

1. User signs in via `authService.signIn(email, password)`
2. API returns JWT in `Authorization` header
3. `apiClient` stores token in localStorage
4. Subsequent requests include token automatically
5. On sign out, token is cleared and added to denylist

### 5. Error Handling

Services throw `ApiError` on failure:

```typescript
import { ApiError } from "@/lib/api-client";

try {
  await authService.signIn(email, password);
} catch (err) {
  if (err instanceof ApiError) {
    if (err.isUnauthorized) {
      // Handle 401
    }
    console.error(err.message); // User-friendly message
  }
}
```

## Agent Checks

- Run `./bin/lint` before finishing any change (Rails rubocop + Next lint/typecheck).
- Run `./bin/test` whenever you touch backend or shared code (`apps/api` tests + frontend tests if present).

## Development Workflow

### Starting Development
```bash
# Install dependencies
npm install

# Start API (terminal 1)
cd apps/api && bin/rails server -p 3001

# Start web (terminal 2)
cd apps/web && npm run dev
```

### Adding a New Feature

1. **Define types** in `packages/types/src/index.ts`
2. **Create/update blueprint** in `apps/api/app/blueprints/`
3. **Create/update controller** in `apps/api/app/controllers/`
4. **Create/update service** in `apps/web/src/services/`
5. **Build UI components** using shadcn/ui and services

### Running Tests
```bash
# API tests
cd apps/api && bin/rails test

# Build types
cd packages/types && npm run build
```

## File Naming Conventions

- Services: `*.service.ts` (e.g., `holidays.service.ts`)
- Types: PascalCase interfaces (e.g., `Holiday`, `CreateHolidayRequest`)
- Components: PascalCase (e.g., `HolidayCard.tsx`)
- Pages: lowercase with hyphens (e.g., `apps/web/src/app/holidays/page.tsx`)

## API Endpoints

| Resource | Endpoint | Methods |
|----------|----------|---------|
| Auth | `/users`, `/users/sign_in`, `/users/sign_out` | POST, DELETE |
| Holidays | `/holidays` | GET, POST, PATCH, DELETE |
| People | `/people` | GET, POST, PATCH, DELETE |
| Gifts | `/gifts` | GET, POST, PATCH, DELETE |
| Gift Statuses | `/gift_statuses` | GET, POST, PATCH, DELETE |

## Environment Variables

### Frontend (`apps/web/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend
Uses Rails credentials for secrets. JWT secret falls back to `secret_key_base`.

