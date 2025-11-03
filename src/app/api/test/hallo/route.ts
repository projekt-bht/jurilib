import type { NextRequest } from 'next/server';

import { PrismaClient } from '~/generated/prisma/client';

export async function GET(_req: NextRequest) {
    const prisma = new PrismaClient();
    const userCount = await prisma.user.count();
    const message = userCount > 0 ? `There are ${userCount} users in the database.` : 'No users found in the database.';
    return new Response(JSON.stringify({ message }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
