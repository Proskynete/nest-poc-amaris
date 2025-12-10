# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS application using Fastify as the HTTP adapter, structured following Domain-Driven Design (DDD) and Clean Architecture principles. The project uses TypeScript, Vitest for testing, and includes Docker support for development and production deployments.

## Common Commands

### Development
```bash
npm run dev              # Start dev server with hot reload (uses ts-node-dev with debugging on port 9229)
npm run start            # Build and run in production mode
npm run build            # Clean build using NestJS CLI with SWC compiler
npm run build:clean      # Remove dist directory
```

### Testing
```bash
npm test                 # Run all tests (unit + e2e) with coverage and calculate global coverage
npm run test:unit        # Run unit tests only with coverage
npm run test:e2e         # Run e2e tests only with coverage
```

The test suite uses Vitest with separate configurations:
- `vitest.config.unit.ts` - Unit tests
- `vitest.config.e2e.ts` - E2E tests
- Unit and E2E tests run concurrently, then global coverage is calculated

### Code Quality
```bash
npm run lint             # Run ESLint on all .js and .ts files
npm run lint:fix         # Auto-fix linting issues
```

### Docker
```bash
docker-compose up my-service-dev         # Run development container with hot reload and debugging
docker-compose up my-service-production  # Run production container
```

Development container exposes port 9229 for debugging and mounts source code as volume.

## Architecture

### Directory Structure

```
src/
├── app/                          # Application layer (HTTP API infrastructure)
│   └── http-api/
│       ├── health/               # Health check endpoints
│       ├── response-normalizer/  # Global response/error formatting
│       └── routes/               # Route constants (API prefix)
├── contexts/                     # Bounded contexts (DDD)
│   ├── payments/                 # Payment context (example domain)
│   │   ├── application/          # Use cases
│   │   │   ├── create-payment-use-case/
│   │   │   └── find-payment-by-id-use-case/
│   │   ├── domain/               # Domain entities and repositories (interfaces)
│   │   └── infrastructure/       # Infrastructure implementations
│   │       ├── http-api/v1/      # REST controllers
│   │       └── repositories/     # Repository implementations
│   └── shared/                   # Shared kernel
│       ├── dependency-inyection/ # Custom @Injectable decorator (wraps NestJS)
│       └── logger/               # Logger domain + Pino implementation
└── main.ts                       # Application bootstrap
```

### Architectural Patterns

**Clean Architecture Layers:**
- **Domain Layer** (`domain/`): Pure business logic, entities, and repository interfaces. No framework dependencies.
- **Application Layer** (`application/`): Use cases that orchestrate domain logic. Contains DTOs for use case inputs.
- **Infrastructure Layer** (`infrastructure/`): Framework-specific implementations (NestJS modules, controllers, repository implementations).

**Key Principles:**
- Dependencies point inward: Infrastructure → Application → Domain
- Domain layer has no external dependencies
- Repository pattern: Domain defines interfaces, infrastructure provides implementations
- Use cases encapsulate business operations and are injected into controllers

**Path Aliases** (configured in `tsconfig.json`):
```typescript
@/src/*       → src/*
@/http-api/*  → src/http-api/*
@/contexts/*  → src/contexts/*
@/users/*     → src/contexts/users/*
@/shared/*    → src/contexts/shared/*
@/tests/*     → tests/*
```

### Dependency Injection

The project uses a custom `@Injectable()` decorator from `@/shared/dependency-inyection/injectable` which wraps NestJS's `@Injectable`. This abstraction layer allows decoupling from the framework.

### Response Normalization

All HTTP responses are automatically normalized through global filters and interceptors:

**Success Responses** (via `SuccessResponseNormalizerInterceptor`):
```json
{
  "data": { ...actual response data... }
}
```

**Error Responses** (via `ErrorResponseNormalizerFilter`):
```json
{
  "error": {
    "message": "Error message",
    "status": 400,
    "reasons": ["validation error 1", "validation error 2"]  // Only for BadRequestException
  }
}
```

### Global Configuration

In `main.ts`, the following are configured globally:
- **Validation**: Uses `class-validator` with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- **Logger**: Custom Pino logger integration via `NestLoggerService`
- **API Prefix**: All routes are prefixed with value from `API` constant in `route.constants.ts`
- **Platform**: Uses Fastify instead of Express

### Adding New Bounded Contexts

Follow the payments context structure:
1. Create `contexts/{context-name}/` directory
2. Add `domain/` layer: entities, repository interfaces, exceptions
3. Add `application/` layer: use cases with DTOs
4. Add `infrastructure/` layer:
   - `{context}.module.ts` - NestJS module with providers and controllers
   - `http-api/v1/` - Controllers (one per endpoint)
   - `repositories/` - Repository implementations
5. Import the module in `app.module.ts`

### Commits

The project uses conventional commits enforced by commitlint (`@commitlint/config-conventional`).
