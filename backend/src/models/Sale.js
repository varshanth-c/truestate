const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({

  // CamelCase fields used by frontend/backend ---------------------------------
  transactionId: { type: String, alias: "Transaction ID" },
  customerId:   { type: String, alias: "Customer ID" },
  customerName: { type: String, alias: "Customer name" },
  phoneNumber:  { type: String, alias: "Phone Number" },
  gender:       { type: String, alias: "Gender" },
  age:          { type: Number, alias: "Age" },
  customerRegion: { type: String, alias: "Customer Region" },

  productId:    { type: String, alias: "Product ID" },
  productName:  { type: String, alias: "Product name" },
  brand:        { type: String, alias: "Brand" },
  productCategory: { type: String, alias: "Product Category" },

  // tags may be array or pipe-separated string → Mongoose will still read it
  tags: { type: [String], alias: "Tags" },

  quantity: { type: Number, alias: "Quantity" },
  pricePerUnit: { type: Number, alias: "Price Per Unit" },
  discountPercentage: { type: Number, alias: "Discount Percentage" },
  totalAmount: { type: Number, alias: "Total Amount" },
  finalAmount: { type: Number, alias: "Final Amount" },

  date: { type: Date, alias: "Date" },

  paymentMethod: { type: String, alias: "Payment Method" },
  orderStatus:   { type: String, alias: "Order Status" },
  deliveryType:  { type: String, alias: "Delivery Type" },
  storeId:       { type: String, alias: "Store ID" },
  storeLocation: { type: String, alias: "Store Location" },
  salespersonId: { type: String, alias: "Salesperson ID" },
  employeeName:  { type: String, alias: "Employee Name" }

}, { timestamps: true, strict: false });

// strict:false allows unknown fields still to exist in the document.
module.exports = mongoose.model('Sale', SaleSchema);
