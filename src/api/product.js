import axios from './axios';

// ----------------product---------------------------

export const postProdRequest = async (data) => {
    const defaultImage = 'https://e0.pxfuel.com/wallpapers/806/472/desktop-wallpaper-blank-white-bright-white.jpg'

    try {
        if (data.image === '') data.image = defaultImage
        await axios.post(`/prod/`, data)
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
};

export const api_prod_details = async (id) => {

    try {
        const res = await axios.get(`/prod/${id}`);
        return res;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }


};
export const api_prod_delete = async (id) => {

    try {
        const res = await axios.delete(`/prod/${id}`);
        return res;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }


};
export const api_prod_detail_update = async (id, data) => await axios.put(`/prod/${id}`, data);

export const update_prod_status = async (id) => await axios.put(`/status/${id}`)

export const prodEditRequest = async (id, data) => await axios.put(`/prod/${id}`, data)

export const api_featured_prod = async (id) => await axios.put(`/status-featured/${id}`)

export const prodUpdateStockRequest = async (id, data) => await axios.put(`/prod/${id}`, data);

export const ProdRequest = async () => await axios(`/prod`);



// ----------------distributor---------------------------
export const api_delete_distributor = async (id) => await axios.delete(`/distributor/${id}`);
export const api_toggle_distributor_status = async (id) => await axios.put(`/distributor-update-status/${id}`);
export const api_update_distributor_numbers = async (id, data) => await axios.put(`/distributor/${id}`, data);
export const api_get_all_distributors = async () => await axios(`/distributor/`);
export const api_post_distributor = async (data) => await axios.post(`/distributor/`, data);

// ----------------categoria---------------------------
export const api_create_category = async (data) => await axios.post(`/category/`, data);
export const api_get_all_categories = async () => await axios(`/category/`);
export const api_delete_category = async (id) => await axios.delete(`/category/${id}`);


// ----------------Orders---------------------------
export const api_create_order = async (data) => await axios.post(`/order/`, data);
export const api_get_order = async () => await axios.get(`/order/`);
export const api_order_by_id = async (id) => await axios.get(`/order/${id}`);
export const api_order_cancel = async (id) => await axios.put(`/order/${id}`);
export const api_order_delete = async (id) => await axios.delete(`/order/${id}`);

// ----------------reporte de stock---------------------------
export const api_stock_report = async () => await axios.get(`/stock-report`);

// ---------------------------- stadistica ---------------------------------
export const api_statistic = async (date1, date2) => await axios.get(`/sales-report?startDate=${date1}&endDate=${date2}`);


// ------------------------------masive update-------------------------------------
export const api_category_update_cost = async (id, data) => await axios.post(`/update-cost-category/${id}`, data);
export const api_distributor_update_cost = async (id, data) => await axios.post(`/update-cost-distributor/${id}`, data); 
