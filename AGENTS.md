# AGENTS.md

This document provides guidelines for agentic coding systems (AI assistants, LLMs, agents) working in the scavenger-hunt codebase.

## Build, Lint, and Test Commands

### Development

- **Start dev server**: `pnpm dev` (runs on port 3000)
- **Build for production**: `pnpm build`
- **Preview production build**: `pnpm preview`

### Code Quality

- **Type check**: `pnpm check-types`
- **Lint and format check**: `pnpm check`
- **Auto-fix linting/formatting**: `pnpm check:fix`

### Testing

- **Run all tests**: `pnpm test`
- **Run single test file**: `pnpm test -- src/path/to/test.ts` (uses Vitest)
- **Run tests matching pattern**: `pnpm test -- -t "pattern"`

### Database

- **Push schema changes**: `pnpm db:push` (Drizzle ORM)
- **Open Drizzle Studio**: `pnpm db:studio`
- **Run seed script**: `pnpm db:seed`

---

## Code Style Guidelines

### TypeScript & Type Safety

**Strict mode enabled** - `strict: true` in tsconfig.json, with:

- `noUnusedLocals` and `noUnusedParameters` - remove all unused code
- `noFallthroughCasesInSwitch` - explicit breaks in switch statements
- `noUncheckedSideEffectImports` - only import side effects explicitly

**Type annotations:**

- Always explicitly type function parameters; **omit return types** - let TypeScript infer them
- Use `type` for simple object shapes; `interface` is discouraged
- Prefer `Array<T>` generic syntax (enforced by Biome: `useConsistentArrayType`)
- Export named types alongside exports: `type Props = { ... }; export function Component(props: Props) { ... }`

### Imports & Modules

**Import organization** (enforced by Biome):

1. External packages (`react`, `@tanstack/*`, etc.)
2. Internal absolute imports (`@/lib`, `@/components`, etc.)
3. Relative imports (`./sibling`, `../parent`)

Use path alias `@/*` → `./src/*` (tsconfig.json)

**Avoid barrel imports** - import directly from source files:

```tsx
// ❌ Avoid: import { Button } from '@/components'
// ✅ Good: import { Button } from '@/components/ui/button'
```

**Default exports discouraged** - Biome rule: `noDefaultExport: error`. Exception: config files (_.config._).

### Formatting & Consistency

**Biome formatter** enforces:

- Tab indentation (not spaces)
- Trailing commas in multiline
- Sorted class names in `cn()`, `clsx()`, `cva()` (Biome nursery rule)

**File naming:**

- Everything: kebab-case (button.tsx, use-auth.ts, my-route.tsx)

### React & Components

**Component structure:**

```tsx
import type { ReactNode } from "react";
import { SomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonProps = {
  variant?: "default" | "outline";
  disabled?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "default",
  disabled,
  children,
}: ButtonProps) {
  return (
    <button
      className={cn("px-4 py-2", variant === "outline" && "border")}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

**Guidelines:**

- Export component and its Props type together
- Use `'use client'` directive sparingly; prefer Server Components in TanStack Start
- Use Tailwind + `cn()` for styling (no inline CSS modules in most cases)
- Prefer composition over prop drilling (children, slots)

### Functional Programming & Code Style

- **Prefer functional over object-oriented** - use functions, composition, and immutability
- **Use function declaration syntax** for named exports and declarations; use arrow functions only for callbacks
- **Omit return types** on functions and procedures - let TypeScript infer them
- **Avoid classes** unless absolutely necessary (prefer factory functions or hooks)
- **Favor pure functions** with explicit inputs and outputs over stateful methods
- **Avoid mutating variables** - use immutable patterns (spread operator, map/filter, etc.)

```tsx
// ❌ Avoid mutation:
const items = [1, 2, 3];
items.push(4);

const obj = { name: "John" };
obj.age = 30;

// ✅ Good - immutable:
const items = [1, 2, 3, 4];
const newItems = [...items, 4];

