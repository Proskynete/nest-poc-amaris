# POC Demo

A NestJS application built with Fastify, following Domain-Driven Design (DDD) and Clean Architecture principles.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Local Development](#local-development)
  - [Production Mode](#production-mode)
  - [Docker](#docker)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v24 (specified in `.nvmrc`)
  - Recommended: Use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions
  - Run `nvm use` in the project root to use the correct version
- **npm**: Comes with Node.js
- **Docker & Docker Compose** (optional, for containerized development)

## Installation

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd poc-demo
```

### Step 2: Install Node.js version

If you're using nvm:

```bash
nvm use
```

This will automatically use Node.js v24 as specified in `.nvmrc`.

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Configure environment variables

Create a `.env` file in the project root (optional, defaults will be used if not provided):

```bash
# .env
PORT=3000
NODE_ENV=development
```

Available environment variables:
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development, production)

## Running the Application

### Local Development

Start the application in development mode with hot-reload and debugging enabled:

```bash
npm run dev
```

The application will be available at:
- **Server**: http://localhost:3000
- **Debugger**: localhost:9229

The dev server uses `ts-node-dev` with automatic restart on file changes and integrates with Pino for pretty-printed logs.

### Production Mode

Build and run the application in production mode:

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

Or in one command:

```bash
npm start
```

The compiled output will be in the `dist/` directory.

### Docker

#### Development with Docker

Run the application in a Docker container with hot-reload:

```bash
docker-compose up my-service-dev
```

Features:
- Port 3000: Application
- Port 9229: Debugger
- Volume mounting for live code changes
- Automatic restart on file changes

#### Production with Docker

Run the optimized production container:

```bash
docker-compose up my-service-production
```

The production container:
- Uses multi-stage build for smaller image size
- Runs with non-root user for security
- Uses `dumb-init` for proper signal handling
- Prunes dev dependencies

## Testing

### Run All Tests

Execute both unit and e2e tests with coverage:

```bash
npm test
```

This command:
1. Runs unit tests with coverage
2. Runs e2e tests with coverage
3. Calculates global test coverage combining both

### Run Unit Tests Only

```bash
npm run test:unit
```

Uses Vitest with configuration from `vitest.config.unit.ts`.

### Run E2E Tests Only

```bash
npm run test:e2e
```

Uses Vitest with configuration from `vitest.config.e2e.ts`.

### Coverage

Coverage reports are generated in:
- `coverage/` - Combined coverage reports
- `.nyc_output/` - NYC coverage data

## Code Quality

### Linting

Check code for linting errors:

```bash
npm run lint
```

Auto-fix linting issues:

```bash
npm run lint:fix
```

The project uses:
- ESLint with TypeScript support
- Prettier for code formatting
- Conventional commits (enforced by commitlint)

### Pre-commit Hooks

The project uses Husky for git hooks:
- Runs linting on staged files
- Validates commit messages against conventional commits

## Project Structure

```
src/
├── app/                          # Application infrastructure layer
│   └── http-api/
│       ├── health/               # Health check endpoints
│       ├── response-normalizer/  # Global response formatting
│       └── routes/               # Route constants
├── contexts/                     # DDD Bounded Contexts
│   ├── payments/                 # Payment context (example)
│   │   ├── application/          # Use cases
│   │   ├── domain/               # Entities & domain logic
│   │   └── infrastructure/       # Controllers & repositories
│   └── shared/                   # Shared kernel
│       ├── dependency-injection/
│       └── logger/
└── main.ts                       # Application entry point
```

### Architecture Principles

- **Clean Architecture**: Dependencies point inward (Infrastructure → Application → Domain)
- **Domain-Driven Design**: Organized by bounded contexts
- **Repository Pattern**: Domain defines interfaces, infrastructure implements them
- **Use Cases**: Encapsulate business operations

## API Documentation

### Base URL

```
http://localhost:3000/api
```

All routes are prefixed with `/api` (configured in `main.ts`).

### Health Check

```bash
GET /api/health
```

Returns the health status of the application.

### Response Format

**Success Response:**
```json
{
  "data": {
    // Response data
  }
}
```

**Error Response:**
```json
{
  "error": {
    "message": "Error message",
    "status": 400,
    "reasons": ["validation error 1"]  // For validation errors
  }
}
```

### Example: Payments API

**Create Payment:**
```bash
POST /api/payments
Content-Type: application/json

{
  "amount": 100.50,
  "customerId": "customer-123"
}
```

**Get Payment by ID:**
```bash
GET /api/payments/:id
```

## Development Workflow

1. **Create a new feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes** following the architecture patterns

3. **Run tests**
   ```bash
   npm test
   ```

4. **Lint your code**
   ```bash
   npm run lint:fix
   ```

5. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add new feature"
   ```

   Commit types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

6. **Push and create a pull request**

## Troubleshooting

### Port already in use

If port 3000 is already in use, change it in your `.env` file:

```bash
PORT=3001
```

### Docker build fails

Clear Docker cache and rebuild:

```bash
docker-compose down
docker system prune -a
docker-compose up --build my-service-dev
```

### Tests failing

Clear coverage data and run again:

```bash
npm run build:clean
rm -rf coverage .nyc_output
npm test
```

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Fastify Documentation](https://www.fastify.io)
- [Vitest Documentation](https://vitest.dev)
- [CLAUDE.md](./CLAUDE.md) - Architecture guide for AI assistants

## License

UNLICENSED - Private project
