// scripts/migrate-fields.js
require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  const MONGO = process.env.MONGO_URI;
  if (!MONGO) {
    console.error('Set MONGO_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to Mongo');

  const db = mongoose.connection.db;
  const coll = db.collection('sales'); // change if your collection name differs

  // Aggregation-update pipeline to copy fields (only if camelCase missing), then remove old fields.
  const res = await coll.updateMany(
    {}, 
    [
      {
        $set: {
          transactionId: { $ifNull: ['$transactionId', '$Transaction ID'] },
          customerId:   { $ifNull: ['$customerId', '$Customer ID'] },
          customerName: { $ifNull: ['$customerName', '$Customer name'] },
          phoneNumber:  { $ifNull: ['$phoneNumber', '$Phone Number'] },
          gender:       { $ifNull: ['$gender', '$Gender'] },
          age:          { $ifNull: ['$age', '$Age'] },
          customerRegion: { $ifNull: ['$customerRegion', '$Customer Region'] },
          productId:    { $ifNull: ['$productId', '$Product ID'] },
          productName:  { $ifNull: ['$productName', '$Product name'] },
          brand:        { $ifNull: ['$brand', '$Brand'] },
          productCategory: { $ifNull: ['$productCategory', '$Product Category'] },
          tags:         { $ifNull: ['$tags', { $cond: [{ $isArray: ['$Tags'] }, '$Tags', { $cond: [{ $eq: [{ $type: '$Tags' }, 'string'] }, { $split: ['$Tags', '|'] }, []] } ] } ] },
          quantity:     { $ifNull: ['$quantity', { $toDouble: { $ifNull: ['$Quantity', 0] } }] },
          pricePerUnit: { $ifNull: ['$pricePerUnit', { $toDouble: { $ifNull: ['$Price Per Unit', 0] } }] },
          discountPercentage: { $ifNull: ['$discountPercentage', { $toDouble: { $ifNull: ['$Discount Percentage', 0] } }] },
          totalAmount:  { $ifNull: ['$totalAmount', { $toDouble: { $ifNull: ['$Total Amount', 0] } }] },
          finalAmount:  { $ifNull: ['$finalAmount', { $toDouble: { $ifNull: ['$Final Amount', 0] } }] },
          date:         { $ifNull: ['$date', { $cond: [{ $ifNull: ['$Date', false] }, { $toDate: '$Date' }, null] }] },
          paymentMethod:{ $ifNull: ['$paymentMethod', '$Payment Method'] },
          orderStatus:  { $ifNull: ['$orderStatus', '$Order Status'] },
          deliveryType: { $ifNull: ['$deliveryType', '$Delivery Type'] },
          storeId:      { $ifNull: ['$storeId', '$Store ID'] },
          storeLocation:{ $ifNull: ['$storeLocation', '$Store Location'] },
          salespersonId:{ $ifNull: ['$salespersonId', '$Salesperson ID'] },
          employeeName: { $ifNull: ['$employeeName', '$Employee Name'] }
        }
      },
      {
        $unset: [
          "Transaction ID","Customer ID","Customer name","Phone Number","Gender","Age",
          "Customer Region","Product ID","Product name","Brand","Product Category","Tags",
          "Quantity","Price Per Unit","Discount Percentage","Total Amount","Final Amount",
          "Date","Payment Method","Order Status","Delivery Type","Store ID","Store Location",
          "Salesperson ID","Employee Name"
        ]
      }
    ],
    { upsert: false }
  );

  console.log('Modified count:', res.modifiedCount);
  await mongoose.disconnect();
  console.log('Migration finished');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
