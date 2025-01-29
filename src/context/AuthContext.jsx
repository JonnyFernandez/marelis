import { createContext, useState, useContext, useEffect } from "react";

import { registerRequest, loginRequest, verifyTokenRequest, logoutRequest, toggleStatusRequest, deleteUserRequest } from "../api/auth";
import Cookies from 'js-cookie';

export const AuthContext = createContext({}); // Cambiado a AuthContext

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [Loading, setLoading] = useState(true);




    const signup = async (values) => {
        console.log("Registrando al usuario:", values);

        try {
            const res = await registerRequest(values);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            setErrors(error.response?.data?.message || ["Unexpected error occurred"]);
        }
    };

    const signin = async (values) => {
        try {
            const res = await loginRequest(values);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    };

    const getAllUsers = async () => {
        console.log(`Buscando todos los usuarios`);

        try {
            const res = await usersRequest();

            setUsers(res.data);

        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    };

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get();

            if (!cookies.token) {
                setIsAuthenticated(false);
                setLoading(false);
                return setUser(null);
            }

            try {
                const res = await verifyTokenRequest(cookies.token);
                // console.log(res);

                if (!res.data) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }
                setIsAuthenticated(true);
                setUser(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
            }
        }
        checkLogin();
    }, []);

    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
        setUser(null);
        logoutRequest()
    };

    const toggle_User_status = async (id) => {
        // console.log(`Buscando todos los usuarios`);

        try {
            await toggleStatusRequest(id);

        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    };
    const removeUser = async (id) => {
        // console.log(`Buscando todos los usuarios`);

        try {
            await deleteUserRequest(id);

        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    };

    return (
        <AuthContext.Provider value={{ logout, signup, signin, user, users, isAuthenticated, errors, Loading, getAllUsers, toggle_User_status, removeUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext); // Cambiado a AuthContext
