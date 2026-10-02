# Contributing to CampusCare

Thank you for contributing to **CampusCare (IT Asset, AMC & Physical Lab Management)**! This guide establishes organization standards to ensure seamless collaboration across multi-developer teams.

---

## 🏛️ Team Architecture & Workflow

We adopt a standard **Git Flow** branching model:

- `main`: Production-ready branch. Only merge tested releases via PR.
- `develop`: Main integration branch where latest features reside.
- `feat/<feature-name>`: Dedicated feature branches branched from `develop`.
- `fix/<bug-name>`: Bugfix branches branched from `develop` or `main`.
- `chore/<task-name>`: Maintenance, CI, dependencies, or tooling updates.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: >= 20.x
- **npm**: >= 10.x
- **Git**

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/reddotorg123/CampusCare.git
   cd CampusCare
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   # or on Windows PowerShell:
   Copy-Item .env.example .env
   ```
   Fill in your Supabase project URL and Anon key in `.env`.

4. Start development server:
   ```bash
   npm run dev
   ```

---

## 📝 Commit Conventions

We follow the **Conventional Commits** specification:

```
<type>(<scope>): <short description>
```

### Types:
- `feat`: A new feature for the user or system
- `fix`: A bug fix
- `docs`: Documentation updates (README, CONTRIBUTING, inline docs)
- `style`: Code style / formatting changes (no functional changes)
- `refactor`: Code restructuring without bug fixes or feature additions
- `perf`: Performance improvements
- `test`: Adding or updating test cases
- `chore`: Build processes, dependencies, or auxiliary tools

### Examples:
- `feat(tickets): add real-time priority escalation modal`
- `fix(auth): resolve Google OAuth callback redirect on mobile`
- `docs(readme): add multi-platform deployment instructions`

---

## 🔍 Code Quality & Verification

Before opening any Pull Request, ensure all checks pass:

```bash
# Verify linting
npm run lint

# Verify production build
npm run build
```

---

## 🔄 Pull Request Guidelines

1. **Keep PRs focused**: Each PR should address a single feature or bug.
2. **Fill out the PR Template**: Describe changes clearly and check off the relevant modules.
3. **Verify CI**: Ensure all GitHub Actions checks pass.
4. **Code Review**: Require at least one peer review before merging into `main` or `develop`.

---

## 🗄️ Database Changes (Supabase)

- Never alter production tables directly without documenting the change.
- Place all new schema migrations in `supabase/` as numbered SQL files or update `supabase/schema.sql` with idempotency (`IF NOT EXISTS`).
- Verify RLS (Row Level Security) policies for any newly created tables to prevent unauthorized data exposure.

---

## 📱 Platform Specifics

- **Web**: React 19 + Vite (`src/`)
- **Android**: Capacitor (`android/`) — run `npx cap sync android` after web builds
- **iOS**: Capacitor (`ios/`) — run `npx cap sync ios` after web builds
- **Windows / Desktop**: Qt 6.11 C++/QML (`qt-client/`)
