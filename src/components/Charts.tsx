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

const COLORS = [
  'hsl(174, 62%, 47%)',  // Primary teal
  'hsl(142, 52%, 45%)',  // Success green
  'hsl(38, 82%, 55%)',   // Warning orange
  'hsl(262, 52%, 65%)',  // Purple
  'hsl(0, 72%, 58%)',    // Destructive red
  'hsl(200, 82%, 55%)',  // Blue
  'hsl(320, 52%, 65%)',  // Pink
];

export const Charts = () => {
  const { getCategoryData, getDailyData } = useBudgetStore();
  const categoryData = getCategoryData();
  const dailyData = getDailyData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card-elevated border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{data.category}</p>
          <p className="text-primary font-bold">{formatCurrency(data.amount)}</p>
          <p className="text-muted-foreground text-sm">{data.percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card-elevated border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">Day {label}</p>
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
      {/* Donut Chart - Expenses by Category */}
      <Card className="bg-card border-card-border rounded-xl shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Expense Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <PieChart className="w-8 h-8" />
                </div>
                <p>No expenses to display</p>
                <p className="text-sm">Add expenses to see the breakdown</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${percentage.toFixed(0)}%`}
                  outerRadius={90}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart - Daily Expense Trend */}
      <Card className="bg-card border-card-border rounded-xl shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground">Daily Spending Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <BarChart className="w-8 h-8" />
                </div>
                <p>No daily data to display</p>
                <p className="text-sm">Add expenses to see daily trends</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(220, 8%, 88%)" 
                />
                <XAxis 
                  dataKey="date"
                  tick={{ fill: 'hsl(240, 10%, 12%)', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(220, 8%, 88%)' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(240, 10%, 12%)', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(220, 8%, 88%)' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="hsl(174, 62%, 47%)"
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