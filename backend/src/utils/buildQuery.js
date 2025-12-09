// Build MongoDB query from request query params
function buildQuery(q) {
  const query = {};
  const and = [];

  // search (customerName, phoneNumber)
  if (q.search) {
    const s = q.search.trim();
    and.push({
      $or: [
        { customerName: { $regex: s, $options: 'i' } },
        { phoneNumber: { $regex: s, $options: 'i' } }
      ]
    });
  }

  if (q.region) {
    const arr = q.region.split(',').map(x => x.trim());
    and.push({ customerRegion: { $in: arr } });
  }
  if (q.gender) {
    and.push({ gender: { $in: q.gender.split(',').map(x=>x.trim()) } });
  }
  if (q.category) {
    and.push({ productCategory: { $in: q.category.split(',').map(x=>x.trim()) } });
  }
  if (q.tags) {
    and.push({ tags: { $in: q.tags.split(',').map(x=>x.trim()) } });
  }
  if (q.payment) {
    and.push({ paymentMethod: { $in: q.payment.split(',').map(x=>x.trim()) } });
  }
  // age range
  if (q.ageMin || q.ageMax) {
    const o = {};
    if (q.ageMin) o.$gte = Number(q.ageMin);
    if (q.ageMax) o.$lte = Number(q.ageMax);
    and.push({ age: o });
  }
  // date range
  if (q.dateFrom || q.dateTo) {
    const o = {};
    if (q.dateFrom) o.$gte = new Date(q.dateFrom);
    if (q.dateTo) {
      // include whole day
      const d = new Date(q.dateTo);
      d.setHours(23,59,59,999);
      o.$lte = d;
    }
    and.push({ date: o });
  }

  if (and.length) query.$and = and;
  return query;
}

module.exports = buildQuery;
