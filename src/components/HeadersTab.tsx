import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

interface HeadersTabProps {
  headers: Header[];
  setHeaders: (headers: Header[]) => void;
}

export const HeadersTab: React.FC<HeadersTabProps> = ({ headers, setHeaders }) => {
  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: keyof Header, value: string | boolean) => {
    const updated = [...headers];
    updated[index] = { ...updated[index], [field]: value };
    setHeaders(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Headers</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addHeader}
          className="text-teal-600 border-teal-600 hover:bg-teal-50 hover:cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Header
        </Button>
      </div>

      <div className="rounded-md border-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] border"></TableHead>
              <TableHead className='border'>Key</TableHead>
              <TableHead className='border'>Value</TableHead>
              <TableHead className="w-[100px] border text-center">Bulk Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {headers.map((header, index) => (
              <TableRow key={index}>
                <TableCell className='border'>
                  <Checkbox
                    checked={header.enabled}
                    onCheckedChange={(checked) => updateHeader(index, 'enabled', checked as boolean)}
                  />
                </TableCell>
                <TableCell className='border'>
                  <Input
                    placeholder="Key"
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    className="text-sm !border-none !shadow-none focus:!ring-0 focus:!shadow-none focus:!outline-none focus:!border-none"
                    />
                </TableCell>
                <TableCell className='border'>
                  <Input
                    placeholder="Value"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    className="text-sm !border-none !shadow-none focus:!ring-0 focus:!shadow-none focus:!outline-none focus:!border-none"
                  />
                </TableCell>
                <TableCell className='border'>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHeader(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 hover:cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {headers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No headers added yet. Click "Add Header" to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};