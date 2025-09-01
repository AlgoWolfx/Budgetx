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
  totalExpenses: number;
  remainingBalance: number;
  savingsRate: number;
}

export interface CategorySummary {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
}

export interface WeeklyExpense {
  week: string;
  amount: number;
}

export interface BudgetState {
  isAuthenticated: boolean;
  monthlyData: MonthlyData;
  expenses: Expense[];
  categoryData: CategorySummary[];
  weeklyData: WeeklyExpense[];
  login: (password: string) => boolean;
  logout: () => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  calculateSummaryData: () => void;
}