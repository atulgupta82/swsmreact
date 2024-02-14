import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    success: false,
    user:[],
};

export const UserSlice=createSlice({
    name:"users",
    initialState,
    reducers:{
        GET_USER_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        GET_USER_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            state.user=action.payload;
        },        
        GET_USER_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        },
        ADD_USER_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
            // console.log(state);
        },
        ADD_USER_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            // state.schemes=action.payload;
            const old_users=state.user;
            let new_users=[...old_users,action.payload];
            state.user = new_users;
        },        
        ADD_USER_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
            console.log(action.payload);
        }, 
        UPDATE_USER_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
            // console.log(state);
        },
        UPDATE_USER_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            let index = state.user.findIndex((u) => u.id === action.payload.id);
            if(index>=0){
                state.user[index] = action.payload;
            }
        },        
        UPDATE_USER_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
            console.log(action.payload);
        },
        DELETE_USER_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
            // console.log(state);
        },
        DELETE_USER_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            let old_user_list=state.user;
            let index = old_user_list.findIndex((u) => u.id === action.payload.id);
            if(index>=0){
                old_user_list.splice(index,1);
                state.user = old_user_list;
            }
        },        
        DELETE_USER_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
            console.log(action.payload);
        },       
    }
})

export const {
    GET_USER_START,GET_USER_SUCCESS,GET_USER_FAIL,
    ADD_USER_START,ADD_USER_SUCCESS,ADD_USER_FAIL,
    UPDATE_USER_START,UPDATE_USER_SUCCESS,UPDATE_USER_FAIL,
    DELETE_USER_START,DELETE_USER_SUCCESS,DELETE_USER_FAIL,
}=UserSlice.actions;
export default UserSlice.reducer;