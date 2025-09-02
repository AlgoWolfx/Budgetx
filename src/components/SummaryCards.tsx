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
  const getCurrentMonthData = useBudgetStore((state) => state.getCurrentMonthData);
  const monthlyData = getCurrentMonthData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const cards = [
    {
      title: 'Aylık Gelir',
      value: formatCurrency(monthlyData.income),
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary-light',
      borderColor: 'border-primary/20',
    },
    {
      title: 'Toplam Giderler',
      value: formatCurrency(monthlyData.totalExpenses),
      icon: TrendingDown,
      color: 'text-destructive',
      bgColor: 'bg-destructive-light',
      borderColor: 'border-destructive/20',
    },
    {
      title: 'Kalan Bakiye',
      value: formatCurrency(monthlyData.remainingBalance),
      icon: TrendingUp,
      color: monthlyData.remainingBalance >= 0 ? 'text-success' : 'text-destructive',
      bgColor: monthlyData.remainingBalance >= 0 ? 'bg-success-light' : 'bg-destructive-light',
      borderColor: monthlyData.remainingBalance >= 0 ? 'border-success/20' : 'border-destructive/20',
    },
    {
      title: 'Tasarruf Oranı',
      value: `${monthlyData.savingsRate.toFixed(1)}%`,
      icon: PiggyBank,
      color: monthlyData.savingsRate >= 20 
        ? 'text-success' 
        : monthlyData.savingsRate >= 10 
        ? 'text-warning' 
        : 'text-destructive',
      bgColor: monthlyData.savingsRate >= 20 
        ? 'bg-success-light' 
        : monthlyData.savingsRate >= 10 
        ? 'bg-warning-light' 
        : 'bg-destructive-light',
      borderColor: monthlyData.savingsRate >= 20 
        ? 'border-success/20' 
        : monthlyData.savingsRate >= 10 
        ? 'border-warning/20' 
        : 'border-destructive/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="bg-card border-card-border rounded-xl shadow-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={cn('p-2 rounded-lg border', card.bgColor, card.borderColor)}>
              <card.icon className={cn('h-4 w-4', card.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-bold', card.color)}>
              {card.value}
            </div>
            {card.title === 'Savings Rate' && (
              <p className="text-xs text-muted-foreground mt-1">
                {monthlyData.savingsRate >= 20 
                  ? 'Excellent savings!'
                  : monthlyData.savingsRate >= 10
                  ? 'Good progress'
                  : 'Room for improvement'
                }
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};