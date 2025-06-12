import React from 'react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface BodyTabProps {
  body: string;
  setBody: (body: string) => void;
  method: string;
}

export const BodyTab: React.FC<BodyTabProps> = ({ body, setBody, method }) => {
  const canHaveBody = ['POST', 'PUT', 'PATCH'].includes(method);

  if (!canHaveBody) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Request body is not available for {method} requests.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="body">Request Body (JSON)</Label>
        <Textarea
          id="body"
          placeholder='{"key": "value"}'
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="min-h-[200px] font-mono text-sm"
        />
      </div>
      
      <div className="text-xs text-muted-foreground">
        Enter valid JSON data for the request body. The Content-Type will automatically be set to application/json.
      </div>
    </div>
  );
};