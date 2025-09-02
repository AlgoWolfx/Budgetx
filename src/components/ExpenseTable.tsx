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
import { Edit, Trash2, Search, Filter, Plus, Calendar, ArrowUpDown, X } from 'lucide-react';
import { AddExpenseModal } from './AddExpenseModal';

export const ExpenseTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  const { getCurrentMonthData, deleteExpense, getAvailableCategories } = useBudgetStore();
  const monthData = getCurrentMonthData();
  const expenses = monthData.expenses || [];
  const availableCategories = getAvailableCategories();

  // Generate category colors dynamically
  const getCategoryColor = (category: string) => {
    const colorOptions = [
      'bg-success-light text-success border-success/20',
      'bg-primary-light text-primary border-primary/20', 
      'bg-destructive-light text-destructive border-destructive/20',
      'bg-warning-light text-warning border-warning/20',
      'bg-purple-100 text-purple-600 border-purple-200',
      'bg-pink-100 text-pink-600 border-pink-200',
      'bg-blue-100 text-blue-600 border-blue-200',
      'bg-green-100 text-green-600 border-green-200',
      'bg-yellow-100 text-yellow-600 border-yellow-200',
      'bg-indigo-100 text-indigo-600 border-indigo-200',
    ];
    
    const index = availableCategories.indexOf(category) % colorOptions.length;
    return colorOptions[index] || 'bg-muted text-muted-foreground border-border';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
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
    if (confirm('Bu gideri silmek istediğinizden emin misiniz?')) {
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

  // Sort expenses
  const sortedExpenses = filteredExpenses.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: 'date' | 'amount' | 'category') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
  };

  const hasActiveFilters = searchTerm !== '' || categoryFilter !== 'all';

  // Mobile card component for individual expenses
  const ExpenseCard = ({ expense }: { expense: Expense }) => (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Badge 
              variant="secondary"
              className={`${getCategoryColor(expense.category)} border text-xs`}
            >
              {expense.category}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(expense.date)}
            </span>
          </div>
          
          <h3 className="font-medium text-foreground text-sm mb-1">
            {expense.description}
          </h3>
          
          {expense.quantity && (
            <p className="text-xs text-muted-foreground">
              {expense.quantity} {expense.unit || 'adet'} × {formatCurrency(expense.amount / expense.quantity)}
            </p>
          )}
        </div>
        
        <div className="text-right">
          <div className="text-lg font-semibold text-foreground">
            {formatCurrency(expense.amount)}
          </div>
          <div className="flex space-x-1 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(expense)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(expense.id)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Card className="bg-card border-border rounded-xl">
        <CardHeader>
          <div className="flex flex-col space-y-4">
            {/* Header with title and add button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-foreground">Gider Geçmişi</CardTitle>
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  {expenses.length}
                </Badge>
              </div>
              
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Yeni Gider</span>
                <span className="sm:hidden">Ekle</span>
              </Button>
            </div>
            
            {/* Filters and search */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Giderlerde ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              {/* Category filter */}
              <Select value={categoryFilter} onValueChange={(value: ExpenseCategory | 'all') => setCategoryFilter(value)}>
                <SelectTrigger className="w-full sm:w-48 bg-background border-border">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-lg">
                  <SelectItem value="all" className="text-foreground hover:bg-muted focus:bg-muted">
                    Tüm Kategoriler
                  </SelectItem>
                  {availableCategories.map((category) => (
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
              
              {/* Sort options */}
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [field, order] = value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(field);
                setSortOrder(order);
              }}>
                <SelectTrigger className="w-full sm:w-44 bg-background border-border">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-lg">
                  <SelectItem value="date-desc" className="text-foreground hover:bg-muted">
                    En Yeni
                  </SelectItem>
                  <SelectItem value="date-asc" className="text-foreground hover:bg-muted">
                    En Eski
                  </SelectItem>
                  <SelectItem value="amount-desc" className="text-foreground hover:bg-muted">
                    En Yüksek Tutar
                  </SelectItem>
                  <SelectItem value="amount-asc" className="text-foreground hover:bg-muted">
                    En Düşük Tutar
                  </SelectItem>
                  <SelectItem value="category-asc" className="text-foreground hover:bg-muted">
                    Kategori A-Z
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {/* Clear filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border-border hover:bg-muted"
                >
                  <X className="h-4 w-4 mr-2" />
                  Temizle
                </Button>
              )}
            </div>
            
            {/* Results info */}
            {hasActiveFilters && (
              <div className="text-sm text-muted-foreground">
                {expenses.length} giderden {sortedExpenses.length} tanesi gösteriliyor
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {sortedExpenses.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              {expenses.length === 0 ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">Henüz gider kaydı yok</h3>
                  <p className="text-muted-foreground mb-6">Başlamak için ilk giderinizi ekleyin</p>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    İlk Giderinizi Ekleyin
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">Filtrelerinizle eşleşen gider yok</h3>
                  <p className="text-muted-foreground mb-6">Arama veya filtrelerinizi ayarlamayı deneyin</p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="border-border hover:bg-muted"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Filtreleri Temizle
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden space-y-3">
                {sortedExpenses.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden sm:block rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-muted/30">
                      <TableHead 
                        className="text-foreground font-medium cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('date')}
                      >
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Tarih</span>
                          {sortBy === 'date' && (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-foreground font-medium cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('category')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Kategori</span>
                          {sortBy === 'category' && (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-foreground font-medium">Açıklama</TableHead>
                      <TableHead 
                        className="text-right text-foreground font-medium cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('amount')}
                      >
                        <div className="flex items-center justify-end space-x-1">
                          <span>Miktar</span>
                          {sortBy === 'amount' && (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right text-foreground font-medium">Eylemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedExpenses.map((expense) => (
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
                            className={`${getCategoryColor(expense.category)} border`}
                          >
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground max-w-64">
                          <div>
                            <div className="truncate">{expense.description}</div>
                            {expense.quantity && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {expense.quantity} {expense.unit || 'adet'} × {formatCurrency(expense.amount / expense.quantity)}
                              </div>
                            )}
                          </div>
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
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(expense.id)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Summary */}
              <div className="mt-4 text-sm text-muted-foreground text-center">
                Toplam: {formatCurrency(sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0))}
                {hasActiveFilters && (
                  <span className="ml-2">
                    ({sortedExpenses.length}/{expenses.length} gider)
                  </span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        editingExpense={editingExpense}
      />
      
      {/* Yeni Gider Ekleme Modalı */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
};