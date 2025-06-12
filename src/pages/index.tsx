import { useState } from 'react';
import { RequestBuilder } from '../components/RequestBuilder';
import { ResponseViewer } from '../components/ResponseViewer';
import { ToastContainer } from 'react-toastify';

const Index = () => {
  const [response, setResponse] = useState(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
          <div className="space-y-6">
            <RequestBuilder 
              onResponse={setResponse}
            />
            {response && (
              <ResponseViewer response={response} />
            )}
          </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Index;