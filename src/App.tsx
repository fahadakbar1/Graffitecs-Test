import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import 'react-toastify/dist/ReactToastify.css';
// Removed incorrect import of Route from lucide-react
import Index from "./pages";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  )
};

export default App;