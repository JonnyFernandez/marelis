import { createContext, useState, useContext, useEffect } from "react";

// import { registerRequest, loginRequest, verifyTokenRequest, logoutRequest, toggleStatusRequest, deleteUserRequest } from "../api/auth";
import { postProdrRequest, prodDetailsRequest, prodDeleteRequest, updateProdRequest, prodEditRequest, prodFeaturedsRequest, prodUpdateStockRequest, ProdRequest, api_delete_distributor, api_toggle_distributor_status, api_update_distributor_numbers, api_get_all_distributors, api_post_distributor, api_create_category, api_get_all_categories, api_delete_category, api_create_order, api_get_order, api_order_by_id, api_order_cancel, api_order_delete, api_stock_report, api_statistic, api_category_update_cost, api_distributor_update_cost } from "../api/product";



export const ProdContext = createContext({}); // Cambiado a ProdContext

const ProdProvider = ({ children }) => {
    const [prod, setProd] = useState(null);
    const [orders, setOrders] = useState([]);
    const [stockReport, setStockReport] = useState([]);
    const [categories, setCategories] = useState([]);
    const [distributors, setDistributors] = useState([]);
    const [statistics, setStatistic] = useState(null);
    const [orderDetail, setOrderDetail] = useState({});
    const [errors, setErrors] = useState([]);
    // console.log(errors);


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
    const getOrdersById = async (id) => {
        try {
            const aux = await api_order_by_id(id);
            if (aux.data) {
                setOrderDetail(aux.data); // Solo asignar si existe `orders`
            } else {
                setOrders({}); // Asignar array vacío si no hay datos
            }
        } catch (error) {
            if (Array.isArray(error.response?.data)) {
                setErrors(error.response.data);
            } else {
                setErrors([error.response?.data?.message || "Unexpected error occurred"]);
            }
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
    const cancelOrder = async (id) => {
        await api_order_cancel(id)
    }
    const deleteOrder = async (id) => {
        await api_order_delete(id)
    }
    const getStockReport = async () => {
        try {
            const stock = await api_stock_report();
            setStockReport(stock.data)
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    };
    const getStatistic = async (date1, date2) => {
        try {
            const statistic = await api_statistic(date1, date2);
            setStatistic(statistic.data)
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    };

    const getCategory = async () => {
        try {
            const aux = await api_get_all_categories();
            if (aux.data) {
                setCategories(aux.data);
            } else {
                setCategories([]);
            }
        } catch (error) {
            if (Array.isArray(error.response?.data)) {
                setErrors(error.response.data);
            } else {
                setErrors([error.response?.data?.message || "Unexpected error occurred"]);
            }
        }
    }
    const createCategory = async (data) => {
        try {
            await api_create_category(data);

        } catch (error) {
            if (Array.isArray(error.response?.data)) {
                setErrors(error.response.data);
            } else {
                setErrors([error.response?.data?.message || "Unexpected error occurred"]);
            }
        }
    }
    const deleteCategory = async (id) => {
        try {
            await api_delete_category(id);

        } catch (error) {
            if (Array.isArray(error.response?.data)) {
                setErrors(error.response.data);
            } else {
                setErrors([error.response?.data?.message || "Unexpected error occurred"]);
            }
        }
    }
    const updateCostMasiveCategory = async (id, data) => {
        try {
            await api_category_update_cost(id, data);

        } catch (error) {
            if (Array.isArray(error.response?.data)) {
                setErrors(error.response.data);
            } else {
                setErrors([error.response?.data?.message || "Unexpected error occurred"]);
            }
        }
    }

    // --------------Distributors--------------
    const add_distributor = async (data) => {
        try {
            await api_post_distributor(data);

        } catch (error) {
            if (Array.isArray(error.response?.data)) {
                setErrors(error.response.data);
            } else {
                setErrors([error.response?.data?.message || "Unexpected error occurred"]);
            }
        }
    }
    const get_distributor = async () => {
        try {
            const aux = await api_get_all_distributors();
            setDistributors(aux.data)
        } catch (error) {
            if (Array.isArray(error.response?.data)) {
                setErrors(error.response.data);
            } else {
                setErrors([error.response?.data?.message || "Unexpected error occurred"]);
            }
        }
    }
    const add_distributor_number = async (id, phoneNumber) => {
        try {
            await api_update_distributor_numbers(id, phoneNumber);

        } catch (error) {
            if (Array.isArray(error.response?.data)) {
                setErrors(error.response.data);
            } else {
                setErrors([error.response?.data?.message || "Unexpected error occurred"]);
            }
        }
    }
    const toggle_distributor_status = async (id) => {
        try {
            await api_toggle_distributor_status(id);

        } catch (error) {
            if (Array.isArray(error.response?.data)) {
                setErrors(error.response.data);
            } else {
                setErrors([error.response?.data?.message || "Unexpected error occurred"]);
            }
        }
    }
    const delete_distributor = async (id) => {
        try {
            await api_delete_distributor(id);

        } catch (error) {
            if (Array.isArray(error.response?.data)) {
                setErrors(error.response.data);
            } else {
                setErrors([error.response?.data?.message || "Unexpected error occurred"]);
            }
        }
    }

    const updateCostMasiveDistributor = async (id, data) => {
        try {
            await api_distributor_update_cost(id, data);

        } catch (error) {
            if (Array.isArray(error.response?.data)) {
                setErrors(error.response.data);
            } else {
                setErrors([error.response?.data?.message || "Unexpected error occurred"]);
            }
        }
    }

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);



    return (
        <ProdContext.Provider value={{ allProduct, prod, createProd, prodById, createOrder, errors, getOrders, orders, getOrdersById, orderDetail, cancelOrder, deleteOrder, getStockReport, stockReport, getStatistic, statistics, getCategory, categories, createCategory, deleteCategory, updateCostMasiveCategory, add_distributor, get_distributor, add_distributor_number, toggle_distributor_status, delete_distributor, distributors, updateCostMasiveDistributor }}>
            {children}
        </ProdContext.Provider>
    );
};

export default ProdProvider;


export const useProd = () => useContext(ProdContext); // Cambiado a ProdContext
