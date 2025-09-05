import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : "user",
    initialState : {
        loading : false,
        user : {},
        users : [],
        isUserUpdated : false,
        isUserDeleted : false
    },
    reducers : {
        usersRequest(state, action){
            return {
                ...state,
                loading : true
            }
        },

        usersSuccess(state, action){
            return {
                ...state,
                loading : false,
                users : action.payload.users,
            }
        },

        usersFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        },

        // getting a single user detail
        userRequest(state, action){
            return {
                ...state,
                loading : true
            }
        },

        userSuccess(state, action){
            return {
                ...state,
                loading : false,
                user : action.payload.user,
            }
        },

        userFail(state, action){
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
        },
        userDeleteRequest(state, action){
            return {
                ...state,
                loading : true,
            }
        },
        userDelteSuccess(state, action){
            return {
                ...state,
                loading : false,
                isUserDeleted : true
            }
        },
        userDeleteFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        },
        clearDeltedUser(state, action){
            return{
                ...state,
                isUserDeleted : false
            }
        },

        // update
        userUpdatedRequest(state, action){
            return {
                ...state,
                loading : true,
            }
        },
        userUpdatedSuccess(state, action){
            return {
                ...state,
                loading : false,
                isUserUpdated : true
            }
        },
        userUpdatedFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        },
        clearUpdatedUser(state, action){
            return{
                ...state,
                isUserUpdated : false
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


const {actions, reducer} = userSlice;

export const {
    usersRequest, 
    usersSuccess,
    usersFail,
    userRequest,
    userSuccess,
    userFail,
    userDeleteFail,
    userDelteSuccess,
    userDeleteRequest,
    clearDeltedUser,
    userUpdatedRequest,
    userUpdatedSuccess,
    userUpdatedFail,
    clearUpdatedUser,
    clearError
} = actions;

export default reducer;