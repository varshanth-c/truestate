// backend/src/services/querySales.js
const Sale = require('../models/Sale');

// helper to build case-insensitive regex array
function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function toRegexArray(val) {
  if (!val) return [];
  const arr = String(val).split(',').map(x => x.trim()).filter(Boolean);
  return arr.map(v => new RegExp(`^${escapeRegExp(v)}$`, 'i'));
}

function stringifyForLog(obj) {
  return JSON.stringify(obj, (k, v) => {
    if (v instanceof RegExp) return v.toString();
    return v;
  });
}

// map raw DB doc (CSV-header names OR camelCase) -> clean camelCase object
function mapCsvToCamel(doc) {
  if (!doc) return doc;
  return {
    _id: doc._id,
    transactionId: doc.transactionId ?? doc['Transaction ID'] ?? doc['Transaction Id'] ?? null,
    customerId: doc.customerId ?? doc['Customer ID'] ?? null,
    customerName: doc.customerName ?? doc['Customer name'] ?? doc['Customer Name'] ?? null,
    phoneNumber: doc.phoneNumber ?? doc['Phone Number'] ?? doc.phone ?? null,
    gender: doc.gender ?? doc.Gender ?? null,
    age: doc.age ?? (doc.Age != null ? Number(doc.Age) : undefined),
    customerRegion: doc.customerRegion ?? doc['Customer Region'] ?? null,
    productCategory: doc.productCategory ?? doc['Product Category'] ?? null,
    tags: Array.isArray(doc.tags)
      ? doc.tags
      : (typeof doc.Tags === 'string' ? doc.Tags.split('|').map(s => s.trim()).filter(Boolean) : (doc.Tags || [])),
    quantity: (doc.quantity != null) ? doc.quantity : (doc.Quantity != null ? Number(doc.Quantity) : undefined),
    pricePerUnit: (doc.pricePerUnit != null) ? doc.pricePerUnit : (doc['Price Per Unit'] != null ? Number(doc['Price Per Unit']) : undefined),
    discountPercentage: (doc.discountPercentage != null) ? doc.discountPercentage : (doc['Discount Percentage'] != null ? Number(doc['Discount Percentage']) : undefined),
    totalAmount: (doc.totalAmount != null) ? doc.totalAmount : (doc['Total Amount'] != null ? Number(doc['Total Amount']) : undefined),
    finalAmount: (doc.finalAmount != null) ? doc.finalAmount : (doc['Final Amount'] != null ? Number(doc['Final Amount']) : undefined),
    date: doc.date ? new Date(doc.date) : (doc.Date ? new Date(doc.Date) : null),
    paymentMethod: doc.paymentMethod ?? doc['Payment Method'] ?? null,
    __orig: doc
  };
}

