import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BudgetState, Expense, ExpenseCategory, ExpenseTemplate, IncomeEntry, MonthlyData, CategorySummary, DailyExpense, MonthlyInsight, MonthlyReport } from '@/types';

// Default templates for common expenses
const defaultTemplates: ExpenseTemplate[] = [
  {
    id: 'template-1',
    name: 'Sigara',
    category: 'Diğer',
    description: 'Sigara',
    defaultAmount: 45,
    hasQuantity: true,
    unit: 'paket',
    isRecurring: true,
    icon: '🚬'
  },
  {
    id: 'template-2', 
    name: 'Sigara Kağıdı',
    category: 'Diğer',
    description: 'Sigara kağıdı/filtre',
    defaultAmount: 15,
    hasQuantity: true,
    unit: 'adet',
    isRecurring: true,
    icon: '📄'
  },
  {
    id: 'template-3',
    name: 'Kira',
    category: 'Kira',
    description: 'Aylık kira ödemesi',
    defaultAmount: 1200,
    hasQuantity: false,
    isRecurring: true,
    icon: '🏠'
  },
  {
    id: 'template-4',
    name: 'Market Alışverişi',
    category: 'Market',
    description: 'Temel ihtiyaçlar',
    defaultAmount: 150,
    hasQuantity: false,
    isRecurring: true,
    icon: '🛒'
  },
  {
    id: 'template-5',
    name: 'İnternet/Telefon',
    category: 'Faturalar',
    description: 'Aylık internet ve telefon faturası',
    defaultAmount: 85,
    hasQuantity: false,
    isRecurring: true,
    icon: '📱'
  },
  {
    id: 'template-6',
    name: 'Spor Salonu',
    category: 'Spor',
    description: 'Aylık spor salonu üyeliği',
    defaultAmount: 150,
    hasQuantity: false,
    isRecurring: true,
    icon: '💪'
  },
  {
    id: 'template-7',
    name: 'Netflix/Abonelik',
    category: 'Eğlence',
    description: 'Aylık abonelik ücreti',
    defaultAmount: 25,
    hasQuantity: false,
    isRecurring: true,
    icon: '📺'
  }
];

// Default categories
const defaultCategories: string[] = [
  'Market',
  'Ulaşım',
  'Faturalar',
  'Kira',
  'Spor',
  'Eğlence',
  'Diğer',
];

