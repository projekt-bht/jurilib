import { NextRequest } from 'next/server';
import db from '@/lib/db';

// Testroute to check the number of users in the database
// available at: /api/test/hallo
export async function GET(_req: NextRequest) {

    const userCount = await db.user.count();
    const message = userCount > 0 ? `There are ${userCount} users in the database.` : 'No users found in the database.';
    return new Response(JSON.stringify({ message }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
