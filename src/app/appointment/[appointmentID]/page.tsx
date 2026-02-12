'use client';

import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  MapPin,
  User,
  Video,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useLoginContext } from '@/app/LoginContext';
import { ResultLoading } from '@/components/Loading/ResultLoading';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cancelAppointment, getCase, getEmployee, getUserAppointment } from '@/services/api';
import type {
  AppointmentResource,
  CaseResource,
  EmployeeResource,
  LoginResource,
} from '@/services/Resources';
import { AppointmentStatus } from '~/generated/prisma/enums';

export default function AppointmentDetailView() {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [fetchesDone, setFetchesDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useLoginContext();
  const userId = (login as LoginResource).userId;

  const [appointment, setAppointment] = useState<AppointmentResource>();
  const [employee, setEmployee] = useState<EmployeeResource>();
  const [_case, setCase] = useState<CaseResource>();

  const [error, setError] = useState<string | null>(null);
  const { appointmentID } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        if (!userId) {
          throw new Error('Benutzer-ID ist ungültig oder wurde nicht gefunden.');
        }

        setLoading(true);
        const appointmentData = await getUserAppointment(userId, appointmentID as string);
        if (appointmentData) {
          const employeeData = await getEmployee(appointmentData.employeeId);
          if (employeeData) {
            setAppointment(appointmentData);
            setEmployee(employeeData);
          }

          if (appointmentData?.caseId) {
            const caseData = await getCase(appointmentData.caseId!);
            if (caseData) setCase(caseData);
          }
        }
        setFetchesDone(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setLoading(false);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Unbekannter Fehler beim Laden der Daten'
        );
      }
    }

    fetchData();
  }, [login, userId]);

  async function handleCancelAppointment() {
    try {
      await cancelAppointment(appointmentID as string);
      setIsCancelling(true);
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsCancelling(false);
      setShowCancelDialog(false);
      router.push('/appointment');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unbekannter Fehler beim Laden der Daten');
    }
  }

  if (!login || !userId || !fetchesDone) return <></>;

  if (!appointment || !employee) {
    return (
      <section className="py-12 px-6 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-7 h-7 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-semibold mb-2">Termin nicht gefunden</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Der angeforderte Termin existiert nicht oder wurde entfernt.
          </p>
          <Link href="/appointment">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zu Termine
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const config = statusConfig[appointment.status];
  const StatusIcon = config.icon;
  const canCancel =
    AppointmentStatus.OPEN || AppointmentStatus.CONFIRMED || AppointmentStatus.REQUESTED;

  const handleCopyLink = () => {
    if (appointment.meetingLink) {
      navigator.clipboard.writeText(appointment.meetingLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  if (loading) {
    const text = isCancelling ? 'Termin wird abgesagt...' : 'Termin wird geladen...';
    return <ResultLoading title={text} description="Bitte warte einen Moment." />;
  }

  return (
    <section className="py-8 md:py-12 px-6 bg-background">
      <div className="max-w-3/4 mx-auto">
        {/* Back */}
        <Link
          href="/appointment"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zu Termine
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Termin</h1>
              <Badge
                variant="secondary"
                className={`${config.bgColor} ${config.color} border-0 text-xs px-2 py-0.5 font-medium`}
              >
                <StatusIcon className="w-3 h-3 mr-1" />
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">ID: {appointment.id}</p>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Details (2 cols wide) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Date & Time card */}
            <div className="bg-card rounded-xl border border-border/60 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-accent-blue-light w-8 h-8 rounded-lg flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-sm font-semibold text-foreground">Datum & Uhrzeit</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Datum</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatFullDate(appointment.dateTimeStart)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Uhrzeit</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatTime(appointment.dateTimeStart)} - {formatTime(appointment.dateTimeEnd)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Dauer</p>
                  <p className="text-sm font-medium text-foreground">
                    {appointment.duration} Minuten
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                    <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location / Meeting Link card */}
            <div className="bg-card rounded-xl border border-border/60 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-accent-blue-light w-8 h-8 rounded-lg flex items-center justify-center">
                  {appointment.location ? (
                    <MapPin className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Video className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <h2 className="text-sm font-semibold text-foreground">
                  {appointment.location ? 'Ort' : 'Online-Meeting'}
                </h2>
              </div>

              {appointment.location ? (
                <div>
                  <p className="text-sm text-foreground font-medium mb-2">{appointment.location}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(appointment.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 inline-flex items-center gap-1.5 text-xs hover:underline"
                  >
                    In Google Maps öffnen
                    <ExternalLink className="w-3 h-3 text-blue-600" />
                  </a>
                </div>
              ) : appointment.meetingLink ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <code className="flex-1 text-xs bg-muted rounded-md px-3 py-2 text-foreground truncate">
                      {appointment.meetingLink}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 h-8 gap-1.5 bg-transparent"
                      onClick={handleCopyLink}
                    >
                      {linkCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Kopiert
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Kopieren
                        </>
                      )}
                    </Button>
                  </div>
                  <a
                    href={appointment.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 inline-flex items-center gap-1.5 text-xs hover:underline"
                  >
                    Meeting beitreten
                    <ExternalLink className="w-3 h-3 text-blue-600" />
                  </a>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Kein Ort oder Link angegeben.</p>
              )}
            </div>

            {/* Notes card */}
            {appointment.notes && (
              <div className="bg-card rounded-xl border border-border/60 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-accent-blue-light w-8 h-8 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-foreground">Notizen</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{appointment.notes}</p>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-3">
            {/* Employee card */}
            <div className="bg-card rounded-xl border border-border/60 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-accent-blue-light w-8 h-8 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-sm font-semibold text-foreground">Berater</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {employee.firstname + ' ' + employee.lastname}
                  </p>
                  <p className="text-xs text-muted-foreground">Rechtsberater</p>
                </div>
              </div>
            </div>

            {/* Case link card */}
            {appointment.caseId && (
              <div className="bg-card rounded-xl border border-border/60 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-accent-blue-light w-8 h-8 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-foreground">Zugehöriger Fall</h2>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Titel: {_case?.title}</p>
                <p className="text-xs text-muted-foreground mb-3">Fall-ID: {_case?.id}</p>
              </div>
            )}

            {/* Meta info */}
            <div className="bg-card rounded-xl border border-border/60 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-accent-blue-light w-8 h-8 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-sm font-semibold text-foreground">Details</h2>
              </div>
              <div className="space-y-2.5">
                <div>
                  <p className="text-xs text-muted-foreground">Erstellt am</p>
                  <p className="text-xs font-medium text-foreground">
                    {formatDateTime(appointment.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Aktualisiert am</p>
                  <p className="text-xs font-medium text-foreground">
                    {formatDateTime(appointment.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {canCancel && (
        <div className="max-w-3/4 mx-auto flex justify-end mt-10">
          <Button
            variant="destructive"
            size="sm"
            className="w-30 h-10 gap-1.5"
            onClick={() => setShowCancelDialog(true)}
          >
            <XCircle className="w-4 h-4" />
            Absagen
          </Button>
        </div>
      )}

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Termin absagen?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
              Möchtest du diesen Termin wirklich absagen? Der Berater wird über die Absage
              informiert. Du kannst bei Bedarf einen neuen Termin vereinbaren.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5"
              onClick={handleCancelAppointment}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Wird abgesagt...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Termin absagen
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

//HELPER FROM v0

const statusConfig: Record<
  AppointmentStatus,
  { label: string; color: string; bgColor: string; dotColor: string; icon: typeof CheckCircle2 }
> = {
  OPEN: {
    label: 'Offen',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    dotColor: 'bg-blue-500',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Bestätigt',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    dotColor: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  CANCELED: {
    label: 'Abgesagt',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    dotColor: 'bg-red-500',
    icon: XCircle,
  },
  COMPLETED: {
    label: 'Abgeschlossen',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    dotColor: 'bg-gray-500',
    icon: CheckCircle2,
  },
  REQUESTED: {
    label: 'Angefragt',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    dotColor: 'bg-blue-500',
    icon: CheckCircle2,
  },
};

function formatFullDate(date: string) {
  const d = new Date(date);

  return d.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(date: string) {
  const d = new Date(date);

  return d.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateTime(date: string) {
  const d = new Date(date);

  return d.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
