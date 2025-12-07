import { Globe, Mail, MapPin, Phone } from 'lucide-react';

export function ProfileInfos({
  id,
  website,
  phone,
  address,
  email,
}: {
  id: string;
  website: string | null;
  phone: string | null;
  address: string | null;
  email: string | null;
}) {
  return (
    <div
      id={`${id}_ProfileInfos`}
      className="grid grid-cols-1 lg:grid-cols-2 gap-x-60 gap-y-5 place-items-center"
    >
      <div className="col-span-1 w-full flex flex-col items-start text-center">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="text-accent-gray" size={25} aria-label="Globe icon" />
          <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">Webseite</h3>
        </div>
        <address className="not-italic">
          {website ? (
            <a href={website} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {website}
            </a>
          ) : (
            <span>Keine Angabe.</span>
          )}
        </address>
      </div>

      <div className="col-span-1 w-full flex flex-col items-start text-center">
        <div className="flex items-center gap-2 mb-2">
          <Phone className="text-accent-gray" size={25} aria-label="Phone icon" />
          <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">Telefon</h3>
        </div>
        <address className="not-italic">
          {phone ? <span>{phone}</span> : <span>Keine Angabe.</span>}
        </address>
      </div>

      <div className="col-span-1 w-full flex flex-col items-start text-center">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="text-accent-gray" size={25} aria-label="Map Pin Icon" />
          <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">Adresse</h3>
        </div>
        <address className="not-italic">
          {address ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {address}
            </a>
          ) : (
            <span>Keine Angabe.</span>
          )}
        </address>
      </div>

      <div className="col-span-1 w-full flex flex-col items-start text-center">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="text-accent-gray" size={25} aria-label="Mail icon" />
          <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">E-Mail</h3>
        </div>
        <address className="not-italic">
          {email ? (
            <a href={`mailto:${email}`} className="hover:underline">
              {email}
            </a>
          ) : (
            <span>Keine Angabe.</span>
          )}
        </address>
      </div>
    </div>
  );
}
