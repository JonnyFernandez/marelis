import axios from './axios';


export const postProdrRequest = async (data) => {
    const defaultImage = 'https://e0.pxfuel.com/wallpapers/806/472/desktop-wallpaper-blank-white-bright-white.jpg'

    try {
        if (data.image === '') data.image = defaultImage
        await axios.post(`/prod/`, data)
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
};

export const prodDetailsRequest = async (id) => {

    try {
        const res = await axios.get(`/prod/${id}`);
        return res;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }


};
export const prodDeleteRequest = async (id) => {

    try {
        const res = await axios.delete(`/prod/${id}`);
        return res;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }


};
export const updateProdRequest = async (id) => await axios.put(`/status/${id}`)

export const prodEditRequest = async (id, data) => await axios.put(`/prod/${id}`, data)

export const prodFeaturedsRequest = async (id) => await axios.put(`/status-featured/${id}`)

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