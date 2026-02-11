# Project Styleguide - Jurilib

This styleguide defines coding conventions and workflow practices for the project **"jurilib"**.

## 1. Naming Conventions

## 1.1 Language

- **English:**  
  All elements that are **permanently part of the codebase or project** must be written in English. This includes, but is not limited to:  
  variables, constants, functions, methods, classes, interfaces, types, enums, file and folder names, branch names, commit messages, backend error messages, and comments.

- **German:**  
  As our team is based in Germany, **issues and temporary comments** (e.g. TODOs or FIXMEs) may be written in German.  
  Furthermore, **all user-facing content** (emails, frontend error messages and everything else in the UI) must be written in German. This is due to the application currently being targeted exclusively at a German customer base.

### 1.2 Variables and Constants

- **Local variables & function arguments:** `lowerCamelCase`
  ```ts
  let userName = 'Alice';
  ```
- **Enviroment Variables:** `UPPER_SNAKE_CASE`
  ```ts
  const API_URL = 'https://api.example.com';
  ```

### 1.3 Functions & Methods

- **React funtions:** `UpperCamleCase`
  ```ts
  function OrganizationCard(orga: Organization) {}
  ```
- **Normal functions:** `lowerCamelCase`
  ```ts
  function getUserName(id: string) {}
  ```
- **Event handlers / callbacks:** `handle` / `on` prefix
  ```ts
  const handleClick = () => {};
  const onSubmit = () => {};
  ```

### 1.4 Classes, Interfaces, Types, Enums

- **Classes:** `UpperCamelCase`
  ```ts
  class UserService {}
  ```
- **Interfaces:** `UpperCamelCase` with a `I` prefix
  ```ts
  interface IUser {}
  ```
- **Types:**
  - **Name:** `UpperCamelCase`
  - **Value:** `lowerCamelCase`
  ```ts
  type UserRole = 'admin' | 'user';
  ```
- **Enums:**
  - **Name:** `UpperCamelCase`
  - **Value:** `UPPER_SNAKE_CASE`
  ```ts
  enum UserType {
    USER
    EMPLOYEE
    ADMIN
  }
  ```

## 2. Branches

### 2.1 Branch Structure

| Branch       | Purpose                                       | Rules / Protection                                          |
| ------------ | --------------------------------------------- | ----------------------------------------------------------- |
| **main**     | Production                                    | only changed through PRs                                    |
| **dev**      | Stage / Integration                           | Created from `main` branch, PRs -> `main`, minimum 1 review |
| **setup/\*** |  For initial setup, may be deleted later      | Created from `dev` branch, PRs -> `dev`, minimum 1 review   |
| **feat/\***  |  Adding new features                          | Created from `dev` branch, PRs -> `dev`, minimum 1 review   |
| **fix/\***   | Self explanatory                              | Created from `dev` branch, PRs -> `dev`, minimum 1 review   |
| **bug/\***   | Can be used interchangeably to fix/\*         | Created from `dev` branch, PRs -> `dev`, minimum 1 review   |
| **docs/\***  | Used if only documentation is added or edited | Created from `dev` branch, PRs -> `dev`, minimum 1 review   |

### 2.2 Creating Branch

Bracnches are created from an issue. This way, all commits within the branch are automatically linked to the issue.

## 3. Git Commit Rules

### 3.1 Basics

- **Structure:**  
  `<type>(<scope>): <short, imperative description>` **or**  
  `<type>(<scope>): <short, imperative description> (#<issue number>)`
- **Reference to issue:** There **allways (!)** has to be a reference to an issue. If the commit is not automatically linked to an issue through a branch, the reference has to be added manually.

### 3.2 Types

| Type         | Meaning                                       |
| ------------ | --------------------------------------------- |
| **feat**     | A new feature                                 |
| **merge**    | Reoslving merge conflicts                     |
| **fix**      | A bug fix                                     |
| **docs**     | Documentation updates                         |
| **style**    | Formatting or style-only changes              |
| **refactor** | Internal code changes, no behavior change     |
| **perf**     | Performance improvements                      |
| **test**     | Add or update tests                           |
| **chore**    | Maintenance tasks, dependency updates, config |
| **ci**       | Continuous integration / deployment setup     |
| **revert**   | Revert a previous commit                      |

### 3.3 Examples

| Bad             | Good                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| “updated stuff” | `feat(auth): add password reset flow` **or** `feat(auth): add password reset flow (refs #7)`           |
| “fixed bug”     | `fix(api): prevent null pointer on login` **or** `fix(api): prevent null pointer on login (fixes #54)` |
| “cleanup”       | `refactor(ui): remove unused button props` **or** `refactor(ui): remove unused button props (#83)`     |

## 4. Linting & Formatting

| **Purpose**            | **Tool**                                                     | **Recommended Configuration**                                          |
| ---------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Linting**            | [ESLint](https://eslint.org/)                                | `eslint-config-next` + `@typescript-eslint` + `eslint-plugin-prettier` |
| **Formatting**         | [Prettier](https://prettier.io/)                             | Consistent code formatting                                             |
| **Type Checking**      | TypeScript                                                   | `strict: true` in `tsconfig.json`                                      |
| **Imports & Ordering** | `eslint-plugin-import` or `eslint-plugin-simple-import-sort` | Automatic sorting and validation of imports                            |
| **Code Style Docs**    | Markdown document in the repository (`STYLEGUIDE.md`)        | Contains rules and examples for team members                           |
