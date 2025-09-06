import { adminOrdersFail, adminOrdersRequest, adminOrdersSuccess, createOrderFail, createOrderRequest, createOrderSuccess, deleteOrdersFail, deleteOrdersRequest, deleteOrdersSuccess, orderDetailFail, orderDetailRequest, orderDetailSuccess, updateOrdersFail, updateOrdersRequest, updateOrdersSuccess, userOrdersFail, userOrdersRequest, userOrdersSuccess } from "../slices/orderSlice"
import axios from "axios"

export const createOrder = order => async(dispatch) => {
    try {
        dispatch(createOrderRequest())
        const {data} = await axios.post("/api/v1/order/new", order)
        dispatch(createOrderSuccess(data))
    } catch (error) {
        dispatch(createOrderFail(error.response.data.message))
    }
}

export const userOrders = () => async (dispatch) => {
    try {
        dispatch(userOrdersRequest());
        const { data } = await axios.get('/api/v1/myorders');
        dispatch(userOrdersSuccess(data));
    } catch (error) {
        // Improved error handling
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to fetch orders';
        dispatch(userOrdersFail(errorMessage));
    }
}

export const orderDetail = id => async (dispatch) => {
    try {
        dispatch(orderDetailRequest());
        const { data } = await axios.get(`/api/v1/order/${id}`);
        dispatch(orderDetailSuccess(data));
    } catch (error) {
        // Improved error handling
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to fetch orders';
        dispatch(orderDetailFail(errorMessage));
    }
}


export const adminOrders = () => async (dispatch) => {
    try {
        dispatch(adminOrdersRequest());
        const { data } = await axios.get('/api/v1/admin/orders');
        dispatch(adminOrdersSuccess(data));
    } catch (error) {
        // Improved error handling
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to fetch orders';
        dispatch(adminOrdersFail(errorMessage));
    }
}


export const deleteOrder = id => async (dispatch) => {
    try {
        dispatch(deleteOrdersRequest());
        await axios.delete(`/api/v1/admin/order/${id}`);
        dispatch(deleteOrdersSuccess());
    } catch (error) {
        // Improved error handling
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to fetch orders';
        dispatch(deleteOrdersFail(errorMessage));
    }
}

export const updateOrder = (id, orderData) => async (dispatch) => {
    try {
        dispatch(updateOrdersRequest());
        const {data} = await axios.put(`/api/v1/admin/order/${id}`, orderData);
        dispatch(updateOrdersSuccess(data));
    } catch (error) {
        // Improved error handling
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to fetch orders';
        dispatch(updateOrdersFail(errorMessage));
    }
}
