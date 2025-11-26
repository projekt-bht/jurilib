import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/auth/password";
import prisma from "@/lib/db";
import { ApiError, handleApiError } from "@/lib/errors";
import {
  MIN_PASSWORD_LENGTH,
  isValidEmail,
  sanitizeString,
} from "@/lib/validation";
import { vectoriseData } from "@/services/server/vectorizer";
import { Prisma } from "~/generated/prisma/client";
import { Areas, OrganizationType, UserType } from "~/generated/prisma/enums";

const normalizeWebsite = (value: string) =>
  value ? (/^https?:\/\//i.test(value) ? value : `https://${value}`) : "";

const isValidOrganizationType = (
  value: string,
): value is OrganizationType =>
  (Object.values(OrganizationType) as string[]).includes(value);

const filterAreas = (value: unknown): Areas[] =>
  Array.isArray(value)
    ? Array.from(
        new Set(
          value.filter((entry): entry is Areas =>
            typeof entry === "string"
              ? (Object.values(Areas) as string[]).includes(entry)
              : false,
          ),
        ),
      )
    : [];

export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    try {
      payload = (await req.json()) as Record<string, unknown>;
    } catch {
      throw new ApiError("Invalid JSON payload", 400);
    }

  const contactName = sanitizeString(payload.contactName);
  const contactEmail = sanitizeString(payload.contactEmail).toLowerCase();
  const password = sanitizeString(payload.password);
  const organizationName = sanitizeString(payload.organizationName);
  const phone = sanitizeString(payload.phone);
  const website = sanitizeString(payload.website);
  const address = sanitizeString(payload.address);
  const description = sanitizeString(payload.description);
  const organizationTypeInput = sanitizeString(payload.organizationType);
  const expertiseArea = filterAreas(payload.expertiseArea);

    if (!contactName) {
      throw new ApiError("Kontaktname ist erforderlich.", 400);
    }

    if (!isValidEmail(contactEmail)) {
      throw new ApiError("Eine gültige E-Mail-Adresse ist erforderlich.", 400);
    }

    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      throw new ApiError(
        `Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen enthalten.`,
        400,
      );
    }

    if (!organizationName) {
      throw new ApiError("Ein Organisationsname ist erforderlich.", 400);
    }

    if (!expertiseArea.length) {
      throw new ApiError(
        "Mindestens ein Fachgebiet muss ausgewählt werden.",
        400,
      );
    }

  const resolvedOrganizationType = isValidOrganizationType(
    organizationTypeInput,
  )
    ? organizationTypeInput
    : OrganizationType.LAW_FIRM;

  const details = [description, `Kontakt: ${contactName} (${contactEmail})`]
    .filter(Boolean)
    .join("\n\n");
  const detailedDescription = details || "Keine weiteren Angaben.";

  const vectorInput = `Fachgebiet: ${expertiseArea.join(", ")}\nBeschreibung: ${detailedDescription}`;

    const [expertiseVector, passwordHash] = await Promise.all([
      vectoriseData(vectorInput),
      hashPassword(password),
    ]);

    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: organizationName,
          email: contactEmail,
          phone: phone || undefined,
          address: address || undefined,
          website: normalizeWebsite(website) || undefined,
          description: detailedDescription,
          type: resolvedOrganizationType,
          expertiseArea,
        },
      });

      await tx.$executeRawUnsafe(
        `UPDATE "Organization"
         SET "expertiseVector" = $1::vector
         WHERE "id" = $2`,
        expertiseVector,
        organization.id,
      );

      const adminUser = await tx.user.create({
        data: {
          name: contactName,
          email: contactEmail,
          password: passwordHash,
          type: UserType.ADMIN,
          organizationId: organization.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          organizationId: true,
          createdAt: true,
        },
      });

      return { organization, adminUser };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return handleApiError(
        new ApiError(
          "E-Mail ist bereits vergeben. Bitte verwenden Sie eine andere Adresse.",
          409,
        ),
        "E-Mail ist bereits vergeben. Bitte verwenden Sie eine andere Adresse.",
      );
    }

    return handleApiError(error, "Interner Fehler bei der Registrierung.");
  }
}
