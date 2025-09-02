import { useEffect, useState } from 'react';
import { MonthSelector } from '@/components/MonthSelector';
import { IncomeInput } from '@/components/IncomeInput';
import { SummaryCards } from '@/components/SummaryCards';
import { Charts } from '@/components/Charts';
import { CategoryBadges } from '@/components/CategoryBadges';
import { ExpenseTable } from '@/components/ExpenseTable';
import { QuickExpensePanel } from '@/components/QuickExpensePanel';
import { ThemeToggle } from '../components/ThemeToggle';
import { AnnualReport } from '@/pages/AnnualReport';
import { useBudgetStore } from '@/store/budgetStore';
import { Button } from '@/components/ui/button';
import { LogOut, FileText } from 'lucide-react';

export const Dashboard = () => {
  const { selectedMonth, logout } = useBudgetStore();
  const [showAnnualReport, setShowAnnualReport] = useState(false);

  const formatMonthDisplay = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('tr-TR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (showAnnualReport) {
    return <AnnualReport onBack={() => setShowAnnualReport(false)} />;
  }



  return (
    <div className="min-h-screen bg-background">
      {/* Non-sticky Navbar - Mobile Responsive */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Navbar Row */}
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand + Month Selector */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Brand */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-foreground">
                    LifeManagement
                  </h1>
                  <p className="text-xs text-muted-foreground">Finansal Yönetim</p>
                </div>
              </div>
              
              {/* Month Selector - Hidden on mobile, shown on md+ */}
              <div className="hidden md:block">
                <MonthSelector />
              </div>
            </div>

            {/* Right: Action Buttons + Theme Toggle + Logout */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              {/* Annual Report Button */}
              <button
                onClick={() => setShowAnnualReport(true)}
                className="flex items-center space-x-2 px-3 py-2 text-blue-700 dark:text-blue-300 hover:bg-muted rounded-lg transition-colors"
                title="Yıllık Rapor"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden lg:block text-sm font-medium">Yıllık Rapor</span>
              </button>

              {/* Separator */}
              <div className="hidden lg:block h-6 w-px bg-border mx-2" />

              {/* Theme Toggle - Embedded inline */}
              <div className="flex items-center px-2">
                <ThemeToggle />
              </div>

              {/* Logout Button - Far Right */}
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 text-red-700 dark:text-red-300 hover:bg-muted rounded-lg transition-colors ml-2"
                title="Çıkış Yap"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block text-sm font-medium">Çıkış</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Month Selector */}
          <div className="md:hidden pb-4">
            <MonthSelector />
          </div>
          
          {/* Income Section + Status */}
          <div className="border-t border-border py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Income Display */}
              <div className="flex-1 lg:max-w-md">
                <IncomeInput />
              </div>
              
              {/* Current Month + Status */}
              <div className="flex items-center justify-between lg:justify-end space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium text-foreground">
                    {formatMonthDisplay(selectedMonth)}
                  </span>
                </div>
                
                {/* Status Indicators */}
                <div className="hidden sm:flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Aktif</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Senkronize</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Summary Cards */}
        <SummaryCards />

        {/* Charts Row */}
        <Charts />

        {/* Category Overview */}
        <CategoryBadges />

        {/* Quick Expense Panel - Above Expense Table */}
        <QuickExpensePanel />

        {/* Expense Table */}
        <ExpenseTable />
      </main>
    </div>
  );
};