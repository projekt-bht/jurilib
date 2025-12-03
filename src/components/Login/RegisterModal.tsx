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
  // Active tab: user or organization
  const [activeTab, setActiveTab] = useState<TabType>('user');

  // Error text shown above forms
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Indicates if an API request is pending
  const [loading, setLoading] = useState(false);

  // User form state
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Organization form state
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

  // Update user form fields dynamically
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  type OrgChangeEvent =
    | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    | { target: { name: string; value: string } };

  // Update organization form fields
  const handleOrgChange = (e: OrgChangeEvent) => {
    setOrgForm({
      ...orgForm,
      [e.target.name]: e.target.value,
    });
  };

  // Toggle expertise area selection
  const handleExpertiseAreaToggle = (area: Areas) => {
    setOrgForm((prev) => ({
      ...prev,
      expertiseArea: prev.expertiseArea.includes(area)
        ? prev.expertiseArea.filter((a) => a !== area) // entfernen
        : [...prev.expertiseArea, area], // hinzufügen
    }));
  };

  const translateError = (err?: string) => {
    switch (err) {
      case 'The given input is invalid.':
        return 'Die Eingabe ist ungültig.';
      case 'There is already an entry with these attributes.':
        return 'Es existiert bereits ein Eintrag mit diesen Daten.';
      case 'The entry could not be found.':
        return 'Der Eintrag wurde nicht gefunden.';
      case 'The reference is invalid.':
        return 'Die Referenz ist ungültig.';
      default:
        return err || 'Fehler bei der Registrierung';
    }
  };

  // Daten an das Backend schicken → Registrierung durchführen
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Choose payload and endpoint based on active tab
      const isUser = activeTab === 'user';
      const apiBase = (process.env.NEXT_PUBLIC_BACKEND_ROOT ?? '/api').replace(/\/$/, '');
      const endpoint = `${apiBase}/${isUser ? 'user' : 'organization'}`;

      if (!isUser) {
        if (!orgForm.shortDescription.trim()) {
          setError('Bitte geben Sie eine Kurzbeschreibung an.');
          setLoading(false);
          return;
        }
        if (!orgForm.expertiseArea.length) {
          setError('Wählen Sie mindestens ein Fachgebiet aus.');
          setLoading(false);
          return;
        }
      }

      const payload = isUser
        ? { ...userForm, type: 'USER' }
        : (() => {
            const { organizationType, ...orgPayload } = orgForm;
            return { ...orgPayload, type: organizationType };
          })();

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Handle server-side errors
      if (!response.ok) {
        setError(translateError(data.error || data.message));
        return;
      }

      setSuccess('Sie haben sich erfolgreich registriert.');
    } catch (err) {
      setError('Fehler bei der Verbindung zum Server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrierung</DialogTitle>
        </DialogHeader>

        {/* Error/success banners */}
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

        {/* Switchable tabs: user | organization */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
          className="mt-6"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="user">Benutzer</TabsTrigger>
            <TabsTrigger value="organization">Organisation</TabsTrigger>
          </TabsList>

          {/* User registration content */}
          <TabsContent value="user">
            <RegisterUserForm
              userForm={userForm}
              loading={loading}
              onChange={handleUserChange}
              onSubmit={handleSubmit}
            />
          </TabsContent>

          {/* Organization registration content */}
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
