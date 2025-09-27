import React from "react";

const RecentTransactions = ({ expenses }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getCategoryIcon = (category) => {
        const icons = {
            Food: "bi-cup-straw",
            Transportation: "bi-car-front",
            Travel: "bi-airplane",
            Shopping: "bi-bag",
            Entertainment: "bi-controller",
            Health: "bi-heart-pulse",
            Utilities: "bi-lightning",
            Education: "bi-book",
        };
        return icons[category] || "bi-receipt";
    };

    const getCategoryColor = (category) => {
        const colors = {
            Food: "text-primary",
            Transportation: "text-success",
            Travel: "text-info",
            Shopping: "text-warning",
            Entertainment: "text-danger",
            Health: "text-secondary",
            Utilities: "text-dark",
            Education: "text-purple",
        };
        return colors[category] || "text-muted";
    };

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
                <h5 className="card-title mb-0">Recent Transactions</h5>
            </div>
            <div className="card-body">
                {expenses.length > 0 ? (
                    <div className="list-group list-group-flush">
                        {expenses.map((expense) => (
                            <div
                                key={expense._id}
                                className="list-group-item border-0 px-0"
                            >
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        <div
                                            className={`rounded-circle p-2 bg-light ${getCategoryColor(
                                                expense.category
                                            )}`}
                                        >
                                            <i
                                                className={`bi ${getCategoryIcon(
                                                    expense.category
                                                )}`}
                                            ></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <h6 className="mb-1">
                                                    {expense.description ||
                                                        "Expense"}
                                                </h6>
                                                <small className="text-muted">
                                                    {expense.category}
                                                    {expense.merchant &&
                                                        ` • ${expense.merchant}`}
                                                </small>
                                            </div>
                                            <div className="text-end">
                                                <div className="fw-bold text-danger">
                                                    -$
                                                    {expense.amount.toFixed(2)}
                                                </div>
                                                <small className="text-muted">
                                                    {formatDate(expense.date)}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted py-4">
                        <i className="bi bi-receipt fs-1 d-block mb-2"></i>
                        <p>No transactions yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentTransactions;