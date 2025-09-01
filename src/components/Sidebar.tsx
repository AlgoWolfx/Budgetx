import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Tag, 
  Settings, 
  TrendingUp,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBudgetStore } from '@/store/budgetStore';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Categories', href: '/categories', icon: Tag },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const logout = useBudgetStore((state) => state.logout);

  return (
    <div className="h-full bg-sidebar-background border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-sidebar-primary/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-sidebar-primary" />
          </div>
          <h2 className="text-lg font-semibold text-sidebar-foreground">MyBudget</h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};