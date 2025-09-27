import axios from "axios";


 

const API_BASE_URL = "http://localhost:8000/api/v1";



 

const api = axios.create({

    baseURL: API_BASE_URL,

    withCredentials: true,

    headers: {

        "Content-Type": "application/json",

    },

});



 

export const authAPI = {

    signup: (userData) => api.post("/auth/signup", userData),

    login: (credentials) => api.post("/auth/login", credentials),

    logout: () => api.post("/auth/logout"),

    getMe: () => api.get("/auth/me"),

};



 

export const expenseAPI = {

    getExpenses: () => api.get("/expenses"),

    addExpense: (expenseData) => api.post("/expenses", expenseData),

    importExpenses: (importData) => api.post("/expenses/import", importData),

    exportExpenses: () => api.get("/expenses/export"),

};



 

export const budgetAPI = {

    getBudgets: () => api.get("/budgets"),

    setBudget: (budgetData) => api.post("/budgets", budgetData),

    setSalaryBreakdown: (breakdownData) => api.put("/budgets/update-breakdown", breakdownData),

};



 

export const goalAPI = {

     createGoal : (goalData) =>api.post("/goals/create-goal", goalData),

     getGoals : () =>api.get("/goals"),

     getGoalById : (id) =>api.get(`/goals/${id}`),

     updateGoal : (id, goalData) =>api.patch(`/goals/${id}`, goalData),

     deleteGoal : (id) =>api.delete(`/goals/${id}`)

};



 

export const dashboardAPI = {

    getDashboard: () => api.get("/dashboard"),

};


 

export default api;
