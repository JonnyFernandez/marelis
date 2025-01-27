import { createContext, useState, useContext, useEffect } from "react";

// import { registerRequest, loginRequest, verifyTokenRequest, logoutRequest, toggleStatusRequest, deleteUserRequest } from "../api/auth";
import { postProdrRequest, prodDetailsRequest, prodDeleteRequest, updateProdRequest, prodEditRequest, prodFeaturedsRequest, prodUpdateStockRequest, ProdRequest, api_delete_distributor, api_toggle_distributor_status, api_update_distributor_numbers, api_get_all_distributors, api_post_distributor, api_create_category, api_get_all_categories, api_delete_category, api_create_order, api_get_order } from "../api/product";



export const ProdContext = createContext({}); // Cambiado a ProdContext

const ProdProvider = ({ children }) => {
    const [prod, setProd] = useState(null);
    const [orders, setOrders] = useState([]);
    const [errors, setErrors] = useState([]);
    console.log(orders);


    const allProduct = async () => {

        try {
            const res = await ProdRequest();
            setProd(res.data);
        } catch (error) {
            setErrors(error.response?.data?.message || ["Unexpected error occurred"]);
        }
    };

    const createProd = async (values) => {
        try {
            await postProdrRequest(values);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    };
    const createOrder = async (values) => {
        try {
            await api_create_order(values);
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    };
    const getOrders = async () => {
        try {
            const aux = await api_get_order();
            if (aux.data?.orders) {
                setOrders(aux.data); // Solo asignar si existe `orders`
            } else {
                setOrders([]); // Asignar array vacío si no hay datos
            }
        } catch (error) {
            if (Array.isArray(error.response?.data)) {
                setErrors(error.response.data);
            } else {
                setErrors([error.response?.data?.message || "Unexpected error occurred"]);
            }
        }
    };


    const prodById = async (id) => {
        try {
            const res = await prodDetailsRequest(id);

            setProd(res.data);

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



    return (
        <ProdContext.Provider value={{ allProduct, prod, createProd, prodById, createOrder, errors, getOrders, orders }}>
            {children}
        </ProdContext.Provider>
    );
};

export default ProdProvider;


export const useProd = () => useContext(ProdContext); // Cambiado a ProdContext
