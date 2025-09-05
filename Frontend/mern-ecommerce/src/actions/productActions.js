import axios from "axios";
import { adminProductsFail, adminProductsRequest, adminProductsSuccess, productsFail, productsRequest, productsSuccess } from "../slices/productsSlice";
import { createReviewFail, createReviewRequest, createReviewSuccess, deleteProductFail, deleteProductRequest, deleteProductSuccess, deleteReviewsFail, deleteReviewsRequest, deleteReviewsSuccess, newproductFail, newproductRequest, newproductSuccess, productFail, productRequest, productSuccess, reviewsFail, reviewsRequest, reviewsSuccess, updateProductFail, updateProductRequest, updateProductSuccess } from "../slices/productSlice";
import { updatePasswordRequest, updatePasswordSuccess } from "../slices/AuthSlice";


export const getProducts = (keyword, price, category, rating,  page = 1, limit = 5) =>  async (dispatch) => {

    try {
        dispatch(productsRequest())
        let url = `/api/v1/products?page=${page}&limit=${limit}`;
        if(keyword){
            url += `&keyword=${keyword}`
        }
        if(price){
            url += `&price[gte]=${price[0]}&price[lte]=${price[1]}`
        }
        if(category){
            url += `&category=${category}`
        }
        if(rating){
            url += `&ratings=${rating}`
        }
        const { data } = await axios.get(url)
        dispatch(productsSuccess(data))
    } catch (error) {
        dispatch(productsFail(error.response.data.message))
    }
}


export const getProduct = id => async (dispatch) => {

    try {
        dispatch(productRequest())
        const { data } = await axios.get(`/api/v1/product/${id}`)
        dispatch(productSuccess(data))
    } catch (error) {
        dispatch(productFail(error.response.data.message))
    }
}

export const createReview = reviewData => async (dispatch) => {

    try {
        dispatch(createReviewRequest())
        const config = {
            headers : {
                "Content-type" : "application/json"
            }
        }
        const {data} = await axios.put(`/api/v1/review`, reviewData, config)
        dispatch(createReviewSuccess(data))
    } catch (error) {
        dispatch(createReviewFail(error.response.data.message))
    }
}

export const getAdminProducts = () => async (dispatch) => {
    try {
        dispatch(adminProductsRequest())
        const {data} = await axios.get("/api/v1/admin/products")
        dispatch(adminProductsSuccess(data))
    } catch (error) {
        dispatch(adminProductsFail(error.response.data.message))
    }
}


export const createNewProduct = newProduct => async (dispatch) => {
    try {
        dispatch(newproductRequest())
        const {data} = await axios.post("/api/v1/admin/products/new", newProduct)
        dispatch(newproductSuccess(data))
    } catch (error) {
        dispatch(newproductFail(error.response.data.message))
    }
}


export const deletProduct = id => async (dispatch) => {
    try {
        dispatch(deleteProductRequest())
        await axios.delete(`/api/v1/admin/product/${id}`)
        dispatch(deleteProductSuccess())
    } catch (error) {
        dispatch(deleteProductFail(error.response.data.message))
    }
}

export const UpdateProduct = (id, newProduct) => async (dispatch) => {
    try {
        dispatch(updateProductRequest())
        const {data} = await axios.put(`/api/v1/admin/product/${id}`, newProduct)
        dispatch(updateProductSuccess(data))
    } catch (error) {
        dispatch(updateProductFail(error.response.data.message))
    }
}


export const getReviews = id => async (dispatch) => {

    try {
        dispatch(reviewsRequest())
        const { data } = await axios.get(`/api/v1/admin/reviews`, {params : {id}})
        dispatch(reviewsSuccess(data))
    } catch (error) {
        dispatch(reviewsFail(error.response.data.message))
    }
}

export const deleteReview = (productId, id) => async (dispatch) => {
    try {
        dispatch(deleteReviewsRequest())
        await axios.delete(`/api/v1/admin/review/${id}`, {params : {productId}})
        dispatch(deleteReviewsSuccess())
    } catch (error) {
        dispatch(deleteReviewsFail(error.response.data.message))
    }
}