import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    success: true,
    schemes:[],
};

export const SchemeSlice=createSlice({
    name:"schemes",
    initialState,
    reducers:{
        GET_SCHEME_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
            // console.log(state);
        },
        GET_SCHEME_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            state.schemes=action.payload;
        },        
        GET_SCHEME_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
            // console.log(action.payload);
        },
        ADD_SCHEME_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
            // console.log(state);
        },
        ADD_SCHEME_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            // state.schemes=action.payload;
            const old_schemes=state.schemes;
            let new_scheme=[...old_schemes,action.payload];
            state.schemes = new_scheme;
        },        
        ADD_SCHEME_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
            // console.log(action.payload);
        },
        //DELETE SCHEME
        DELETE_SCHEME_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
            // console.log(state);
        },
        DELETE_SCHEME_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            let old_schemes_list=state.schemes;
            let index = old_schemes_list.findIndex((u) => u.id === action.payload.id);
            if(index>=0){
                old_schemes_list.splice(index,1);
                state.schemes = old_schemes_list;
            }
        },        
        DELETE_SCHEME_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
            // console.log(action.payload);
        },   
          
    }
})

export const {
    GET_SCHEME_START,GET_SCHEME_SUCCESS,GET_SCHEME_FAIL,
    ADD_SCHEME_START,ADD_SCHEME_SUCCESS,ADD_SCHEME_FAIL,
    DELETE_SCHEME_START,DELETE_SCHEME_SUCCESS,DELETE_SCHEME_FAIL
}=SchemeSlice.actions;
export default SchemeSlice.reducer;
