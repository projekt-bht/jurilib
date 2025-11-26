import { Spinner } from '@/components/ui/spinner';

type LoadingProps = { message: string };

export default function Loading({ message }: LoadingProps) {
  return (
    <div className="flex flex-col justify-between items-center h-screen bg-card">
      <div className="flex flex-col justify-center items-center grow gap-6">
        <Spinner className="size-18 text-primary-hover" />
        <div className="text-lg pt-5 text-foreground">{message}</div>
        <div className="text-base text-muted-foreground">Dies dauert nur einen Moment...</div>
      </div>
      <div className="mb-8 text-muted-foreground">Deine Anfrage wird vertraulich behandelt.</div>
    </div>
  );
}
