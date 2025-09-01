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
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useBudgetStore } from '@/store/budgetStore';
import { Expense, ExpenseCategory } from '@/types';
import { Edit, Trash2, Search, Filter } from 'lucide-react';
import { AddExpenseModal } from './AddExpenseModal';

const categoryColors: Record<string, string> = {
  'Groceries': 'bg-success-light text-success border-success/20',
  'Transport': 'bg-primary-light text-primary border-primary/20',
  'Bills': 'bg-destructive-light text-destructive border-destructive/20',
  'Rent': 'bg-warning-light text-warning border-warning/20',
  'Gym': 'bg-purple-100 text-purple-600 border-purple-200',
  'Entertainment': 'bg-pink-100 text-pink-600 border-pink-200',
  'Other': 'bg-muted text-muted-foreground border-border',
};

const categories: ExpenseCategory[] = [
  'Groceries',
  'Transport', 
  'Bills',
  'Rent',
  'Gym',
  'Entertainment',
  'Other',
];

export const ExpenseTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | 'all'>('all');
  
  const { getCurrentMonthData, deleteExpense } = useBudgetStore();
  const monthData = getCurrentMonthData();
  const expenses = monthData.expenses || [];

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

  // Filter expenses based on search term and category
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Sort by date (newest first)
  const sortedExpenses = filteredExpenses.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <Card className="bg-card border-card-border rounded-xl shadow-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <CardTitle className="text-foreground">Expense History</CardTitle>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-input border-input-border"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={(value: ExpenseCategory | 'all') => setCategoryFilter(value)}>
                <SelectTrigger className="w-48 bg-input border-input-border">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-card-elevated border-border rounded-lg">
                  <SelectItem value="all" className="text-foreground hover:bg-muted focus:bg-muted">
                    All Categories
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      className="text-foreground hover:bg-muted focus:bg-muted"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/30">
                  <TableHead className="text-foreground font-medium">Date</TableHead>
                  <TableHead className="text-foreground font-medium">Category</TableHead>
                  <TableHead className="text-foreground font-medium">Description</TableHead>
                  <TableHead className="text-right text-foreground font-medium">Amount</TableHead>
                  <TableHead className="text-right text-foreground font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={5} 
                      className="text-center text-muted-foreground py-12"
                    >
                      {expenses.length === 0 ? (
                        <div>
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                            <Search className="h-6 w-6" />
                          </div>
                          <p className="font-medium">No expenses recorded yet</p>
                          <p className="text-sm">Add your first expense to get started</p>
                        </div>
                      ) : (
                        <div>
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                            <Filter className="h-6 w-6" />
                          </div>
                          <p className="font-medium">No expenses match your filters</p>
                          <p className="text-sm">Try adjusting your search or category filter</p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedExpenses.map((expense) => (
                    <TableRow 
                      key={expense.id} 
                      className="border-border hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="text-foreground font-medium">
                        {formatDate(expense.date)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={`${categoryColors[expense.category] || 'bg-muted text-muted-foreground'} border`}
                        >
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground max-w-64 truncate">
                        {expense.description}
                      </TableCell>
                      <TableCell className="text-right text-foreground font-semibold">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(expense)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary-light"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(expense.id)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive-light"
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

          {/* Results summary */}
          {expenses.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Showing {sortedExpenses.length} of {expenses.length} expenses
              {(searchTerm || categoryFilter !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                  }}
                  className="ml-2 text-primary hover:text-primary-hover"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
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