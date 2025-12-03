import { NextRequest, NextResponse } from 'next/server';
import { ValidationError } from '@/error/validationErrors';
import { createUser } from './services';

//nur post für user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
