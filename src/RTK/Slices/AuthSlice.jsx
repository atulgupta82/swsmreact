import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    success: false,
    authData:null,
};

export const AuthSlice=createSlice({
    name:"authData",
    initialState,
    reducers:{
        LOGIN_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        LOGIN_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            state.authData=action.payload;
        },        
        LOGIN_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        },
        LOG_OUT:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            state.authData=null;
            localStorage.clear();
        },
        REGISTER_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        REGISTER_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            state.authData=action.payload;
        },        
        REGISTER_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        },
        UPDATE_USER_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        UPDATE_USER_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            state.authData.user=action.payload;
        },        
        UPDATE_USER_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        }, 
    }
})

export const {LOGIN_START,LOGIN_SUCCESS,LOGIN_FAIL,LOG_OUT,UPDATE_USER_START,UPDATE_USER_SUCCESS,UPDATE_USER_FAIL,REGISTER_START,REGISTER_SUCCESS,REGISTER_FAIL}=AuthSlice.actions;
export default AuthSlice.reducer;