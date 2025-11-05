import { Clock, Mail, MapPin, Phone, Scale } from "lucide-react";

export default function OrganizationDetailPage({ params }: { params: { id: string } }) {
    return (
        <div id={`orgaDetailPage_${params.id}`} className="flex flex-col justify-start items-center w-full px-4 py-6">
            <div className="outline-1 p-6 rounded-lg w-full max-w-5xl outline-gray-300">
                <h2 className="text-2xl font-bold mb-4">
                    Organization Detail Page
                </h2>
                <p> Das hier ist die Beschreibung der Kanzlei und wird später automatisch ersetzt werden.</p>
                <div className="grid grid-cols-2 gap-x-40 gap-y-15 pt-10 justify-items-start">
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Scale color="grey" size={25} />
                            <h3 className="text-xl font-bold">Fachgebiete</h3>
                        </div>
                        <p>Hier könnten weitere Details zur Kanzlei stehen.</p>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin color="grey" size={25} />
                            <h3 className="text-xl font-bold">Adresse</h3>
                        </div>
                        <p>Hier könnten Kontaktdaten stehen.</p>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Phone color="grey" size={25} />
                            <h3 className="text-xl font-bold">Telefon</h3>
                        </div>
                        <p>Hier könnten Kontaktdaten stehen.</p>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Mail color="grey" size={25} />
                            <h3 className="text-xl font-bold">E-Mail</h3>
                        </div>
                        <p>Hier könnten Kontaktdaten stehen.</p>
                    </div>
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock color="grey" size={25} />
                            <h3 className="text-xl font-bold">Öffnungszeiten</h3>
                        </div>
                        <p>Hier könnten Kontaktdaten stehen.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}