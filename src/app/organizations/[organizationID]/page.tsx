import { Clock, Mail, MapPin, Phone, Scale } from 'lucide-react';

import OrganizationCalendar from '@/components/Organization/OrganizationCalendar';
import { sectionHeading } from '@/components/Organization/OrganizationStyling';
import type { Organization } from '~/generated/prisma/client';

export default async function OrganizationDetailPage({
  params,
}: {
  params: { organizationID: string };
}) {
  const parameters = await params;
  const organizationID = parameters.organizationID;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}organization/${organizationID}`);
  const org: Organization = await res.json();

  return org ? (
    <div
      id={`orgaDetailPage_${organizationID}`}
      className="flex flex-col justify-start items-center w-full px-4 py-6"
    >
      <div className="outline-1 p-6 rounded-lg w-full max-w-5xl outline-gray-300 shadow-md">
        <p className="text-2xl font-bold mb-4">{org?.name}</p>
        <p> {org?.description}</p>
        <div className="grid grid-cols-2 gap-x-40 gap-y-16 pt-10 justify-items-start">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Scale color="grey" size={25} />
              <p className={sectionHeading()}>Fachgebiete</p>
            </div>
            <p>{org?.expertiseArea}</p>
          </div>
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin color="grey" size={25} />
              <p className={sectionHeading()}>Adresse</p>
            </div>
            <p>{org?.address}</p>
          </div>
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Phone color="grey" size={25} />
              <p className={sectionHeading()}>Telefon</p>
            </div>
            <p>{org?.phone}</p>
          </div>
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Mail color="grey" size={25} />
              <p className={sectionHeading()}>E-Mail</p>
            </div>
            <p>{org?.email}</p>
          </div>
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock color="grey" size={25} />
              <p className={sectionHeading()}>Öffnungszeiten</p>
            </div>
            <p>Hier könnten Kontaktdaten stehen.</p>
          </div>
        </div>
      </div>

      <div className="outline-1 p-6 rounded-lg w-full max-w-5xl outline-gray-300 shadow-md mt-6">
        <p className="text-base font-bold mb-4">Termin vereinbaren</p>
        <div className="grid grid-cols-2 gap-x-40 gap-y-16 pt-10 justify-items-start">
          <div className="col-span-1 justify-center items-left flex flex-col gap-4">
            <p className="text-base text-gray-600">Wählen Sie ein Datum</p>
            <OrganizationCalendar />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>is nich</div>
  );
}
