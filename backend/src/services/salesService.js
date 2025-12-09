// backend/src/services/querySales.js
const Sale = require('../models/Sale');

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
    tags: Array.isArray(doc.tags) ? doc.tags : (typeof doc.Tags === 'string' ? doc.Tags.split('|').map(s=>s.trim()).filter(Boolean) : (doc.Tags || [])),
    quantity: (doc.quantity != null) ? doc.quantity : (doc.Quantity != null ? Number(doc.Quantity) : undefined),
    pricePerUnit: (doc.pricePerUnit != null) ? doc.pricePerUnit : (doc['Price Per Unit'] != null ? Number(doc['Price Per Unit']) : undefined),
    discountPercentage: (doc.discountPercentage != null) ? doc.discountPercentage : (doc['Discount Percentage'] != null ? Number(doc['Discount Percentage']) : undefined),
    totalAmount: (doc.totalAmount != null) ? doc.totalAmount : (doc['Total Amount'] != null ? Number(doc['Total Amount']) : undefined),
    finalAmount: (doc.finalAmount != null) ? doc.finalAmount : (doc['Final Amount'] != null ? Number(doc['Final Amount']) : undefined),
    date: doc.date ? new Date(doc.date) : (doc.Date ? new Date(doc.Date) : null),
    paymentMethod: doc.paymentMethod ?? doc['Payment Method'] ?? null,
    // keep original doc for debug if needed
    __orig: doc
  };
}

// main query function
async function querySales(q = {}) {
  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.max(1, Number(q.limit) || 10);
  const skip = (page - 1) * limit;

  // buildQuery should already produce a filter using CSV keys or camelCase
  // require it from your utils (ensure path correct)
  const buildQuery = require('../utils/buildQuery');
  const filter = buildQuery(q);

  // sort mapping - keep fields you want
  const sortMap = {
    date_desc: { date: -1 },
    date_asc: { date: 1 },
    quantity_asc: { quantity: 1 },
    quantity_desc: { quantity: -1 },
    customer_az: { customerName: 1 },
    customer_za: { customerName: -1 }
  };
  const sortKey = q.sort || 'date_desc';
  const sort = sortMap[sortKey] || { date: -1 };

  // fetch raw docs and map to camelCase
  const itemsRaw = await Sale.find(filter).sort(sort).skip(skip).limit(limit).lean().exec();
  const items = itemsRaw.map(mapCsvToCamel);

  // count total
  const total = await Sale.countDocuments(filter);

  // aggregation summary - robust to CSV headers or camelCase
  const agg = await Sale.aggregate([
    { $match: filter },
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

  // normalize summary keys
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
