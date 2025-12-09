import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000'
});

export async function fetchSales(params) {
  const res = await api.get('/api/sales', { params });
  return res.data; // { data, total, page, limit }
}
