import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";

import { dashboardAPI, expenseAPI, budgetAPI } from "../../services/api";

import DashboardStats from "../components/Dashboard/DashboardStats";

import ExpenseChart from "../components/Dashboard/ExpenseChart";

import BudgetOverview from "../components/Dashboard/BudgetOverview";

import RecentTransactions from "../components/Dashboard/RecentTransactions";
import { Download } from "lucide-react";
const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const dashboardRef = useRef(null);

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

    const exportToPDF = async () => {
        setExporting(true);
        try {
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 15;
            const usableWidth = pageWidth - margin * 2;
            let yPosition = margin;

            // Helper function to add a new page if needed
            const checkPageBreak = (requiredSpace) => {
                if (yPosition + requiredSpace > pageHeight - margin) {
                    pdf.addPage();
                    yPosition = margin;
                    return true;
                }
                return false;
            };

            // Header
            pdf.setFontSize(20);
            pdf.setTextColor(102, 16, 242);
            pdf.text("WealthWise Financial Report", pageWidth / 2, yPosition, {
                align: "center",
            });
            yPosition += 10;

            pdf.setFontSize(10);
            pdf.setTextColor(108, 117, 125);
            pdf.text(
                `Generated on ${new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}`,
                pageWidth / 2,
                yPosition,
                { align: "center" }
            );
            yPosition += 15;

            // Financial Summary Section
            pdf.setFontSize(16);
            pdf.setTextColor(33, 37, 41);
            pdf.text("Financial Overview", margin, yPosition);
            yPosition += 10;

            const summaryData = [
                [
                    "Total Expenses",
                    `${dashboardData?.stats?.totalExpenses || "0"}`,
                ],
                [
                    "Active Budgets",
                    `${dashboardData?.stats?.totalBudgets || "0"}`,
                ],
                [
                    "Financial Goals",
                    `${dashboardData?.stats?.totalGoals || "0"}`,
                ],
                ["Total Transactions", `${expenses.length}`],
                [
                    "Categories Tracked",
                    `${[...new Set(expenses.map((e) => e.category))].length}`,
                ],
            ];

            // Summary table
            pdf.setFontSize(10);
            summaryData.forEach(([label, value]) => {
                checkPageBreak(8);
                pdf.setTextColor(88, 88, 88);
                pdf.text(label + ":", margin, yPosition);
                pdf.setTextColor(33, 37, 41);
                pdf.text(value, margin + 50, yPosition);
                yPosition += 6;
            });

            yPosition += 10;

            // Category Breakdown
            checkPageBreak(20);
            pdf.setFontSize(16);
            pdf.setTextColor(33, 37, 41);
            pdf.text("Expense Breakdown by Category", margin, yPosition);
            yPosition += 10;

            // Calculate category totals
            const categoryTotals = {};
            expenses.forEach((expense) => {
                if (categoryTotals[expense.category]) {
                    categoryTotals[expense.category] += expense.amount;
                } else {
                    categoryTotals[expense.category] = expense.amount;
                }
            });

            const sortedCategories = Object.entries(categoryTotals).sort(
                ([, a], [, b]) => b - a
            );

            // Category table headers
            checkPageBreak(25);
            pdf.setFillColor(248, 249, 250);
            pdf.rect(margin, yPosition - 2, usableWidth, 8, "F");
            pdf.setFontSize(10);
            pdf.setTextColor(33, 37, 41);
            pdf.text("Category", margin + 2, yPosition + 3);
            pdf.text("Amount", margin + 80, yPosition + 3);
            pdf.text("Percentage", margin + 120, yPosition + 3);
            yPosition += 8;

            const totalExpenseAmount = Object.values(categoryTotals).reduce(
                (sum, amount) => sum + amount,
                0
            );

            sortedCategories.forEach(([category, amount], index) => {
                checkPageBreak(8);
                const percentage =
                    totalExpenseAmount > 0
                        ? ((amount / totalExpenseAmount) * 100).toFixed(1)
                        : 0;

                // Alternate row colors
                if (index % 2 === 0) {
                    pdf.setFillColor(252, 252, 252);
                    pdf.rect(margin, yPosition - 2, usableWidth, 6, "F");
                }

                pdf.setTextColor(33, 37, 41);
                pdf.text(category, margin + 2, yPosition + 2);
                pdf.text(`Rs.${amount.toFixed(2)}`, margin + 80, yPosition + 2);
                pdf.text(`${percentage}%`, margin + 120, yPosition + 2);
                yPosition += 6;
            });

            yPosition += 15;

            // Recent Transactions Table
            checkPageBreak(30);
            pdf.setFontSize(16);
            pdf.setTextColor(33, 37, 41);
            pdf.text("Recent Transactions", margin, yPosition);
            yPosition += 10;

            // Sort expenses by date (most recent first)
            const sortedExpenses = [...expenses]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 20); // Show top 20 transactions

            if (sortedExpenses.length > 0) {
                // Table headers
                checkPageBreak(25);
                pdf.setFillColor(248, 249, 250);
                pdf.rect(margin, yPosition - 2, usableWidth, 8, "F");
                pdf.setFontSize(9);
                pdf.setTextColor(33, 37, 41);
                pdf.text("Date", margin + 2, yPosition + 3);
                pdf.text("Description", margin + 25, yPosition + 3);
                pdf.text("Category", margin + 75, yPosition + 3);
                pdf.text("Amount", margin + 120, yPosition + 3);
                pdf.text("Merchant", margin + 150, yPosition + 3);
                yPosition += 8;

                // Table rows
                sortedExpenses.forEach((expense, index) => {
                    checkPageBreak(8);

                    // Alternate row colors
                    if (index % 2 === 0) {
                        pdf.setFillColor(252, 252, 252);
                        pdf.rect(margin, yPosition - 2, usableWidth, 6, "F");
                    }

                    pdf.setTextColor(33, 37, 41);
                    pdf.setFontSize(8);

                    // Format date
                    const date = new Date(expense.date).toLocaleDateString(
                        "en-US",
                        {
                            month: "short",
                            day: "numeric",
                        }
                    );

                    pdf.text(date, margin + 2, yPosition + 2);

                    // Truncate description if too long
                    const description =
                        (expense.description || "Expense").length > 20
                            ? (expense.description || "Expense").substring(
                                  0,
                                  20
                              ) + "..."
                            : expense.description || "Expense";
                    pdf.text(description, margin + 25, yPosition + 2);

                    // Truncate category if too long
                    const category =
                        expense.category.length > 12
                            ? expense.category.substring(0, 12) + "..."
                            : expense.category;
                    pdf.text(category, margin + 75, yPosition + 2);

                    pdf.setTextColor(220, 53, 69); // Red for expenses
                    pdf.text(
                        `-Rs.${expense.amount.toFixed(2)}`,
                        margin + 120,
                        yPosition + 2
                    );

                    pdf.setTextColor(108, 117, 125); // Gray for merchant
                    const merchant = expense.merchant
                        ? expense.merchant.length > 15
                            ? expense.merchant.substring(0, 15) + "..."
                            : expense.merchant
                        : "-";
                    pdf.text(merchant, margin + 150, yPosition + 2);

                    yPosition += 6;
                });
            } else {
                pdf.setTextColor(108, 117, 125);
                pdf.text("No transactions found", margin, yPosition);
            }

            // Footer
            const pageCount = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(108, 117, 125);
                pdf.text(
                    `Page ${i} of ${pageCount} • WealthWise Financial Report`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: "center" }
                );
            }

            // Save the PDF
            const fileName = `wealthwise-financial-report-${
                new Date().toISOString().split("T")[0]
            }.pdf`;
            pdf.save(fileName);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Error generating PDF. Please try again.");
        } finally {
            setExporting(false);
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
        <div
            ref={dashboardRef}
            className="container-fluid py-4"
            style={{
                minHeight: "100vh",
            }}
        >
            {/* Header Section */}
            <div className="row mb-5">
                <div className="col">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <div>
                            <h1 className="display-5 fw-bold mb-2 text-primary">
                                Dashboard
                            </h1>
                            <p className="lead text-muted mb-0">
                                Get insights into your financial journey
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-primary btn-sm rounded-pill px-3 hover-lift"
                                onClick={exportToPDF}
                                disabled={exporting || loading}
                            >
                                {exporting ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-1"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Exporting...
                                    </>
                                ) : (
                                    <>
                                        <Download size={16} className="me-1" />
                                        Export PDF
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <DashboardStats stats={dashboardData?.stats} />

            {/* Charts Section */}
            <div className="row mb-5 g-4">
                <div className="col-xl-7">
                    <ExpenseChart expenses={expenses} />
                </div>
                <div className="col-xl-5">
                    <BudgetOverview budgets={budgets} expenses={expenses} />
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="row">
                <div className="col">
                    <RecentTransactions expenses={expenses.slice(0, 10)} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

