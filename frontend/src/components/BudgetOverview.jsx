import React from "react";

const BudgetOverview = ({ budgets, expenses }) => {
    const calculateBudgetUsage = (budget) => {
        const categoryExpenses = expenses
            .filter((expense) => expense.category === budget.category)
            .reduce((total, expense) => total + expense.amount, 0);

        const percentage = (categoryExpenses / budget.amount) * 100;
        return {
            spent: categoryExpenses,
            percentage: Math.min(percentage, 100),
            remaining: Math.max(budget.amount - categoryExpenses, 0),
        };
    };

    const getProgressBarClass = (percentage) => {
        if (percentage >= 90) return "bg-danger";
        if (percentage >= 70) return "bg-warning";
        return "bg-success";
    };

    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
                <h5 className="card-title mb-0">Budget Overview</h5>
            </div>
            <div className="card-body">
                {budgets.length > 0 ? (
                    <div className="space-y-4">
                        {budgets.map((budget) => {
                            const usage = calculateBudgetUsage(budget);
                            return (
                                <div key={budget._id} className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="mb-0">
                                            {budget.category}
                                        </h6>
                                        <small className="text-muted">
                                            ${usage.spent.toFixed(2)} / $
                                            {budget.amount.toFixed(2)}
                                        </small>
                                    </div>
                                    <div
                                        className="progress mb-2"
                                        style={{ height: "8px" }}
                                    >
                                        <div
                                            className={`progress-bar ${getProgressBarClass(
                                                usage.percentage
                                            )}`}
                                            role="progressbar"
                                            style={{
                                                width: `${usage.percentage}%`,
                                            }}
                                            aria-valuenow={usage.percentage}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                    <small className="text-muted">
                                        {usage.percentage.toFixed(1)}% used • $
                                        {usage.remaining.toFixed(2)} remaining
                                    </small>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-muted">
                        <i className="bi bi-pie-chart fs-1 d-block mb-2"></i>
                        <p>No budgets set up yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BudgetOverview;
