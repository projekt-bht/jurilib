#!/usr/bin/env bash
npm install
colima start
bash start-database.sh
npm run db:push
npm run dev
