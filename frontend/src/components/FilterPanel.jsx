import React, { useState, useEffect } from 'react';

// Simple filter panel using text inputs and Apply buttons.
// Uses keys: region, gender, category, tags, payment
export default function FilterPanel({ params, updateParam }) {
  const [region, setRegion] = useState(params.region || '');
  const [gender, setGender] = useState(params.gender || '');
  const [category, setCategory] = useState(params.category || '');
  const [tags, setTags] = useState(params.tags || '');
  const [payment, setPayment] = useState(params.payment || '');
  const [ageMin, setAgeMin] = useState(params.ageMin || '');
  const [ageMax, setAgeMax] = useState(params.ageMax || '');

  useEffect(() => {
    setRegion(params.region || '');
    setGender(params.gender || '');
    setCategory(params.category || '');
    setTags(params.tags || '');
    setPayment(params.payment || '');
    setAgeMin(params.ageMin || '');
    setAgeMax(params.ageMax || '');
  }, [params]);

  return (
    <aside>
      <div style={{ marginBottom: 12 }}>
        <label className="small">Region</label>
        <input className="input" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="North,South" />
        <div style={{ marginTop: 6 }}>
          <button onClick={() => updateParam('region', region)}>Apply</button>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label className="small">Gender</label>
        <input className="input" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Male,Female" />
        <div style={{ marginTop: 6 }}>
          <button onClick={() => updateParam('gender', gender)}>Apply</button>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label className="small">Category</label>
        <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Electronics" />
        <div style={{ marginTop: 6 }}>
          <button onClick={() => updateParam('category', category)}>Apply</button>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label className="small">Tags</label>
        <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tag1,tag2" />
        <div style={{ marginTop: 6 }}>
          <button onClick={() => updateParam('tags', tags)}>Apply</button>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label className="small">Payment method</label>
        <input className="input" value={payment} onChange={(e) => setPayment(e.target.value)} placeholder="COD,Card" />
        <div style={{ marginTop: 6 }}>
          <button onClick={() => updateParam('payment', payment)}>Apply</button>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label className="small">Age min / max</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} placeholder="min" />
          <input className="input" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} placeholder="max" />
        </div>
        <div style={{ marginTop: 6 }}>
          <button onClick={() => { updateParam('ageMin', ageMin); updateParam('ageMax', ageMax); }}>Apply</button>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <label className="small">Sort</label>
        <select className="input" value={params.sort} onChange={(e) => updateParam('sort', e.target.value)}>
          <option value="date_desc">Date (new → old)</option>
          <option value="date_asc">Date (old → new)</option>
          <option value="quantity_desc">Quantity (high → low)</option>
          <option value="customer_az">Customer (A → Z)</option>
        </select>
      </div>
    </aside>
  );
}
