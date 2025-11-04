import { NextRequest, NextResponse } from "next/server";

import db from '@/lib/db';
import { OrganizationCreateInput } from "~/generated/prisma/models";
import { Organization } from "~/generated/prisma/client";

import prisma from "@/lib/db";

export async function POST(req:NextRequest){
    const body = await req.json();
    const organizationInfo: OrganizationCreateInput = body;
    console.log(organizationInfo);

    try{
        db.organization.create({data:organizationInfo})
        return NextResponse.json({status:204})
    } catch(e){
        throw e
    }
}

export async function GET(_req:NextRequest){
    const organizations = await prisma.organization.findMany()
    return NextResponse.json(organizations)
}