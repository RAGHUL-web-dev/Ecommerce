import axios from "axios";
import { 
    loginFail, 
    loginRequest, 
    loginSuccess, 
    clearError, 
    registerRequest, 
    registerSuccess, 
    registerFail,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutUserSuccess,
    logoutUserFail,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFail,
    updatePasswordRequest,
    updatePasswordSuccess,
    updatePasswordFail,
    forgetPasswordFail,
    forgetPasswordRequest,
    forgetPasswordSuccess,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFail,  
} from "../slices/AuthSlice";

import { userDeleteFail, userDeleteRequest, userDelteSuccess, userFail, usersFail, usersRequest, usersSuccess, userSuccess, userUpdatedFail, userUpdatedRequest, userUpdatedSuccess } from "../slices/userSlice";

export const login = (email, password) => async (dispatch) => {

    try {
        dispatch(loginRequest())
        const {data} = await axios.post('https://ecommerce-mmvv.onrender.com/api/v1/login', {email, password})
        dispatch(loginSuccess(data))
    } catch (error) {
        dispatch(loginFail(error.response.data.message))
    }
}



export const clearAuthError = () => (dispatch) => {
    dispatch(clearError())
}

export const register = (userData) => async (dispatch) => {
    try {
        dispatch(registerRequest());
        const config = {
            headers: { 'Content-type': 'multipart/form-data' }
        };
        const { data } = await axios.post('https://ecommerce-mmvv.onrender.com/api/v1/register', userData, config);
        dispatch(registerSuccess(data));
    } catch (error) {
        dispatch(registerFail(error.response.data.message))
    }
};


export const loadUser = async (dispatch) => {
    try {
        dispatch(loadUserRequest());
        const { data } = await axios.get('https://ecommerce-mmvv.onrender.com/api/v1/myprofile');
        dispatch(loadUserSuccess(data));
    } catch (error) {
        dispatch(loadUserFail(error.response.data.message))
    }
};


export const logoutUser = async (dispatch) => {
    try {
        await axios.get('/api/v1/logedout');
        dispatch(logoutUserSuccess());
    } catch (error) {
        dispatch(logoutUserFail())
    }
};

export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch(updateProfileRequest());
        const config = {
            headers: { 'Content-type': 'multipart/form-data' }
        };
        const { data } = await axios.put('https://ecommerce-mmvv.onrender.com/api/v1/update/profile', userData, config);
        dispatch(updateProfileSuccess(data));
    } catch (error) {
        dispatch(updateProfileFail(error.response.data.message))
    }
};

export const updatePassword = (formData) => async (dispatch) => {
    try {
        dispatch(updatePasswordRequest());
        const config = {
            headers : { 'Content-type' : 'application/json' }
        }
        await axios.put('https://ecommerce-mmvv.onrender.com/api/v1/password/change', formData, config);
        dispatch(updatePasswordSuccess());
    } catch (error) {
        dispatch(updatePasswordFail(error.response.data.message))
    }
};


export const forgotPassword = (formData) => async (dispatch) => {
    try{
        dispatch(forgetPasswordRequest())
        const config = {
            headers : {'Content-type' : 'application/json'}
        }
        const {data} = await axios.post("https://ecommerce-mmvv.onrender.com/api/v1/forgot/password", formData, config )
        dispatch(forgetPasswordSuccess(data))
    } catch(error){
        dispatch(forgetPasswordFail(error.response.data.message))
    }
}


export const resetPassword = (formData, token) => async (dispatch) => {
    try{
        dispatch(resetPasswordRequest())
        const config = {
            headers : {'Content-type' : 'application/json'}
        }
        const {data} = await axios.post(`https://ecommerce-mmvv.onrender.com/api/v1/password/reset/${token}`, formData, config)
        dispatch(resetPasswordSuccess(data))
    } catch(error){
        dispatch(resetPasswordFail(error.response.data.message))
    }
}

// get users details
export const getUsers = () => async(dispatch) => {
    try {
        dispatch(usersRequest())
        const {data} = await axios.get("https://ecommerce-mmvv.onrender.com/api/v1/admin/users")
        dispatch(usersSuccess(data))
    } catch (error) {
        dispatch(usersFail(error.response.data.message))
    }
}

export const getUser = id => async(dispatch) => {
    try {
        dispatch(userDeleteRequest())
        const {data} = await axios.get(`https://ecommerce-mmvv.onrender.com/api/v1/admin/users/${id}`)
        dispatch(userSuccess(data))
    } catch (error) {
        dispatch(userFail(error.response.data.message))
    }
}


export const deleteUser = id => async(dispatch) => {
    try {
        dispatch(userDeleteRequest())
        await axios.delete(`https://ecommerce-mmvv.onrender.com/api/v1/admin/users/${id}`)
        dispatch(userDelteSuccess())
    } catch (error) {
        dispatch(userDeleteFail(error.response.data.message))
    }
}


export const updateUser = (id, formData) => async(dispatch) => {
    try {
        dispatch(userUpdatedRequest())
        const config = {
            headers : {
                "Content-type" : "application/json"
            }
        }
        await axios.put(`https://ecommerce-mmvv.onrender.com/api/v1/admin/users/${id}`, formData, config)
        dispatch(userUpdatedSuccess())
    } catch (error) {
        dispatch(userUpdatedFail(error.response.data.message))
    }
}