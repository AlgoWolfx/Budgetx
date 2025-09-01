import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBudgetStore } from '@/store/budgetStore';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  AlertTriangle,
  BarChart3
} from 'lucide-react';

const insightIcons = {
  achievement: Award,
  warning: AlertTriangle,
  comparison: TrendingUp,
  trend: BarChart3,
};

const insightColors = {
  achievement: 'bg-success-light text-success border-success/20',
  warning: 'bg-warning-light text-warning border-warning/20',
  comparison: 'bg-primary-light text-primary border-primary/20',
  trend: 'bg-accent text-accent-strong border-accent-strong/20',
};

export const InsightsPanel = () => {
  const getInsights = useBudgetStore((state) => state.getInsights);
  const insights = getInsights();

  if (insights.length === 0) {
    return (
      <Card className="bg-card border-card-border rounded-xl shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Smart Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Add more expenses to generate personalized insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-card-border rounded-xl shadow-card">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span>Smart Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insightIcons[insight.type];
          const colorClass = insightColors[insight.type];
          
          return (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 bg-surface rounded-lg border border-border hover:bg-surface-elevated transition-colors"
            >
              <div className={`p-2 rounded-lg ${colorClass.replace('text-', 'bg-').replace('border-', '')} bg-opacity-20`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-foreground leading-relaxed">
                  {insight.message}
                </p>
                <Badge 
                  variant="secondary" 
                  className={`${colorClass} text-xs border`}
                >
                  {insight.type}
                </Badge>
              </div>
            </div>
          );
        })}
        
        {insights.length < 3 && (
          <div className="text-xs text-muted-foreground text-center py-2 border-t border-border">
            More insights will appear as you track additional expenses
          </div>
        )}
      </CardContent>
    </Card>
  );
};