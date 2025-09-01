import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BudgetState, Expense, ExpenseCategory, MonthlyData, CategorySummary, DailyExpense, MonthlyInsight, MonthlyReport } from '@/types';

// Generate mock data for 3 months
const generateMockData = () => {
  const currentDate = new Date();
  const months = [];
  
  for (let i = 2; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.push(monthKey);
  }

  const mockExpensesByMonth = {
    [months[0]]: [ // 2 months ago
      { id: '1', date: `${months[0]}-15`, category: 'Groceries' as ExpenseCategory, description: 'Weekly grocery shopping', amount: 145.50 },
      { id: '2', date: `${months[0]}-14`, category: 'Transport' as ExpenseCategory, description: 'Metro monthly pass', amount: 85.00 },
      { id: '3', date: `${months[0]}-13`, category: 'Bills' as ExpenseCategory, description: 'Internet & Mobile', amount: 89.99 },
      { id: '4', date: `${months[0]}-12`, category: 'Entertainment' as ExpenseCategory, description: 'Netflix subscription', amount: 15.99 },
      { id: '5', date: `${months[0]}-11`, category: 'Rent' as ExpenseCategory, description: 'Monthly rent', amount: 1200.00 },
      { id: '6', date: `${months[0]}-10`, category: 'Groceries' as ExpenseCategory, description: 'Fresh produce', amount: 65.30 },
      { id: '7', date: `${months[0]}-09`, category: 'Gym' as ExpenseCategory, description: 'Fitness membership', amount: 49.99 },
      { id: '8', date: `${months[0]}-08`, category: 'Transport' as ExpenseCategory, description: 'Uber rides', amount: 28.50 },
    ],
    [months[1]]: [ // 1 month ago
      { id: '9', date: `${months[1]}-16`, category: 'Groceries' as ExpenseCategory, description: 'Costco bulk shopping', amount: 178.25 },
      { id: '10', date: `${months[1]}-15`, category: 'Bills' as ExpenseCategory, description: 'Electricity bill', amount: 95.45 },
      { id: '11', date: `${months[1]}-14`, category: 'Entertainment' as ExpenseCategory, description: 'Movie night', amount: 45.00 },
      { id: '12', date: `${months[1]}-13`, category: 'Transport' as ExpenseCategory, description: 'Gas station', amount: 68.00 },
      { id: '13', date: `${months[1]}-12`, category: 'Rent' as ExpenseCategory, description: 'Monthly rent', amount: 1200.00 },
      { id: '14', date: `${months[1]}-10`, category: 'Groceries' as ExpenseCategory, description: 'Local market', amount: 42.80 },
      { id: '15', date: `${months[1]}-09`, category: 'Gym' as ExpenseCategory, description: 'Personal training', amount: 75.00 },
      { id: '16', date: `${months[1]}-08`, category: 'Other' as ExpenseCategory, description: 'Pharmacy', amount: 23.50 },
    ],
    [months[2]]: [ // Current month
      { id: '17', date: `${months[2]}-10`, category: 'Groceries' as ExpenseCategory, description: 'Weekly groceries', amount: 125.75 },
      { id: '18', date: `${months[2]}-09`, category: 'Bills' as ExpenseCategory, description: 'Internet bill', amount: 59.99 },
      { id: '19', date: `${months[2]}-08`, category: 'Entertainment' as ExpenseCategory, description: 'Spotify premium', amount: 9.99 },
      { id: '20', date: `${months[2]}-07`, category: 'Transport' as ExpenseCategory, description: 'Monthly metro pass', amount: 85.00 },
      { id: '21', date: `${months[2]}-05`, category: 'Rent' as ExpenseCategory, description: 'Monthly rent', amount: 1200.00 },
      { id: '22', date: `${months[2]}-04`, category: 'Gym' as ExpenseCategory, description: 'Gym membership', amount: 49.99 },
      { id: '23', date: `${months[2]}-03`, category: 'Groceries' as ExpenseCategory, description: 'Organic produce', amount: 87.20 },
    ]
  };

  const incomeByMonth = {
    [months[0]]: 4800,
    [months[1]]: 5200,
    [months[2]]: 5500,
  };

  return { mockExpensesByMonth, incomeByMonth, months };
};

