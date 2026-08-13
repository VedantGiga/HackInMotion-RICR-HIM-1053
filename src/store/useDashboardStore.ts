import { create } from 'zustand';
import { Transaction } from '@/components/site/KoshinDashboard';

interface DashboardState {
  // Navigation
  activeTab: "dashboard" | "transactions" | "spending-analysis" | "budget" | "goals" | "subscriptions" | "simulator" | "ai" | "settings";
  setActiveTab: (tab: "dashboard" | "transactions" | "spending-analysis" | "budget" | "goals" | "subscriptions" | "simulator" | "ai" | "settings") => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Transactions & Filtering
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[] | ((prev: Transaction[]) => Transaction[])) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  uploadSuccess: boolean;
  setUploadSuccess: (success: boolean) => void;

  // Form state
  newMerchant: string;
  setNewMerchant: (val: string) => void;
  newAmount: string;
  setNewAmount: (val: string) => void;
  newDate: string;
  setNewDate: (val: string) => void;
  newType: "expense" | "income";
  setNewType: (val: "expense" | "income") => void;

  // Simulator State
  foodCut: number;
  setFoodCut: (val: number) => void;
  subCut: number;
  setSubCut: (val: number) => void;
  shoppingCut: number;
  setShoppingCut: (val: number) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: "dashboard",
  setActiveTab: (tab) => set({ activeTab: tab }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  transactions: [],
  setTransactions: (updater) => set((state) => ({
    transactions: typeof updater === 'function' ? updater(state.transactions) : updater
  })),
  selectedCategory: "All",
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
  uploadSuccess: false,
  setUploadSuccess: (success) => set({ uploadSuccess: success }),

  newMerchant: "",
  setNewMerchant: (val) => set({ newMerchant: val }),
  newAmount: "",
  setNewAmount: (val) => set({ newAmount: val }),
  newDate: new Date().toISOString().split("T")[0],
  setNewDate: (val) => set({ newDate: val }),
  newType: "expense",
  setNewType: (val) => set({ newType: val }),

  foodCut: 35,
  setFoodCut: (val) => set({ foodCut: val }),
  subCut: 25,
  setSubCut: (val) => set({ subCut: val }),
  shoppingCut: 20,
  setShoppingCut: (val) => set({ shoppingCut: val }),
}));
