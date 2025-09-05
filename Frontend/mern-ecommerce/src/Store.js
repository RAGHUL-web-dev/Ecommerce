import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/AuthSlice";
import cartReducer from "./slices/CartSlice";
import orderReducer from "./slices/orderSlice"
import userReducer from "./slices/userSlice"
// import { thunk } from "redux-thunk";

const reducer = combineReducers({
    productsState: productsReducer,
    productState: productReducer,
    authState: authReducer,
    cartState : cartReducer,
    orderState : orderReducer,
    userState : userReducer
});

const store = configureStore({
    reducer,
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({ serializableCheck: false })
    //         .concat(myCustomMiddleware)
});


export default store;