import { Clock, Mail, MapPin, Phone, Scale } from 'lucide-react';

import type { Organization } from '~/generated/prisma/client';

export default function OrganizationDetail(organization: Organization) {
  return (
    <div
      id={`OrganizationDetailPage_${organization.id}`}
      className="flex flex-col justify-start items-center w-full px-4 py-6"
    >
      <div className="bg-background outline-1 p-6 rounded-lg w-full max-w-5xl outline-border shadow-md">
        <div className="flex items-center mb-4">
          <p className="text-4xl font-bold pr-4">{organization.name}</p>
          <div className="text-base inline-block px-2 py-1 rounded-xl border border-accent-amber font-semibold bg-accent-amber-light text-accent-amber">
            €€€
          </div>
        </div>

        <p> {organization.description}</p>

        <div className="grid grid-cols-2 gap-x-10 gap-y-5 pt-8 justify-items-start">
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
    </div>
  );
}
