'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterUserFormProps {
  userForm: {
    name: string;
    email: string;
    password: string;
  };
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RegisterUserForm({
  userForm,
  loading,
  onChange,
  onSubmit,
}: RegisterUserFormProps) {
  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <div className="space-y-4 mt-6">
        <div className="space-y-2">
          <Label htmlFor="user-name">Name</Label>
          <Input
            id="user-name"
            name="name"
            value={userForm.name}
            onChange={onChange}
            placeholder="Ihr vollständiger Name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="user-email">E-Mail</Label>
          <Input
            id="user-email"
            name="email"
            type="email"
            value={userForm.email}
            onChange={onChange}
            placeholder="ihre.email@beispiel.de"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="user-password">Passwort</Label>
          <Input
            id="user-password"
            name="password"
            type="password"
            value={userForm.password}
            onChange={onChange}
            placeholder="Mindestens 8 Zeichen"
            minLength={8}
            required
          />
        </div>

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? 'Wird registriert...' : 'Registrieren'}
        </Button>
      </div>
    </form>
  );
}
