import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const ExpenseChart = ({ expenses }) => {
    // Process expenses data for chart
    const processExpenseData = () => {
        const categoryTotals = {};

        expenses.forEach((expense) => {
            if (categoryTotals[expense.category]) {
                categoryTotals[expense.category] += expense.amount;
            } else {
                categoryTotals[expense.category] = expense.amount;
            }
        });

        return Object.entries(categoryTotals).map(
            ([category, amount], index) => ({
                id: index,
                value: amount,
                label: category,
            })
        );
    };

    const chartData = processExpenseData();

    return (
        <div
            className="card border-0 shadow-lg h-100 hover-lift"
            style={{ transition: "all 0.3s ease" }}
        >
            <div className="card-header bg-white border-0 pb-0">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <h5 className="card-title mb-1 fw-bold">
                            Expense Categories
                        </h5>
                        <small className="text-muted">
                            Your spending breakdown
                        </small>
                    </div>
                    <div className="dropdown">
                        <button
                            className="btn btn-sm btn-outline-primary rounded-pill"
                            type="button"
                        >
                            <i className="bi bi-three-dots"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-body">
                {chartData.length > 0 ? (
                    <div className="row align-items-center">
                        <div className="col-md-7">
                            <PieChart
                                series={[
                                    {
                                        data: chartData,
                                        highlightScope: {
                                            faded: "global",
                                            highlighted: "item",
                                        },
                                        faded: {
                                            innerRadius: 30,
                                            additionalRadius: -30,
                                            color: "gray",
                                        },
                                    },
                                ]}
                                height={280}
                                width={280}
                            />
                        </div>
                        <div className="col-md-5">
                            <div className="ms-3">
                                <h6 className="fw-bold mb-3">
                                    Category Summary
                                </h6>
                                {chartData.slice(0, 5).map((item, index) => (
                                    <div
                                        key={index}
                                        className="d-flex align-items-center mb-2"
                                    >
                                        <div
                                            className="rounded-circle me-2"
                                            style={{
                                                width: "12px",
                                                height: "12px",
                                                background: `hsl(${
                                                    index * 60
                                                }, 70%, 60%)`,
                                            }}
                                        ></div>
                                        <div className="flex-grow-1">
                                            <small className="text-muted">
                                                {item.label}
                                            </small>
                                            <div className="fw-bold">
                                                ₹{item.value.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-muted py-5">
                        <div
                            className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                            style={{ width: "80px", height: "80px" }}
                        >
                            <i className="bi bi-chart-pie fs-1 text-primary"></i>
                        </div>
                        <h6>No expense data available</h6>
                        <p className="mb-0">
                            Start tracking your expenses to see insights
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseChart;
