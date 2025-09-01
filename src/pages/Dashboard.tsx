import { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { SummaryCards } from '@/components/SummaryCards';
import { Charts } from '@/components/Charts';
import { ExpenseTable } from '@/components/ExpenseTable';
import { useBudgetStore } from '@/store/budgetStore';

export const Dashboard = () => {
  const calculateSummaryData = useBudgetStore((state) => state.calculateSummaryData);

  useEffect(() => {
    calculateSummaryData();
  }, [calculateSummaryData]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-surface border-b border-border p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track your expenses and manage your budget
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <SummaryCards />
            <Charts />
            <ExpenseTable />
          </div>
        </main>
      </div>
    </div>
  );
};