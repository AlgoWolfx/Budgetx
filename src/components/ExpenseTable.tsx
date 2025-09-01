import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBudgetStore } from '@/store/budgetStore';
import { Expense } from '@/types';
import { Edit, Trash2, Plus } from 'lucide-react';
import { AddExpenseModal } from './AddExpenseModal';

const categoryColors: Record<string, string> = {
  'Groceries': 'bg-success/10 text-success',
  'Transport': 'bg-primary/10 text-primary',
  'Bills': 'bg-destructive/10 text-destructive',
  'Rent': 'bg-warning/10 text-warning',
  'Gym': 'bg-purple-500/10 text-purple-400',
  'Entertainment': 'bg-pink-500/10 text-pink-400',
  'Other': 'bg-muted-foreground/10 text-muted-foreground',
};

export const ExpenseTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const { expenses, deleteExpense } = useBudgetStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  return (
    <>
      <Card className="bg-card-elevated border-border-elevated">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Recent Expenses</CardTitle>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-foreground">Date</TableHead>
                  <TableHead className="text-foreground">Category</TableHead>
                  <TableHead className="text-foreground">Description</TableHead>
                  <TableHead className="text-right text-foreground">Amount</TableHead>
                  <TableHead className="text-right text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={5} 
                      className="text-center text-muted-foreground py-8"
                    >
                      No expenses recorded yet. Add your first expense to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow 
                      key={expense.id} 
                      className="border-border hover:bg-muted/50"
                    >
                      <TableCell className="text-foreground">
                        {formatDate(expense.date)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={categoryColors[expense.category] || 'bg-muted text-muted-foreground'}
                        >
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground max-w-48 truncate">
                        {expense.description}
                      </TableCell>
                      <TableCell className="text-right text-foreground font-medium">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(expense)}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(expense.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        editingExpense={editingExpense}
      />
    </>
  );
};