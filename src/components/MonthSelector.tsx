import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useBudgetStore } from '@/store/budgetStore';
import { Calendar } from 'lucide-react';

export const MonthSelector = () => {
  const { selectedMonth, setSelectedMonth } = useBudgetStore();

  const formatMonthDisplay = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const generateAvailableMonths = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 2; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.push(monthKey);
    }
    
    return months;
  };

  const availableMonths = generateAvailableMonths();

  return (
    <div className="flex items-center space-x-3">
      <Calendar className="h-5 w-5 text-muted-foreground" />
      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
        <SelectTrigger className="w-48 bg-surface border-border rounded-lg">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent className="bg-card-elevated border-border rounded-lg">
          {availableMonths.map((month) => (
            <SelectItem 
              key={month} 
              value={month}
              className="text-foreground hover:bg-muted focus:bg-muted rounded-md"
            >
              {formatMonthDisplay(month)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};