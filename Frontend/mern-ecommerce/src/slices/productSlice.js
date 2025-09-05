import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name : "product",
    initialState : {
        loading : false,
        product : {},
        isReviewSubmitted : false,
        isProductCreated : false,
        isProductDeleted : false,
        isProductUpdated : false,
        isReviewDeleted : false,
        reviews : []
    },
    reducers : {
        productRequest(state, action){
            return {
                ...state,
                loading : true
            }
        },
        productSuccess(state, action){
            return{
                ...state,
                loading : false,
                product : action.payload.product
            }
        },
        productFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        },
        createReviewRequest(state, action){
            return {
                ...state,
                loading : true
            }
        },
        createReviewSuccess(state, action){
            return{
                ...state,
                loading : false,
                isReviewSubmitted : true
            }
        },
        createReviewFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        },
        createReviewSubmitted(state, action){
            return{
                ...state,
                isReviewSubmitted : false
            }
        },
        clearError(state, action){
            return{
                ...state,
                error : null
            }
        },
        newproductRequest(state, action){
            return {
                ...state,
                loading : true
            }
        },
        newproductSuccess(state, action){
            return{
                ...state,
                loading : false,
                product : action.payload.product,
                isProductCreated : true
            }
        },
        newproductFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload,
                isProductCreated : false
            }
        },
        clearProductCreated(state, action){
            return {
                ...state,
                isProductCreated : false
            }
        },
        deleteProductRequest(state, action){
            return {
                ...state,
                loading : true
            }
        },
        deleteProductSuccess(state, action){
            return{
                ...state,
                loading : false,
                isProductDeleted : true
            }
        },
        deleteProductFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        },
        clearProductDeleted(state, action){
            return {
                ...state,
                isProductDeleted : false
            }
        },
        updateProductRequest(state, action){
            return {
                ...state,
                loading : true
            }
        },
        updateProductSuccess(state, action){
            return{
                ...state,
                loading : false,
                product : action.payload.product,
                isProductUpdated : true
            }
        },
        updateProductFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        },
        clearProductUpdated(state, action){
            return {
                ...state,
                isProductUpdated : false
            }
        },
        reviewsRequest(state, action){
            return {
                ...state,
                loading : true
            }
        },
        reviewsSuccess(state, action){
            return{
                ...state,
                loading : false,
                reviews : action.payload.reviews
            }
        },
        reviewsFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        },
        deleteReviewsRequest(state, action){
            return {
                ...state,
                loading : true
            }
        },
        deleteReviewsSuccess(state, action){
            return{
                ...state,
                loading : false,
                isReviewDeleted : true
            }
        },
        deleteReviewsFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        },
        clearReviewsDeleted(state, action){
            return {
                ...state,
                isReviewDeleted : false
            }
        },
    }
})

const {actions, reducer} = productSlice;
export const {
    productRequest,
    productSuccess, 
    productFail, 
    createReviewRequest, 
    createReviewSuccess, 
    createReviewFail,
    createReviewSubmitted,
    clearError,
    newproductRequest,
    newproductSuccess,
    newproductFail,
    clearProductCreated,
    deleteProductRequest,
    deleteProductSuccess,
    deleteProductFail,
    clearProductDeleted,
    updateProductRequest,
    updateProductSuccess,
    updateProductFail,
    clearProductUpdated,
    reviewsRequest,
    reviewsSuccess,
    reviewsFail,
    deleteReviewsRequest,
    deleteReviewsSuccess,
    deleteReviewsFail,
    clearReviewsDeleted
} = actions
export default reducer;