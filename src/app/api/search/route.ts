import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

type SearchRequest ={
    test: string
}

export async function POST(req:NextRequest){
    const body= await req.json();
    const manipulatedBody:SearchRequest = body;

    const returnBody = manipulatedBody.test+"... hallo";

    return NextResponse.json(returnBody);
}