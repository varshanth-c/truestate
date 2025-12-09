import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  FileInput,
  Settings,
  ChevronDown,
  ChevronRight,
  UserCheck,
  UserX,
  Ban,
  CheckCircle,
  FileText,
  FileCheck,
  Vault,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: { title: string; icon: React.ElementType; href: string }[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { title: 'Nexus', icon: Compass, href: '/nexus' },
  { title: 'Intake', icon: FileInput, href: '/intake' },
  {
    title: 'Services',
    icon: Settings,
    children: [
      { title: 'Pre-active', icon: UserCheck, href: '/services/pre-active' },
      { title: 'Active', icon: CheckCircle, href: '/services/active' },
      { title: 'Blocked', icon: Ban, href: '/services/blocked' },
      { title: 'Closed', icon: UserX, href: '/services/closed' },
    ],
  },
  {
    title: 'Invoices',
    icon: FileText,
    children: [
      { title: 'Proforma Invoices', icon: FileText, href: '/invoices/proforma' },
      { title: 'Final Invoices', icon: FileCheck, href: '/invoices/final' },
    ],
  },
];

interface AppSidebarProps {
  collapsed: boolean;
}

export const AppSidebar = ({ collapsed }: AppSidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Services', 'Invoices']);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (href?: string) => href === location.pathname;
  const isChildActive = (children?: NavItem['children']) =>
    children?.some((child) => child.href === location.pathname);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
          <Vault className="w-5 h-5" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">Vault</span>
            <span className="text-xs text-muted-foreground">Anurag Yadav</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={cn(
                      'flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isChildActive(item.children)
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {expandedItems.includes(item.title) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                  {!collapsed && expandedItems.includes(item.title) && (
                    <ul className="mt-1 ml-4 pl-4 border-l border-border space-y-1">
                      {item.children.map((child) => (
                        <li key={child.title}>
                          <NavLink
                            to={child.href}
                            className={({ isActive }) =>
                              cn(
                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                isActive
                                  ? 'bg-primary text-primary-foreground'
                                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                              )
                            }
                          >
                            <child.icon className="w-4 h-4" />
                            <span>{child.title}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.href!}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
