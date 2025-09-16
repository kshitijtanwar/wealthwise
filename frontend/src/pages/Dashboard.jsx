import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { dashboardAPI, expenseAPI, budgetAPI, goalAPI } from "../services/api";
import DashboardStats from "../components/DashboardStats";
import ExpenseChart from "../components/ExpenseChart";
import BudgetOverview from "../components/BudgetOverview";
import RecentTransactions from "../components/RecentTransactions";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    // const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [dashboardRes, expensesRes, budgetsRes] =
                await Promise.all([
                    dashboardAPI.getDashboard(),
                    expenseAPI.getExpenses(),
                    budgetAPI.getBudgets(),
                    goalAPI.getGoals(),
                ]);

            setDashboardData(dashboardRes.data);
            setExpenses(expensesRes.data.expenses || []);
            setBudgets(budgetsRes.data.budgets || []);
            // setGoals(goalsRes.data.goals || []);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex vh-100">
            {/* Sidebar */}
            <div className="bg-dark text-white" style={{ width: "250px" }}>
                <div className="p-3">
                    <h4 className="mb-4">WealthWise</h4>
                    <div className="mb-4">
                        <small className="text-muted">Welcome back,</small>
                        <div className="fw-bold">
                            {user?.name || user?.email}
                        </div>
                    </div>
                    <nav className="nav flex-column">
                        <a
                            className="nav-link text-white active"
                            href="#dashboard"
                        >
                            <i className="bi bi-house me-2"></i>Dashboard
                        </a>
                        <a className="nav-link text-white-50" href="#expenses">
                            <i className="bi bi-receipt me-2"></i>Expenses
                        </a>
                        <a className="nav-link text-white-50" href="#budgets">
                            <i className="bi bi-pie-chart me-2"></i>Budgets
                        </a>
                        <a className="nav-link text-white-50" href="#goals">
                            <i className="bi bi-target me-2"></i>Goals
                        </a>
                    </nav>
                </div>
                <div className="mt-auto p-3">
                    <button
                        className="btn btn-outline-light w-100"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-fill bg-light">
                <div className="container-fluid p-4">
                    <div className="row mb-4">
                        <div className="col">
                            <h2 className="mb-0">Dashboard</h2>
                            <p className="text-muted">
                                Overview of your financial data
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <DashboardStats stats={dashboardData?.stats} />

                    {/* Charts Row */}
                    <div className="row mb-4">
                        <div className="col-lg-8">
                            <ExpenseChart expenses={expenses} />
                        </div>
                        <div className="col-lg-4">
                            <BudgetOverview
                                budgets={budgets}
                                expenses={expenses}
                            />
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="row">
                        <div className="col">
                            <RecentTransactions
                                expenses={expenses.slice(0, 10)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
