import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import prisma from '@/lib/db';
import { vectorizeExpertiseArea } from '@/services/server/vectorizer';
import type { OrganizationCreateInput } from '~/generated/prisma/models';
import { OrganizationType, PriceCategory } from '~/generated/prisma/enums';

// ---------------------------------------------
// POST – Neue Organisation erstellen
// ---------------------------------------------
export async function POST(req: NextRequest) {
  try {
    // Request-Body einlesen (Organisation wird vom Client gesendet)
    const body = await req.json();
    const organizationInfo: OrganizationCreateInput = body;

    /* 
      Fachgebiete (Prisma Enum "Areas[]") extrahieren.
      - Client sendet eine Liste von Fachgebieten, z. B.: ["FAMILY_LAW", "TAX_LAW"]
      - Falls kein Array vorhanden, Standardwert = leeres Array
    */
    const expertiseArea = Array.isArray(organizationInfo.expertiseArea)
      ? organizationInfo.expertiseArea
      : [];

    /*
      Wenn Fachgebiete vorhanden sind → Textstring erzeugen und vektorisieren.
      Dies dient dem späteren semantischen Matching über pgvector.
      Beispiel: ["TAX_LAW", "FINANCE"] → "TAX_LAW, FINANCE"
    */
    const expertiseVector =
      expertiseArea.length > 0 ? await vectorizeExpertiseArea(expertiseArea.join(', ')) : null;

    // Organisation per Prisma in der Datenbank anlegen
    const createdOrganization = await prisma.organization.create({
      data: {
        name: organizationInfo.name,
        email: organizationInfo.email,
        password: organizationInfo.password,
        phone: organizationInfo.phone ?? null,
        website: organizationInfo.website ?? null,
        address: organizationInfo.address ?? null,
        description: organizationInfo.description ?? null,
        shortDescription: organizationInfo.shortDescription ?? '',
        expertiseArea,
        // Prisma Enums → automatische Typprüfung + konsistente Werte
        type: organizationInfo.type ?? OrganizationType.ASSOCIATION,
        priceCategory: organizationInfo.priceCategory ?? PriceCategory.MEDIUM,
      },
    });

    /*
      Nach Erstellung: pgvector-Feld manuell updaten.
      Prisma hat für pgvector noch keine Native-Unterstützung,
      daher wird ein Raw SQL-Befehl genutzt.
    */
    if (expertiseVector) {
      await prisma.$executeRawUnsafe(
        `UPDATE "Organization"
            SET "expertiseVector" = $1::vector
            WHERE "id" = $2`,
        expertiseVector,
        createdOrganization.id
      );
    }

    // Erfolgreiche Antwort zurückgeben
    return NextResponse.json(createdOrganization, { status: 201 });
  } catch (e) {
    console.error('Create organization failed', e);
    return NextResponse.json({ error: 'Create organization failed' }, { status: 500 });
  }
}

// ---------------------------------------------
// PATCH – Existierende Organisation aktualisieren
// ---------------------------------------------
export async function PATCH(req: NextRequest) {
  try {
    // Request auslesen
    const body = await req.json();
    const organizationInfo: OrganizationCreateInput = body;

    // Ohne ID kann nichts aktualisiert werden → 400 Bad Request
    if (!organizationInfo.id) return NextResponse.json({ status: 400 });

    // Fachgebiete erneut aufbauen und vektorisieren
    const expertiseArea = Array.isArray(organizationInfo.expertiseArea)
      ? organizationInfo.expertiseArea
      : [];

    const expertiseVector =
      expertiseArea.length > 0 ? await vectorizeExpertiseArea(expertiseArea.join(', ')) : null;

    // Datensatz per Prisma-Update ändern
    const updatedOrganization = await prisma.organization.update({
      where: { id: organizationInfo.id },
      data: {
        name: organizationInfo.name,
        email: organizationInfo.email,
        password: organizationInfo.password,
        phone: organizationInfo.phone ?? null,
        website: organizationInfo.website ?? null,
        address: organizationInfo.address ?? null,
        description: organizationInfo.description ?? null,
        shortDescription: organizationInfo.shortDescription ?? '',
        expertiseArea,
        type: organizationInfo.type ?? OrganizationType.ASSOCIATION,
        priceCategory: organizationInfo.priceCategory ?? PriceCategory.MEDIUM,
      },
    });

    // Vektor aktualisieren, falls Fachgebiete geändert wurden
    if (expertiseVector) {
      await prisma.$executeRawUnsafe(
        `UPDATE "Organization"
            SET "expertiseVector" = $1::vector
            WHERE "id" = $2`,
        expertiseVector,
        updatedOrganization.id
      );
    }

    return NextResponse.json(updatedOrganization, { status: 200 });
  } catch (e) {
    console.error('Patch organization failed', e);
    return NextResponse.json({ error: 'Patch organization failed' }, { status: 500 });
  }
}

// ---------------------------------------------
// GET – Alle Organisationen abrufen
// ---------------------------------------------
export async function GET(_req: NextRequest) {
  /*
    Holt alle Organisationen aus der Datenbank.
    Kein Filter, keine Pagination – vollständige Liste.
    Gute Basisroute für Admin- oder Debug-Zwecke.
  */
  const organizations = await prisma.organization.findMany();
  return NextResponse.json(organizations);
}
