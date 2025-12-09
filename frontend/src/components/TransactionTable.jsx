import React from 'react';

export default function TransactionTable({ rows, loading }) {
  if (loading) return <div className="mb">Loading...</div>;
  if (!rows.length) return <div className="mb">No results.</div>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Customer</th>
          <th>Region</th>
          <th>Category</th>
          <th>Qty</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r._id}>
            <td>{r.date ? new Date(r.date).toLocaleDateString() : ''}</td>
            <td>{r.customerName || '-'}</td>
            <td>{r.customerRegion || '-'}</td>
            <td>{r.productCategory || '-'}</td>
            <td>{r.quantity ?? '-'}</td>
            <td>{r.finalAmount ?? r.totalAmount ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
