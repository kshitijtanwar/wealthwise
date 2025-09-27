import { useState, useEffect } from "react";

import { dashboardAPI, expenseAPI, budgetAPI } from "../../services/api";

import DashboardStats from "../components/Dashboard/DashboardStats";

import ExpenseChart from "../components/Dashboard/ExpenseChart";

import BudgetOverview from "../components/Dashboard/BudgetOverview";

import RecentTransactions from "../components/Dashboard/RecentTransactions";



 

const Dashboard = () => {

    const [dashboardData, setDashboardData] = useState(null);

    const [expenses, setExpenses] = useState([]);

    const [budgets, setBudgets] = useState([]);

    const [loading, setLoading] = useState(true);



 

    useEffect(() => {

        fetchDashboardData();

    }, []);


 

    const fetchDashboardData = async () => {

        try {

            const [dashboardRes, expensesRes, budgetsRes] = await Promise.all([

                dashboardAPI.getDashboard(),

                expenseAPI.getExpenses(),

                budgetAPI.getBudgets(),

            ]);

           

            setDashboardData(dashboardRes.data);

            setExpenses(expensesRes.data.expenses || []);

            setBudgets(budgetsRes.data.budgets || []);

        } catch (error) {

            console.error("Error fetching dashboard data:", error);

        } finally {

            setLoading(false);

        }

    };


 

    if (loading) {

        return (

            <div className="d-flex justify-content-center align-items-center h-100">

                <div className="spinner-border text-primary" role="status">

                    <span className="visually-hidden">Loading...</span>

                </div>

            </div>

        );

    }


 

    return (

        <div className="container-fluid h-100">

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


 

         

            <div className="row mb-4">

                <div className="col-lg-6">

                    <ExpenseChart expenses={expenses} />

                </div>

                <div className="col-lg-6">

                    <BudgetOverview budgets={budgets} expenses={expenses} />

                </div>

            </div>


 

   

            <div className="row">

                <div className="col">

                    <RecentTransactions expenses={expenses.slice(0, 10)} />

                </div>

            </div>

        </div>

    );

};


 

export default Dashboard;

//mui
