import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Transaction } from '@/types';

interface FullTableViewProps {
  transactions: Transaction[];
  isOpen: boolean;
  onClose: () => void;
}

export const FullTableView = ({ transactions, isOpen, onClose }: FullTableViewProps) => {
  if (!isOpen) return null;

  const allColumns: { key: keyof Transaction; label: string }[] = [
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'date', label: 'Date' },
    { key: 'customerId', label: 'Customer ID' },
    { key: 'customerName', label: 'Customer name' },
    { key: 'phoneNumber', label: 'Phone Number' },
    { key: 'gender', label: 'Gender' },
    { key: 'age', label: 'Age' },
    { key: 'productCategory', label: 'Product Category' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'totalAmount', label: 'Total Amount' },
    { key: 'customerRegion', label: 'Customer region' },
    { key: 'productId', label: 'Product ID' },
    { key: 'employeeName', label: 'Employee name' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-4 bg-card rounded-lg border border-border shadow-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Full table view</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow className="bg-table-header">
                {allColumns.map((col) => (
                  <TableHead key={col.key} className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-table-row-hover">
                  <TableCell className="text-sm">{transaction.transactionId}</TableCell>
                  <TableCell className="text-sm">{transaction.date}</TableCell>
                  <TableCell className="text-sm">{transaction.customerId}</TableCell>
                  <TableCell className="text-sm">{transaction.customerName}</TableCell>
                  <TableCell className="text-sm">{transaction.phoneNumber}</TableCell>
                  <TableCell className="text-sm">{transaction.gender}</TableCell>
                  <TableCell className="text-sm">{transaction.age}</TableCell>
                  <TableCell className="text-sm">{transaction.productCategory}</TableCell>
                  <TableCell className="text-sm">{transaction.quantity}</TableCell>
                  <TableCell className="text-sm">₹ {transaction.totalAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{transaction.customerRegion}</TableCell>
                  <TableCell className="text-sm">{transaction.productId}</TableCell>
                  <TableCell className="text-sm">{transaction.employeeName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
