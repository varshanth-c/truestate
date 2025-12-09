// src/components/dashboard/FilterPanel.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FilterState } from '@/types';
import { filterOptions } from '@/utils/mockData';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
  onReset: () => void;
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export const FilterPanel = ({ filters, onFilterChange, onReset }: FilterPanelProps) => {
  const [localTags, setLocalTags] = useState<string[]>(Array.isArray(filters.tags) ? filters.tags : []);
  const [dateFrom, setDateFrom] = useState<string | null>(filters.dateRange?.from ?? null);
  const [dateTo, setDateTo] = useState<string | null>(filters.dateRange?.to ?? null);

  useEffect(() => setLocalTags(Array.isArray(filters.tags) ? filters.tags : []), [filters.tags]);
  useEffect(() => {
    setDateFrom(filters.dateRange?.from ?? null);
    setDateTo(filters.dateRange?.to ?? null);
  }, [filters.dateRange]);

  const activeFiltersCount = Object.entries(filters).reduce((count, [, v]) => {
    if (!v) return count;
    if (Array.isArray(v)) return count + (v.length > 0 ? 1 : 0);
    if (typeof v === 'object' && v !== null) {
      if ((v as any).from || (v as any).to) return count + 1;
      return count;
    }
    return count + 1;
  }, 0);

  const handleTagToggle = (tag: string) => {
    const next = localTags.includes(tag) ? localTags.filter(t => t !== tag) : [...localTags, tag];
    setLocalTags(next);
    onFilterChange('tags', next);
  };

  const applyDateRange = () => {
    onFilterChange('dateRange', { from: dateFrom, to: dateTo });
  };

  const handleReset = () => {
    setLocalTags([]);
    setDateFrom(null);
    setDateTo(null);
    onReset();
  };

  const setPresetDays = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - (days - 1));
    const f = isoDate(from);
    const t = isoDate(to);
    setDateFrom(f);
    setDateTo(t);
    onFilterChange('dateRange', { from: f, to: t });
  };

  const setToday = () => {
    const t = isoDate(new Date());
    setDateFrom(t);
    setDateTo(t);
    onFilterChange('dateRange', { from: t, to: t });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-lg border border-border">

      {/* Avatars */}
      <div className="flex items-center -space-x-1 mr-2">
        <Avatar className="w-7 h-7 border-2 border-card">
          <AvatarFallback className="bg-avatar-purple text-primary-foreground text-xs">M</AvatarFallback>
        </Avatar>
        <Avatar className="w-7 h-7 border-2 border-card">
          <AvatarFallback className="bg-destructive text-primary-foreground text-xs">R</AvatarFallback>
        </Avatar>
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted border-2 border-card text-xs font-medium text-muted-foreground">
          +4
        </div>
      </div>

      {/* Region */}
      <Select value={filters.customerRegion || 'all'}
        onValueChange={(v) => onFilterChange('customerRegion', v === 'all' ? '' : v)}>
        <SelectTrigger className="w-[140px] h-9 text-sm">
          <SelectValue placeholder="Customer Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Regions</SelectItem>
          {filterOptions.regions.map(region => (
            <SelectItem key={region} value={region}>{region}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Gender */}
      <Select value={filters.gender || 'all'}
        onValueChange={(v) => onFilterChange('gender', v === 'all' ? '' : v)}>
        <SelectTrigger className="w-[100px] h-9 text-sm">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {filterOptions.genders.map(gender => (
            <SelectItem key={gender} value={gender}>{gender}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Age */}
      <Select value={filters.ageRange || 'all'}
        onValueChange={(v) => onFilterChange('ageRange', v === 'all' ? '' : v)}>
        <SelectTrigger className="w-[110px] h-9 text-sm">
          <SelectValue placeholder="Age Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ages</SelectItem>
          {filterOptions.ageRanges.map(age => (
            <SelectItem key={age} value={age}>{age}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Category */}
      <Select value={filters.productCategory || 'all'}
        onValueChange={(v) => onFilterChange('productCategory', v === 'all' ? '' : v)}>
        <SelectTrigger className="w-[150px] h-9 text-sm">
          <SelectValue placeholder="Product Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {filterOptions.categories.map(cat => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Tags */}
      <div className="flex items-center gap-2">
        {filterOptions.tags.map(tag => {
          const active = localTags.includes(tag);
          return (
            <Button
              key={tag}
              size="sm"
              variant={active ? 'solid' : 'outline'}
              className="h-9 text-xs"
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </Button>
          );
        })}
      </div>

      {/* Payment */}
      <Select value={filters.paymentMethod || 'all'}
        onValueChange={(v) => onFilterChange('paymentMethod', v === 'all' ? '' : v)}>
        <SelectTrigger className="w-[150px] h-9 text-sm">
          <SelectValue placeholder="Payment Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Methods</SelectItem>
          {filterOptions.paymentMethods.map(method => (
            <SelectItem key={method} value={method}>{method}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Range */}
      <div className="flex items-center gap-2">
        <input type="date" value={dateFrom ?? ''} onChange={(e) => setDateFrom(e.target.value || null)}
          className="h-9 px-2 rounded border" />
        <span className="text-sm">—</span>
        <input type="date" value={dateTo ?? ''} onChange={(e) => setDateTo(e.target.value || null)}
          className="h-9 px-2 rounded border" />
        <Button variant="outline" size="sm" className="h-9" onClick={applyDateRange}>Apply</Button>

        <Button size="sm" variant="ghost" className="h-9 text-xs" onClick={setToday}>Today</Button>
        <Button size="sm" variant="ghost" className="h-9 text-xs" onClick={() => setPresetDays(7)}>7d</Button>
        <Button size="sm" variant="ghost" className="h-9 text-xs" onClick={() => setPresetDays(30)}>30d</Button>
      </div>

      {/* Reset */}
      {activeFiltersCount > 0 && (
        <Button variant="ghost" size="sm" onClick={handleReset} className="h-9 text-muted-foreground">
          Reset ({activeFiltersCount})
        </Button>
      )}
    </div>
  );
};
