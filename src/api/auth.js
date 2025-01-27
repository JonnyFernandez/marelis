import axios from './axios';


export const registerRequest = async (user) => {
    let info = {
        email: user.email,
        password: user.password,
        name: user.name,
        type: user.type
    };
    // console.log(info);


    try {
        const res = await axios.post(`/register`, info);
        return res;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
};

export const loginRequest = async (user) => {
    let info = {
        email: user.email,
        password: user.password,
    };
    try {
        const res = await axios.post(`/login`, info);
        return res;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }


};
export const usersRequest = async () => {

    try {
        const res = await axios.get(`/users`);
        return res;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }


};
export const verifyTokenRequest = () => axios.get('/verify')
export const logoutRequest = () => axios.post('/logout')
export const toggleStatusRequest = (id) => axios.put(`/user-status/${id}`)
export const deleteUserRequest = (id) => axios.delete(`/users/${id}`)
