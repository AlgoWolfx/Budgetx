import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBudgetStore } from '@/store/budgetStore';
import { TrendingUp, TrendingDown, Eye, PieChart, BarChart3, Percent, Calculator, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { CategoryDetailModal } from './CategoryDetailModal';

export const CategoryBadges = () => {
  const getCategoryData = useBudgetStore((state) => state.getCategoryData);
  const getCurrentMonthData = useBudgetStore((state) => state.getCurrentMonthData);
  const getAvailableCategories = useBudgetStore((state) => state.getAvailableCategories);
  const categories = getCategoryData();
  const monthData = getCurrentMonthData();
  const availableCategories = getAvailableCategories();
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Map categories to emojis for better visual representation
  const getCategoryEmoji = (category: string): string => {
    const categoryEmojiMap: Record<string, string> = {
      'Market': '🛒',
      'Ulaşım': '🚗',
      'Faturalar': '📱',
      'Kira': '🏠', 
      'Spor': '💪',
      'Eğlence': '📺',
      'Yatırım': '📈',
      'Sağlık': '🏥',
      'Eğitim': '📚',
      'Giyim': '👕',
      'Teknoloji': '💻',
      'Restoran': '🍽️',
      'Kafe': '☕',
      'Yakıt': '⛽',
      'Temizlik': '🧽',
      'Kozmetik': '💄',
      'Sigara': '🚬',
      'Alkol': '🍺',
      'Hediye': '🎁',
      'Seyahat': '✈️',
      'Diğer': '💰'
    };
    
    // Try exact match first
    if (categoryEmojiMap[category]) {
      return categoryEmojiMap[category];
    }
    
    // Try partial matches for flexibility
    const lowerCategory = category.toLowerCase();
    for (const [key, emoji] of Object.entries(categoryEmojiMap)) {
      if (lowerCategory.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerCategory)) {
        return emoji;
      }
    }
    
    return '💰'; // Default emoji
  };

  // Generate category colors with better contrast and modern gradients
  const getCategoryColor = (category: string) => {
    const colorOptions = [
      'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200 dark:from-emerald-950 dark:to-emerald-900 dark:text-emerald-200 dark:border-emerald-800',
      'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 border-blue-200 dark:from-blue-950 dark:to-blue-900 dark:text-blue-200 dark:border-blue-800',
      'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-800 border-purple-200 dark:from-purple-950 dark:to-purple-900 dark:text-purple-200 dark:border-purple-800',
      'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-800 border-orange-200 dark:from-orange-950 dark:to-orange-900 dark:text-orange-200 dark:border-orange-800',
      'bg-gradient-to-br from-pink-50 to-pink-100 text-pink-800 border-pink-200 dark:from-pink-950 dark:to-pink-900 dark:text-pink-200 dark:border-pink-800',
      'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-800 border-indigo-200 dark:from-indigo-950 dark:to-indigo-900 dark:text-indigo-200 dark:border-indigo-800',
      'bg-gradient-to-br from-teal-50 to-teal-100 text-teal-800 border-teal-200 dark:from-teal-950 dark:to-teal-900 dark:text-teal-200 dark:border-teal-800',
      'bg-gradient-to-br from-red-50 to-red-100 text-red-800 border-red-200 dark:from-red-950 dark:to-red-900 dark:text-red-200 dark:border-red-800',
      'bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200 dark:from-yellow-950 dark:to-yellow-900 dark:text-yellow-200 dark:border-yellow-800',
      'bg-gradient-to-br from-cyan-50 to-cyan-100 text-cyan-800 border-cyan-200 dark:from-cyan-950 dark:to-cyan-900 dark:text-cyan-200 dark:border-cyan-800',
    ];
    
    const index = availableCategories.indexOf(category) % colorOptions.length;
    return colorOptions[index] || 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border-gray-200 dark:from-gray-950 dark:to-gray-900 dark:text-gray-200 dark:border-gray-800';
  };

  // Enhanced category trend analysis
  const getCategoryTrend = (category: any) => {
    const expenseCount = category.count;
    const avgAmount = category.amount / category.count;
    
    if (expenseCount >= 5 && avgAmount > 100) {
      return { 
        icon: TrendingUp, 
        color: 'text-red-500 dark:text-red-400', 
        label: 'Yüksek Aktivite',
        bgColor: 'bg-red-50 dark:bg-red-950/20'
      };
    } else if (expenseCount >= 3) {
      return { 
        icon: BarChart3, 
        color: 'text-orange-500 dark:text-orange-400', 
        label: 'Orta Aktivite',
        bgColor: 'bg-orange-50 dark:bg-orange-950/20'
      };
    } else if (expenseCount === 1) {
      return { 
        icon: TrendingDown, 
        color: 'text-blue-500 dark:text-blue-400', 
        label: 'Düşük Aktivite',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20'
      };
    }
    return {
      icon: Calculator,
      color: 'text-green-500 dark:text-green-400',
      label: 'Normal',
      bgColor: 'bg-green-50 dark:bg-green-950/20'
    };
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedCategory(null);
  };

  if (categories.length === 0) {
    return (
      <>
      <Card className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PieChart className="h-5 w-5 text-primary" />
            </div>
            <span>Kategori Genel Bakışı</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 flex items-center justify-center">
              <PieChart className="h-10 w-10 text-primary/70" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Henüz Kategori Verisi Yok</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Bu ay henüz gider eklenmemiş. Kategori dağılımını görmek için ilk giderinizi ekleyin.
            </p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-lg text-sm text-primary">
              <BarChart3 className="h-4 w-4" />
              <span>Gider eklendikten sonra burada görünecek</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Category Detail Modal for empty state */}
      <CategoryDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleDetailModalClose}
        categoryName={selectedCategory}
      />
      </>
    );
  }

  // Determine how many categories to show initially
  const categoriesToShow = showAll ? categories : categories.slice(0, 6);
  const hasMoreCategories = categories.length > 6;

  return (
    <>
    <Card className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3 text-foreground">
            <div className="p-2.5 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl">
              <PieChart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-lg font-bold">Kategori Genel Bakışı</span>
              <p className="text-sm text-muted-foreground font-normal mt-0.5">
                {categories.length} farklı kategoride toplam harcama
              </p>
            </div>
          </CardTitle>
          <div className="text-right">
            <div className="text-xl font-bold text-foreground">
              {formatCurrency(monthData.totalExpenses)}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
              <Percent className="h-3 w-3" />
              <span>Bu ay toplam</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {categoriesToShow
            .sort((a, b) => b.amount - a.amount)
            .map((category, index) => {
              const trend = getCategoryTrend(category);
              const emoji = getCategoryEmoji(category.category);
              const isTopCategory = index < 3;
              
              return (
                <div
                  key={category.category}
                  onClick={() => handleCategoryClick(category.category)}
                  className={`
                    group relative bg-gradient-to-br from-background/80 to-background/40 
                    border border-border/60 rounded-xl p-5 
                    hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1
                    transition-all duration-300 cursor-pointer
                    ${isTopCategory ? 'ring-1 ring-primary/20 bg-gradient-to-br from-primary/5 to-background/80' : ''}
                  `}
                >
                  {/* Top Category Badge */}
                  {isTopCategory && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-medium px-2 py-1 rounded-full shadow-md">
                      #{index + 1}
                    </div>
                  )}

                  {/* Category Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl transform group-hover:scale-110 transition-transform duration-200" role="img" aria-label={category.category}>
                        {emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground text-base mb-1 group-hover:text-primary transition-colors">
                          {category.category}
                        </h3>
                        <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${trend.bgColor} ${trend.color}`}>
                          <trend.icon className="h-3 w-3" />
                          <span>{trend.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amount Display */}
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {formatCurrency(category.amount)}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-muted-foreground">
                          <strong className="text-foreground">{category.count}</strong> gider
                        </span>
                        <span className="text-muted-foreground">
                          Ort. <strong className="text-foreground">{formatCurrency(category.amount / category.count)}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">Toplam içinde payı</span>
                      <Badge 
                        variant="secondary"
                        className={`${getCategoryColor(category.category)} border text-xs font-semibold`}
                      >
                        {category.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                        style={{ width: `${Math.min(category.percentage, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Details */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span>Detayları gör</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  
                  {/* Subtle hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              );
            })
          }
        </div>
        
        {/* Enhanced Show More/Less Button */}
        {hasMoreCategories && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="group bg-gradient-to-r from-background to-background/80 border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            >
              <Eye className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
              <span className="font-medium">
                {showAll 
                  ? `Daha Az Göster` 
                  : `${categories.length - 6} Kategori Daha Göster`
                }
              </span>
            </Button>
          </div>
        )}
        
        {/* Enhanced Summary Stats */}
        <div className="mt-8 pt-6 border-t border-border/60">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl">
              <div className="text-sm font-semibold text-success mb-1 flex items-center justify-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>En Yüksek</span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {formatCurrency(categories[0]?.amount || 0)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {categories[0]?.category}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
              <div className="text-sm font-semibold text-primary mb-1 flex items-center justify-center space-x-1">
                <Calculator className="h-4 w-4" />
                <span>Ortalama</span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {formatCurrency(monthData.totalExpenses / categories.length)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Kategori başına
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 rounded-xl">
              <div className="text-sm font-semibold text-warning mb-1 flex items-center justify-center space-x-1">
                <BarChart3 className="h-4 w-4" />
                <span>Aktif Kategori</span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {categories.length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Farklı kategori
              </div>
            </div>
          </div>
          
          {/* Additional insights */}
          <div className="mt-6 p-4 bg-gradient-to-r from-muted/30 to-muted/10 border border-border/40 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <PieChart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Harcama Dağılımı Özeti</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  En çok harcama yaptığınız <strong className="text-foreground">{categories[0]?.category}</strong> kategorisi, 
                  toplam harcamanızın <strong className="text-primary">{categories[0]?.percentage.toFixed(1)}%</strong>'ini oluşturuyor.
                  {categories.length >= 3 && (
                    <span>
                      {' '}En az harcama yaptığınız kategori ise <strong className="text-foreground">{categories[categories.length - 1]?.category}</strong>.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    
    {/* Category Detail Modal */}
    <CategoryDetailModal
      isOpen={isDetailModalOpen}
      onClose={handleDetailModalClose}
      categoryName={selectedCategory}
    />
  </>
  );
};