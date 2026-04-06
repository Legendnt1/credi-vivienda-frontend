# CrediVivienda Frontend

[![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular&logoColor=white)](https://angular.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![RxJS](https://img.shields.io/badge/RxJS-7-B7178C?logo=reactivex&logoColor=white)](https://rxjs.dev/) [![Jasmine](https://img.shields.io/badge/Jasmine-5-8A4182?logo=jasmine&logoColor=white)](https://jasmine.github.io/) [![Karma](https://img.shields.io/badge/Karma-6-56C0C0?logo=karma&logoColor=white)](https://karma-runner.github.io/) [![ngx-translate](https://img.shields.io/badge/ngx--translate-i18n-3B82F6)](https://github.com/ngx-translate/core)

University web application for housing credit management. This repository contains the Angular frontend focused on financial simulation, real estate project management, and report generation.

## Project Description

CrediVivienda allows authenticated users to:

- Register and review real estate projects.
- Simulate credit and installment scenarios.
- Analyze dashboards and financial reports.
- Configure system preferences.

The project is organized by functional domains (`iam`, `projects`, `financial`) and follows a layered architecture:

- `application`: state and use cases.
- `domain`: business entities and models.
- `infrastructure`: HTTP integrations and assemblers.
- `presentation`: views and UI components.

## Main Technologies

- Angular 20 (standalone components)
- TypeScript 5
- RxJS
- Karma + Jasmine for unit testing
- ngx-translate for i18n

## Repository Structure

```text
src/
  app/
    financial/
    iam/
    projects/
    shared/
  environments/
server/
public/assets/
```

- `src/app/app.routes.ts`: main routes and lazy-loaded views.
- `server/`: data and routes for local mock API setup.
- `public/assets/`: images, fonts, icons, and translation files.

## Prerequisites

- Node.js LTS (recommended: 20+)
- pnpm (recommended) or npm
- Angular CLI 20

## Installation and Run

1. Clone the repository.
2. Install dependencies.
3. Start the development server.

```bash
pnpm install
pnpm start
```

Application URL: `http://localhost:4200`

## Available Scripts

```bash
pnpm start   # Runs ng serve
pnpm build   # Builds the project
pnpm watch   # Development build in watch mode
pnpm test    # Runs unit tests
```

## Development Conventions

- Keep strict TypeScript typing.
- Avoid `any`; prefer explicit types or `unknown` when needed.
- Build small, focused components.
- Prioritize readability and naming consistency.
- Add tests for critical logic.

## Contribution Guide

Academic contributions are welcome. To contribute:

1. Create a branch from `main`:
   - `feature/short-name`
   - `fix/short-name`
2. Make atomic changes with clear commit messages.
3. Run tests and build before opening a PR.
4. Open a Pull Request describing:
   - Problem or objective.
   - Implemented solution.
   - Evidence (screenshots or test notes).
5. Wait for team review and address feedback.

### Suggested Commit Format

```text
type(scope): short description
```

Examples:

- `feat(projects): add project details view`
- `fix(financial): correct down payment calculation`
- `docs(readme): update contribution guide`

## Minimum Pull Request Criteria

- Code compiles without errors.
- Existing tests pass.
- No secrets or credentials are included.
- Functionality is manually validated.
- Documentation is updated when behavior changes.

## Team

Project developed for a university context. You can update this section with team members, course name, and instructor.
