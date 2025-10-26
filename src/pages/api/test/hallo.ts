
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '~/generated/prisma/client';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    const userCount = await prisma.user.count();
    res.status(200).json({ message: userCount > 0 ? `There are ${userCount} users in the database.` : 'No users found in the database.' });
}