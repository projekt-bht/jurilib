import { Clock, Mail, MapPin, Phone, Scale } from 'lucide-react';

import type { Organization } from '~/generated/prisma/client';

import OrganizationCalendar from './OrganizationCalendar';

export default function OrganizationDetail(organization: Organization) {
  return (
    <div
      id={`OrganizationDetailPage_${organization.id}`}
      className="flex flex-col justify-start items-center w-full px-4 py-6"
    >
      <div className="bg-background outline-1 p-6 rounded-lg w-full max-w-5xl outline-border shadow-md">
        <p className="text-2xl font-bold mb-4">{organization.name}</p>
        <p> {organization.description}</p>
        <div className="grid grid-cols-2 gap-x-40 gap-y-16 pt-10 justify-items-start">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="text-foreground" size={25} />
              <p className="flex items-center gap-2 text-xl font-bold text-foreground">
                Fachgebiete
              </p>
            </div>
            <p>{organization.expertiseArea}</p>
          </div>
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="text-foreground" size={25} />
              <p className="flex items-center gap-2 text-xl font-bold text-foreground">Adresse</p>
            </div>
            <p>{organization.address}</p>
          </div>
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="text-foreground" size={25} />
              <p className="flex items-center gap-2 text-xl font-bold text-foreground">Telefon</p>
            </div>
            <p>{organization.phone}</p>
          </div>
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="text-foreground" size={25} />
              <p className="flex items-center gap-2 text-xl font-bold text-foreground">E-Mail</p>
            </div>
            <p>{organization.email}</p>
          </div>
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-foreground" size={25} />
              <p className="flex items-center gap-2 text-xl font-bold text-foreground">
                Öffnungszeiten
              </p>
            </div>
            <p>Hier könnten Kontaktdaten stehen.</p>
          </div>
        </div>
      </div>

      <div className="bg-background outline-1 p-6 rounded-lg w-full max-w-5xl outline-border shadow-md mt-6">
        <p className="text-base font-bold mb-4">Termin vereinbaren</p>
        <div className="grid grid-cols-2 gap-x-40 gap-y-16 pt-10 justify-items-start">
          <div className="col-span-1 justify-center items-left flex flex-col gap-4">
            <OrganizationCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}
