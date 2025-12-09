import { MainLayout } from '@/components/layout/MainLayout';
import { useState } from 'react';

const FinalInvoices = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <MainLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Final Invoices</h1>
          <p className="text-muted-foreground">Manage final invoices</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default FinalInvoices;
