export interface Transaction {
  id: string;
  transactionId: string;
  date: string;
  customerId: string;
  customerName: string;
  phoneNumber: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  productCategory: string;
  quantity: number;
  totalAmount: number;
  customerRegion: string;
  productId: string;
  employeeName: string;
  paymentMethod?: string;
  tags?: string[];
}

export interface FilterState {
  customerRegion: string;
  gender: string;
  ageRange: string;
  productCategory: string;
  tags: string[];
  paymentMethod: string;
  dateRange: { from: Date | null; to: Date | null };
}

export interface SortState {
  field: keyof Transaction | '';
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