// Generate mock data for current and future months
const generateMockData = () => {
  const months = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
  
  // Start from current month and add all remaining months of current year
  for (let month = currentMonth; month <= 12; month++) {
    const monthKey = `${currentYear}-${String(month).padStart(2, '0')}`;
    months.push(monthKey);
  }
  
  // Add all months for the next year
  const nextYear = currentYear + 1;
  for (let month = 1; month <= 12; month++) {
    const monthKey = `${nextYear}-${String(month).padStart(2, '0')}`;
    months.push(monthKey);
  }

  const mockExpensesByMonth: Record<string, Expense[]> = {};
  const incomeByMonth: Record<string, number> = {};

  // Get current month key for setting as default
  const currentMonthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
  const lastMonthKey = currentMonth > 1 
    ? `${currentYear}-${String(currentMonth - 1).padStart(2, '0')}` 
    : `${currentYear - 1}-12`;
  const twoMonthsAgoKey = currentMonth > 2 
    ? `${currentYear}-${String(currentMonth - 2).padStart(2, '0')}` 
    : currentMonth === 2 
    ? `${currentYear - 1}-12`
    : `${currentYear - 1}-11`;

  // Mock expenses for recent/current months (keep existing sample data for these months)
  if (months.includes(twoMonthsAgoKey)) {
    mockExpensesByMonth[twoMonthsAgoKey] = [
      { id: '1', date: `${twoMonthsAgoKey}-15`, category: 'Market' as ExpenseCategory, description: 'Haftalık market alışverişi', amount: 145.50 },
      { id: '2', date: `${twoMonthsAgoKey}-14`, category: 'Ulaşım' as ExpenseCategory, description: 'Metro aylık kart', amount: 85.00 },
      { id: '3', date: `${twoMonthsAgoKey}-13`, category: 'Faturalar' as ExpenseCategory, description: 'İnternet ve Telefon', amount: 89.99 },
      { id: '4', date: `${twoMonthsAgoKey}-12`, category: 'Eğlence' as ExpenseCategory, description: 'Netflix aboneliği', amount: 15.99 },
      { id: '5', date: `${twoMonthsAgoKey}-11`, category: 'Kira' as ExpenseCategory, description: 'Aylık kira', amount: 1200.00 },
      { id: '6', date: `${twoMonthsAgoKey}-10`, category: 'Market' as ExpenseCategory, description: 'Taze ürünler', amount: 65.30 },
      { id: '7', date: `${twoMonthsAgoKey}-09`, category: 'Spor' as ExpenseCategory, description: 'Fitness üyelik', amount: 49.99 },
      { id: '8', date: `${twoMonthsAgoKey}-08`, category: 'Ulaşım' as ExpenseCategory, description: 'Uber yolculuğu', amount: 28.50 },
    ];
  }

  if (months.includes(lastMonthKey)) {
    mockExpensesByMonth[lastMonthKey] = [
      { id: '9', date: `${lastMonthKey}-16`, category: 'Market' as ExpenseCategory, description: 'Toplu market alışverişi', amount: 178.25 },
      { id: '10', date: `${lastMonthKey}-15`, category: 'Faturalar' as ExpenseCategory, description: 'Elektrik faturası', amount: 95.45 },
      { id: '11', date: `${lastMonthKey}-14`, category: 'Eğlence' as ExpenseCategory, description: 'Sinema gecesi', amount: 45.00 },
      { id: '12', date: `${lastMonthKey}-13`, category: 'Ulaşım' as ExpenseCategory, description: 'Benzin istasyonu', amount: 68.00 },
      { id: '13', date: `${lastMonthKey}-12`, category: 'Kira' as ExpenseCategory, description: 'Aylık kira', amount: 1200.00 },
      { id: '14', date: `${lastMonthKey}-10`, category: 'Market' as ExpenseCategory, description: 'Yerel market', amount: 42.80 },
      { id: '15', date: `${lastMonthKey}-09`, category: 'Spor' as ExpenseCategory, description: 'Kişisel antrenman', amount: 75.00 },
      { id: '16', date: `${lastMonthKey}-08`, category: 'Diğer' as ExpenseCategory, description: 'Eczane', amount: 23.50 },
    ];
  }

  mockExpensesByMonth[currentMonthKey] = [
    { id: '17', date: `${currentMonthKey}-10`, category: 'Market' as ExpenseCategory, description: 'Haftalık yiyecek', amount: 125.75 },
    { id: '18', date: `${currentMonthKey}-09`, category: 'Faturalar' as ExpenseCategory, description: 'İnternet faturası', amount: 59.99 },
    { id: '19', date: `${currentMonthKey}-08`, category: 'Eğlence' as ExpenseCategory, description: 'Spotify premium', amount: 9.99 },
    { id: '20', date: `${currentMonthKey}-07`, category: 'Ulaşım' as ExpenseCategory, description: 'Aylık metro kartı', amount: 85.00 },
    { id: '21', date: `${currentMonthKey}-05`, category: 'Kira' as ExpenseCategory, description: 'Aylık kira', amount: 1200.00 },
    { id: '22', date: `${currentMonthKey}-04`, category: 'Spor' as ExpenseCategory, description: 'Spor salonu üyeliği', amount: 49.99 },
    { id: '23', date: `${currentMonthKey}-03`, category: 'Market' as ExpenseCategory, description: 'Organik ürünler', amount: 87.20 },
  ];

  if (months.includes(twoMonthsAgoKey)) {
    incomeByMonth[twoMonthsAgoKey] = 4800;
  }
  if (months.includes(lastMonthKey)) {
    incomeByMonth[lastMonthKey] = 5200;
  }
  incomeByMonth[currentMonthKey] = 5500;

  return { mockExpensesByMonth, incomeByMonth, months, currentMonthKey, lastMonthKey, twoMonthsAgoKey };
};

const { mockExpensesByMonth, incomeByMonth, months, currentMonthKey, lastMonthKey, twoMonthsAgoKey } = generateMockData();

// Income entries storage (similar to expenses)
const incomeEntriesByMonth: Record<string, IncomeEntry[]> = {};

// Initialize with sample data for current and available months
const initializeIncomeEntries = () => {
  const { currentMonthKey, lastMonthKey, twoMonthsAgoKey, months } = generateMockData();
  
  if (months.includes(twoMonthsAgoKey)) {
    incomeEntriesByMonth[twoMonthsAgoKey] = [
      {
        id: 'income-1',
        date: `${twoMonthsAgoKey}-01`,
        description: 'Aylık Maaş',
        amount: 4500,
        source: 'Maaş'
      },
      {
        id: 'income-2', 
        date: `${twoMonthsAgoKey}-15`,
        description: 'Freelance Proje',
        amount: 300,
        source: 'Freelance'
      }
    ];
  }
  
  if (months.includes(lastMonthKey)) {
    incomeEntriesByMonth[lastMonthKey] = [
      {
        id: 'income-3',
        date: `${lastMonthKey}-01`,
        description: 'Aylık Maaş',
        amount: 4500,
        source: 'Maaş'
      },
      {
        id: 'income-4',
        date: `${lastMonthKey}-20`,
        description: 'Bonus',
        amount: 700,
        source: 'Bonus'
      }
    ];
  }
  
  incomeEntriesByMonth[currentMonthKey] = [
    {
      id: 'income-5',
      date: `${currentMonthKey}-01`, 
      description: 'Aylık Maaş',
      amount: 4500,
      source: 'Maaş'
    },
    {
      id: 'income-6',
      date: `${currentMonthKey}-25`,
      description: 'Konsültasyon',
      amount: 1000,
      source: 'Freelance'
    }
  ];
};

