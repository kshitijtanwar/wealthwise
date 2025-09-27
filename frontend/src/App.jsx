import "bootstrap/dist/css/bootstrap.css";

import "bootstrap/dist/js/bootstrap.bundle.js";

import "./styles/custom.css";

import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";

import Homepage from "./pages/Homepage";

import LoginPage from "./pages/LoginPage";

import SignupPage from "./pages/SignupPage";

import Dashboard from "./pages/Dashboard";

import Layout from "./components/Layout/Layout";

import Budgets from "./pages/Budgets";

import Expenses from "./pages/Expenses";

import Goals from "./pages/Goals";

import { Toaster } from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";

import { AuthProvider } from "../contexts/AuthContext";

import Settings from "./pages/Settings";

const ProtectedRoutes = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center">
                Loading...
            </div>
        );
    }

    return user ? children : <Navigate to={"/login"} />;
};

const PublicRoutes = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center">
                Loading...
            </div>
        );
    }

    return user ? <Navigate to={"/dashboard"} /> : children;
};

function App() {
    return (
        <section>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Homepage />} />

                        <Route
                            path="/login"
                            element={
                                <PublicRoutes>
                                    <LoginPage />
                                </PublicRoutes>
                            }
                        />

                        <Route
                            path="/register"
                            element={
                                <PublicRoutes>
                                    <SignupPage />
                                </PublicRoutes>
                            }
                        />

                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoutes>
                                    <Layout />
                                </ProtectedRoutes>
                            }
                        >
                            <Route path="" element={<Dashboard />} />

                            <Route path="budgets" element={<Budgets />} />

                            <Route path="expenses" element={<Expenses />} />

                            <Route path="goals" element={<Goals />} />

                            <Route path="settings" element={<Settings />} />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>

            <Toaster />
        </section>
    );
}

export default App;
