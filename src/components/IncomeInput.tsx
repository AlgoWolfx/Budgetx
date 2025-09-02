import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBudgetStore } from '@/store/budgetStore';
import { DollarSign, Edit, Settings, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { IncomeManagementModal } from './IncomeManagementModal';

export const IncomeInput = () => {
  const { selectedMonth, getCurrentMonthData, getMonthIncomeEntries } = useBudgetStore();
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const { toast } = useToast();

  const currentData = getCurrentMonthData();
  const incomeEntries = getMonthIncomeEntries(selectedMonth);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getIncomeStatusText = () => {
    if (incomeEntries.length === 0) {
      return 'Gelir girişi yok';
    } else if (incomeEntries.length === 1) {
      return '1 gelir girişi';
    } else {
      return `${incomeEntries.length} gelir girişi`;
    }
  };

  return (
    <>
      <div 
        className="flex items-center space-x-3 bg-card border border-border rounded-lg p-3 hover:border-border/80 transition-colors duration-200 cursor-pointer"
        onClick={() => setShowIncomeModal(true)}
      >
        <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg">
          <DollarSign className="h-5 w-5 text-success" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Aylık Gelir
            </span>
            <span className="text-lg font-semibold text-foreground">
              {formatCurrency(currentData.income)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 mt-1">
            <TrendingUp className="h-3 w-3 text-success" />
            <span className="text-xs text-muted-foreground">
              {getIncomeStatusText()}
            </span>
          </div>
        </div>
        
        <div className="p-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors duration-200">
          <Settings className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>

      <IncomeManagementModal
        isOpen={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        month={selectedMonth}
      />
    </>
  );
};