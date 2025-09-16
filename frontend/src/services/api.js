import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

// Create axios instance with defaults
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Send cookies with requests
    headers: {
        "Content-Type": "application/json",
    },
});

// Auth API calls
export const authAPI = {
    signup: (userData) => api.post("/auth/signup", userData),
    login: (credentials) => api.post("/auth/login", credentials),
    logout: () => api.post("/auth/logout"),
    getMe: () => api.get("/auth/me"),
};

// Expense API calls
export const expenseAPI = {
    getExpenses: () => api.get("/expenses"),
    addExpense: (expenseData) => api.post("/expenses", expenseData),
    importExpenses: (importData) => api.post("/expenses/import", importData),
    exportExpenses: () => api.get("/expenses/export"),
};

// Budget API calls
export const budgetAPI = {
    getBudgets: () => api.get("/budgets"),
    setBudget: (budgetData) => api.post("/budgets", budgetData),
};

// Goal API calls
export const goalAPI = {
    getGoals: () => api.get("/goals/track"),
    setGoal: (goalData) => api.post("/goals", goalData),
};

// Dashboard API calls
export const dashboardAPI = {
    getDashboard: () => api.get("/dashboard"),
};

export default api;