const obj = { name: "John", age: 30 };
const updated = { ...obj, age: 30 };

// Function declarations for named exports:
export function getUserById(id: string) {
	// implementation
}

// Arrow functions for callbacks:
const handleClick = () => { /* ... */ };
items.map((item) => item.id);
```

### Comments

**Don't comment code unless there's a really good reason.** Code should be self-documenting via clear variable naming and descriptive function names. If you find yourself needing comments to explain code logic, consider refactoring for clarity instead.

### Form Handling

**Forms use React Hook Form + Zod:**

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Required"),
});

export function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

### Error Handling

**Server Functions (TanStack Start):**

```tsx
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth-middleware";

export const myServerFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    try {
      return result;
    } catch (error) {
      if (error instanceof SomeKnownError) {
        throw new Error("User-friendly message");
      }
      throw error;
    }
  });
```

**Client-side:** Use Sonner for toast notifications on errors/success.

### Naming Conventions

- **Hooks**: `use*` prefix (useAuth, useQuery, useCallback)
- **Server functions**: `*ServerFn` suffix (joinHuntServerFn, updateUserServerFn)
- **Queries**: `*Queries` object (huntQueries, userQueries)
- **Database tables**: plural snake_case (users, collection_items)
- **Boolean variables/functions**: `is*`, `has*`, `can*`, `should*` (isLoading, hasError, canEdit)
- **Event handlers**: `on*` prefix (onClick, onSubmit, onError)
- **Constants**: UPPER_SNAKE_CASE (API_URL, MAX_RETRIES)

### Enums & Unions

**No TypeScript enums** - Biome rule: `noEnum: error`. Use `as const` enums with union types instead:

```tsx
// ❌ Avoid:
enum Role {
  Admin = "admin",
  User = "user",
}

// ✅ Good:
const ROLES = {
	admin: "admin",
	user: "user",
} as const;

type Role = typeof ROLES[keyof typeof ROLES];
```

---

## Architecture Patterns

### Server Functions

- Use `createServerFn()` for backend logic (authentication, DB mutations)
- Always apply `authMiddleware` for protected operations
- Input validation with Zod
- Handler receives `{ data, context }` where context includes authenticated user

### Queries & Data Fetching

- Use TanStack Query for client-side caching/fetching
- Query objects located in `src/queries/` (e.g., `huntQueries.list()`)
- Server render with `ensureQueryData()` to preload
- Use `useSuspenseQueries()` for client-side suspension with error boundaries

### Database

- Drizzle ORM with PostgreSQL
- Schema in `src/db/schema.ts`
- Run migrations with `pnpm db:push`
- Use Drizzle's type-safe query builder (no raw SQL)

### File Structure

```
src/
├── components/       # Reusable UI components
├── routes/          # TanStack Router route definitions
├── server-funcs/    # Server Functions (TanStack Start)
├── queries/         # React Query definitions
├── lib/             # Utilities, helpers, auth
├── db/              # Database schema, migrations
├── hooks/           # Custom React hooks
└── integrations/    # External API integrations (Cloudinary, etc.)
```

---

## Additional Resources

Review the included React Best Practices guide (from Vercel) for performance optimization patterns:

- Eliminate waterfalls in data fetching (Dependency-Based Parallelization, Promise.all)
- Optimize bundle size (avoid barrel imports, dynamic imports)
- Server-side rendering with Suspense boundaries
- Client-side re-render optimization (memoization, state management)

---

## Summary for Agents

When working in this codebase:

1. Always run `pnpm check-types && pnpm check:fix` before committing
2. Import directly from source files, not barrel files
3. Type everything explicitly; use Zod for runtime validation
4. Prefer composition and Server Components
5. Use React Hook Form + Zod for forms
6. Apply `authMiddleware` to protected Server Functions
7. Follow naming conventions (hooks, server functions, queries)
8. No TypeScript enums; use union types + const arrays instead
