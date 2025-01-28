import { createContext, useState, useContext, useEffect } from "react";

// import { registerRequest, loginRequest, verifyTokenRequest, logoutRequest, toggleStatusRequest, deleteUserRequest } from "../api/auth";
import { postProdrRequest, prodDetailsRequest, prodDeleteRequest, updateProdRequest, prodEditRequest, prodFeaturedsRequest, prodUpdateStockRequest, ProdRequest, api_delete_distributor, api_toggle_distributor_status, api_update_distributor_numbers, api_get_all_distributors, api_post_distributor, api_create_category, api_get_all_categories, api_delete_category, api_create_order, api_get_order, api_order_by_id, api_order_cancel, api_order_delete, api_stock_report, api_statistic } from "../api/product";



export const ProdContext = createContext({}); // Cambiado a ProdContext

const ProdProvider = ({ children }) => {
    const [prod, setProd] = useState(null);
    const [orders, setOrders] = useState([]);
    const [stockReport, setStockReport] = useState([]);
    const [statistics, setStatistic] = useState(null);
    const [orderDetail, setOrderDetail] = useState({});
    const [errors, setErrors] = useState([]);
    // console.log(stockReport);




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

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);



    return (
        <ProdContext.Provider value={{ allProduct, prod, createProd, prodById, createOrder, errors, getOrders, orders, getOrdersById, orderDetail, cancelOrder, deleteOrder, getStockReport, stockReport, getStatistic, statistics }}>
            {children}
        </ProdContext.Provider>
    );
};

export default ProdProvider;


export const useProd = () => useContext(ProdContext); // Cambiado a ProdContext
