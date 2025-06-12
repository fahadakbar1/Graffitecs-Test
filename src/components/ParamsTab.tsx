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

interface Param {
  key: string;
  value: string;
  enabled: boolean;
}

interface ParamsTabProps {
  params: Param[];
  setParams: (params: Param[]) => void;
}

export const ParamsTab: React.FC<ParamsTabProps> = ({ params, setParams }) => {
  const addParam = () => {
    setParams([...params, { key: '', value: '', enabled: true }]);
  };

  const removeParam = (index: number) => {
    setParams(params.filter((_, i) => i !== index));
  };

  const updateParam = (index: number, field: keyof Param, value: string | boolean) => {
    const updated = [...params];
    updated[index] = { ...updated[index], [field]: value };
    setParams(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Query Parameters</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addParam}
          className="text-teal-600 border-teal-600 hover:bg-teal-50 hover:cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Parameter
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
            {params.map((param, index) => (
              <TableRow key={index}>
                <TableCell className='border'>
                  <Checkbox
                    checked={param.enabled}
                    onCheckedChange={(checked) => updateParam(index, 'enabled', checked as boolean)}
                  />
                </TableCell>
                <TableCell className='border'>
                  <Input
                    placeholder="Key"
                    value={param.key}
                    onChange={(e) => updateParam(index, 'key', e.target.value)}
                    className="text-sm !border-none !shadow-none focus:!ring-0 focus:!shadow-none focus:!outline-none focus:!border-none"
                  />
                </TableCell>
                <TableCell className='border'>
                  <Input
                    placeholder="Value"
                    value={param.value}
                    onChange={(e) => updateParam(index, 'value', e.target.value)}
                    className="text-sm !border-none !shadow-none focus:!ring-0 focus:!shadow-none focus:!outline-none focus:!border-none"
                  />
                </TableCell>
                <TableCell className='border'>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeParam(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 hover:cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {params.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No parameters added yet. Click "Add Parameter" to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
