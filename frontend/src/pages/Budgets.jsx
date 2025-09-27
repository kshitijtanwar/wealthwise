import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { budgetAPI } from "../../services/api";

import { expenseAPI } from "../../services/api";

import { useState, useEffect } from "react";

import {
    Container,
    Row,
    Col,
    Card,
    Alert,
    Spinner,
    ProgressBar,
} from "react-bootstrap";

import { LineChart } from "@mui/x-charts";

import AddBudget from "../components/Budgets/AddBudget";

const COLORS = [
    "#e63946", // strong red
    "#1d3557", // navy blue
    "#f4a261", // orange
    "#2a9d8f", // teal
    "#264653", // dark blue
    "#9d4edd", // purple
];

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [budgetsRes, expensesRes] = await Promise.all([
                budgetAPI.getBudgets(),
                expenseAPI.getExpenses(),
            ]);
            setBudgets(budgetsRes.data.budgets || budgetsRes.data || []);
            setExpenses(expensesRes.data.expenses || expensesRes.data || []);
            setError("");
        } catch (err) {
            setError("Failed to fetch budgets or expenses.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /*

   * Aggregate expense amounts by category for pie chart and budget consumption

   */

    const expenseTotalsByCategory = expenses.reduce((acc, e) => {
        if (e.category && e.amount) {
            acc[e.category] = (acc[e.category] || 0) + e.amount;
        }
        return acc;
    }, {});

    /*

   * Build data for line chart:

   * Track budget remaining over months for each category (assuming expenses have 'date')

   */

    const monthlyExpensesByCategory = {};

    expenses.forEach(({ category, date, amount }) => {
        if (category && date && amount) {
            const month = new Date(date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
            });
            if (!monthlyExpensesByCategory[category])
                monthlyExpensesByCategory[category] = {};
            monthlyExpensesByCategory[category][month] =
                (monthlyExpensesByCategory[category][month] || 0) + amount;
        }
    });

    const allMonthsSet = new Set();
    Object.values(monthlyExpensesByCategory).forEach((m) =>
        Object.keys(m).forEach((month) => allMonthsSet.add(month))
    );
    const allMonths = Array.from(allMonthsSet).sort(
        (a, b) => new Date(a) - new Date(b)
    );

    const lineSeries = budgets.map((b, idx) => {
        const monthlySpend = monthlyExpensesByCategory[b.category] || {};
        let cumulativeSpend = 0;
        const data = allMonths.map((month) => {
            const spent = monthlySpend[month] || 0;
            cumulativeSpend += spent;
            return Math.max(b.amount - cumulativeSpend, 0);
        });
        return {
            label: `${b.category}`,
            data,
            color: COLORS[idx % COLORS.length],
            curve: "linear",
        };
    });

    /*

   * For progress bars, show spend % per budget

   */

    const enhancedBudgets = budgets.map((b, idx) => {
        const spent = expenseTotalsByCategory[b.category] || 0;
        const percentUsed = Math.min(100, (spent / b.amount || 0) * 100);
        return {
            ...b,
            spent,
            percentUsed,
            remaining: Math.max(b.amount - spent, 0),
            color: COLORS[idx % COLORS.length],
        };
    });

    if (loading)
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
                        <h5 className="text-muted">Loading your budgets...</h5>
                        <p className="text-muted small">
                            Please wait while we fetch your data
                        </p>
                    </div>
                </div>
            </Container>
        );

    return (
        <Container className="py-4">
            {error && (
                <Alert variant="danger" className="rounded-3 border-0">
                    {error}
                </Alert>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="display-5 fw-bold text-dark mb-1">
                        Budgets
                    </h1>
                    <p className="text-muted mb-0">Track usage and trends</p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn btn-primary px-4 py-2 rounded-3 shadow-sm hover-lift"
                    style={{ height: "fit-content" }}
                >
                    <AddRoundedIcon className="me-2" /> Add Budget
                </button>
            </div>

            {/* Budget Usage */}
            <Row className="mb-4">
                <Col>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-transparent border-0 py-3">
                            <div className="d-flex align-items-center">
                                <div
                                    className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center me-3"
                                    style={{ width: "40px", height: "40px" }}
                                >
                                    <span style={{ fontSize: "1.2rem" }}>
                                        📊
                                    </span>
                                </div>
                                <div>
                                    <h5 className="mb-0 fw-semibold">
                                        Budget Usage
                                    </h5>
                                    <small className="text-muted">
                                        Track spending progress across budgets
                                    </small>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="pt-2">
                            {enhancedBudgets.length ? (
                                enhancedBudgets.map((budget, idx) => (
                                    <div
                                        key={idx}
                                        className="mb-4 p-3 bg-light bg-opacity-50 rounded-3"
                                    >
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <strong className="text-dark">
                                                {budget.category}
                                            </strong>
                                            <div className="text-end">
                                                <div className="fw-semibold">
                                                    ₹{budget.spent.toFixed(2)} /
                                                    ${budget.amount.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                        <ProgressBar
                                            now={budget.percentUsed}
                                            label={`${budget.percentUsed.toFixed(
                                                1
                                            )}%`}
                                            className="rounded-3"
                                            style={{ height: "8px" }}
                                            variant="info"
                                            animated
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    <div
                                        className="text-muted mb-2"
                                        style={{ fontSize: "2rem" }}
                                    >
                                        📊
                                    </div>
                                    <p className="text-muted mb-0">
                                        No budget data available.
                                    </p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Budget Remaining Over Time */}
            <Row>
                <Col>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-transparent border-0 py-3">
                            <div className="d-flex align-items-center">
                                <div
                                    className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center me-3"
                                    style={{ width: "40px", height: "40px" }}
                                >
                                    <span style={{ fontSize: "1.2rem" }}>
                                        📈
                                    </span>
                                </div>
                                <div>
                                    <h5 className="mb-0 fw-semibold">
                                        Budget Remaining Over Time
                                    </h5>
                                    <small className="text-muted">
                                        Track how your remaining budget changes
                                        by month
                                    </small>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="pt-2">
                            {lineSeries.length ? (
                                <LineChart
                                    height={400}
                                    xAxis={[
                                        {
                                            scaleType: "point",
                                            data: allMonths,
                                        },
                                    ]}
                                    series={lineSeries}
                                />
                            ) : (
                                <div className="text-center py-4">
                                    <div
                                        className="text-muted mb-2"
                                        style={{ fontSize: "2rem" }}
                                    >
                                        📈
                                    </div>
                                    <p className="text-muted mb-0">
                                        No budget data available.
                                    </p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <AddBudget
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onBudgetAdded={fetchAllData}
            />
        </Container>
    );
};

export default Budgets;
