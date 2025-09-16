import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const result = await signup({
            name: formData.name,
            email: formData.email,
            password: formData.password,
        });

        if (!result.success) {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <div className="col-md-6 d-flex align-items-center justify-content-center bg-success">
                    <div className="text-white text-center">
                        <h1 className="display-4 fw-bold">WealthWise</h1>
                        <p className="lead">
                            Start your financial journey today
                        </p>
                    </div>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-center">
                    <div className="w-100" style={{ maxWidth: "400px" }}>
                        <div className="card border-0 shadow">
                            <div className="card-body p-5">
                                <h2 className="card-title text-center mb-4">
                                    Create Account
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
                                            htmlFor="name"
                                            className="form-label"
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
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
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
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
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="confirmPassword"
                                            className="form-label"
                                        >
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-success w-100 mb-3"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Creating account..."
                                            : "Sign Up"}
                                    </button>
                                </form>
                                <div className="text-center">
                                    <p className="mb-0">
                                        Already have an account?{" "}
                                        <Link
                                            to="/login"
                                            className="text-success text-decoration-none"
                                        >
                                            Sign in
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

export default SignupPage;
