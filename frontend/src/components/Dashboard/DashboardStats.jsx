import React from "react";

const DashboardStats = ({ stats }) => {
    const statsData = [
        {
            title: "Total Expenses",
            value: stats?.totalExpenses || 0,
            icon: "bi-wallet",
            color: "primary",
            bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        {
            title: "Active Budgets",
            value: stats?.totalBudgets || 0,
            icon: "bi-pie-chart-fill",
            color: "success",
            bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        {
            title: "Financial Goals",
            value: stats?.totalGoals || 0,
            icon: "bi-bullseye",
            color: "warning",
            bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        {
            title: "Monthly Savings",
            value: stats?.monthlySavings || "₹1,250",
            icon: "bi-piggy-bank",
            color: "info",
            bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
    ];

    return (
        <div className="row mb-5 g-4">
            {statsData.map((stat, index) => (
                <div key={index} className="col-lg-3 col-md-6">
                    <div
                        className="card border-0 shadow-lg h-100 hover-lift"
                        style={{ transition: "all 0.3s ease" }}
                    >
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            background: stat.bgGradient,
                                        }}
                                    >
                                        <i
                                            className={`bi ${stat.icon} text-white fs-4`}
                                        ></i>
                                    </div>
                                </div>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-sm btn-outline-light border-0"
                                        type="button"
                                    >
                                        <i className="bi bi-three-dots-vertical"></i>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h6 className="text-muted mb-2 fw-medium">
                                    {stat.title}
                                </h6>
                                <h2 className="fw-bold mb-0 text-dark">
                                    {stat.value}
                                </h2>
                                <small className="text-success">
                                    <i className="bi bi-arrow-up-short"></i>
                                    +2.5% from last month
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
