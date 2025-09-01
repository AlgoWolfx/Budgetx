export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
}

export type ExpenseCategory = 
  | 'Groceries'
  | 'Transport'
  | 'Bills'
  | 'Rent'
  | 'Gym'
  | 'Entertainment'
  | 'Other';

export interface MonthlyData {
  income: number;
  expenses: Expense[];
  totalExpenses: number;
  remainingBalance: number;
  savingsRate: number;
}

export interface CategorySummary {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  count: number;
}

export interface DailyExpense {
  date: string;
  amount: number;
}

export interface MonthlyInsight {
  type: 'comparison' | 'achievement' | 'warning' | 'trend';
  message: string;
}

export interface MonthlyReport {
  monthKey: string;
  monthName: string;
  income: number;
  totalExpenses: number;
  savingsRate: number;
  topCategory: ExpenseCategory;
  sparklineData: number[];
}

export interface BudgetState {
  isAuthenticated: boolean;
  selectedMonth: string;
  monthlyData: Record<string, MonthlyData>;
  login: (password: string) => boolean;
  logout: () => void;
  
  // Month management
  setSelectedMonth: (month: string) => void;
  setMonthlyIncome: (month: string, income: number) => void;
  
  // Expense management
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Data calculations
  calculateMonthlyData: (month: string) => void;
  getCurrentMonthData: () => MonthlyData;
  getCategoryData: () => CategorySummary[];
  getDailyData: () => DailyExpense[];
  getInsights: () => MonthlyInsight[];
  getMonthlyReports: () => MonthlyReport[];
}