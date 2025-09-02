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
    return date.toLocaleDateString('tr-TR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const generateAvailableMonths = () => {
    const months = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
    
    // Start from current month and add all remaining months of current year
    for (let month = currentMonth; month <= 12; month++) {
      const monthKey = `${currentYear}-${String(month).padStart(2, '0')}`;
      months.push(monthKey);
    }
    
    // Add all months for the next year (2026)
    const nextYear = currentYear + 1;
    for (let month = 1; month <= 12; month++) {
      const monthKey = `${nextYear}-${String(month).padStart(2, '0')}`;
      months.push(monthKey);
    }
    
    return months;
  };

  const groupMonthsByYear = () => {
    const months = generateAvailableMonths();
    const grouped: Record<string, string[]> = {};
    
    months.forEach(month => {
      const year = month.split('-')[0];
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(month);
    });
    
    return grouped;
  };

  const monthsByYear = groupMonthsByYear();

  return (
    <div className="flex items-center space-x-2">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Calendar className="h-4 w-4 text-primary" />
      </div>
      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
        <SelectTrigger className="w-44 bg-card border-border rounded-lg hover:border-border/80 transition-colors">
          <SelectValue placeholder="Ay seçin" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border rounded-lg max-h-80 shadow-lg">
          {Object.entries(monthsByYear).map(([year, months]) => (
            <div key={year}>
              <div className="px-3 py-2 text-xs font-semibold text-primary bg-primary/10 rounded-md mx-1 mt-1 mb-2">
                {year}
              </div>
              {months.map((month) => (
                <SelectItem 
                  key={month} 
                  value={month}
                  className="text-foreground hover:bg-muted focus:bg-muted rounded-md ml-2 mr-1 mb-1"
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{formatMonthDisplay(month).replace(` ${year}`, '')}</span>
                    {month === selectedMonth && (
                      <div className="w-2 h-2 bg-primary rounded-full ml-2" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};