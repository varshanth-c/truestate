import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSales } from '../services/api';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import TransactionTable from '../components/TransactionTable';
import Pagination from '../components/Pagination';

function qsToObj(sp) {
  return {
    // match backend buildQuery param names
    search: sp.get('search') || '',
    region: sp.get('region') || '',
    gender: sp.get('gender') || '',
    category: sp.get('category') || '',
    tags: sp.get('tags') || '',
    payment: sp.get('payment') || '',
    ageMin: sp.get('ageMin') || '',
    ageMax: sp.get('ageMax') || '',
    dateFrom: sp.get('dateFrom') || '',
    dateTo: sp.get('dateTo') || '',
    sort: sp.get('sort') || 'date_desc',
    page: Number(sp.get('page') || 1),
    limit: Number(sp.get('limit') || 10)
  };
}

export default function SalesPage() {
  const [sp, setSp] = useSearchParams();
  const params = useMemo(() => qsToObj(sp), [sp]);

  // fetch; backend may return { items, total, summary } OR { data, total, summary }
  const { data, isLoading } = useQuery(
    ['sales', params],
    () => fetchSales(params),
    { keepPreviousData: true }
  );

  // helper to normalize backend response
  const items = data?.items ?? data?.data ?? [];
  const total = data?.total ?? 0;
  const summary = data?.summary ?? {};

  function updateParam(key, value) {
    const next = new URLSearchParams(sp);
    if (value === '' || value == null) next.delete(key);
    else next.set(key, value);
    if (key !== 'page') next.set('page', '1');
    setSp(next);
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <h1 style={{ margin: 0 }}>Sales</h1>
        <SearchBar value={params.search} onChange={(v) => updateParam('search', v)} />
      </div>

      <div style={{ display: 'flex', gap: 32, marginTop: 20, alignItems: 'flex-start' }}>
        {/* LEFT SIDEBAR */}
        <aside style={{ width: 280 }}>
          <FilterPanel params={params} updateParam={updateParam} />
        </aside>

        {/* RIGHT CONTENT */}
        <main style={{ flex: 1 }}>
          {/* quick summary line */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="small">Page {params.page} • {total} results</div>
            <div className="small">
              Units: <strong>{summary.totalUnits ?? summary.unitsSold ?? '-'}</strong> —
              Total: <strong>{summary.totalAmount ?? '-'}</strong>
            </div>
          </div>

          <div className="table-container">
            <TransactionTable rows={items} loading={isLoading} />
          </div>

          <div style={{ marginTop: 20 }}>
            <Pagination total={total} page={params.page} limit={params.limit} onPage={(p) => updateParam('page', p)} />
          </div>
        </main>
      </div>
    </div>
  );
}