// Initialize income entries
initializeIncomeEntries();



export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      selectedMonth: currentMonthKey, // Current month
      monthlyData: {},
      customCategories: [],
      expenseTemplates: [...defaultTemplates],

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

      // Income management
      addIncomeEntry: (month: string, entry) => {
        const newEntry: IncomeEntry = {
          ...entry,
          id: `income-${Date.now()}`,
        };
        
        incomeEntriesByMonth[month] = [newEntry, ...(incomeEntriesByMonth[month] || [])];
        get().calculateMonthlyData(month);
      },

      updateIncomeEntry: (month: string, id: string, updatedEntry) => {
        incomeEntriesByMonth[month] = incomeEntriesByMonth[month]?.map((entry) =>
          entry.id === id ? { ...entry, ...updatedEntry } : entry
        ) || [];
        get().calculateMonthlyData(month);
      },

      deleteIncomeEntry: (month: string, id: string) => {
        incomeEntriesByMonth[month] = incomeEntriesByMonth[month]?.filter((entry) => entry.id !== id) || [];
        get().calculateMonthlyData(month);
      },

      getMonthIncomeEntries: (month: string) => {
        return incomeEntriesByMonth[month] || [];
      },

      addCustomCategory: (category: string) => {
        set((state) => ({
          customCategories: [...state.customCategories, category]
        }));
      },

      getAvailableCategories: () => {
        const { customCategories } = get();
        return [...defaultCategories, ...customCategories];
      },



      // Template management
      addExpenseTemplate: (template) => {
        const newTemplate: ExpenseTemplate = {
          ...template,
          id: `template-${Date.now()}`,
        };
        set((state) => ({
          expenseTemplates: [...state.expenseTemplates, newTemplate]
        }));
      },

      updateExpenseTemplate: (id, updatedTemplate) => {
        set((state) => ({
          expenseTemplates: state.expenseTemplates.map(template =>
            template.id === id ? { ...template, ...updatedTemplate } : template
          )
        }));
      },

      deleteExpenseTemplate: (id) => {
        set((state) => ({
          expenseTemplates: state.expenseTemplates.filter(template => template.id !== id)
        }));
      },

      getExpenseTemplates: () => {
        return get().expenseTemplates;
      },

      addExpenseFromTemplate: (templateId, customAmount, quantity) => {
        const { expenseTemplates, selectedMonth } = get();
        const template = expenseTemplates.find(t => t.id === templateId);
        
        if (!template) return;

        const amount = customAmount || template.defaultAmount || 0;
        const finalAmount = template.hasQuantity && quantity ? amount * quantity : amount;
        
        const expense: Expense = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          category: template.category,
          description: template.hasQuantity && quantity 
            ? `${template.description} (${quantity} ${template.unit || 'adet'})`
            : template.description,
          amount: finalAmount,
          quantity: template.hasQuantity ? quantity : undefined,
          unit: template.unit
        };
        
        // Add to mock data for the selected month
        mockExpensesByMonth[selectedMonth] = [expense, ...(mockExpensesByMonth[selectedMonth] || [])];
        get().calculateMonthlyData(selectedMonth);
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
        const incomeEntries = incomeEntriesByMonth[month] || [];
        
        // Calculate total income from entries, fallback to legacy income
        const totalIncomeFromEntries = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
        const income = totalIncomeFromEntries > 0 ? totalIncomeFromEntries : (incomeByMonth[month] || 0);
        
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const remainingBalance = income - totalExpenses;
        const savingsRate = income > 0 ? (remainingBalance / income) * 100 : 0;

        set((state) => ({
          monthlyData: {
            ...state.monthlyData,
            [month]: {
              income,
              incomeEntries,
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
          incomeEntries: [],
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
          const monthName = date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
          
          if (!data) {
            return {
              monthKey: month,
              monthName,
              income: 0,
              totalExpenses: 0,
              savingsRate: 0,
              topCategory: 'Diğer' as ExpenseCategory,
              sparklineData: []
            };
          }

          // Get top category
          const categories = data.expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
          }, {} as Record<ExpenseCategory, number>);
          
          const topCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0]?.[0] as ExpenseCategory || 'Diğer';
          
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
        customCategories: state.customCategories,
        expenseTemplates: state.expenseTemplates,
        // Don't persist monthlyData as it's generated from mock data
      }),
    }
  )
);