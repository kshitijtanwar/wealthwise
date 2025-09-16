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
        <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
                <h5 className="card-title mb-0">Expenses by Category</h5>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center">
                {chartData.length > 0 ? (
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
                        height={300}
                        width={400}
                    />
                ) : (
                    <div className="text-center text-muted">
                        <i className="bi bi-chart-pie fs-1 d-block mb-2"></i>
                        <p>No expense data available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseChart;
