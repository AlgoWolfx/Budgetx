import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudgetStore } from '@/store/budgetStore';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  PiggyBank 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const SummaryCards = () => {
  const monthlyData = useBudgetStore((state) => state.monthlyData);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const cards = [
    {
      title: 'Monthly Income',
      value: formatCurrency(monthlyData.income),
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(monthlyData.totalExpenses),
      icon: TrendingDown,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Remaining Balance',
      value: formatCurrency(monthlyData.remainingBalance),
      icon: TrendingUp,
      color: monthlyData.remainingBalance >= 0 ? 'text-success' : 'text-destructive',
      bgColor: monthlyData.remainingBalance >= 0 ? 'bg-success/10' : 'bg-destructive/10',
    },
    {
      title: 'Savings Rate',
      value: `${monthlyData.savingsRate.toFixed(1)}%`,
      icon: PiggyBank,
      color: monthlyData.savingsRate >= 20 ? 'text-success' : monthlyData.savingsRate >= 10 ? 'text-warning' : 'text-destructive',
      bgColor: monthlyData.savingsRate >= 20 ? 'bg-success/10' : monthlyData.savingsRate >= 10 ? 'bg-warning/10' : 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className="bg-card-elevated border-border-elevated hover:bg-surface-elevated transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={cn('p-2 rounded-lg', card.bgColor)}>
              <card.icon className={cn('h-4 w-4', card.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-bold', card.color)}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};