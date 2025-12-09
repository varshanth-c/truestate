import { Transaction } from '@/types';

const customerNames = ['Neha Yadav', 'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Gupta', 'Vikram Singh', 'Anjali Verma', 'Rohit Joshi'];
const regions = ['South', 'North', 'East', 'West', 'Central'];
const categories = ['Clothing', 'Electronics'];
const employees = ['Harsh Agrawal', 'Sanjay Mehta', 'Pooja Sharma', 'Ravi Kumar', 'Nisha Patel'];
const paymentMethods = ['Credit Card', 'Debit Card', 'UPI', 'Cash', 'Net Banking'];

export const generateMockTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  
  for (let i = 0; i < count; i++) {
    const baseDate = new Date('2023-09-26');
    baseDate.setDate(baseDate.getDate() + Math.floor(Math.random() * 30));
    
    transactions.push({
      id: `trans_${i + 1}`,
      transactionId: `${1234567 + i}`,
      date: baseDate.toISOString().split('T')[0],
      customerId: `CUST1${2016 + (i % 100)}`,
      customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
      phoneNumber: `+91 ${9123456789 + i}`,
      gender: Math.random() > 0.5 ? 'Female' : 'Male',
      age: 20 + Math.floor(Math.random() * 40),
      productCategory: categories[Math.floor(Math.random() * categories.length)],
      quantity: 1 + Math.floor(Math.random() * 10),
      totalAmount: 500 + Math.floor(Math.random() * 9500),
      customerRegion: regions[Math.floor(Math.random() * regions.length)],
      productId: `PROD${String(i + 1).padStart(4, '0')}`,
      employeeName: employees[Math.floor(Math.random() * employees.length)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      tags: [],
    });
  }
  
  return transactions;
};

export const mockTransactions = generateMockTransactions(100);

export const filterOptions = {
  regions,
  categories,
  genders: ['Male', 'Female', 'Other'],
  ageRanges: ['18-25', '26-35', '36-45', '46-55', '55+'],
  paymentMethods,
  tags: ['VIP', 'New', 'Returning', 'Discount Applied'],
};
