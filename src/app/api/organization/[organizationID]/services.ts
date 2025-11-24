import db from "@/lib/db";
import { vectorizeExpertiseArea } from "@/services/openRouter/vectorizer";
import type { Organization } from "~/generated/prisma/client";
import type { OrganizationCreateInput } from "~/generated/prisma/models";

export const createOrganization = async (organization: Organization): Promise<Organization> => {
    try {
        const expertiseVector = await vectorizeExpertiseArea(organization.expertiseArea!.toString());

        const createdOrganization = await db.organization.create({ data: organization as OrganizationCreateInput });
        await db.$executeRaw`UPDATE "Organization"
            SET "expertiseVector" = ${expertiseVector}::vector
            WHERE "id" = ${createdOrganization.id}`;
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

export const updateOrganization = async (organization: Organization): Promise<Organization> => {
    try {
        // Hier sollte geprüft werden, ob sich das Expertise Area Feld geändert hat
        // Wenn nicht, kann die Vektorisierung übersprungen werden
        const expertiseVector = await vectorizeExpertiseArea(organization.expertiseArea!.toString());

        const updatedOrganization = await db.organization.update({
            where: { id: organization.id },
            data: {
                ...organization,
            },
        });

        await db.$executeRaw`UPDATE "Organization"
          SET "expertiseVector" = ${expertiseVector}::vector
          WHERE "id" = ${updatedOrganization.id}`;

        return updatedOrganization;
    } catch (error) {
        // Hier muss geprüft werden, ob der Fehler von Prisma kommt oder von der Vektorisierung
        throw new Error('Database update failed or vectorization failed: ' + (error as Error).message);
    }
}

export const deleteOrganization = async (organizationID: string): Promise<void> => {
    try {
        await db.organization.delete({ where: { id: organizationID } });
    } catch (error) {
        throw new Error('Internal Server Error: ' + (error as Error).message);
    }

}