// main query function
async function querySales(q = {}) {
  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.max(1, Number(q.limit) || 10);
  const skip = (page - 1) * limit;

  const buildQuery = require('../utils/buildQuery');
  let filter = buildQuery(q);

  if (process.env.NODE_ENV !== 'production') {
    try { console.log('querySales REQ_Q:', stringifyForLog(q)); } catch (e) {}
  }

  // copy filter then remove/replace certain keys with tolerant checks
  const finalFilter = { ...filter };

  function removeKeyConditions(keys) {
    if (!finalFilter.$and) return;
    finalFilter.$and = finalFilter.$and.filter(cond => {
      try {
        const s = JSON.stringify(cond);
        return !keys.some(k => s.includes(`"${k}"`));
      } catch (e) {
        return true;
      }
    });
    if (finalFilter.$and && finalFilter.$and.length === 0) delete finalFilter.$and;
  }

  // CATEGORY: support q.category or q.productCategory, match productCategory or "Product Category"
  const catVal = q.category ?? q.productCategory;
  if (catVal) {
    removeKeyConditions(['productCategory', 'Product Category']);
    const regexArr = toRegexArray(catVal);
    if (regexArr.length) {
      const catCond = { $or: [{ productCategory: { $in: regexArr } }, { 'Product Category': { $in: regexArr } }] };
      if (!finalFilter.$and) finalFilter.$and = [];
      finalFilter.$and.push(catCond);
    }
  }

  // REGION: support q.region, match both customerRegion and "Customer Region"
  if (q.region) {
    removeKeyConditions(['customerRegion', 'Customer Region']);
    const regexArr = toRegexArray(q.region);
    if (regexArr.length) {
      const regionCond = { $or: [{ customerRegion: { $in: regexArr } }, { 'Customer Region': { $in: regexArr } }] };
      if (!finalFilter.$and) finalFilter.$and = [];
      finalFilter.$and.push(regionCond);
    }
  }

  // GENDER
  if (q.gender) {
    removeKeyConditions(['gender']);
    const regexArr = toRegexArray(q.gender);
    if (regexArr.length) {
      if (!finalFilter.$and) finalFilter.$and = [];
      finalFilter.$and.push({ gender: { $in: regexArr } });
    }
  }

  // PAYMENT: check paymentMethod and "Payment Method"
  if (q.payment) {
    removeKeyConditions(['paymentMethod', 'Payment Method']);
    const regexArr = toRegexArray(q.payment);
    if (regexArr.length) {
      const payCond = { $or: [{ paymentMethod: { $in: regexArr } }, { 'Payment Method': { $in: regexArr } }] };
      if (!finalFilter.$and) finalFilter.$and = [];
      finalFilter.$and.push(payCond);
    }
  }

  // TAGS: if buildQuery didn't add tags, add a safe $in
  if (q.tags) {
    const hasTagsInFilter = finalFilter.$and && finalFilter.$and.some(c => {
      try { return JSON.stringify(c).includes('"tags"'); } catch (e) { return false; }
    });
    if (!hasTagsInFilter) {
      const tagsArr = Array.isArray(q.tags) ? q.tags : String(q.tags).split(',').map(s => s.trim()).filter(Boolean);
      if (tagsArr.length) {
        if (!finalFilter.$and) finalFilter.$and = [];
        finalFilter.$and.push({ tags: { $in: tagsArr } });
      }
    }
  }

  // NOTE: age/date are numeric/date ranges handled by buildQuery — keep them as-is.
  // Do NOT remove age/date conditions.

  // sort mapping - added totalAmount and finalAmount sorts
  const sortMap = {
    date_desc: { date: -1 },
    date_asc: { date: 1 },
    quantity_asc: { quantity: 1 },
    quantity_desc: { quantity: -1 },
    customer_az: { customerName: 1 },
    customer_za: { customerName: -1 },
    totalAmount_desc: { totalAmount: -1 },
    totalAmount_asc: { totalAmount: 1 },
    finalAmount_desc: { finalAmount: -1 },
    finalAmount_asc: { finalAmount: 1 }
  };
  const sortKey = q.sort || 'date_desc';
  const sort = sortMap[sortKey] || { date: -1 };

  if (process.env.NODE_ENV !== 'production') {
    try { console.log('querySales FINAL_FILTER:', stringifyForLog(finalFilter)); } catch (e) {}
  }

  // fetch raw docs and map to camelCase
  const itemsRaw = await Sale.find(finalFilter).sort(sort).skip(skip).limit(limit).lean().exec();
  const items = itemsRaw.map(mapCsvToCamel);

  // count total
  const total = await Sale.countDocuments(finalFilter);

  // aggregation summary - robust to CSV headers or camelCase
  const agg = await Sale.aggregate([
    { $match: finalFilter },
    {
      $group: {
        _id: null,
        totalUnits: { $sum: { $ifNull: ['$quantity', '$Quantity', 0] } },
        totalAmount: { $sum: { $ifNull: ['$finalAmount', '$Final Amount', '$totalAmount', '$Total Amount', 0] } },
        totalDiscount: {
          $sum: {
            $let: {
              vars: {
                p: { $ifNull: ['$pricePerUnit', '$Price Per Unit', 0] },
                qnt: { $ifNull: ['$quantity', '$Quantity', 0] },
                d: { $ifNull: ['$discountPercentage', '$Discount Percentage', 0] }
              },
              in: { $multiply: ['$$p', '$$qnt', { $divide: ['$$d', 100] }] }
            }
          }
        }
      }
    }
  ]).exec();

  const summaryRaw = (agg && agg[0]) ? agg[0] : { totalUnits: 0, totalAmount: 0, totalDiscount: 0 };

  const summary = {
    totalUnits: summaryRaw.totalUnits ?? 0,
    totalAmount: summaryRaw.totalAmount ?? 0,
    totalDiscount: summaryRaw.totalDiscount ?? 0
  };

  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    items,
    summary
  };
}

module.exports = { querySales };
