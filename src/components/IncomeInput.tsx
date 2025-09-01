import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBudgetStore } from '@/store/budgetStore';
import { DollarSign, Check, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const IncomeInput = () => {
  const { selectedMonth, getCurrentMonthData, setMonthlyIncome } = useBudgetStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempIncome, setTempIncome] = useState('');
  const { toast } = useToast();

  const currentData = getCurrentMonthData();

  useEffect(() => {
    setTempIncome(currentData.income.toString());
    setIsEditing(false);
  }, [selectedMonth, currentData.income]);

  const handleSave = () => {
    const income = parseFloat(tempIncome);
    if (isNaN(income) || income < 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid income amount.",
        variant: "destructive"
      });
      return;
    }

    setMonthlyIncome(selectedMonth, income);
    setIsEditing(false);
    
    toast({
      title: "Income updated",
      description: `Monthly income set to $${income.toFixed(2)}`,
    });
  };

  const handleCancel = () => {
    setTempIncome(currentData.income.toString());
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-3 bg-surface border border-border rounded-lg p-3">
        <DollarSign className="h-5 w-5 text-muted-foreground" />
        <div className="flex items-center space-x-2">
          <Label htmlFor="income" className="text-sm font-medium text-foreground whitespace-nowrap">
            Monthly Income:
          </Label>
          <Input
            id="income"
            type="number"
            step="0.01"
            value={tempIncome}
            onChange={(e) => setTempIncome(e.target.value)}
            className="w-32 h-8 bg-input border-input-border"
            placeholder="0.00"
            autoFocus
          />
          <Button 
            size="sm" 
            onClick={handleSave}
            className="h-8 px-3 bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCancel}
            className="h-8 px-3 border-border text-foreground"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 bg-surface border border-border rounded-lg p-3 hover:bg-surface-elevated transition-colors">
      <DollarSign className="h-5 w-5 text-primary" />
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">Monthly Income:</span>
        <span className="font-semibold text-foreground">
          {formatCurrency(currentData.income)}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <Edit className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};