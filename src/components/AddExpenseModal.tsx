import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useBudgetStore } from '@/store/budgetStore';
import { Expense, ExpenseCategory } from '@/types';

const categories: ExpenseCategory[] = [
  'Groceries',
  'Transport',
  'Bills',
  'Rent',
  'Gym',
  'Entertainment',
  'Other',
];

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingExpense?: Expense | null;
}

export const AddExpenseModal = ({ 
  isOpen, 
  onClose, 
  editingExpense 
}: AddExpenseModalProps) => {
  const [formData, setFormData] = useState({
    date: '',
    category: '' as ExpenseCategory | '',
    description: '',
    amount: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { addExpense, updateExpense, selectedMonth } = useBudgetStore();

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        date: editingExpense.date,
        category: editingExpense.category,
        description: editingExpense.description,
        amount: editingExpense.amount.toString(),
      });
    } else {
      // Set default date to current selected month
      const today = new Date().toISOString().split('T')[0];
      const [currentYear, currentMonth] = selectedMonth.split('-');
      const monthStartDate = `${currentYear}-${currentMonth}-01`;
      
      setFormData({
        date: today >= monthStartDate ? today : monthStartDate,
        category: '',
        description: '',
        amount: '',
      });
    }
  }, [editingExpense, isOpen, selectedMonth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const expenseData = {
        date: formData.date,
        category: formData.category as ExpenseCategory,
        description: formData.description,
        amount: parseFloat(formData.amount),
      };

      if (editingExpense) {
        updateExpense(editingExpense.id, expenseData);
      } else {
        addExpense(expenseData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.date &&
      formData.category &&
      formData.description.trim() &&
      formData.amount &&
      !isNaN(parseFloat(formData.amount)) &&
      parseFloat(formData.amount) > 0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card-elevated border-card-border max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-foreground font-medium">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-input border-input-border text-foreground rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground font-medium">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="pl-8 bg-input border-input-border text-foreground rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground font-medium">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value: ExpenseCategory) => 
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="bg-input border-input-border text-foreground rounded-lg">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent className="bg-card-elevated border-border rounded-lg">
                {categories.map((category) => (
                  <SelectItem 
                    key={category} 
                    value={category}
                    className="text-foreground hover:bg-muted focus:bg-muted rounded-md"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-medium">Description</Label>
            <Textarea
              id="description"
              placeholder="What did you spend money on?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-input border-input-border text-foreground resize-none rounded-lg"
              rows={3}
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border text-foreground hover:bg-muted rounded-lg"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg"
            >
              {isLoading 
                ? 'Saving...' 
                : editingExpense 
                ? 'Update Expense' 
                : 'Add Expense'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};