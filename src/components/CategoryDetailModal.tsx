import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBudgetStore } from '@/store/budgetStore';
import { 
  Calendar, 
  Euro, 
  BarChart3, 
  Clock,
  Calculator
} from 'lucide-react';

interface CategoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string | null;
}

export const CategoryDetailModal = ({ isOpen, onClose, categoryName }: CategoryDetailModalProps) => {
  const { getCurrentMonthData } = useBudgetStore();
  const monthData = getCurrentMonthData();

  // Get expenses for the selected category
  const categoryExpenses = monthData.expenses?.filter(
    expense => expense.category === categoryName
  ) || [];

  // Sort expenses by date (newest first)
  const sortedExpenses = categoryExpenses.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate category statistics
  const totalAmount = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const avgAmount = categoryExpenses.length > 0 ? totalAmount / categoryExpenses.length : 0;
  const percentage = monthData.totalExpenses > 0 ? (totalAmount / monthData.totalExpenses) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };



  // Category emoji mapping
  const getCategoryEmoji = (category: string): string => {
    const categoryEmojiMap: Record<string, string> = {
      'Market': '🛒', 'Ulaşım': '🚗', 'Faturalar': '📱', 'Kira': '🏠', 
      'Spor': '💪', 'Eğlence': '📺', 'Yatırım': '📈', 'Sağlık': '🏥',
      'Eğitim': '📚', 'Giyim': '👕', 'Teknoloji': '💻', 'Restoran': '🍽️',
      'Kafe': '☕', 'Yakıt': '⛽', 'Temizlik': '🧽', 'Kozmetik': '💄',
      'Sigara': '🚬', 'Alkol': '🍺', 'Hediye': '🎁', 'Seyahat': '✈️',
      'Diğer': '💰'
    };
    
    if (categoryEmojiMap[category]) {
      return categoryEmojiMap[category];
    }
    
    const lowerCategory = category.toLowerCase();
    for (const [key, emoji] of Object.entries(categoryEmojiMap)) {
      if (lowerCategory.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerCategory)) {
        return emoji;
      }
    }
    
    return '💰';
  };

  if (!categoryName) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] overflow-hidden bg-card border-border">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-3 text-lg sm:text-xl font-bold text-foreground">
            <div className="text-2xl sm:text-3xl" role="img" aria-label={categoryName}>
              {getCategoryEmoji(categoryName)}
            </div>
            <div>
              <span>{categoryName}</span>
              <p className="text-xs sm:text-sm font-normal text-muted-foreground mt-1">
                Kategori detayları ve harcama geçmişi
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto scrollbar-thin pr-2 space-y-4 sm:space-y-6">
          {/* Category Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-primary flex items-center space-x-2">
                  <Euro className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Toplam Harcama</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-foreground">
                  {formatCurrency(totalAmount)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Bu ay toplam
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-success flex items-center space-x-2">
                  <Calculator className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Ortalama</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-foreground">
                  {formatCurrency(avgAmount)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Gider başına
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-warning flex items-center space-x-2">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Toplam İçinde Payı</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-foreground">
                  {percentage.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {categoryExpenses.length} gider
                </p>
              </CardContent>
            </Card>
          </div>



          {/* Gider Listesi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span>Gider Geçmişi</span>
                <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                  {categoryExpenses.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {sortedExpenses.length === 0 ? (
                <div className="text-center py-8 px-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2 text-sm sm:text-base">Bu kategoride henüz gider yok</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {categoryName} kategorisinde henüz bir harcama kaydı bulunmuyor.
                  </p>
                </div>
              ) : (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="space-y-3">
                    {sortedExpenses.map((expense) => (
                      <div key={expense.id} className="bg-muted/30 rounded-lg p-3 sm:p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground text-sm mb-1">
                              {expense.description}
                            </h4>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 text-xs text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(expense.date)}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(expense.date)}</span>
                              </span>
                            </div>
                            {expense.quantity && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {expense.quantity} {expense.unit || 'adet'} × {formatCurrency(expense.amount / expense.quantity)}
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-base sm:text-lg font-semibold text-foreground">
                              {formatCurrency(expense.amount)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};