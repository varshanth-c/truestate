// src/services/transactionService.ts
import { Transaction, FilterState, SortState } from '@/types';

// safe API base for Next/Vite/CRA or fallback
const API_BASE =
  (typeof process !== 'undefined' && process.env && (process.env.NEXT_PUBLIC_API_BASE || process.env.REACT_APP_API_BASE)) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env && ( (import.meta as any).env.VITE_API_BASE )) ||
  'http://localhost:5000';

function toQueryString(obj: Record<string, any>) {
  const parts: string[] = [];
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) v.forEach(val => parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(val)}`));
    else parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  });
  return parts.length ? `?${parts.join('&')}` : '';
}

function makeSortKey(sort?: SortState) {
  if (!sort?.field || !sort?.direction) return undefined;
  if (sort.field === 'customerName') return sort.direction === 'asc' ? 'customer_az' : 'customer_za';
  return `${sort.field}_${sort.direction}`; // e.g. date_desc
}

/** Convert FilterState -> backend query object */
function buildBackendQuery(filters: FilterState | undefined) {
  const q: Record<string, any> = {};
  if (!filters) return q;

  if (filters.customerRegion) q.region = filters.customerRegion;
  if (filters.gender) q.gender = filters.gender;
  if (filters.productCategory) q.category = filters.productCategory;

  // tags -> CSV
  if (filters.tags) {
    if (Array.isArray(filters.tags)) q.tags = filters.tags.join(',');
    else q.tags = String(filters.tags);
  }

  // paymentMethod -> payment
  if ((filters as any).paymentMethod) q.payment = (filters as any).paymentMethod;

  // dateRange -> dateFrom/dateTo (expect yyyy-mm-dd from <input type="date">)
  if ((filters as any).dateRange) {
    const dr = (filters as any).dateRange;
    if (dr.from) q.dateFrom = dr.from;
    if (dr.to) q.dateTo = dr.to;
  }

  // ageRange like "18-25" or "55+"
  if ((filters as any).ageRange) {
    const s = String((filters as any).ageRange).trim();
    if (s.includes('+')) {
      const min = parseInt(s.replace('+', ''), 10);
      if (!Number.isNaN(min)) q.ageMin = min;
    } else if (s.includes('-')) {
      const [minS, maxS] = s.split('-').map(x => x.trim());
      const min = parseInt(minS, 10);
      const max = parseInt(maxS, 10);
      if (!Number.isNaN(min)) q.ageMin = min;
      if (!Number.isNaN(max)) q.ageMax = max;
    }
  }

  return q;
}

export const transactionService = {
  async getTransactions(
    filters: FilterState = {},
    sort: SortState = {},
    page = 1,
    pageSize = 15,
    search = ''
  ): Promise<{ data: Transaction[]; total: number; page: number; pages: number; summary?: any }> {
    const q: Record<string, any> = { page, limit: pageSize };
    if (search) q.search = search;
    Object.assign(q, buildBackendQuery(filters));
    const sk = makeSortKey(sort);
    if (sk) q.sort = sk;

    const url = `${API_BASE}/api/sales${toQueryString(q)}`;

    const res = await fetch(url); // no credentials in dev
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Failed to load transactions (${res.status}) ${text}`);
    }
    const json = await res.json();
    return {
      data: json.data || [],
      total: json.total ?? 0,
      page: json.page ?? page,
      pages: json.pages ?? Math.ceil((json.total ?? 0) / pageSize),
      summary: json.summary
    };
  },

  async getTransactionById(id: string): Promise<Transaction | null> {
    const res = await fetch(`${API_BASE}/api/sales/${encodeURIComponent(id)}`);
    if (res.status === 404) return null;
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Failed to load transaction (${res.status}) ${text}`);
    }
    return res.json();
  },

  async getStats(filters: FilterState = {}): Promise<{ totalUnits: number; totalAmount: number; totalDiscount: number }> {
    const q = buildBackendQuery(filters);
    const url = `${API_BASE}/api/sales/stats${toQueryString(q)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Failed to load stats (${res.status}) ${text}`);
    }
    return res.json();
  }
};
