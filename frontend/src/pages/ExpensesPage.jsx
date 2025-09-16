import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { PieChart, BarChart, LineChart } from "@mui/x-charts";
import { expenseAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const ExpensesPage = () => {
    const { user, logout } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const response = await expenseAPI.getExpenses();
            // Handle both direct array and nested object responses
            const expensesData = response.data.expenses || response.data || [];
            setExpenses(Array.isArray(expensesData) ? expensesData : []);
            setError("");
        } catch (error) {
            setError("Failed to fetch expenses");
            console.error("Error fetching expenses:", error);
        } finally {
            setLoading(false);
        }
    };

    // Process data for charts
    const processExpenseData = () => {
        if (!Array.isArray(expenses) || !expenses.length)
            return { categoryData: [], monthlyData: [], totalSpent: 0 };

        // Group by category
        const categoryTotals = expenses.reduce((acc, expense) => {
            if (expense && expense.category && expense.amount) {
                acc[expense.category] =
                    (acc[expense.category] || 0) + expense.amount;
            }
            return acc;
        }, {});

        const categoryData = Object.entries(categoryTotals).map(
            ([category, amount], index) => ({
                id: index,
                value: amount,
                label: category,
            })
        );

        // Group by month
        const monthlyTotals = expenses.reduce((acc, expense) => {
            if (expense && expense.date && expense.amount) {
                const month = new Date(expense.date).toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        year: "numeric",
                    }
                );
                acc[month] = (acc[month] || 0) + expense.amount;
            }
            return acc;
        }, {});

        const monthlyData = Object.entries(monthlyTotals).map(
            ([month, amount]) => ({
                month,
                amount,
            })
        );

        // Sort monthly data by date
        monthlyData.sort((a, b) => new Date(a.month) - new Date(b.month));

        const totalSpent = expenses.reduce(
            (sum, expense) =>
                sum + (expense && expense.amount ? expense.amount : 0),
            0
        );

        return { categoryData, monthlyData, totalSpent };
    };

    const { categoryData, monthlyData, totalSpent } = processExpenseData();

    const handleLogout = () => {
        logout();
    };

    if (loading) {
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
                            <Link
                                className="nav-link text-white-50"
                                to="/dashboard"
                            >
                                <i className="bi bi-house me-2"></i>Dashboard
                            </Link>
                            <Link
                                className="nav-link text-white active"
                                to="/expenses"
                            >
                                <i className="bi bi-receipt me-2"></i>Expenses
                            </Link>
                            <a
                                className="nav-link text-white-50"
                                href="#budgets"
                            >
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
                <div className="flex-fill bg-light d-flex justify-content-center align-items-center">
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Loading expenses...</p>
                    </div>
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
                        <Link
                            className="nav-link text-white-50"
                            to="/dashboard"
                        >
                            <i className="bi bi-house me-2"></i>Dashboard
                        </Link>
                        <Link
                            className="nav-link text-white active"
                            to="/expenses"
                        >
                            <i className="bi bi-receipt me-2"></i>Expenses
                        </Link>
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
                <Container fluid className="py-4">
                    <Row className="mb-4">
                        <Col>
                            <h2 className="mb-0">Expense Analytics</h2>
                            <p className="text-muted">
                                Visualize your spending patterns
                            </p>
                        </Col>
                    </Row>

                    {error && (
                        <Row className="mb-4">
                            <Col>
                                <Alert variant="danger">{error}</Alert>
                            </Col>
                        </Row>
                    )}

                    {expenses.length === 0 && !loading ? (
                        <Row>
                            <Col>
                                <Alert variant="info" className="text-center">
                                    <h5>No expenses found</h5>
                                    <p>
                                        Start by adding some expenses to see
                                        your spending analytics.
                                    </p>
                                </Alert>
                            </Col>
                        </Row>
                    ) : (
                        <>
                            {/* Summary Card */}
                            <Row className="mb-4">
                                <Col md={12}>
                                    <Card>
                                        <Card.Body>
                                            <Row className="text-center">
                                                <Col md={4}>
                                                    <h3 className="text-primary">
                                                        ${totalSpent.toFixed(2)}
                                                    </h3>
                                                    <p className="text-muted mb-0">
                                                        Total Spent
                                                    </p>
                                                </Col>
                                                <Col md={4}>
                                                    <h3 className="text-success">
                                                        {expenses.length}
                                                    </h3>
                                                    <p className="text-muted mb-0">
                                                        Total Transactions
                                                    </p>
                                                </Col>
                                                <Col md={4}>
                                                    <h3 className="text-info">
                                                        {categoryData.length}
                                                    </h3>
                                                    <p className="text-muted mb-0">
                                                        Categories
                                                    </p>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Charts Row */}
                            <Row>
                                {/* Category Pie Chart */}
                                <Col lg={6} className="mb-4">
                                    <Card>
                                        <Card.Header>
                                            <h5 className="mb-0">
                                                Expenses by Category
                                            </h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <div
                                                style={{
                                                    height: "300px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {categoryData.length > 0 ? (
                                                    <PieChart
                                                        series={[
                                                            {
                                                                data: categoryData,
                                                                highlightScope:
                                                                    {
                                                                        faded: "global",
                                                                        highlighted:
                                                                            "item",
                                                                    },
                                                                faded: {
                                                                    innerRadius: 30,
                                                                    additionalRadius:
                                                                        -30,
                                                                },
                                                            },
                                                        ]}
                                                        height={300}
                                                        width={400}
                                                    />
                                                ) : (
                                                    <p className="text-muted">
                                                        No data available
                                                    </p>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                {/* Monthly Bar Chart */}
                                <Col lg={6} className="mb-4">
                                    <Card>
                                        <Card.Header>
                                            <h5 className="mb-0">
                                                Monthly Spending
                                            </h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <div style={{ height: "300px" }}>
                                                {monthlyData.length > 0 ? (
                                                    <BarChart
                                                        xAxis={[
                                                            {
                                                                scaleType:
                                                                    "band",
                                                                data: monthlyData.map(
                                                                    (item) =>
                                                                        item.month
                                                                ),
                                                            },
                                                        ]}
                                                        series={[
                                                            {
                                                                data: monthlyData.map(
                                                                    (item) =>
                                                                        item.amount
                                                                ),
                                                                label: "Amount ($)",
                                                                color: "#0d6efd",
                                                            },
                                                        ]}
                                                        height={300}
                                                    />
                                                ) : (
                                                    <p className="text-muted">
                                                        No data available
                                                    </p>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Spending Trend Line Chart */}
                            <Row>
                                <Col lg={12} className="mb-4">
                                    <Card>
                                        <Card.Header>
                                            <h5 className="mb-0">
                                                Spending Trend
                                            </h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <div style={{ height: "300px" }}>
                                                {monthlyData.length > 0 ? (
                                                    <LineChart
                                                        xAxis={[
                                                            {
                                                                scaleType:
                                                                    "point",
                                                                data: monthlyData.map(
                                                                    (item) =>
                                                                        item.month
                                                                ),
                                                            },
                                                        ]}
                                                        series={[
                                                            {
                                                                data: monthlyData.map(
                                                                    (item) =>
                                                                        item.amount
                                                                ),
                                                                label: "Monthly Spending ($)",
                                                                color: "#198754",
                                                                curve: "linear",
                                                            },
                                                        ]}
                                                        height={300}
                                                    />
                                                ) : (
                                                    <p className="text-muted">
                                                        No data available
                                                    </p>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Recent Expenses Table */}
                            <Row>
                                <Col lg={12}>
                                    <Card>
                                        <Card.Header>
                                            <h5 className="mb-0">
                                                Recent Expenses
                                            </h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Description</th>
                                                            <th>Category</th>
                                                            <th>Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(
                                                            expenses
                                                        ) &&
                                                            expenses
                                                                .sort(
                                                                    (a, b) =>
                                                                        new Date(
                                                                            b.date
                                                                        ) -
                                                                        new Date(
                                                                            a.date
                                                                        )
                                                                )
                                                                .slice(0, 10)
                                                                .map(
                                                                    (
                                                                        expense,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                expense._id ||
                                                                                index
                                                                            }
                                                                        >
                                                                            <td>
                                                                                {new Date(
                                                                                    expense.date
                                                                                ).toLocaleDateString()}
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    expense.description
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                <span className="badge bg-secondary">
                                                                                    {
                                                                                        expense.category
                                                                                    }
                                                                                </span>
                                                                            </td>
                                                                            <td className="fw-bold text-danger">
                                                                                $
                                                                                {expense.amount.toFixed(
                                                                                    2
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default ExpensesPage;
