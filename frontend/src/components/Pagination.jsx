import React from 'react';

export default function Pagination({ total, page, limit, onPage }) {
  const last = Math.max(1, Math.ceil(total / limit));
  return (
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12}}>
      <div className="small">Showing page {page} of {last} — {total} results</div>
      <div style={{display:'flex', gap:8}}>
        <button disabled={page<=1} onClick={()=> onPage(page-1)}>Prev</button>
        <button disabled={page>=last} onClick={()=> onPage(page+1)}>Next</button>
      </div>
    </div>
  );
}
