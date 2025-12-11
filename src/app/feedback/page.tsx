export default function Feedback() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-6xl mx-auto text-center">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfzpq_zaYNwmqFTPA60XjePKGuuAB0Tw8_CsE3JKeB_zURV6g/viewform?embedded=true"
          className="block w-[60vw] h-[100vh] border-0"
        >
          Wird geladen...
        </iframe>
      </div>
    </div>
  );
}
