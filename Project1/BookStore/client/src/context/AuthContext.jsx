import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const userInfo = sessionStorage.getItem('userInfo');
        if (userInfo) {
            try {
                return JSON.parse(userInfo);
            } catch (error) {
                sessionStorage.removeItem('userInfo');
                return null;
            }
        }
        return null;
    });
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/users/login', { email, password });
            setUser(data);
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || error.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post('/api/users', { name, email, password });
            setUser(data);
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || error.message };
        }
    };

    const logout = () => {
        sessionStorage.removeItem('userInfo');
        setUser(null);
    };

    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        sessionStorage.setItem('userInfo', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
