import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name : "products",
    initialState : {
        loading : false
    },
    reducers : {
        productsRequest(state, action){
            return {
                loading : true
            }
        },

        productsSuccess(state, action){
            return {
                loading : false,
                products : action.payload.products,
                productCount : action.payload.count,
                resPerPage : action.payload.resPerPage
            }
        },

        productsFail(state, action){
            return {
                loading : false,
                error : action.payload
            }
        },
        adminProductsRequest(state, action){
            return {
                ...state,
                loading : true
            }
        },

        adminProductsSuccess(state, action){
            return {
                ...state,
                loading : false,
                products : action.payload.products,
            }
        },

        adminProductsFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        },
        clearError(state, action){
            return {
                ...state,
                error : null
            }
        }
    }
})


const {actions, reducer} = productsSlice;

export const {productsRequest, productsSuccess, productsFail, adminProductsRequest, adminProductsSuccess, adminProductsFail} = actions;

export default reducer;