const { mockExpensesByMonth, incomeByMonth, months } = generateMockData();

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      selectedMonth: months[2], // Current month
      monthlyData: {},

      login: (password: string) => {
        if (password === 'budget123') {
          set({ isAuthenticated: true });
          // Initialize monthly data for all months
          months.forEach(month => {
            get().calculateMonthlyData(month);
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false });
      },

      setSelectedMonth: (month: string) => {
        set({ selectedMonth: month });
        get().calculateMonthlyData(month);
      },

      setMonthlyIncome: (month: string, income: number) => {
        set((state) => ({
          monthlyData: {
            ...state.monthlyData,
            [month]: {
              ...state.monthlyData[month],
              income,
              remainingBalance: income - (state.monthlyData[month]?.totalExpenses || 0),
              savingsRate: ((income - (state.monthlyData[month]?.totalExpenses || 0)) / income) * 100
            }
          }
        }));
      },

      addExpense: (newExpense) => {
        const { selectedMonth } = get();
        const expense: Expense = {
          ...newExpense,
          id: Date.now().toString(),
        };
        
        // Add to mock data for the selected month
        mockExpensesByMonth[selectedMonth] = [expense, ...(mockExpensesByMonth[selectedMonth] || [])];
        get().calculateMonthlyData(selectedMonth);
      },

      updateExpense: (id, updatedExpense) => {
        const { selectedMonth } = get();
        mockExpensesByMonth[selectedMonth] = mockExpensesByMonth[selectedMonth]?.map((expense) =>
          expense.id === id ? { ...expense, ...updatedExpense } : expense
        ) || [];
        get().calculateMonthlyData(selectedMonth);
      },

      deleteExpense: (id) => {
        const { selectedMonth } = get();
        mockExpensesByMonth[selectedMonth] = mockExpensesByMonth[selectedMonth]?.filter((expense) => expense.id !== id) || [];
        get().calculateMonthlyData(selectedMonth);
      },

      calculateMonthlyData: (month: string) => {
        const expenses = mockExpensesByMonth[month] || [];
        const income = incomeByMonth[month] || 0;
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const remainingBalance = income - totalExpenses;
        const savingsRate = income > 0 ? (remainingBalance / income) * 100 : 0;

        set((state) => ({
          monthlyData: {
            ...state.monthlyData,
            [month]: {
              income,
              expenses,
              totalExpenses,
              remainingBalance,
              savingsRate,
            }
          }
        }));
      },

      getCurrentMonthData: () => {
        const { selectedMonth, monthlyData } = get();
        return monthlyData[selectedMonth] || {
          income: 0,
          expenses: [],
          totalExpenses: 0,
          remainingBalance: 0,
          savingsRate: 0,
        };
      },

      getCategoryData: (): CategorySummary[] => {
        const monthData = get().getCurrentMonthData();
        if (!monthData.expenses.length) return [];

        const categoryTotals = monthData.expenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {} as Record<ExpenseCategory, number>);

        const categoryCount = monthData.expenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + 1;
          return acc;
        }, {} as Record<ExpenseCategory, number>);

        return Object.entries(categoryTotals).map(([category, amount]) => ({
          category: category as ExpenseCategory,
          amount,
          percentage: (amount / monthData.totalExpenses) * 100,
          count: categoryCount[category as ExpenseCategory] || 0,
        }));
      },

      getDailyData: (): DailyExpense[] => {
        const monthData = get().getCurrentMonthData();
        const dailyTotals = monthData.expenses.reduce((acc, expense) => {
          const day = expense.date.split('-')[2];
          acc[day] = (acc[day] || 0) + expense.amount;
          return acc;
        }, {} as Record<string, number>);

        return Object.entries(dailyTotals)
          .map(([day, amount]) => ({
            date: day,
            amount,
          }))
          .sort((a, b) => parseInt(a.date) - parseInt(b.date));
      },

      getInsights: (): MonthlyInsight[] => {
        const { selectedMonth, monthlyData } = get();
        const currentData = monthlyData[selectedMonth];
        
        if (!currentData) return [];

        const insights: MonthlyInsight[] = [];
        
        // Compare with previous month
        const currentMonthIndex = months.indexOf(selectedMonth);
        if (currentMonthIndex > 0) {
          const prevMonth = months[currentMonthIndex - 1];
          const prevData = monthlyData[prevMonth];
          
          if (prevData) {
            const expenseChange = ((currentData.totalExpenses - prevData.totalExpenses) / prevData.totalExpenses) * 100;
            if (Math.abs(expenseChange) > 5) {
              insights.push({
                type: expenseChange > 0 ? 'warning' : 'achievement',
                message: `Total expenses ${expenseChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(expenseChange).toFixed(1)}% vs last month.`
              });
            }
          }
        }

        // Savings rate insight
        if (currentData.savingsRate >= 20) {
          insights.push({
            type: 'achievement',
            message: `Excellent! You saved ${currentData.savingsRate.toFixed(1)}% of your income this month.`
          });
        } else if (currentData.savingsRate < 10) {
          insights.push({
            type: 'warning',
            message: `Your savings rate is ${currentData.savingsRate.toFixed(1)}%. Consider reducing expenses.`
          });
        }

        // Top category insight
        const categories = get().getCategoryData();
        if (categories.length > 0) {
          const topCategory = categories.sort((a, b) => b.amount - a.amount)[0];
          insights.push({
            type: 'trend',
            message: `${topCategory.category} is your largest expense category at $${topCategory.amount.toFixed(2)} (${topCategory.percentage.toFixed(1)}%).`
          });
        }

        return insights.slice(0, 4); // Limit to 4 insights
      },

      getMonthlyReports: (): MonthlyReport[] => {
        const { monthlyData } = get();
        
        return months.map(month => {
          const data = monthlyData[month];
          const date = new Date(`${month}-01`);
          const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          
          if (!data) {
            return {
              monthKey: month,
              monthName,
              income: 0,
              totalExpenses: 0,
              savingsRate: 0,
              topCategory: 'Other' as ExpenseCategory,
              sparklineData: []
            };
          }

          // Get top category
          const categories = data.expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
          }, {} as Record<ExpenseCategory, number>);
          
          const topCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0]?.[0] as ExpenseCategory || 'Other';
          
          // Generate sparkline data (daily expenses for the month)
          const dailyData = Array.from({ length: 30 }, (_, i) => {
            const day = String(i + 1).padStart(2, '0');
            return data.expenses
              .filter(expense => expense.date.endsWith(`-${day}`))
              .reduce((sum, expense) => sum + expense.amount, 0);
          });

          return {
            monthKey: month,
            monthName,
            income: data.income,
            totalExpenses: data.totalExpenses,
            savingsRate: data.savingsRate,
            topCategory,
            sparklineData: dailyData
          };
        }).reverse(); // Show newest first
      },
    }),
    {
      name: 'budget-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        selectedMonth: state.selectedMonth,
        // Don't persist monthlyData as it's generated from mock data
      }),
    }
  )
);