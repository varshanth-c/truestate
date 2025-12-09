import React, { useState, useEffect } from 'react';

export default function SearchBar({ value, onChange }) {
  const [val, setVal] = useState(value || '');

  useEffect(() => setVal(value || ''), [value]);

  useEffect(() => {
    const t = setTimeout(() => onChange(val), 300);
    return () => clearTimeout(t);
  }, [val]);

  return (
    <div style={{ width: 420 }}>
      <input
        className="input"
        placeholder="Search name or phone..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
    </div>
  );
}
