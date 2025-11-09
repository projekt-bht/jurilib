'use client'
import OrganizationCard from "@/components/Organization/OrganizationCard"
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Organization } from "~/generated/prisma/client";
import Loading from "./loading";

async function getResults(inputString: string) {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: inputString,
    cache: 'no-store'
  });


  if (res.ok) {
    const data = await res.json();
    return data as Organization[];
  } else {
    throw new Error('Failed to fetch search results');
  }
}


export default function SearchResults() {
  const params = useParams()
  const router = useRouter()
  const [organizations, setOrganizations] = useState<Organization[]>();
  async function load() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const organizations = await getResults(JSON.stringify(params))
      setOrganizations(organizations)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => { load(); }, [params]);

  if(!organizations)
    return <Loading></Loading>

  // to simulate loading time and trigger loading.tsx

  return (
    <div className="flex flex-col justify-start items-center h-screen pt-3">
      {organizations.length > 0 ? 
        <>
          <p className="text-xl text-gray-800 font-semibold">Passende Organisationen</p>
          <p className="text-base text-gray-500 pt-2">
            Hier sind die Organisationen, die zu Ihrer Suche passen:
          </p>
          <div className="h-8" />
          {
            organizations.map((organization) => (
              <OrganizationCard
                key={"OrganizationCard_" + organization.id}
                {...organization}
              />
            ))
          }
          <div className="mb-8 text-gray-400 pt-6">
            Deine Anfrage wird vertraulich behandelt.
          </div>
        </> :
        <>
         <div className="flex flex-col justify-center items-center h-full text-center gap-y-10">
            <p className="text-5xl font-bold text-black">
              Leider konnten wir keine passende Organisation finden.
            </p>
            <button onClick={ () => router.push("/")} className="bg-blue-200 text-black font-bold p-5 pr-5 pl-5 rounded-full text-3xl">
              Suche neustarten
            </button>
          </div>
        </>
      }
    </div>

  );
}