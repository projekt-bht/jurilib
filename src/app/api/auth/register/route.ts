import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { OrganizationType, PriceCategory } from '~/generated/prisma/enums';
/*
  in services
   //hashing password
  // validierungscheck
  // datenbankcall für create user */
//schau bei Hannes ob er organizationCreateInput nutzt wenn nicht korregiere
export async function POST(request: NextRequest) {
  try {
    // Request-Body auslesen (JSON-Daten aus der Anfrage extrahieren)
    const body = await request.json();
    const { type, name, email, password, priceCategory } = body;

    // Grundvalidierung: Prüfen ob alle Pflichtfelder vorhanden sind
    // hannes bringen
    if (!type || !name || !email || !password || !priceCategory) {
      return NextResponse.json(
        { error: 'Alle Pflichtfelder müssen ausgefüllt werden' },
        { status: 400 }
      );
    }

    // Passwortlänge prüfen (einfache Sicherheitsmaßnahme)
    // hannes bringen
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Passwort muss mindestens 8 Zeichen lang sein' },
        { status: 400 }
      );
    }

    // Passwort sicher hashen bevor es in der Datenbank gespeichert wird
    // hannes bringen
    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------------------------------------------
    // Registrierung eines normalen Benutzers
    // ---------------------------------------------
    if (type === 'user') {
      // Prüfen ob ein Nutzer mit dieser Email bereits existiert
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true }, // only fetch existing column to avoid schema mismatches
      });

      if (existingUser) {
        return NextResponse.json({ error: 'E-Mail bereits registriert' }, { status: 400 });
      }

      // Neuen Benutzer in der Datenbank erstellen
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          type: 'USER',
        },
      });

      // Erfolgsantwort zurückgeben (ohne Passwort!)
      return NextResponse.json(
        {
          message: 'Benutzer erfolgreich registriert',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
        { status: 201 }
      );

      // ---------------------------------------------
      // Registrierung einer Organisation
      // ---------------------------------------------
    } else if (type === 'organization') {
      // Zusätzliche Felder, die nur Organisationen betreffen
      const {
        phone,
        website,
        address,
        expertiseArea,
        organizationType,
        description,
        shortDescription,
        priceCategory,
      } = body;

      // Prüfen ob eine Organisation mit dieser Email bereits existiert
      // hannes bringen in servie layer fehlermedlung auch dort statt return  mit catch oder try catch
      const existingOrg = await prisma.organization.findUnique({
        where: { email },
        select: { id: true }, // only fetch existing column to avoid schema mismatches
      });

      if (existingOrg) {
        return NextResponse.json({ error: 'E-Mail bereits registriert' }, { status: 400 });
      }

      const resolvedOrganizationType = organizationType ?? OrganizationType.ASSOCIATION;
      const resolvedPriceCategory = priceCategory ?? PriceCategory.MEDIUM;
      const resolvedExpertiseArea = Array.isArray(expertiseArea) ? expertiseArea : [];

      // Neue Organisation in der Datenbank erstellen
      // kann von hannes übernommen werden
      const organization = await prisma.organization.create({
        data: {
          name,
          description: description ?? null,
          email,
          password: hashedPassword,
          phone: phone || null, // Falls nicht angegeben → null
          website: website || null,
          address: address || null,
          expertiseArea: resolvedExpertiseArea, // Erwartet ein Array
          shortDescription: shortDescription ?? '', // Platzhalter, leer
          type: resolvedOrganizationType, // Fallback-Wert
          priceCategory: resolvedPriceCategory, // Standardwert
        },
      });

      // Erfolgsantwort zurückgeben (ohne Passwort!)
      //zeile 26 von hannes ersetzten mit diese teil , else teil weglöschen
      return NextResponse.json(
        {
          message: 'Organisation erfolgreich registriert',
          organization: {
            id: organization.id,
            name: organization.name,
            email: organization.email,
          },
        },
        { status: 201 }
      );
    } else {
      // Ungültiger Registrierungstyp (weder 'user' noch 'organization')
      return NextResponse.json({ error: 'Ungültiger Registrierungstyp' }, { status: 400 });
    }
  } catch (error) {
    //auch von hannes übernommen
    // Allgemeiner Fehlerfall – alles, was schiefgeht, landet hier
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
