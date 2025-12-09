// src/components/dashboard/SortDropdown.tsx
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction } from '@/types';

interface SortDropdownProps {
  value: string; // current sort field (e.g. 'date' or 'customerName')
  onChange: (field: keyof Transaction) => void;
}

const sortOptions: { value: keyof Transaction; label: string }[] = [
  { value: 'customerName', label: 'Customer Name (A-Z)' },
  { value: 'date', label: 'Date (newest first)' },
  { value: 'totalAmount', label: 'Total Amount' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'age', label: 'Age' },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  // find label for current value (fallback to placeholder)
  const current = sortOptions.find((o) => String(o.value) === String(value));
  const displayLabel = current ? current.label : 'Sort by';

  return (
    <Select
      value={String(value ?? '')}
      onValueChange={(v) => {
        // cast back to keyof Transaction and call handler
        onChange(v as keyof Transaction);
      }}
    >
      <SelectTrigger className="w-[220px] h-9 text-sm">
        {/* show chosen label */}
        <SelectValue placeholder={displayLabel} />
      </SelectTrigger>

      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={String(option.value)} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SortDropdown;
