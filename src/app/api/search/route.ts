import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import vectoriseData from "~/helper/vectoriseData";
import prisma from "@/lib/db";

type SearchRequest ={
    searchID: string
}

const similarityOffset = 0.35

export async function POST(req:NextRequest){
    const body= await req.json();
    const manipulatedBody:SearchRequest = body;

    const query = decodeURIComponent(manipulatedBody.searchID)
    
    if(query){
        const searchInput = await vectoriseData(query)
        const matches = await prisma.$queryRawUnsafe(`
        SELECT id, name, "expertiseArea",
            1 - ("expertiseVector" <=> $1::vector) AS similarity
        FROM "Organization"
        WHERE 
            "expertiseVector" IS NOT NULL
            AND (1 - ("expertiseVector" <=> $1::vector)) >= $2
        ORDER BY similarity DESC
        `, 
        searchInput,
        similarityOffset
        );

        console.log(matches)
        return NextResponse.json(matches, { status: 200 })
    }

    return NextResponse.json({ message: "Something went wrong" }, { status: 400 })
}

