/* eslint-disable jsx-a11y/alt-text */
'use client';

import { Checkbox } from '@radix-ui/react-checkbox';
import { Label } from '@radix-ui/react-label';
import {
  ArrowLeft,
  Calendar,
  Check,
  Download,
  File,
  FileText,
  FolderOpen,
  Image,
  Link,
  Trash2,
  Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { useLoginContext } from '@/app/LoginContext';
import { fetchBackendData } from '@/components/Dashboard/helper';
import { Button } from '@/components/ui/button';
import type { Employee, Organization } from '~/generated/prisma/browser';
import type { Appointment, Case, CaseStatus } from '~/generated/prisma/client';
import { ResultLoading } from '@/components/Loading/ResultLoading';

export default function CaseDetailPage({ params }: { params: Promise<{ caseID: string }> }) {
  const router = useRouter();
  const { login } = useLoginContext();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caseID, setCaseID] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);

  const statusConfig: Record<
    CaseStatus,
    { label: string; color: string; bgColor: string; dotColor: string }
  > = {
    OPEN: {
      label: 'Offen',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      dotColor: 'bg-blue-500',
    },
    IN_PROGRESS: {
      label: 'In Bearbeitung',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      dotColor: 'bg-emerald-500',
    },
    COMPLETED: {
      label: 'Abgeschlossen',
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
      dotColor: 'bg-gray-500',
    },
  };

  // Unwrap params promise
  useEffect(() => {
    params.then((p) => setCaseID(p.caseID));
  }, [params]);

  // Fetch case data
  useEffect(() => {
    const fetchData = async () => {
      if (!caseID) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/case/${caseID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch case data');
        }

        const caseData = await response.json();
        setCaseData(caseData);
        setDocuments(caseData.documentsURL ?? []);
        const resEmployee = await fetchBackendData('/employee', caseData.employeeId, 'Employee');
        const employeeData = await resEmployee.json();
        setEmployee(employeeData);

        const resOrganization = await fetchBackendData(
          'organization',
          employeeData.organizationId,
          'Organization'
        );
        const organizationData = await resOrganization.json();
        setOrganization(organizationData);

        // Fetch appointments for this case
        const appointmentsRes = await fetchBackendData(
          '/appointment/case',
          caseData.id,
          'Appointments'
        );
        const appointmentsData: Appointment[] = await appointmentsRes.json();
        setAppointments(appointmentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load case');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [caseID, login]);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !caseID) return;

      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);

        const response = await fetch(`/api/case/${caseID}/documents/user`, {
          method: 'POST',
          headers: {
            private: isPrivate ? 'true' : 'false',
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload document');
        }

        const data = await response.json();
        setDocuments((prev) => [...prev, data.documentUrl]);

        // Reset input
        event.target.value = '';
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload document');
      } finally {
        setUploading(false);
      }
    },
    [caseID, isPrivate]
  );

  async function handleDeleteDocument(docUrl: string) {
    if (!caseID) return;
    const splittedUrl: string = docUrl.split('?')[0];
    const privateURL: boolean = splittedUrl.endsWith('user');
    try {
      const response = await fetch(docUrl, {
        method: 'DELETE',
        headers: {
          private: privateURL ? 'true' : 'false',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setDocuments((prev) => prev.filter((doc) => doc !== docUrl));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  }

  async function handleDownloadDocument(docUrl: string, fileName: string) {
    const splittedUrl: string = docUrl.split('?')[0];
    const privateURL: boolean = splittedUrl.endsWith('user');
    try {
      const response = await fetch(docUrl, {
        headers: {
          private: privateURL ? 'true' : 'false',
        },
      });

      if (!response.ok) {
        throw new Error('Fehler beim Herunterladen des Dokumentes');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Herunterladen des Dokumentes');
    }
  }

  function getFileNameFromUrl(url: string): string {
    const params = new URLSearchParams(url.split('?')[1]);
    const fileName = params.get('fileName') ?? 'Unbekannter Dateiname';

    return fileName;
  }

  function getShortenedFileNameFromUrl(url: string): string {
    const params = new URLSearchParams(url.split('?')[1]);
    const fileName = params.get('fileName') ?? 'Unbekannter Dateiname';

    if (fileName.length > 25) {
      const lastDotIndex = fileName.lastIndexOf('.');
      if (lastDotIndex > 0) {
        const nameWithoutExt = fileName.substring(0, lastDotIndex);
        const ext = fileName.substring(lastDotIndex);
        const maxNameLength = 28 - ext.length - 3; // 3 for "..."
        return nameWithoutExt.substring(0, maxNameLength) + '..' + ext;
      }
      return fileName.substring(0, 25) + '...';
    }
    return fileName;
  }

  function getFileIconAndColor(fileName: string) {
    const ext = fileName.split('.').pop()?.toLowerCase();

    const fileTypeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
      png: { icon: <Image className="w-5 h-5" />, color: 'text-blue-500' },
      jpeg: { icon: <Image className="w-5 h-5" />, color: 'text-blue-500' },
      pdf: { icon: <FileText className="w-5 h-5" />, color: 'text-red-500' },
      doc: { icon: <File className="w-5 h-5" />, color: 'text-blue-500' },
      docx: { icon: <File className="w-5 h-5" />, color: 'text-blue-500' },
      txt: { icon: <File className="w-5 h-5" />, color: 'text-gray-500' },
      xls: { icon: <File className="w-5 h-5" />, color: 'text-green-500' },
      xlsx: { icon: <File className="w-5 h-5" />, color: 'text-green-500' },
    };

    return (
      fileTypeConfig[ext ?? ''] || { icon: <File className="w-5 h-5" />, color: 'text-gray-400' }
    );
  }

  if (loading) {
    return (
      <ResultLoading title="Fall wird geladen..." description="Bitte warten Sie einen Moment." />
    );
  }

  if (!caseData) {
    return (
      <section className="bg-card">
        <div className="flex-1 w-full p-20 md:p-20 overflow-y-auto">
          <div className="space-y-6">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 cursor-pointer"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Button>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-foreground mb-2">Fall nicht gefunden</h2>
              <p className="text-muted-foreground">Der angeforderte Fall existiert nicht.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card">
      <div className="flex-1 w-full p-20 md:p-20 overflow-y-auto">
        <div className="space-y-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 cursor-pointer mb-4"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4" />
                Zurück
              </Button>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-2">
                {caseData.title || 'Untitled Case'}
              </h1>
              <p className="text-lg text-muted-foreground">Fall-ID: {caseData.id}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-background border p-6 mt-6 rounded-lg w-full border-border shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-1">
            <FolderOpen className="w-6 h-6 text-accent-blue inline-block mr-2" />
            Fall-Informationen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                Status
              </label>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${statusConfig[caseData.status].dotColor}`} />
                <span className={`font-medium ${statusConfig[caseData.status].color}`}>
                  {statusConfig[caseData.status].label}
                </span>
              </div>
            </div>
            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-3 block">
                Beschreibung
              </label>
              <p className="text-foreground leading-relaxed">
                {caseData.description || 'Keine Beschreibung vorhanden'}
              </p>
            </div>

            {/* Created Date */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                Erstellt am
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">
                  {new Date(caseData.createdAt).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Updated Date */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-2 block">
                Aktualisiert am
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">
                  {new Date(caseData.updatedAt).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {/* Organization */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-3 block">
                Zuständige Organisation
              </label>
              <p className="text-foreground leading-relaxed">
                {organization?.name ?? 'Keine Organisation vorhanden'}
              </p>
            </div>

            {/* Employee Name */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-3 block">
                Zuständige*r Mitarbeiter*in
              </label>
              <p className="text-foreground leading-relaxed">
                {`${employee?.firstname} ${employee?.lastname}` || 'Keine Person vorhanden'}
              </p>
            </div>
          </div>

          {/* Appointments Section */}
          <div className=" pt-6">
            <label className="text-sm font-semibold text-muted-foreground mb-3 block">
              Termine
            </label>
            {appointments.length > 0 ? (
              <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="shadow-md border-border border rounded-lg p-4 hover:bg-secondary/80 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-medium text-foreground mb-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(appointment.dateTimeStart).toLocaleDateString('de-DE', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          appointment.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700'
                            : appointment.status === 'CANCELED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {appointment.status === 'CONFIRMED'
                          ? 'Bestätigt'
                          : appointment.status === 'CANCELED'
                            ? 'Abgesagt'
                            : 'Offen'}
                      </div>
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-foreground text-muted-foreground line-clamp-2">
                        {appointment.notes}
                      </p>
                    )}
                    {appointment.meetingLink && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        <Link className="w-3 h-3" />
                        <a
                          href={appointment.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary"
                        >
                          Teilnehmen
                        </a>
                      </div>
                    )}
                    {appointment.location && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        <Calendar className="w-3 h-3" />
                        <span>{appointment.location}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="shadow-md border-border border rounded-lg p-8 text-center">
                <Calendar className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Keine Termine vorhanden</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-background border p-6 mt-6 rounded-lg w-full border-border shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-1">
              <FileText className="w-6 h-6 text-accent-blue inline-block mr-2" />
              Dokumente
            </h2>
            <span className="text-sm text-muted-foreground">{documents.length} Dateien</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-3 block">
                Dokumente hochladen
              </label>
              {/* Upload Section */}
              <label
                htmlFor="file-upload"
                className="shadow-md rounded-xl p-8 border hover:border-dashed border-border hover:border-primary/50 hover:bg-secondary/80 transition-colors cursor-pointer block"
              >
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.pptx,.png,.jpg,.jpeg,.gif"
                  data-fd-max-file-size="52428800"
                />
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-foreground hover:text-primary transition-colors">
                      Datei auswählen
                    </span>
                    <p className="text-xs text-muted-foreground mb-2">(max. 50MB)</p>
                    <Label className="min-h-9 rounded-md py-1 px-2 text-sm font-medium text-foreground transition-colors cursor-pointer hover:bg-accent-gray-soft flex justify-center items-center gap-2">
                      <div className="relative w-4 h-4">
                        <Checkbox
                          checked={isPrivate}
                          onCheckedChange={(checked) => setIsPrivate(checked === true)}
                          className="w-4 h-4 border-2 border-gray-300 rounded data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          aria-label="Privat"
                        />
                        {isPrivate && (
                          <Check className="absolute inset-0 w-4 h-4 text-white pointer-events-none" />
                        )}
                      </div>
                      <span>Nur für mich sichtbar</span>
                    </Label>
                  </div>
                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Wird hochgeladen...
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Documents List */}
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-3 block">
                Deine Dokumente
              </label>
              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((docUrl, index) => {
                    const fileName = getFileNameFromUrl(docUrl);
                    const shortenedFileName = getShortenedFileNameFromUrl(docUrl);
                    const { icon, color } = getFileIconAndColor(fileName);

                    return (
                      <div
                        key={index}
                        className="shadow-md border-border border rounded-lg p-4 flex items-center justify-between hover:bg-secondary/80 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={color}>{icon}</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {shortenedFileName}
                            </p>
                            <p className="text-xs text-muted-foreground">Dokument</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownloadDocument(docUrl, fileName)}
                            className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary cursor-pointer"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(docUrl)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="shadow-md border-border border  rounded-lg p-8 text-center">
                  <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Noch keine Dokumente hochgeladen</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
