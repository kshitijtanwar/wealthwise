import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await login({ email, password });

        if (!result.success) {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <div className="col-md-6 d-flex align-items-center justify-content-center bg-primary">
                    <div className="text-white text-center">
                        <h1 className="display-4 fw-bold">WealthWise</h1>
                        <p className="lead">
                            Manage your finances intelligently
                        </p>
                    </div>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-center">
                    <div className="w-100" style={{ maxWidth: "400px" }}>
                        <div className="card border-0 shadow">
                            <div className="card-body p-5">
                                <h2 className="card-title text-center mb-4">
                                    Welcome Back
                                </h2>
                                <form onSubmit={handleSubmit}>
                                    {error && (
                                        <div
                                            className="alert alert-danger"
                                            role="alert"
                                        >
                                            {error}
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <label
                                            htmlFor="email"
                                            className="form-label"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="password"
                                            className="form-label"
                                        >
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 mb-3"
                                        disabled={loading}
                                    >
                                        {loading ? "Signing in..." : "Sign In"}
                                    </button>
                                </form>
                                <div className="text-center">
                                    <p className="mb-0">
                                        Don't have an account?{" "}
                                        <Link
                                            to="/signup"
                                            className="text-primary text-decoration-none"
                                        >
                                            Sign up
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
