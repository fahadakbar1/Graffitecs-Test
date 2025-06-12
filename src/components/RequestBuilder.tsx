import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent } from './ui/card';
import { ParamsTab } from './ParamsTab';
import { HeadersTab } from './HeadersTab';
import { BodyTab } from './BodyTab';
import { AuthTab } from './AuthTab';
import { toast } from 'react-toastify';
import { Link2 } from 'lucide-react';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

interface RequestBuilderProps {
  onResponse: (response: any) => void;
}

export const RequestBuilder: React.FC<RequestBuilderProps> = ({ onResponse }) => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [params, setParams] = useState([{ key: '', value: '', enabled: true }]);
  const [headers, setHeaders] = useState([{ key: '', value: '', enabled: true }]);
  const [body, setBody] = useState('');
  const [auth, setAuth] = useState({ type: 'none', token: '', username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!url.trim()) {
      toast.error("URL is required");
      return false;
    }

    // Validate params
    const enabledParams = params.filter(p => p.enabled && p.key);
    for (const param of enabledParams) {
      if (param.key && !param.value) {
        toast.error("All enabled parameters must have both key and value");
        return false;
      }
    }

    // Validate headers
    const enabledHeaders = headers.filter(h => h.enabled && h.key);
    for (const header of enabledHeaders) {
      if (header.key && !header.value) {
        toast.error("All enabled headers must have both key and value");
        return false;
      }
    }

    // Validate JSON body
    if (body.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        JSON.parse(body);
      } catch (error) {
        toast.error("Invalid JSON in request body");
        return false;
      }
    }

    return true;
  };

  const handleSendRequest = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Build query parameters
      const enabledParams = params.filter(p => p.enabled && p.key && p.value);
      const queryParams = new URLSearchParams();
      enabledParams.forEach(param => {
        queryParams.append(param.key, param.value);
      });

      const finalUrl = enabledParams.length > 0 
        ? `${url}?${queryParams.toString()}`
        : url;

      // Build headers
      const requestHeaders: Record<string, string> = {};
      headers.filter(h => h.enabled && h.key && h.value).forEach(header => {
        requestHeaders[header.key] = header.value;
      });

      // Add auth headers
      if (auth.type === 'bearer' && auth.token) {
        requestHeaders['Authorization'] = `Bearer ${auth.token}`;
      } else if (auth.type === 'basic' && auth.username && auth.password) {
        const credentials = btoa(`${auth.username}:${auth.password}`);
        requestHeaders['Authorization'] = `Basic ${credentials}`;
      }

      // Add content-type for JSON body
      if (body.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
        requestHeaders['Content-Type'] = 'application/json';
      }

      const startTime = Date.now();
      const response = await fetch(finalUrl, {
        method,
        headers: requestHeaders,
        body: ['POST', 'PUT', 'PATCH'].includes(method) && body.trim() ? body : undefined,
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      onResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        responseTime,
        url: finalUrl
      });

      toast.success(`Request completed in ${responseTime}ms`);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="flex gap-4">

          <div className='flex flex-1 border rounded-md'>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger style={{ border: 'none',borderRight: '1px solid #a1a1a150',boxShadow: 'none',outline: 'none'}} className="w-32 rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HTTP_METHODS.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='flex items-center px-4 flex-1'>
              <Link2 color="#a1a1a1" size={18} style={{ transform: 'rotate(-45deg)' }} />
              <Input
                placeholder="https://api.example.com/endpoint"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="px-2 flex-1 !border-none !shadow-none focus:!ring-0 focus:!shadow-none focus:!outline-none focus:!border-none"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleSendRequest} 
            disabled={isLoading}
            className="bg-teal-600 hover:bg-teal-700 hover:cursor-pointer text-white px-8"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
          
        </div>

        <Tabs defaultValue="params" className="w-full">
          <div className='border-b w-full'>
          <TabsList className="flex bg-white rounded-none p-0 gap-2">
            <TabsTrigger value="params" className="px-4 cursor-pointer rounded-none shadow-none border-b-2 border-transparent data-[state=active]:border-b-teal-500 data-[state=active]:shadow-none data-[state=active]:text-teal-600">Params</TabsTrigger>
            <TabsTrigger value="auth" className="px-4 cursor-pointer rounded-none shadow-none border-b-2 border-transparent data-[state=active]:border-b-teal-500 data-[state=active]:shadow-none data-[state=active]:text-teal-600">Auth</TabsTrigger>
            <TabsTrigger value="headers" className="px-4 cursor-pointer rounded-none shadow-none border-b-2 border-transparent data-[state=active]:border-b-teal-500 data-[state=active]:shadow-none data-[state=active]:text-teal-600">Headers</TabsTrigger>
            <TabsTrigger value="body" className="px-4 cursor-pointer rounded-none shadow-none border-b-2 border-transparent data-[state=active]:border-b-teal-500 data-[state=active]:shadow-none data-[state=active]:text-teal-600">Body</TabsTrigger>
          </TabsList>
          </div>
          
          <TabsContent value="params">
            <ParamsTab params={params} setParams={setParams} />
          </TabsContent>
          
          <TabsContent value="auth">
            <AuthTab auth={auth} setAuth={setAuth} />
          </TabsContent>
          
          <TabsContent value="headers">
            <HeadersTab headers={headers} setHeaders={setHeaders} />
          </TabsContent>
          
          <TabsContent value="body">
            <BodyTab 
              body={body} 
              setBody={setBody} 
              method={method}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
