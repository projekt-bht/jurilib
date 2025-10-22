# Jurilib

## Description

Wir wollen eine **Client-Server-Multipage-Webapplication** namens “Jurilib” entwerfen, welche dem Nutzer eine **simple Oberfläche, um komplexe Themen, wie die Suche nach einer Anwaltskanzlei, mit den eignen Worten vereinfacht und ermöglicht**. Diese Suche basiert auf einer eigens angelegten Datenbank, welche aus Anwaltskanzleien und Vereinen besteht. Nach erfolgreicher Suche, wird der Nutzer mit Profilen begrüßt und kann im Anschluss Anfragen zu Dienstleistungen stellen und mögliche Termine anfragen.

## Prerequisites

Für die einfache Ausführung des Stacks haben wir start-global.sh angelegt. Dafür benötigt ihr vorab HomeBrew auf eurem Mac.

Führt Folgendes lokal im Terminal aus, falls ihr [HomeBrew](https://brew.sh/de/) noch nicht installiert haben solltet

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Nun installiert ihr euch [Colima](https://github.com/abiosoft/colima). Dies nutzen wir um eine leichtgewichtige Docker Laufzeitumgebung zu erstellen.

```
brew install colima
```

Nun seid ihr einsatzbereit ![(Lächeln)](https://projekt-wise25.atlassian.net/wiki/s/228520539/6452/d4a56d2badaeae11dd53ddd41df72e35fe3907b7/_/images/icons/emoticons/smile.png)

## Dev Environment

Um das Projekt lokal laufen zu lassen führt Folgendes aus:

```
./start-global.sh
```

Das erleichtert euch das eigentlich angedachte Setup des T3-Stacks und das initiale npm install.

**Wichtig:** bei jeder Ausführung wird “npm install” ausgeführt. Wir sollten überprüfen, ob das unerwünschte Seiteneffekte mit sich zieht.

Das angedachte Setup (nach initialem npm install) wäre wie folgt:

```
./start-database.sh
npm run db:push
npm run dev
```

## Prod Environment

tbd

## Resources

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials
- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://prisma.io/)
- [Drizzle](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)
- [tRPC](https://trpc.io/)