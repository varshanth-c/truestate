import { Info } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface StatsCardsProps {
  stats: {
    totalUnits: number;
    totalAmount: number;
    totalDiscount: number;
  };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex items-center gap-6">
      {/* Total units sold */}
      <div className="flex items-center gap-3 px-4 py-2 bg-card rounded-lg border border-border">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Total units sold
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Total quantity of items sold</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-lg font-semibold text-foreground">{stats.totalUnits}</p>
        </div>
      </div>

      {/* Total Amount */}
      <div className="flex items-center gap-3 px-4 py-2 bg-card rounded-lg border border-border">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-success text-success-foreground text-sm">₹</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-xs text-muted-foreground">Total Amount</p>
          <p className="text-lg font-semibold text-foreground">{formatCurrency(stats.totalAmount)}</p>
        </div>
      </div>

      {/* Total Discount */}
      <div className="flex items-center gap-3 px-4 py-2 bg-card rounded-lg border border-border">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-destructive text-destructive-foreground text-sm">₹</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-xs text-muted-foreground">Total Discount</p>
          <p className="text-lg font-semibold text-foreground">{formatCurrency(stats.totalDiscount)}</p>
        </div>
      </div>
    </div>
  );
};
