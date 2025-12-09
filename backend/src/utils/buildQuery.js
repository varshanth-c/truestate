// backend/src/utils/buildQuery.js
// Build MongoDB query from request query params (robust to CSV header field names)
function toArr(v) {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(String).map(s => s.trim()).filter(Boolean);
  return String(v).split(',').map(s => s.trim()).filter(Boolean);
}

function buildQuery(q = {}) {
  const query = {};
  const and = [];

  // search (customerName, phoneNumber, transactionId)
  if (q.search) {
    const s = String(q.search).trim();
    if (s.length) {
      and.push({
        $or: [
          { customerName: { $regex: s, $options: 'i' } },
          { phoneNumber: { $regex: s, $options: 'i' } },
          { transactionId: { $regex: s, $options: 'i' } }
        ]
      });
    }
  }

  // region (supports customerRegion OR "Customer Region")
  if (q.region) {
    const arr = toArr(q.region);
    if (arr.length) {
      and.push({
        $or: [
          { customerRegion: { $in: arr } },
          { 'Customer Region': { $in: arr } }
        ]
      });
    }
  }

  // gender (supports gender OR Gender)
  if (q.gender) {
    const arr = toArr(q.gender);
    if (arr.length) {
      and.push({
        $or: [
          { gender: { $in: arr } },
          { Gender: { $in: arr } }
        ]
      });
    }
  }

  // category (frontend may send category or productCategory) — check both productCategory and "Product Category"
  const catVal = q.category ?? q.productCategory;
  if (catVal) {
    const arr = toArr(catVal);
    if (arr.length) {
      and.push({
        $or: [
          { productCategory: { $in: arr } },
          { 'Product Category': { $in: arr } }
        ]
      });
    }
  }

  // tags (CSV or array)
  if (q.tags) {
    const arr = Array.isArray(q.tags) ? q.tags.map(String).map(s=>s.trim()).filter(Boolean) : toArr(q.tags);
    if (arr.length) and.push({ tags: { $in: arr } });
  }

  // payment (checks paymentMethod and "Payment Method")
  if (q.payment) {
    const arr = toArr(q.payment);
    if (arr.length) {
      and.push({
        $or: [
          { paymentMethod: { $in: arr } },
          { 'Payment Method': { $in: arr } }
        ]
      });
    }
  }

  // age range (ageMin, ageMax)
  if (q.ageMin != null || q.ageMax != null) {
    const o = {};
    if (q.ageMin != null && !Number.isNaN(Number(q.ageMin))) o.$gte = Number(q.ageMin);
    if (q.ageMax != null && !Number.isNaN(Number(q.ageMax))) o.$lte = Number(q.ageMax);
    // only push if has at least one bound
    if (Object.keys(o).length) and.push({ age: o });
  }

  // date range (dateFrom, dateTo) — include whole dateTo day
  if (q.dateFrom || q.dateTo) {
    const o = {};
    if (q.dateFrom) {
      const d1 = new Date(q.dateFrom);
      if (!Number.isNaN(d1.getTime())) o.$gte = d1;
    }
    if (q.dateTo) {
      const d2 = new Date(q.dateTo);
      if (!Number.isNaN(d2.getTime())) {
        d2.setHours(23,59,59,999);
        o.$lte = d2;
      }
    }
    if (Object.keys(o).length) and.push({ date: o });
  }

  if (and.length) query.$and = and;
  return query;
}

module.exports = buildQuery;
