import { Copy, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Transaction, SortState } from '@/types';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface TransactionTableProps {
  transactions: Transaction[];
  sort: SortState;
  onSort: (field: keyof Transaction) => void;
}

const columns: { key: keyof Transaction; label: string; sortable?: boolean }[] = [
  { key: 'transactionId', label: 'Transaction ID', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'customerId', label: 'Customer ID', sortable: true },
  { key: 'customerName', label: 'Customer name', sortable: true },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'gender', label: 'Gender', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
  { key: 'productCategory', label: 'Product Category', sortable: true },
  { key: 'quantity', label: 'Quantity', sortable: true },
];

export const TransactionTable = ({ transactions, sort, onSort }: TransactionTableProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Phone number copied to clipboard',
    });
  };

  const getSortIcon = (field: keyof Transaction) => {
    if (sort.field !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-50" />;
    }
    return sort.direction === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1" />
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    'text-xs font-medium text-muted-foreground whitespace-nowrap',
                    col.sortable && 'cursor-pointer select-none'
                  )}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  <div className="flex items-center">
                    {col.label}
                    {col.sortable && getSortIcon(col.key)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="hover:bg-table-row-hover transition-colors"
                >
                  <TableCell className="text-sm font-medium">{transaction.transactionId}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{transaction.date}</TableCell>
                  <TableCell className="text-sm">{transaction.customerId}</TableCell>
                  <TableCell className="text-sm">{transaction.customerName}</TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1.5">
                      {transaction.phoneNumber}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-5 h-5"
                        onClick={() => copyToClipboard(transaction.phoneNumber)}
                      >
                        <Copy className="w-3 h-3 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{transaction.gender}</TableCell>
                  <TableCell className="text-sm">{transaction.age}</TableCell>
                  <TableCell className="text-sm">{transaction.productCategory}</TableCell>
                  <TableCell className="text-sm font-medium">{String(transaction.quantity).padStart(2, '0')}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
