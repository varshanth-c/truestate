import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Nexus from '@/pages/Nexus';
import Intake from '@/pages/Intake';
import PreActive from '@/pages/services/PreActive';
import Active from '@/pages/services/Active';
import Blocked from '@/pages/services/Blocked';
import Closed from '@/pages/services/Closed';
import ProformaInvoices from '@/pages/invoices/ProformaInvoices';
import FinalInvoices from '@/pages/invoices/FinalInvoices';
import NotFound from '@/pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/nexus" element={<Nexus />} />
      <Route path="/intake" element={<Intake />} />
      <Route path="/services/pre-active" element={<PreActive />} />
      <Route path="/services/active" element={<Active />} />
      <Route path="/services/blocked" element={<Blocked />} />
      <Route path="/services/closed" element={<Closed />} />
      <Route path="/invoices/proforma" element={<ProformaInvoices />} />
      <Route path="/invoices/final" element={<FinalInvoices />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
