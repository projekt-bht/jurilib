import OrganizationCard from "@/components/Organization/OrganizationCard"
import type { Organization } from "~/generated/prisma/client";
import { Areas } from "~/generated/prisma/client";

async function getResults(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}/search/${id}`, { cache: 'no-store' });

  if (res.ok) {
    const data = await res.json();
    return data as Organization[];
  } else {
    throw new Error('Failed to fetch search results');
  }
}


export default async function SearchResults({ params }: { params: { id: string } }) {

  // Not used yet, uncomment when backend is ready!!
  // const organizations = await getResults(params.id);

  // to simulate loading time and trigger loading.tsx
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Dummy Data, can be deleted when connected to backend
  const organizations: Organization[] = [
    {
      "id": "1",
      "name": "Rechtsberatum München",
      "description": "In Ansprechpartner für Arbeitsrecht und Vertragsrecht.",
      "email": "contact@rechtsberatum.de",
      "phone": "+49 89 1234567",
      "address": "München, Germany",
      "website": "https://rechtsberatum.de",
      "expertiseArea": [Areas.Arbeitsrecht, Areas.Vertragsrecht],
      "type": "LAW_FIRM",
      "createdAt": new Date(),
      "updatedAt": new Date(),
    },
    {
      "id": "2",
      "name": "Legal Aid Berlin",
      "description": "Wir bieten kostenlose Rechtsberatung für Bedürftige.",
      "email": "info@legalaid-berlin.de",
      "phone": "+49 30 9876543",
      "address": "Berlin, Germany",
      "website": "https://legalaid-berlin.de",
      "expertiseArea": [Areas.Mietrecht, Areas.Sozialrecht],
      "type": "ASSOCIATION",
      "createdAt": new Date(),
      "updatedAt": new Date(),
    },
    {
      "id": "3",
      "name": "Family Law Experts",
      "description": "Spezialisiert auf Scheidungen und Sorgerecht.",
      "email": "hello@familylawexperts.de",
      "phone": null,
      "address": null,
      "website": "https://familylawexperts.de",
      "expertiseArea": [Areas.Familienrecht],
      "type": "LAW_FIRM",
      "createdAt": new Date(),
      "updatedAt": new Date(),
    },

  ]

  return (
    <div className="flex flex-col justify-start items-center h-screen pt-3">
      <p className="text-xl text-gray-800 font-semibold">Passende Organisationen</p>
      <p className="text-base text-gray-500 pt-2">
        Hier sind die Organisationen, die zu Ihrer Suche passen:
      </p>
      <div className="h-8" />
      {organizations.map((organization) => (
        <OrganizationCard
          key={"OrganizationCard_" + organization.id}
          {...organization}
        />
      ))}
      <div className="mb-8 text-gray-400 pt-6">
        Deine Anfrage wird vertraulich behandelt.
      </div>
    </div>

  );
}