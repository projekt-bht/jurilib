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

| Branch | Purpose             | Rules / Protection                                                          |
| ------ | ------------------- | --------------------------------------------------------------------------- |
| main   | Production          | Merge via PR, minimum 1 review <!--- vllt später noch: ", status checks"--> |
| dev    | Stage / Integration | Merge via PR, minimum 1 review                                              |

<!--- TODO: here either futher table entries concerning future branch names or 2.1 Branch Naming Conventions and then adding 2.2 to "Git Commit Rules"-->

### Git Commit Rules

## 3. Linting & Formatting
