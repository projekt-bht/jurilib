import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createSearch } from './services';

type SearchRequest = {
  searchID: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const manipulatedBody: SearchRequest = body;

    const query = decodeURIComponent(manipulatedBody.searchID);
    const filteredMatches = await createSearch(query);

    if (filteredMatches) {
      return NextResponse.json(filteredMatches, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Something went wrong' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Something went wrong: ' + (error as Error).message },
      { status: 400 }
    );
  }
}
