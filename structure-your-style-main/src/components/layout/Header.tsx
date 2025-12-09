import { Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSidebar: () => void;
}

export const Header = ({ searchQuery, onSearchChange, onToggleSidebar }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-card border-b border-border">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Sales Management System</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Name, Phone no."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 pl-10 bg-background"
          />
        </div>

        {/* User avatars */}
        <div className="flex items-center -space-x-2">
          <Avatar className="w-8 h-8 border-2 border-card">
            <AvatarFallback className="bg-avatar-purple text-primary-foreground text-xs font-medium">
              D
            </AvatarFallback>
          </Avatar>
          <Avatar className="w-8 h-8 border-2 border-card">
            <AvatarFallback className="bg-avatar-orange text-primary-foreground text-xs font-medium">
              A
            </AvatarFallback>
          </Avatar>
          <Avatar className="w-8 h-8 border-2 border-card">
            <AvatarFallback className="bg-avatar-blue text-primary-foreground text-xs font-medium">
              B
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
