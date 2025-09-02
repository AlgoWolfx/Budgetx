import { useState } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Wallet, 
  Target,
  Calendar,
  ArrowLeft,
  DollarSign,
  Award,
  AlertTriangle
} from 'lucide-react';

interface AnnualReportProps {
  onBack: () => void;
}

interface MonthlyData {
  month: string;
  monthName: string;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

export const AnnualReport = ({ onBack }: AnnualReportProps) => {
  const { monthlyData, getCategoryData } = useBudgetStore();
  const [selectedYear] = useState(new Date().getFullYear());

  // Calculate annual data
  const calculateAnnualData = () => {
    const yearData: MonthlyData[] = [];
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalSavings = 0;
    const categoryTotals: Record<string, number> = {};

    // Get all months for the selected year
    for (let month = 1; month <= 12; month++) {
      const monthKey = `${selectedYear}-${String(month).padStart(2, '0')}`;
      const data = monthlyData[monthKey];
      
      if (data) {
        const savings = data.income - data.totalExpenses;
        const savingsRate = data.income > 0 ? (savings / data.income) * 100 : 0;
        
        yearData.push({
          month: monthKey,
          monthName: new Date(selectedYear, month - 1).toLocaleDateString('tr-TR', { month: 'short' }),
          income: data.income,
          expenses: data.totalExpenses,
          savings,
          savingsRate
        });

        totalIncome += data.income;
        totalExpenses += data.totalExpenses;
        totalSavings += savings;

        // Aggregate category data
        data.expenses.forEach(expense => {
          categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });
      } else {
        // Add empty data for months without data
        yearData.push({
          month: monthKey,
          monthName: new Date(selectedYear, month - 1).toLocaleDateString('tr-TR', { month: 'short' }),
          income: 0,
          expenses: 0,
          savings: 0,
          savingsRate: 0
        });
      }
    }

    const categoryData: CategoryData[] = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const averageMonthlySavings = yearData.filter(d => d.income > 0).length > 0 
      ? totalSavings / yearData.filter(d => d.income > 0).length 
      : 0;
    
    const averageSavingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

    return {
      yearData,
      categoryData,
      totalIncome,
      totalExpenses,
      totalSavings,
      averageMonthlySavings,
      averageSavingsRate,
      bestSavingsMonth: yearData.reduce((max, month) => month.savings > max.savings ? month : max, yearData[0]),
      worstSpendingMonth: yearData.reduce((max, month) => month.expenses > max.expenses ? month : max, yearData[0])
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const annualData = calculateAnnualData();

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--chart-6))',
    'hsl(var(--chart-7))'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Ana Sayfa</span>
                <span className="sm:hidden">Geri</span>
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {selectedYear} Yıllık Rapor
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Detaylı finansal analiz ve tasarruf raporu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Toplam Gelir</span>
                <span className="sm:hidden">Gelir</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{formatCurrency(annualData.totalIncome)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="hidden sm:inline">Ortalama: {formatCurrency(annualData.totalIncome / 12)}/ay</span>
                <span className="sm:hidden">{formatCurrency(annualData.totalIncome / 12)}/ay</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
                <Wallet className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Toplam Harcama</span>
                <span className="sm:hidden">Harcama</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{formatCurrency(annualData.totalExpenses)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="hidden sm:inline">Ortalama: {formatCurrency(annualData.totalExpenses / 12)}/ay</span>
                <span className="sm:hidden">{formatCurrency(annualData.totalExpenses / 12)}/ay</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
                <PiggyBank className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Toplam Tasarruf</span>
                <span className="sm:hidden">Tasarruf</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-success">{formatCurrency(annualData.totalSavings)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="hidden sm:inline">Ortalama: {formatCurrency(annualData.averageMonthlySavings)}/ay</span>
                <span className="sm:hidden">{formatCurrency(annualData.averageMonthlySavings)}/ay</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
                <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Tasarruf Oranı</span>
                <span className="sm:hidden">Oran</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{annualData.averageSavingsRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {annualData.averageSavingsRate >= 20 ? 'Mükemmel!' : annualData.averageSavingsRate >= 10 ? 'İyi' : 'İyileştirilebilir'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Monthly Savings Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span>Aylık Tasarruf Trendi</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={annualData.yearData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="monthName" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `€${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Tasarruf']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="hsl(var(--success))" 
                    fill="hsl(var(--success))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Income vs Expenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                <BarChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span>Gelir vs Harcama</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={annualData.yearData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="monthName"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `€${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value), 
                      name === 'income' ? 'Gelir' : 'Harcama'
                    ]}
                  />
                  <Bar dataKey="income" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Category Spending */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span>Kategori Bazlı Harcamalar</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={annualData.categoryData.slice(0, 7)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="amount"
                    >
                      {annualData.categoryData.slice(0, 7).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Harcama']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 w-full">
                  {annualData.categoryData.slice(0, 7).map((category, index) => (
                    <div key={category.category} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-xs sm:text-sm text-foreground font-medium truncate">{category.category}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {category.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span>Önemli İçgörüler</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
                  <span className="text-xs sm:text-sm font-medium text-success">En İyi Tasarruf Ayı</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground">
                  <span className="font-semibold">{annualData.bestSavingsMonth?.monthName}</span> ayında{' '}
                  <span className="font-bold text-success">
                    {formatCurrency(annualData.bestSavingsMonth?.savings || 0)}
                  </span> tasarruf yaptınız.
                </p>
              </div>

              <div className="p-3 sm:p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
                  <span className="text-xs sm:text-sm font-medium text-warning">En Çok Harcama Ayı</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground">
                  <span className="font-semibold">{annualData.worstSpendingMonth?.monthName}</span> ayında{' '}
                  <span className="font-bold text-warning">
                    {formatCurrency(annualData.worstSpendingMonth?.expenses || 0)}
                  </span> harcama yaptınız.
                </p>
              </div>

              <div className="p-3 sm:p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-primary">En Büyük Harcama Kategorisi</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground">
                  <span className="font-semibold">{annualData.categoryData[0]?.category}</span> kategorisinde{' '}
                  <span className="font-bold text-primary">
                    {formatCurrency(annualData.categoryData[0]?.amount || 0)}
                  </span> harcadınız.
                </p>
              </div>

              {annualData.averageSavingsRate >= 20 && (
                <div className="p-3 sm:p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
                    <span className="text-xs sm:text-sm font-medium text-success">Mükemmel Tasarruf!</span>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground">
                    %{annualData.averageSavingsRate.toFixed(1)} tasarruf oranınız ile harika bir performans sergiliyorsunuz!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monthly Details Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span>Aylık Detaylar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mobile View - Cards */}
            <div className="block sm:hidden space-y-3">
              {annualData.yearData.map((month) => (
                <div key={month.month} className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="font-medium text-foreground text-sm">
                    {new Date(month.month + '-01').toLocaleDateString('tr-TR', { 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Gelir:</span>
                      <div className="font-medium text-foreground">
                        {month.income > 0 ? formatCurrency(month.income) : '-'}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Harcama:</span>
                      <div className="font-medium text-foreground">
                        {month.expenses > 0 ? formatCurrency(month.expenses) : '-'}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tasarruf:</span>
                      <div className={`font-medium ${
                        month.savings > 0 ? 'text-success' : month.savings < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {month.income > 0 ? formatCurrency(month.savings) : '-'}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Oran:</span>
                      <div className={`font-medium ${
                        month.savingsRate >= 20 ? 'text-success' : month.savingsRate >= 10 ? 'text-warning' : 'text-destructive'
                      }`}>
                        {month.income > 0 ? `${month.savingsRate.toFixed(1)}%` : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop View - Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Ay</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Gelir</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Harcama</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Tasarruf</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Tasarruf Oranı</th>
                  </tr>
                </thead>
                <tbody>
                  {annualData.yearData.map((month) => (
                    <tr key={month.month} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-3 px-4 text-foreground font-medium">
                        {new Date(month.month + '-01').toLocaleDateString('tr-TR', { 
                          month: 'long',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-4 text-right text-foreground">
                        {month.income > 0 ? formatCurrency(month.income) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right text-foreground">
                        {month.expenses > 0 ? formatCurrency(month.expenses) : '-'}
                      </td>
                      <td className={`py-3 px-4 text-right font-medium ${
                        month.savings > 0 ? 'text-success' : month.savings < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {month.income > 0 ? formatCurrency(month.savings) : '-'}
                      </td>
                      <td className={`py-3 px-4 text-right font-medium ${
                        month.savingsRate >= 20 ? 'text-success' : month.savingsRate >= 10 ? 'text-warning' : 'text-destructive'
                      }`}>
                        {month.income > 0 ? `${month.savingsRate.toFixed(1)}%` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};