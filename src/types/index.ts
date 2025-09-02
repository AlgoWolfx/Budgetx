export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  quantity?: number;
  unit?: string; // 'adet', 'paket', 'kutu' etc.
}

export type ExpenseCategory = string;

export interface ExpenseTemplate {
  id: string;
  name: string;
  category: ExpenseCategory;
  description: string;
  defaultAmount?: number;
  hasQuantity: boolean;
  unit?: string;
  isRecurring: boolean; // Aylık tekrarlanan giderler için
  icon?: string;
}

export interface IncomeEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  description: string;
  amount: number;
  source?: string; // Optional income source (e.g., "Maaş", "Freelance", "Bonus")
}

export interface MonthlyData {
  income: number; // Total calculated income for backward compatibility
  incomeEntries: IncomeEntry[]; // Individual income entries
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
  customCategories: string[];
  expenseTemplates: ExpenseTemplate[];
  login: (password: string) => boolean;
  logout: () => void;
  
  // Month management
  setSelectedMonth: (month: string) => void;
  setMonthlyIncome: (month: string, income: number) => void; // Legacy method
  
  // Income management
  addIncomeEntry: (month: string, entry: Omit<IncomeEntry, 'id'>) => void;
  updateIncomeEntry: (month: string, id: string, entry: Partial<IncomeEntry>) => void;
  deleteIncomeEntry: (month: string, id: string) => void;
  getMonthIncomeEntries: (month: string) => IncomeEntry[];
  
  // Category management
  addCustomCategory: (category: string) => void;
  getAvailableCategories: () => ExpenseCategory[];
  
  // Template management
  addExpenseTemplate: (template: Omit<ExpenseTemplate, 'id'>) => void;
  updateExpenseTemplate: (id: string, template: Partial<ExpenseTemplate>) => void;
  deleteExpenseTemplate: (id: string) => void;
  getExpenseTemplates: () => ExpenseTemplate[];
  
  // Expense management
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addExpenseFromTemplate: (templateId: string, customAmount?: number, quantity?: number) => void;
  

  // Data calculations
  calculateMonthlyData: (month: string) => void;
  getCurrentMonthData: () => MonthlyData;
  getCategoryData: () => CategorySummary[];
  getDailyData: () => DailyExpense[];
  getInsights: () => MonthlyInsight[];
  getMonthlyReports: () => MonthlyReport[];
}