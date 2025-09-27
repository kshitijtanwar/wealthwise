import React from "react";

const DashboardStats = ({ stats }) => {
    return (
        <div className="row mb-4">
            <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                                <div className="bg-primary bg-opacity-10 rounded p-3">
                                    <i className="bi bi-receipt text-primary fs-4"></i>
                                </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <h6 className="card-title text-muted mb-1">
                                    Total Expenses
                                </h6>
                                <h3 className="mb-0">
                                    {stats?.totalExpenses || 0}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                                <div className="bg-success bg-opacity-10 rounded p-3">
                                    <i className="bi bi-pie-chart text-success fs-4"></i>
                                </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <h6 className="card-title text-muted mb-1">
                                    Active Budgets
                                </h6>
                                <h3 className="mb-0">
                                    {stats?.totalBudgets || 0}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                                <div className="bg-warning bg-opacity-10 rounded p-3">
                                    <i className="bi bi-target text-warning fs-4"></i>
                                </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <h6 className="card-title text-muted mb-1">
                                    Financial Goals
                                </h6>
                                <h3 className="mb-0">
                                    {stats?.totalGoals || 0}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
