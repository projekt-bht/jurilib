'use client';

export function Login() {
  //Login Logik
  return (
    <button
      onClick={() => console.log('Login')}
      className="bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-hover-foreground p-2 pr-3 pl-3 rounded-full"
    >
      Einloggen
    </button>
  );
}
