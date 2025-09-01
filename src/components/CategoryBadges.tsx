import { Badge } from '@/components/ui/badge';
import { useBudgetStore } from '@/store/budgetStore';

const categoryColors: Record<string, string> = {
  'Groceries': 'bg-success-light text-success border-success/20',
  'Transport': 'bg-primary-light text-primary border-primary/20',
  'Bills': 'bg-destructive-light text-destructive border-destructive/20',
  'Rent': 'bg-warning-light text-warning border-warning/20',
  'Gym': 'bg-purple-100 text-purple-600 border-purple-200',
  'Entertainment': 'bg-pink-100 text-pink-600 border-pink-200',
  'Other': 'bg-muted text-muted-foreground border-border',
};

export const CategoryBadges = () => {
  const getCategoryData = useBudgetStore((state) => state.getCategoryData);
  const categories = getCategoryData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No expenses yet this month. Add your first expense to see category breakdowns.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Category Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {categories
          .sort((a, b) => b.amount - a.amount)
          .map((category) => (
            <div
              key={category.category}
              className="bg-card border border-card-border rounded-lg p-4 space-y-2 hover:shadow-soft transition-shadow"
            >
              <Badge 
                variant="secondary"
                className={`${categoryColors[category.category] || 'bg-muted text-muted-foreground'} w-full justify-center border`}
              >
                {category.category}
              </Badge>
              <div className="text-center space-y-1">
                <div className="font-semibold text-foreground text-sm">
                  {formatCurrency(category.amount)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {category.percentage.toFixed(1)}% • {category.count} {category.count === 1 ? 'expense' : 'expenses'}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};