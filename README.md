# JURILIB
## Getting Started
- [Docker Desktop](https://docs.docker.com/get-started/get-docker/) oder [Colima](https://github.com/abiosoft/colima) starten
- ```npm install``` zum Laden der Abhängigkeiten
- ```.env```aus der ```sample.env``` Vorlage erstellen. (Kann einfach kopiert und umbenannt werden)
- Aufsetzen des Datenbank-Containers via Docker:
    - ```docker compose -f docker-compose.postgres.yml up -d```
- Initialisieren der Datenbank via Script:
    - ```npm run db:setup```
- Starten des Webservers:
    - ```npm run dev```

Im Anschluss könnt ihr [http://localhost:3000](http://localhost:3000) aufrufen, um die Anwendung zu sehen.
Zusätzlich steht euch unter [http://localhost:5555](http://localhost:5555) das **Prisma Studio** *(visuelle Darstellung der Datenbank)* zur Verfügung.

### Basic Next.js Struktur
- ```/src/app/page.tsx``` bildet die Startpage
- ```/src/app/[PageName]/page.tsx``` bilden alle weiteren Frontend-Sites 
- ```/src/app/api/[Endpoint]/route.tsx``` bilden alle Backend-API's

Weitere Infos siehe [Learn More](##--Weitere--Ressourcen)

## Daily Setup
- ```npm run db:deploy```
- ```npm run dev```

### Anpassung des Datenbank-Schemas
- unter ```/prisma/schema.prisma``` findet ihr das Datenbank-Schema
- nach Anpassung des Schemas ist eine erneute Migration erforderlich:
    - ```npm run db:dev``` wird euch nach einem Namen fragen. Dieser wird in eurer lokalen Migrationshistorie dargestellt. 
    - **Keine Sorge:** hat keine Auswirkungen auf das Deployment oder Inhalt, oder, oder, oder...

## Weitere Ressourcen

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Prisma](https://prisma.io/) - ORM
- [Tailwind CSS](https://tailwindcss.com/)


You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
