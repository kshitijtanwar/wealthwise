import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const handleLogout = () => {
        logout();
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

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
                            className={`nav-link ${
                                isActive("/dashboard")
                                    ? "text-white active"
                                    : "text-white-50"
                            }`}
                            to="/dashboard"
                        >
                            <i className="bi bi-house me-2"></i>Dashboard
                        </Link>
                        <Link
                            className={`nav-link ${
                                isActive("/expenses")
                                    ? "text-white active"
                                    : "text-white-50"
                            }`}
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
            <div
                className="flex-fill bg-light d-flex flex-column"
                style={{ height: "100vh" }}
            >
                <div className="flex-fill overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
