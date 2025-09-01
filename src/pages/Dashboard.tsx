import { useEffect } from 'react';
import { MonthSelector } from '@/components/MonthSelector';
import { IncomeInput } from '@/components/IncomeInput';
import { SummaryCards } from '@/components/SummaryCards';
import { Charts } from '@/components/Charts';
import { InsightsPanel } from '@/components/InsightsPanel';
import { CategoryBadges } from '@/components/CategoryBadges';
import { ExpenseTable } from '@/components/ExpenseTable';
import { useBudgetStore } from '@/store/budgetStore';
import { Button } from '@/components/ui/button';
import { Plus, LogOut } from 'lucide-react';
import { useState } from 'react';
import { AddExpenseModal } from '@/components/AddExpenseModal';

export const Dashboard = () => {
  const { selectedMonth, logout } = useBudgetStore();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const formatMonthDisplay = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="bg-surface border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Month selector and Income Input */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-light rounded-lg">
                <div className="h-6 w-6 bg-primary rounded-sm" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">MyBudget</h1>
            </div>
            <MonthSelector />
            <IncomeInput />
          </div>

          {/* Right: Add Expense Button and Logout */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsExpenseModalOpen(true)}
              className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
            <Button
              variant="outline"
              onClick={logout}
              className="border-border text-foreground hover:bg-muted rounded-lg"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Current Month Display */}
        <div className="max-w-7xl mx-auto mt-2">
          <p className="text-muted-foreground">
            Viewing data for <span className="font-medium text-foreground">{formatMonthDisplay(selectedMonth)}</span>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Summary Cards */}
        <SummaryCards />

        {/* Charts Row */}
        <Charts />

        {/* Category Overview and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CategoryBadges />
          </div>
          <div>
            <InsightsPanel />
          </div>
        </div>

        {/* Expense Table */}
        <ExpenseTable />
      </main>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />
    </div>
  );
};