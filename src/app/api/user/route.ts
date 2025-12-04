import { NextRequest, NextResponse } from 'next/server';
import { ValidationError } from '@/error/validationErrors';
import { createUser } from './services';
import { UserCreateInput } from '~/generated/prisma/models';

//nur post für user
export async function POST(request: NextRequest) {
  try {
    if (!request.headers.get('content-type')?.includes('application/json')) {
      throw new ValidationError('invalidInput', 'content-type', undefined, 415);
    }

    const body: UserCreateInput = await request.json();
    if (!body || Object.keys(body).length === 0) {
      throw new ValidationError('invalidInput', 'body', undefined, 400);
    }
    const user = await createUser(body);

    return NextResponse.json(
      {
        message: 'Benutzer erfolgreich registriert',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.getErrorMessage() }, { status: error.statusCode });
    }

    console.error('User registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
