import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: localStorage.getItem("cartItems")
            ? JSON.parse(localStorage.getItem("cartItems"))
            : [],
            shippingInfo : localStorage.getItem("shippingInfo")
            ? JSON.parse(localStorage.getItem("shippingInfo"))
            : {},
        loading: false,

    },
    reducers: {
        addCartItemsRequest(state) {
            state.loading = true;
        },
        addCartItemsSuccess(state, action) {
            const item = action.payload;
            const index = state.items.findIndex(i => i.product === item.product);

            if (index >= 0) {
                // If item exists, update it
                state.items[index] = item;
            } else {
                // If item does not exist, add new
                state.items.push(item);
            }

            state.loading = false;
            // Save to localStorage after update
            localStorage.setItem("cartItems", JSON.stringify(state.items));
        },
        increaseCartItemQty(state, action){
            state.items = state.items.map(item =>{
                if(item.product == action.payload){
                    item.quanity += 1;
                }
                return item;
            })
            localStorage.setItem("cartItems", JSON.stringify(state.items));
        },
        decreaseCartItemQty(state, action){
            state.items = state.items.map(item =>{
                if(item.product == action.payload){
                    item.quanity -= 1;
                }
                return item;
            })
            localStorage.setItem("cartItems", JSON.stringify(state.items));
        },
        removeItemFromCart(state, action){
            const filterItems = state.items.filter(item => {
                return item.product !== action.payload
            })
            localStorage.setItem("cartItems", JSON.stringify(state.items));
            return{
                ...state,
                items : filterItems
            }
        },
        saveShippingInfo(state, action){
            localStorage.setItem('shippingInfo', JSON.stringify(action.payload));
            return {
                ...state,
                shippingInfo : action.payload
            }
        },
        orderCompleted(state, action){
            localStorage.removeItem('shippingInfo')
            localStorage.removeItem('cartItems')
            localStorage.removeItem('orderInfo')
            return {
                items : [],
                loading : false,
                shippingInfo : {}
            }
        }
    },
});

const { actions, reducer } = cartSlice;
export const { 
    addCartItemsRequest, 
    addCartItemsSuccess,
    increaseCartItemQty,
    decreaseCartItemQty,
    removeItemFromCart,
    saveShippingInfo,
    orderCompleted
 } = actions;
export default reducer;
