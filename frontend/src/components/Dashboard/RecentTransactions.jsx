import React, { useState, useMemo } from "react";

const RecentTransactions = ({ expenses }) => {
    const [filterType, setFilterType] = useState("recent");
    const [selectedCategory, setSelectedCategory] = useState("all");

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

    // Get unique categories from expenses
    const categories = useMemo(() => {
        const uniqueCategories = [
            ...new Set(expenses.map((expense) => expense.category)),
        ];
        return uniqueCategories.sort();
    }, [expenses]);

    // Filter and sort expenses based on selected filters
    const filteredAndSortedExpenses = useMemo(() => {
        let filtered = [...expenses];

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (expense) => expense.category === selectedCategory
            );
        }

        // Sort by filter type
        switch (filterType) {
            case "recent":
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case "oldest":
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case "price-high":
                filtered.sort((a, b) => b.amount - a.amount);
                break;
            case "price-low":
                filtered.sort((a, b) => a.amount - b.amount);
                break;
            default:
                break;
        }

        return filtered;
    }, [expenses, filterType, selectedCategory]);

    const getFilterLabel = () => {
        const filterLabels = {
            recent: "Most Recent",
            oldest: "Oldest First",
            "price-high": "Price: High to Low",
            "price-low": "Price: Low to High",
        };
        return filterLabels[filterType] || "Recent";
    };

    const handleFilterChange = (newFilterType) => {
        setFilterType(newFilterType);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const clearFilters = () => {
        setFilterType("recent");
        setSelectedCategory("all");
    };

    return (
        <div
            className="card border-0 shadow-lg hover-lift"
            style={{ transition: "all 0.3s ease" }}
        >
            <div className="card-header bg-white border-0 pb-0">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <h5 className="card-title mb-1 fw-bold">
                            Recent Transactions
                        </h5>
                        <small className="text-muted">
                            Your latest financial activities
                            {(filterType !== "recent" ||
                                selectedCategory !== "all") && (
                                <span className="ms-1">
                                    • Filtered (
                                    {filteredAndSortedExpenses.length} of{" "}
                                    {expenses.length})
                                </span>
                            )}
                        </small>
                    </div>
                    <div className="d-flex gap-2">
                        <div className="dropdown">
                            <button
                                className="btn btn-sm btn-outline-primary rounded-pill px-3 dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-funnel me-1"></i>
                                {getFilterLabel()}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <h6 className="dropdown-header">Sort By</h6>
                                </li>
                                <li>
                                    <button
                                        className={`dropdown-item ${
                                            filterType === "recent"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleFilterChange("recent")
                                        }
                                    >
                                        <i className="bi bi-clock me-2"></i>Most
                                        Recent
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`dropdown-item ${
                                            filterType === "oldest"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleFilterChange("oldest")
                                        }
                                    >
                                        <i className="bi bi-clock-history me-2"></i>
                                        Oldest First
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`dropdown-item ${
                                            filterType === "price-high"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleFilterChange("price-high")
                                        }
                                    >
                                        <i className="bi bi-arrow-down me-2"></i>
                                        Price: High to Low
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`dropdown-item ${
                                            filterType === "price-low"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleFilterChange("price-low")
                                        }
                                    >
                                        <i className="bi bi-arrow-up me-2"></i>
                                        Price: Low to High
                                    </button>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <h6 className="dropdown-header">
                                        Filter by Category
                                    </h6>
                                </li>
                                <li>
                                    <button
                                        className={`dropdown-item ${
                                            selectedCategory === "all"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleCategoryChange("all")
                                        }
                                    >
                                        <i className="bi bi-list me-2"></i>All
                                        Categories
                                    </button>
                                </li>
                                {categories.map((category) => (
                                    <li key={category}>
                                        <button
                                            className={`dropdown-item ${
                                                selectedCategory === category
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleCategoryChange(category)
                                            }
                                        >
                                            <i
                                                className={`bi ${getCategoryIcon(
                                                    category
                                                )} me-2`}
                                            ></i>
                                            {category}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item text-danger"
                                        onClick={clearFilters}
                                    >
                                        <i className="bi bi-x-circle me-2"></i>
                                        Clear Filters
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <button className="btn btn-sm btn-primary rounded-pill px-3">
                            <i className="bi bi-eye me-1"></i>View All
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-body px-0">
                {filteredAndSortedExpenses.length > 0 ? (
                    <div className="">
                        {filteredAndSortedExpenses.map((expense, index) => (
                            <div
                                key={expense._id}
                                className={`d-flex align-items-center p-3 hover-bg-light ${
                                    index !==
                                    filteredAndSortedExpenses.length - 1
                                        ? "border-bottom"
                                        : ""
                                }`}
                                style={{
                                    transition: "background-color 0.2s ease",
                                }}
                            >
                                <div className="flex-shrink-0 me-3">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            background:
                                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        }}
                                    >
                                        <i
                                            className={`bi ${getCategoryIcon(
                                                expense.category
                                            )} text-white`}
                                        ></i>
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="mb-1 fw-bold">
                                                {expense.description ||
                                                    "Expense"}
                                            </h6>
                                            <div className="d-flex align-items-center">
                                                <span className="badge bg-light text-dark me-2">
                                                    {expense.category}
                                                </span>
                                                {expense.merchant && (
                                                    <small className="text-muted">
                                                        <i className="bi bi-shop me-1"></i>
                                                        {expense.merchant}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div className="fw-bold fs-5 text-danger mb-1">
                                                -${expense.amount.toFixed(2)}
                                            </div>
                                            <small className="text-muted d-flex align-items-center">
                                                <i className="bi bi-calendar3 me-1"></i>
                                                {formatDate(expense.date)}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : expenses.length > 0 ? (
                    <div className="text-center text-muted py-5">
                        <div
                            className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                            style={{ width: "80px", height: "80px" }}
                        >
                            <i className="bi bi-funnel fs-1 text-primary"></i>
                        </div>
                        <h6>No transactions match your filters</h6>
                        <p className="mb-0">
                            Try adjusting your filter criteria
                        </p>
                        <button
                            className="btn btn-outline-primary btn-sm mt-3 rounded-pill"
                            onClick={clearFilters}
                        >
                            <i className="bi bi-x-circle me-1"></i>Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-muted py-5">
                        <div
                            className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                            style={{ width: "80px", height: "80px" }}
                        >
                            <i className="bi bi-receipt fs-1 text-primary"></i>
                        </div>
                        <h6>No transactions yet</h6>
                        <p className="mb-0">
                            Your recent transactions will appear here
                        </p>
                        <button className="btn btn-primary btn-sm mt-3 rounded-pill">
                            <i className="bi bi-plus me-1"></i>Add Transaction
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentTransactions;
