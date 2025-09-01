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
  Legend,
} from 'recharts';

const COLORS = [
  'hsl(213, 94%, 68%)',  // Primary blue
  'hsl(142, 76%, 36%)',  // Success green
  'hsl(38, 92%, 50%)',   // Warning yellow
  'hsl(280, 100%, 70%)', // Purple
  'hsl(0, 84%, 60%)',    // Destructive red
  'hsl(47, 96%, 89%)',   // Light yellow
  'hsl(185, 57%, 50%)',  // Cyan
];

export const Charts = () => {
  const { categoryData, weeklyData } = useBudgetStore();

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
        <div className="bg-card-elevated border border-border-elevated rounded-lg p-3 shadow-lg">
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
        <div className="bg-card-elevated border border-border-elevated rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{label}</p>
          <p className="text-primary font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Pie Chart - Expenses by Category */}
      <Card className="bg-card-elevated border-border-elevated">
        <CardHeader>
          <CardTitle className="text-foreground">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percentage }) => `${percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend 
                wrapperStyle={{ color: 'hsl(215, 25%, 95%)' }}
                formatter={(value) => (
                  <span style={{ color: 'hsl(215, 25%, 95%)' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart - Weekly Expense Trend */}
      <Card className="bg-card-elevated border-border-elevated">
        <CardHeader>
          <CardTitle className="text-foreground">Weekly Expense Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(225, 12%, 18%)" 
              />
              <XAxis 
                dataKey="week"
                tick={{ fill: 'hsl(215, 25%, 95%)', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(225, 12%, 18%)' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(215, 25%, 95%)', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(225, 12%, 18%)' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar 
                dataKey="amount" 
                fill="hsl(213, 94%, 68%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};