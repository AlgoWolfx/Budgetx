import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudgetStore } from '@/store/budgetStore';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

  const PieLabel = ({ percentage }: { percentage: number }) => {
    return (
      <text 
        className="fill-foreground" 
        fontSize={12} 
        textAnchor="middle" 
        dominantBaseline="middle"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    );
  };

const COLORS = [
  'hsl(var(--chart-1))',  // Primary teal
  'hsl(var(--chart-2))',  // Success green
  'hsl(var(--chart-3))',  // Warning orange
  'hsl(var(--chart-4))',  // Purple
  'hsl(var(--chart-5))',  // Destructive red
  'hsl(var(--chart-6))',  // Blue
  'hsl(var(--chart-7))',  // Pink
];

export const Charts = () => {
  const { getCategoryData, getDailyData } = useBudgetStore();
  const categoryData = getCategoryData();
  const dailyData = getDailyData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card-elevated border border-border rounded-xl p-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: payload[0].color }}
            />
            <div>
              <p className="text-foreground font-semibold text-sm">{data.category}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-primary font-bold text-lg">{formatCurrency(data.amount)}</p>
                <span className="text-muted-foreground text-sm">({data.percentage.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card-elevated border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">Gün {label}</p>
          <p className="text-primary font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const pieChartData = categoryData.map((item) => ({
    ...item,
    name: item.category,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Modern Donut Chart - Expenses by Category */}
      <Card className="bg-card border-card-border rounded-xl shadow-card overflow-hidden group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground text-xl font-bold flex items-center space-x-2">
              <div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
              <span>Gider Dağılımı</span>
            </CardTitle>
            <div className="text-muted-foreground text-sm">
              {categoryData.length > 0 && (
                <span>{categoryData.length} kategori</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {categoryData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-muted via-muted to-muted/50 flex items-center justify-center shadow-inner">
                  <PieChart className="w-10 h-10 text-muted-foreground/70" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Henüz gider yok</p>
                  <p className="text-sm text-muted-foreground/80">Gider ekleyerek güzel grafikler görün</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Modern Pie Chart */}
              <div className="relative">
                <ResponsiveContainer width="100%" height={340}>
                  <PieChart>
                    <defs>
                      <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15"/>
                      </filter>
                    </defs>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={false}
                      outerRadius={110}
                      innerRadius={65}
                      fill="#8884d8"
                      dataKey="amount"
                      stroke="hsl(var(--background))"
                      strokeWidth={3}
                      filter="url(#drop-shadow)"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Summary */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center bg-card/80 backdrop-blur-sm rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg">
                    <p className="text-xs text-muted-foreground font-medium">Toplam</p>
                    <p className="text-sm font-bold text-foreground">
                      {formatCurrency(categoryData.reduce((sum, item) => sum + item.amount, 0))}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Modern Legend */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground mb-3">Kategoriler</h4>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                  {pieChartData.map((entry, index) => (
                    <div key={entry.category} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200 group">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {entry.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(entry.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart - Daily Expense Trend */}
      <Card className="bg-card border-card-border rounded-xl shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Günlük Harcama Deseni</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <BarChart className="w-8 h-8" />
                </div>
                <p>Gösterilecek günlük veri yok</p>
                <p className="text-sm">Günlük eğilimleri görmek için gider ekleyin</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                />
                <XAxis 
                  dataKey="date"
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickFormatter={(value) => `€${value}`}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};