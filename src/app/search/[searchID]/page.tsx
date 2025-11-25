'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import OrganizationCard from '@/app/organization/_components/OrganizationCard';
import type { Organization } from '~/generated/prisma/client';

import Loading from './loading';

export default function SearchResults() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      cache: 'no-store',
    })
      .then((res) => res.json())
      .then((data) => {
        setOrganizations(data);
        setLoading(false);
      })
      .catch((err) => {
        throw new Error('Failed to load organizations: ' + (err as Error).message);
      });
  }, [params]);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col justify-start items-center pt-3 bg-card">
      {organizations.length > 0 ? (
        <>
          <p className="text-4xl text-foreground font-semibold">Passende Organisationen</p>
          <p className="text-xl text-foreground pt-2">
            Hier sind die Organisationen, die zu Ihrer Suche passen:
          </p>
          <div className="h-8" />
          {organizations.map((organization) => (
            <OrganizationCard key={'OrganizationCard_' + organization.id} {...organization} />
          ))}
          <div className="mb-8 text-muted-foreground pt-6">
            Deine Anfrage wird vertraulich behandelt.
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center h-full text-center gap-y-10 py-4">
          <p className="text-2xl font-bold text-foreground">
            Leider konnten wir keine passende Organisation finden.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-primary-foreground font-bold p-2 pr-3 pl-3 rounded-full"
          >
            Suche neustarten
          </button>
        </div>
      )}
    </div>
  );
}
