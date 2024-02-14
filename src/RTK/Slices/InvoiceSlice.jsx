import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    success: false,
    invoices:[],
};

export const InvoiceSlice=createSlice({
    name:"invoices",
    initialState,
    reducers:{
        GET_INVOICES_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        GET_INVOICES_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            state.invoices=action.payload;
        },        
        GET_INVOICES_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        } 
    }
})

export const {
    GET_INVOICES_START,GET_INVOICES_SUCCESS,GET_INVOICES_FAIL
}=InvoiceSlice.actions;
export default InvoiceSlice.reducer;