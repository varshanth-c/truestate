import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TransactionTable } from '@/components/dashboard/TransactionTable';
import { FullTableView } from '@/components/dashboard/FullTableView';
import { Pagination } from '@/components/dashboard/Pagination';
import { SortDropdown } from '@/components/dashboard/SortDropdown';
import { useTransactions } from '@/hooks/useTransactions';

const Dashboard = () => {
  const [showFullTable, setShowFullTable] = useState(false);
  const {
    transactions,
    allTransactions,
    filters,
    sort,
    pagination,
    stats,
    searchQuery,
    setSearchQuery,
    updateFilter,
    resetFilters,
    updateSort,
    goToPage,
  } = useTransactions();

  return (
    <MainLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      <div className="space-y-6">
        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
        />

        {/* Stats and Sort Row */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <StatsCards stats={stats} />
          
          <div className="flex items-center gap-3">
            <SortDropdown value={sort.field} onChange={updateSort} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFullTable(true)}
              className="h-9"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              Full table view
            </Button>
          </div>
        </div>

        {/* Transaction Table */}
        <div>
          <TransactionTable
            transactions={transactions}
            sort={sort}
            onSort={updateSort}
          />
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={goToPage}
          />
        </div>
      </div>

      {/* Full Table View Modal */}
      <FullTableView
        transactions={allTransactions}
        isOpen={showFullTable}
        onClose={() => setShowFullTable(false)}
      />
    </MainLayout>
  );
};

export default Dashboard;
