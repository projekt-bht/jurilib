import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/db';
import { OrganizationCreateInput } from "~/generated/prisma/models";
import prisma from "@/lib/db";
import { vectorizeExpertiseArea } from "@helper/vectorizer";

export async function POST(req:NextRequest){
    const body = await req.json();
    const organizationInfo: OrganizationCreateInput = body;

    //TODO: Validierung
    const input = `
        ${organizationInfo.expertiseArea!.toString()}
      `
    const expertiseVector = await vectorizeExpertiseArea(input)

    try{
        const createdOrganization = await db.organization.create({data:organizationInfo})
        await db.$executeRawUnsafe(
            `UPDATE "Organization"
            SET "expertiseVector" = $1::vector
            WHERE "id" = $2`,
            expertiseVector,
            createdOrganization.id
        )
        return NextResponse.json({ message: "Created" }, { status: 201 })
    } catch(e){
        throw e
    }
}

export async function PATCH(req:NextRequest){
    const body = await req.json();
    const organizationInfo: OrganizationCreateInput = body;

    //TODO: Validierung
    if(!organizationInfo.id)
        return NextResponse.json({status: 400})

    const input = `
        ${organizationInfo.expertiseArea!.toString()}
      `
    const expertiseVector = await vectorizeExpertiseArea(input)

    try{
        const updatedOrganization = await db.organization.update({
        where: { id: organizationInfo.id },
        data: {
            ...organizationInfo
        },
        })
        await db.$executeRawUnsafe(
            `UPDATE "Organization"
            SET "expertiseVector" = $1::vector
            WHERE "id" = $2`,
            expertiseVector,
            updatedOrganization.id
        )
        return NextResponse.json({ message: "Patched" }, { status: 200 })
    } catch(e){
        throw e
    }
}

export async function GET(_req:NextRequest){
    const organizations = await prisma.organization.findMany()
    return NextResponse.json(organizations)
}