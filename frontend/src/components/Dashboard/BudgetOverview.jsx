const BudgetOverview = ({ budgets, expenses }) => {
    const now = new Date();
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
    ];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const calculateBudgetUsage = (budget) => {
        const categoryExpenses = expenses
            .filter((expense) => {
                const expenseDate = new Date(expense.date);
                return (
                    expense.category === budget.category &&
                    expenseDate.getMonth() === currentMonth &&
                    expenseDate.getFullYear() === currentYear
                );
            })
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
        <div
            className="card border-0 shadow-lg h-100 hover-lift"
            style={{ transition: "all 0.3s ease" }}
        >
            <div className="card-header bg-white border-0 pb-0">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <h5 className="card-title mb-1 fw-bold">
                            {months[currentMonth]} Budget Tracker
                        </h5>
                        <small className="text-muted">
                            Monitor your monthly spending
                        </small>
                    </div>
                    <div className="dropdown">
                        <button
                            className="btn btn-sm btn-outline-primary rounded-pill"
                            type="button"
                        >
                            <i className="bi bi-gear"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-body">
                {budgets.length > 0 ? (
                    <div className="space-y-4">
                        {budgets.map((budget) => {
                            const usage = calculateBudgetUsage(budget);
                            return (
                                <div
                                    key={budget._id}
                                    className="p-3 bg-light bg-opacity-50 rounded-3 mb-3"
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center">
                                            <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                                                <i className="bi bi-wallet2 text-primary"></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-0 fw-bold">
                                                    {budget.category}
                                                </h6>
                                                <small className="text-muted">
                                                    Budget limit
                                                </small>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div className="fw-bold">
                                                ${usage.spent.toFixed(2)}
                                            </div>
                                            <small className="text-muted">
                                                of ${budget.amount.toFixed(2)}
                                            </small>
                                        </div>
                                    </div>

                                    <div
                                        className="progress mb-3"
                                        style={{ height: "12px" }}
                                    >
                                        <div
                                            className={`progress-bar progress-bar-striped progress-bar-animated ${getProgressBarClass(
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

                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="badge bg-light text-dark">
                                            {usage.percentage.toFixed(1)}% used
                                        </span>
                                        <small
                                            className={`fw-medium ${
                                                usage.remaining > 0
                                                    ? "text-success"
                                                    : "text-danger"
                                            }`}
                                        >
                                            <i
                                                className={`bi ${
                                                    usage.remaining > 0
                                                        ? "bi-arrow-down"
                                                        : "bi-exclamation-triangle"
                                                } me-1`}
                                            ></i>
                                            $
                                            {Math.abs(usage.remaining).toFixed(
                                                2
                                            )}{" "}
                                            {usage.remaining > 0
                                                ? "remaining"
                                                : "over budget"}
                                        </small>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-muted py-5">
                        <div
                            className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                            style={{ width: "80px", height: "80px" }}
                        >
                            <i className="bi bi-pie-chart fs-1 text-primary"></i>
                        </div>
                        <h6>No budgets set up yet</h6>
                        <p className="mb-0">
                            Create your first budget to start tracking
                        </p>
                        <button className="btn btn-primary btn-sm mt-3 rounded-pill">
                            <i className="bi bi-plus me-1"></i>Create Budget
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BudgetOverview;
