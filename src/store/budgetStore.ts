import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BudgetState, Expense, ExpenseCategory } from '@/types';

const mockExpenses: Expense[] = [
  { id: '1', date: '2024-01-15', category: 'Groceries', description: 'Weekly grocery shopping', amount: 125.50 },
  { id: '2', date: '2024-01-14', category: 'Transport', description: 'Metro monthly pass', amount: 85.00 },
  { id: '3', date: '2024-01-13', category: 'Bills', description: 'Internet & Mobile', amount: 89.99 },
  { id: '4', date: '2024-01-12', category: 'Entertainment', description: 'Netflix subscription', amount: 15.99 },
  { id: '5', date: '2024-01-11', category: 'Gym', description: 'Fitness membership', amount: 49.99 },
  { id: '6', date: '2024-01-10', category: 'Groceries', description: 'Fresh produce', amount: 45.30 },
  { id: '7', date: '2024-01-09', category: 'Entertainment', description: 'Movie tickets', amount: 32.00 },
  { id: '8', date: '2024-01-08', category: 'Transport', description: 'Uber rides', amount: 28.50 },
  { id: '9', date: '2024-01-07', category: 'Bills', description: 'Electricity bill', amount: 78.45 },
  { id: '10', date: '2024-01-06', category: 'Groceries', description: 'Household items', amount: 67.20 },
  { id: '11', date: '2024-01-05', category: 'Entertainment', description: 'Spotify premium', amount: 9.99 },
  { id: '12', date: '2024-01-04', category: 'Transport', description: 'Gas station', amount: 55.00 },
];

const mockIncome = 5500; // Monthly income

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      monthlyData: {
        income: mockIncome,
        totalExpenses: 0,
        remainingBalance: 0,
        savingsRate: 0,
      },
      expenses: mockExpenses,
      categoryData: [],
      weeklyData: [],

      login: (password: string) => {
        if (password === 'budget123') {
          set({ isAuthenticated: true });
          get().calculateSummaryData();
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false });
      },

      addExpense: (newExpense) => {
        const expense: Expense = {
          ...newExpense,
          id: Date.now().toString(),
        };
        set((state) => ({
          expenses: [expense, ...state.expenses],
        }));
        get().calculateSummaryData();
      },

      updateExpense: (id, updatedExpense) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updatedExpense } : expense
          ),
        }));
        get().calculateSummaryData();
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
        get().calculateSummaryData();
      },

      calculateSummaryData: () => {
        const { expenses } = get();
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const remainingBalance = mockIncome - totalExpenses;
        const savingsRate = ((remainingBalance / mockIncome) * 100);

        // Calculate category data
        const categoryTotals = expenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {} as Record<ExpenseCategory, number>);

        const categoryData = Object.entries(categoryTotals).map(([category, amount]) => ({
          category: category as ExpenseCategory,
          amount,
          percentage: (amount / totalExpenses) * 100,
        }));

        // Calculate weekly data (last 4 weeks)
        const now = new Date();
        const weeklyData = Array.from({ length: 4 }, (_, i) => {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - (i + 1) * 7);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          
          const weekExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= weekStart && expenseDate <= weekEnd;
          });
          
          const weekAmount = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
          
          return {
            week: `Week ${4 - i}`,
            amount: weekAmount,
          };
        }).reverse();

        set({
          monthlyData: {
            income: mockIncome,
            totalExpenses,
            remainingBalance,
            savingsRate,
          },
          categoryData,
          weeklyData,
        });
      },
    }),
    {
      name: 'budget-storage',
      partialize: (state) => ({ 
        expenses: state.expenses,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);