'use client';
import { useState } from 'react';
import { Areas, OrganizationType, PriceCategory } from '../../../generated/prisma/enums';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RegisterUserForm from './RegisterUserForm';
import RegisterOrganizationForm from './RegisterOrganizationForm';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'user' | 'organization';

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  // Aktive Registerkarte: Benutzer oder Organisation
  const [activeTab, setActiveTab] = useState<TabType>('user');

  // Fehlertext, der über den Formularen angezeigt wird
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Zeigt an, ob gerade eine API-Anfrage läuft
  const [loading, setLoading] = useState(false);

  // State für das Benutzer-Registrierungsformular
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  // State für das Organisations-Registrierungsformular
  const [orgForm, setOrgForm] = useState<{
    name: string;
    email: string;
    password: string;
    phone: string;
    website: string;
    address: string;
    organizationType: OrganizationType;
    expertiseArea: Areas[];
    description: string;
    shortDescription: string;
    priceCategory: PriceCategory;
  }>({
    name: '',
    email: '',
    password: '',
    phone: '',
    website: '',
    address: '',
    organizationType: OrganizationType.LAW_FIRM,
    expertiseArea: [],
    description: '',
    shortDescription: '',
    priceCategory: PriceCategory.MEDIUM,
  });

  // Aktualisiert Benutzerformular-Felder dynamisch anhand des Input-Namens
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  // Aktualisiert Organisationsformular-Felder
  type OrgChangeEvent =
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    | { target: { name: string; value: string } };

  const handleOrgChange = (e: OrgChangeEvent) => {
    setOrgForm({
      ...orgForm,
      [e.target.name]: e.target.value,
    });
  };

  // Fügt ein Fachgebiet hinzu oder entfernt es, wenn es schon ausgewählt ist
  const handleExpertiseAreaToggle = (area: Areas) => {
    setOrgForm((prev) => ({
      ...prev,
      expertiseArea: prev.expertiseArea.includes(area)
        ? prev.expertiseArea.filter((a) => a !== area) // entfernen
        : [...prev.expertiseArea, area], // hinzufügen
    }));
  };

  // Daten an das Backend schicken → Registrierung durchführen
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Verhindert Seitenreload des Standardformulars
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Je nach aktiver Registerkarte unterschiedliche Payload zusammenstellen
      const payload =
        activeTab === 'user' ? { type: 'user', ...userForm } : { type: 'organization', ...orgForm };

      // Anfrage an das Registrierungs-API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Fehlerfall vom Server
      if (!response.ok) {
        setError(data.error || 'Fehler bei der Registrierung');
        return;
      }

      setSuccess('Sie haben sich erfolgreich registriert.');
      // Bei Erfolg könnte man hier Modal schließen oder weiterleiten
    } catch (err) {
      // Netzwerkfehler oder unerwartete Probleme
      setError('Fehler bei der Verbindung zum Server');
      console.error(err);
    } finally {
      // Ladeanimation wieder deaktivieren
      setLoading(false);
    }
  };

  // Wenn Modal nicht geöffnet ist → nichts rendern
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Modal-Inhalt */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrierung</DialogTitle>
        </DialogHeader>

        {/* Fehleranzeige über den Tabs */}
        {error && (
          <div className="mt-2 mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-2 mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Umschaltbare Tabs: Benutzer | Organisation */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
          className="mt-6"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="user">Benutzer</TabsTrigger>
            <TabsTrigger value="organization">Organisation</TabsTrigger>
          </TabsList>

          {/* Inhalt der Benutzer-Registrierung */}
          <TabsContent value="user">
            <RegisterUserForm
              userForm={userForm}
              loading={loading}
              onChange={handleUserChange}
              onSubmit={handleSubmit}
            />
          </TabsContent>

          {/* Inhalt der Organisations-Registrierung */}
          <TabsContent value="organization">
            <RegisterOrganizationForm
              orgForm={orgForm}
              loading={loading}
              onChange={handleOrgChange}
              onSelectOrgType={(value) =>
                setOrgForm((prev) => ({
                  ...prev,
                  organizationType: value, // Update des Organisationstyps
                }))
              }
              onToggleArea={handleExpertiseAreaToggle}
              onSubmit={handleSubmit}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
