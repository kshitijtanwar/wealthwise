import { useState, useEffect } from "react";

import { authAPI } from "../services/api";

import { AuthContext } from "./AuthProvider";


 

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);


 

    const login = async (credentials) => {

        try {

            const response = await authAPI.login(credentials);

            setUser(response.data);

            return { success: true, message: "Login successful!" };

        } catch (error) {

            return {

                success: false,

                message: error.response.data.error || "Login failed",

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

                error: error.response.data.error || "Signup failed",

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

    const checkAuthStatus = async () => {

        try {

            const response = await authAPI.getMe();

            setUser(response.data);

        } catch {

            setUser(null);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        checkAuthStatus();

    }, []);


 

    const value = {

        user,

        login,

        signup,

        logout,

        loading,

        checkAuthStatus

    };


 

    return (

        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

    );

};

