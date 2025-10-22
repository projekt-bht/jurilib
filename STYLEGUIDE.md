# Project Styleguide - Jurilib

This styleguide defines coding conventions and workflow practices for the project **"jurilib"**.

## 1. Naming Conventions

### 1.1 Variables and Constants

- **Local variables & function arguments:** `lowerCamelCase`
  ```ts
  let userName = "Alice";
  ```
- **Constants:** `UPPER_SNAKE_CASE`
  ```ts
  const API_URL = "https://api.example.com";
  ```
- **Boolean variables:** use `is/has/can` prefixes
  ```ts
  const isActive = true;
  const hasAccess = false;
  ```

### 1.2 Functions & Methods

- **Normal functions:** `lowerCamelCase``
  ```ts
  function getUserName(id: string) {}
  ```
- **Async functions:** `lowerCamelCase`, optionally with a `fetch` / `load` prefix <!--- TODO: Decision here!-->
  ```ts
  async function fetchUserData() {}
  async function loadUserData() {}
  ```
- **Event handlers / callbacks:** `handle` / `on` prefix
  ```ts
  const handleClick = () => {};
  const onSubmit = () => {};
  ```

### 1.3 Classes, Interfaces, Types, Enums

- **Classes:** `UpperCamelCase`
  ```ts
  class UserService {}
  ```
- **Interfaces:** `UpperCamelCase`, optional `I` prefix <!--- TODO: Decision here!-->
  ```ts
  interface User {}
  interface IUser {}
  ```
- **Types / Enums:** `UpperCamelCase`
  ```ts
  type UserRole = "admin" | "user";
  enum Status {
    Active,
    Inactive,
  }
  ```

### 1.4 Files & Folders

- **React components / classes:**  
  `UpperCamelCase` → `UserCard.tsx` <!--- TODO: chatgbt suggested this after I mentions that we were using a T3 stack. don't know if this is relevant yet and if so, if we should also define naming conventions for other more specific things like css files -->
- **Utilities / services:**  
  `lowerCamelCase` or `kebab-case` → `authService.ts`, `dateUtils.ts`or `auth-service.ts`, `date-utils.ts` <!--- TODO: Decison here! -->
- **Folders:**  
  `kebab-case` or `UpperCamelCase` → `components/`, `services/`or `Components/`, `Services/` <!--- TODO: Decison here! -->

## 2. Branches & Git Workflow

| Branch     | Purpose                                 | Rules / Protection                                                  |
| ---------- | --------------------------------------- | ------------------------------------------------------------------- |
| main       | Production                              | only changed though PR <!--- vllt später noch: ", status checks"--> |
| dev        | Stage / Integration                     | Created from `main` branch, PR -> `main`, minimum 1 review          |
| setup/\*   |  For inital setup, may be deleted later | Created from `dev` branch, PR -> `dev`, minimum 1 review            |
| feature/\* |  Adding new features                    | Created from `dev` branch, PR -> `dev`, minimum 1 review            |
| bugfix/\*  | self explanatory                        | Created from `dev` branch, PR -> `dev`, minimum 1 review            |

<!--- TODO: here either futher table entries concerning future branch names or 2.1 Branch Naming Conventions and then adding 2.2 to "Git Commit Rules"-->

### Git Commit Rules

## 3. Linting & Formatting

---

---

# Format & Lint Vorschlag von ChatGBT

| Zweck                 | Tool                                                                                             | Empfohlene Config                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Linting**           | [ESLint](https://eslint.org/)                                                                    | `eslint-config-next` + `@typescript-eslint` + `eslint-plugin-prettier` |
| **Formatting**        | [Prettier](https://prettier.io/)                                                                 | Einheitliches Codeformat                                               |
| **Type Checking**     | TypeScript                                                                                       | `strict: true` in `tsconfig.json`                                      |
| **Imports & Ordnung** | `eslint-plugin-import` oder `eslint-plugin-simple-import-sort`                                   | Automatische Sortierung & Checks                                       |
| **Git Hooks**         | [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/okonet/lint-staged) | Pre-commit Checks                                                      |
| **Commit Style**      | [Commitlint](https://commitlint.js.org/)                                                         | Conventional Commits (`feat:`, `fix:`, etc.)                           |
| **Code Style Doku**   | Markdown-Dokument im Repo (`STYLEGUIDE.md`)                                                      | Regeln + Beispiele für Teammitglieder                                  |
