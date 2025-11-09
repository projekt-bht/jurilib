import OrganizationCard from "@/components/Organization/OrganizationCard";
import type { Organization } from "~/generated/prisma/client";

import Loading from "../search/[searchID]/loading";

export default async function OrganizationsPage() {

    // by default, data will be fetched when rendered data has changed
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}organization`);
    const organizations: Organization[] = await res.json()

    if (!organizations)
        return <Loading />

    // to simulate loading time and trigger loading.tsx

    return (
        <div className="flex flex-col justify-start items-center h-screen pt-3">
            {organizations.length > 0 ?
                <>
                    <p className="text-xl text-gray-800 font-semibold">Organisationsliste</p>
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
                <div className="flex flex-col justify-center items-center h-full text-center gap-y-10">
                    <p className="text-5xl font-bold text-black">
                        Leider konnten wir keine passende Organisation finden.
                    </p>
                </div>
            }
        </div>
    )
}   