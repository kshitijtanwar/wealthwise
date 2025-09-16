import React, { useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { AuthContext } from "./AuthContextProvider";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            setUser(response.data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Login failed",
            };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await authAPI.signup(userData);
            setUser(response.data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Signup failed",
            };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
            setUser(null); // Logout locally even if API call fails
        }
    };

    useEffect(() => {
        // Check if user is already logged in on app start
        const checkAuthStatus = async () => {
            try {
                const response = await authAPI.getMe();
                setUser(response.data);
            } catch {
                // User is not logged in or token is invalid
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const value = {
        user,
        login,
        signup,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
