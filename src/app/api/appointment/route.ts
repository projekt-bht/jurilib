import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createAppointment } from './services';

/**
 * TODO:
 * - Get implementieren
 * - bei Hannes nachfragen
 */

// POST /api/appointment/
// Create a new appointment
export async function POST(req: NextRequest) {
  try {
    // TODO: übernommen von Hannes - nachfragen, was genau die if-Abfrage soll
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ message: 'Invalid content type' }, { status: 415 });
    }

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: 'Request body is required' }, { status: 400 });
    }

    const createdAppointment = await createAppointment(body);
    return NextResponse.json(createdAppointment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Creation failed: ' + (error as Error).message },
      { status: 400 }
    );
  }
}

// GET /api/appointment/
// Retrieve all appointments of ...???
export async function GET(_req: NextRequest) {
  // TODO: To be implemented
}
