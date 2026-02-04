<!-- Logo and Title -->
<div style="text-align: center;"> 
<img src="public/scale_logo.svg" alt="jurilib Logo" width="200"/>

</br>

<h1>JURILIB</h1>
</div>

<!-- Content -->

Jurilib is a full‑stack legal services platform that connects users with organizations that offer legal services. Additionally it offers features to manage cases and appointments.

It’s built with a [Next.js](https://nextjs.org/docs), [TypeScript](https://www.typescriptlang.org/), and a [Prisma-backed](https://www.prisma.io/docs) data layer and uses [Tailwind](https://tailwindcss.com/) and [Shadcn](https://ui.shadcn.com/docs) in the frontend.

The codebase is structured for feature growth and testing, with modular UI components, API routes, and validation utilities.

## Getting Started

- Start [Docker Desktop](https://docs.docker.com/get-started/get-docker/) or [Colima](https://github.com/abiosoft/colima)
- Install dependencies: `npm install`
- Create a `.env` file using `sample.env` as a template (you can simply copy and rename it)
- Set up the database container using Docker: `docker compose -f docker-compose.postgres.yml up -d`
- Initialize the database:
  - `npm run db:setup`  
    Creates the database structure based on the provided schema.
  - `npm run db:seed`  
    Seeds the database with mocked data (per organization: two users, three services, four requests, five appointments).
- Start the development server: `npm run dev`

After the setup is complete, you can open [http://localhost:3000](http://localhost:3000) to view the application.  
Additionally, **Prisma Studio** _(visual database browser)_ is available at  
[http://localhost:5555](http://localhost:5555).

## Basic Next.js Structure

- `/src/app/page.tsx` represents the landing page
- `/src/app/[PageName]/page.tsx` represent all additional frontend pages
- `/src/app/api/[Endpoint]/route.tsx` represent all backend API endpoints

For more information, see [Additional Resources](#additional-resources).

## Recommended VS Code Extensions

- [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Daily Setup

Make sure the Docker container is running. Then:

- `npm run db:deploy`
- `npm run dev`

## Modifying the Database Schema

- The database schema is located at `/prisma/schema.prisma`
- After modifying the schema, a new migration is required:
  - `npm run db:dev` will prompt you for a migration name, which will be reflected in your local migration history.
  - **No worries:** this does not affect deployment, existing data, or anything else along these lines

## Frontend Icons

Für die Nutzung von Icons im Frontend, kann die Library [Lucide](https://lucide.dev/icons/) genutzt werden.
Icons können einfach als React Komponenten implentiert werden.
Folgende Props können bei jedem Icon angepasst werden:

| name                | type    | default      |
| ------------------- | ------- | ------------ |
| size                | number  | 24           |
| color               | string  | currentColor |
| strokeWidth         | number  | 2            |
| absoluteStrokeWidth | boolean | false        |

Einfache Implementierung über:

```
const App = () => {
  return <Camera size={48} fill="red" />;
};
```

## Weitere Ressourcen

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Prisma](https://prisma.io/) - ORM
- [Tailwind CSS](https://tailwindcss.com/)

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
