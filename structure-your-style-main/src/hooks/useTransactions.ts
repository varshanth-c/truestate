// src/hooks/useTransactions.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Transaction, FilterState, SortState, PaginationState } from '@/types';
import { transactionService } from '@/services/transactionService';

const initialFilters: FilterState = {
  customerRegion: '',
  gender: '',
  ageRange: '',
  productCategory: '',
  tags: [],
  paymentMethod: '',
  dateRange: { from: null, to: null },
};

const initialSort: SortState = {
  field: 'date',
  direction: 'desc',
};

const initialPagination: PaginationState = {
  page: 1,
  pageSize: 15,
  total: 0,
};

export const useTransactions = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortState>(initialSort);
  const [pagination, setPagination] = useState<PaginationState>(initialPagination);
  const [searchQuery, setSearchQuery] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<{ totalUnits: number; totalAmount: number; totalDiscount: number }>({
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(
    async (page = pagination.page) => {
      setLoading(true);
      try {
        const res = await transactionService.getTransactions(filters, sort, page, pagination.pageSize, searchQuery);
        setTransactions(res.data || []);
        setPagination((prev) => ({
          ...prev,
          page: res.page ?? page,
          total: res.total ?? 0,
        }));
        if (res.summary) setStats(res.summary);
      } catch (err) {
        console.error('fetchPage error', err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    },
    [filters, sort, pagination.pageSize, searchQuery]
  );

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const first = await transactionService.getTransactions(filters, sort, 1, 1, searchQuery);
      const total = first.total ?? 0;
      if (total === 0) {
        setAllTransactions([]);
        setLoading(false);
        return;
      }
      const cap = Math.min(total, 100000); // safety cap
      const all = await transactionService.getTransactions(filters, sort, 1, cap, searchQuery);
      setAllTransactions(all.data || []);
    } catch (err) {
      console.error('fetchAll error', err);
      setAllTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, searchQuery]);

  // initial and when dependencies change
  useEffect(() => {
    // reset to page 1 whenever filters/search/sort change
    setPagination((p) => ({ ...p, page: 1 }));
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, searchQuery, pagination.pageSize]);

  // stat refresh (optional) — uses service's stats endpoint
  useEffect(() => {
    (async () => {
      try {
        const s = await transactionService.getStats(filters);
        setStats(s);
      } catch {
        // ignore, summary from list already used
      }
    })();
  }, [filters]);

  // helpers exposed to UI (keep same signatures as your old hook)
  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const updateSort = (field: keyof Transaction) => {
    setSort((prev) => {
      if (prev.field === field) {
        return { field: String(field), direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { field: String(field), direction: 'desc' };
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchPage(page);
  };

  // derived pagination values
  const totalPages = useMemo(() => Math.ceil((pagination.total ?? 0) / pagination.pageSize), [pagination.total, pagination.pageSize]);

  return {
    transactions,
    allTransactions,
    filters,
    sort,
    pagination: { ...pagination, total: pagination.total, totalPages },
    stats,
    searchQuery,
    setSearchQuery,
    updateFilter,
    resetFilters,
    updateSort,
    goToPage,
    fetchAll,
    loading,
  };
};
