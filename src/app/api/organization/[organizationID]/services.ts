import db from "@/lib/db";
import { vectorizeExpertiseArea } from "@/services/openRouter/vectorizer";
import type { Organization } from "~/generated/prisma/client";
import type { OrganizationCreateInput } from "~/generated/prisma/models";

export const createOrganization = async (organization: Organization): Promise<Organization> => {
    const id = organization.id;
    const expertiseVector = await vectorizeExpertiseArea(id);

    try {
        const createdOrganization = await db.organization.create({ data: organization as OrganizationCreateInput });
        await db.$executeRawUnsafe(
            `UPDATE "Organization"
            SET "expertiseVector" = $1::vector
            WHERE "id" = $2`,
            expertiseVector,
            createdOrganization.id
        );
        return createdOrganization;
    } catch (error) {
        throw new Error('Database insert failed: ' + (error as Error).message);
    }
}

export const readOrganization = async (organizationID: string): Promise<Organization> => {
    try {
        const matchedOrg: Organization | null = await db.organization.findUnique({ where: { id: organizationID } });
        if (!matchedOrg) {
            throw new Error('Organization not found');
        }
        return matchedOrg;
    } catch (error) {
        throw new Error('Database query failed: ' + (error as Error).message);
    }
}
