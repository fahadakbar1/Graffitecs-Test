import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Auth {
  type: string;
  token: string;
  username: string;
  password: string;
}

interface AuthTabProps {
  auth: Auth;
  setAuth: (auth: Auth) => void;
}

export const AuthTab: React.FC<AuthTabProps> = ({ auth, setAuth }) => {
  const updateAuth = (field: keyof Auth, value: string) => {
    setAuth({ ...auth, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="auth-type" className='text-lg font-medium mt-1'>Authentication Type</Label>
        <Select value={auth.type} onValueChange={(value) => updateAuth('type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Auth</SelectItem>
            <SelectItem value="bearer">Bearer Token</SelectItem>
            <SelectItem value="basic">Basic Auth</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {auth.type === 'bearer' && (
        <div className="space-y-2">
          <Label htmlFor="token">Token</Label>
          <Input
            id="token"
            placeholder="Enter your bearer token"
            value={auth.token}
            onChange={(e) => updateAuth('token', e.target.value)}
            type="password"
          />
        </div>
      )}

      {auth.type === 'basic' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter username"
              value={auth.username}
              onChange={(e) => updateAuth('username', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Enter password"
              value={auth.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAuth('password', e.target.value)}
              type="password"
            />
          </div>
        </div>
      )}

      {auth.type === 'none' && (
        <div className="text-center text-muted-foreground py-8">
          No authentication required for this request.
        </div>
      )}
    </div>
  );
};