import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@components/ui/tooltip';
import { QueryClient , QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import RawMaterialsPage from './pages/RawMaterialsPage';
import ProductionPage from './pages/ProductionPage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<ProductsPage />} />
      <Route path="/raw-materials" element={<ProductionPage/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;