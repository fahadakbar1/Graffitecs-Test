import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Clock, Globe } from 'lucide-react';

interface ResponseViewerProps {
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
    responseTime: number;
    url: string;
  };
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
    if (status >= 300 && status < 400) return 'bg-yellow-100 text-yellow-800';
    if (status >= 400) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatResponseData = (data: any) => {
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }
    return data;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Response</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{response.responseTime}ms</span>
            </div>
            <Badge className={getStatusColor(response.status)}>
              {response.status} {response.statusText}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="w-4 h-4" />
          <span className="truncate">{response.url}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="body" className="w-full">
          <TabsList>
            <TabsTrigger value="body">Response Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="body" className="mt-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <pre className="text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                {formatResponseData(response.data)}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="headers" className="mt-4">
            <div className="space-y-2">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4 py-2 border-b border-border last:border-0">
                  <div className="font-mono text-sm font-medium">{key}</div>
                  <div className="col-span-2 font-mono text-sm text-muted-foreground break-all">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};