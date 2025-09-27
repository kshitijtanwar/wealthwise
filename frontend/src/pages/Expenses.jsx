import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { expenseAPI } from "../../services/api";

import { LineChart, BarChart } from "@mui/x-charts";

import { useState, useEffect } from "react";

import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";

import AddExpense from "../components/Expenses/AddExpense";

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);

            const response = await expenseAPI.getExpenses();

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

    const handleAddExpense = async () => {
        await fetchExpenses();
    };

    if (loading) {
        return (
            <Container className="py-5">
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "60vh" }}
                >
                    <div className="text-center">
                        <Spinner
                            animation="border"
                            variant="primary"
                            className="mb-3"
                            style={{ width: "3rem", height: "3rem" }}
                        />
                        <h5 className="text-muted">Loading your expenses...</h5>
                        <p className="text-muted small">
                            Please wait while we fetch your data
                        </p>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="">
                    <h1 className="display-5 fw-bold text-dark mb-2">
                        Expenses
                    </h1>
                    <p className="text-muted fs-6 mb-0">
                        Track and analyze your spending patterns
                    </p>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="btn btn-primary px-4 py-2 rounded-3 shadow-sm hover-lift"
                    style={{ height: "fit-content" }}
                >
                    <AddRoundedIcon className="me-2" /> Add Expense
                </button>
            </div>

            {error && (
                <Row className="mb-4">
                    <Col>
                        <Alert variant="danger">{error}</Alert>
                    </Col>
                </Row>
            )}

            {expenses.length === 0 && !loading ? (
                <Row className="justify-content-center">
                    <Col lg={8} xl={6}>
                        <Card className="border-0 shadow-sm bg-light">
                            <Card.Body className="text-center py-5">
                                <div className="mb-4">
                                    <div
                                        className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center"
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                        }}
                                    >
                                        <AddRoundedIcon
                                            style={{
                                                fontSize: "2.5rem",
                                                color: "var(--bs-primary)",
                                            }}
                                        />
                                    </div>
                                </div>
                                <h4 className="text-dark mb-3">
                                    No expenses yet
                                </h4>
                                <p className="text-muted mb-4">
                                    Start tracking your expenses to get insights
                                    into your spending habits and financial
                                    patterns.
                                </p>
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="btn btn-primary px-4 py-2 rounded-3"
                                >
                                    <AddRoundedIcon className="me-2" /> Add Your
                                    First Expense
                                </button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <>
                    {/* Summary Cards */}
                    <Row className="mb-5 g-4">
                        <Col md={4}>
                            <Card className="border-0 shadow-sm h-100 hover-lift">
                                <Card.Body className="text-center py-4">
                                    <div
                                        className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                        }}
                                    >
                                        <span
                                            className="fw-bold text-primary"
                                            style={{ fontSize: "1.5rem" }}
                                        >
                                            $
                                        </span>
                                    </div>
                                    <h3 className="text-primary fw-bold mb-2">
                                        ${totalSpent.toFixed(2)}
                                    </h3>
                                    <p className="text-muted mb-0 fw-medium">
                                        Total Spent
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="border-0 shadow-sm h-100 hover-lift">
                                <Card.Body className="text-center py-4">
                                    <div
                                        className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                        }}
                                    >
                                        <span
                                            className="fw-bold text-success"
                                            style={{ fontSize: "1.5rem" }}
                                        >
                                            #
                                        </span>
                                    </div>
                                    <h3 className="text-success fw-bold mb-2">
                                        {expenses.length}
                                    </h3>
                                    <p className="text-muted mb-0 fw-medium">
                                        Total Transactions
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="border-0 shadow-sm h-100 hover-lift">
                                <Card.Body className="text-center py-4">
                                    <div
                                        className="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                        }}
                                    >
                                        <span
                                            className="fw-bold text-info"
                                            style={{ fontSize: "1.5rem" }}
                                        >
                                            📊
                                        </span>
                                    </div>
                                    <h3 className="text-info fw-bold mb-2">
                                        {categoryData.length}
                                    </h3>
                                    <p className="text-muted mb-0 fw-medium">
                                        Categories
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Charts Row */}
                    <Row className="g-4 mb-5">
                        {/* Spending Trend Chart */}
                        <Col lg={6}>
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Header className="bg-transparent border-0 py-3">
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center me-3"
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                            }}
                                        >
                                            <span
                                                style={{ fontSize: "1.2rem" }}
                                            >
                                                📈
                                            </span>
                                        </div>
                                        <div>
                                            <h5 className="mb-0 fw-semibold">
                                                Spending Trend
                                            </h5>
                                            <small className="text-muted">
                                                Track your spending over time
                                            </small>
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body className="pt-2">
                                    <div
                                        style={{ height: "320px" }}
                                        className="d-flex align-items-center justify-content-center"
                                    >
                                        {monthlyData.length > 0 ? (
                                            <LineChart
                                                xAxis={[
                                                    {
                                                        scaleType: "point",
                                                        data: monthlyData.map(
                                                            (item) => item.month
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
                                            <div className="text-center">
                                                <div
                                                    className="text-muted mb-2"
                                                    style={{ fontSize: "3rem" }}
                                                >
                                                    📊
                                                </div>
                                                <p className="text-muted">
                                                    No data available yet
                                                </p>
                                                <small className="text-muted">
                                                    Add some expenses to see
                                                    trends
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Monthly Bar Chart */}
                        <Col lg={6}>
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Header className="bg-transparent border-0 py-3">
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center me-3"
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                            }}
                                        >
                                            <span
                                                style={{ fontSize: "1.2rem" }}
                                            >
                                                📊
                                            </span>
                                        </div>
                                        <div>
                                            <h5 className="mb-0 fw-semibold">
                                                Monthly Spending
                                            </h5>
                                            <small className="text-muted">
                                                Compare monthly expenses
                                            </small>
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body className="pt-2">
                                    <div
                                        style={{ height: "320px" }}
                                        className="d-flex align-items-center justify-content-center"
                                    >
                                        {monthlyData.length > 0 ? (
                                            <BarChart
                                                xAxis={[
                                                    {
                                                        scaleType: "band",
                                                        data: monthlyData.map(
                                                            (item) => item.month
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
                                                        color: "#6610f2",
                                                    },
                                                ]}
                                                height={300}
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <div
                                                    className="text-muted mb-2"
                                                    style={{ fontSize: "3rem" }}
                                                >
                                                    📊
                                                </div>
                                                <p className="text-muted">
                                                    No data available yet
                                                </p>
                                                <small className="text-muted">
                                                    Add some expenses to see
                                                    charts
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Recent Expenses Table */}
                    <Row>
                        <Col lg={12}>
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-transparent border-0 py-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: "1.2rem",
                                                    }}
                                                >
                                                    📋
                                                </span>
                                            </div>
                                            <div>
                                                <h5 className="mb-0 fw-semibold">
                                                    Recent Expenses
                                                </h5>
                                                <small className="text-muted">
                                                    Your latest transactions
                                                </small>
                                            </div>
                                        </div>
                                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                                            {expenses.length > 10
                                                ? "10"
                                                : expenses.length}{" "}
                                            of {expenses.length}
                                        </span>
                                    </div>
                                </Card.Header>
                                <Card.Body className="pt-2">
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead>
                                                <tr className="border-bottom">
                                                    <th className="border-0 text-muted fw-semibold py-3">
                                                        Date
                                                    </th>
                                                    <th className="border-0 text-muted fw-semibold py-3">
                                                        Description
                                                    </th>
                                                    <th className="border-0 text-muted fw-semibold py-3">
                                                        Category
                                                    </th>
                                                    <th className="border-0 text-muted fw-semibold py-3 text-end">
                                                        Amount
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(expenses) &&
                                                    expenses
                                                        .sort(
                                                            (a, b) =>
                                                                new Date(
                                                                    b.date
                                                                ) -
                                                                new Date(a.date)
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
                                                                    className="hover-bg-light"
                                                                >
                                                                    <td className="py-3">
                                                                        <div className="text-dark fw-medium">
                                                                            {new Date(
                                                                                expense.date
                                                                            ).toLocaleDateString(
                                                                                "en-US",
                                                                                {
                                                                                    month: "short",
                                                                                    day: "numeric",
                                                                                    year: "numeric",
                                                                                }
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-3">
                                                                        <div className="text-dark fw-medium">
                                                                            {
                                                                                expense.description
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-3">
                                                                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-3">
                                                                            {
                                                                                expense.category
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-3 text-end">
                                                                        <span className="fw-bold text-danger fs-6">
                                                                            $
                                                                            {expense.amount.toFixed(
                                                                                2
                                                                            )}
                                                                        </span>
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

            <AddExpense
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onExpenseAdded={handleAddExpense}
            />
        </Container>
    );
};

export default Expenses;
