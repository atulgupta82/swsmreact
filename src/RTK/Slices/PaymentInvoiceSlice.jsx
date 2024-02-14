import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    success: false,
    payment_invoices:[],
};

export const PaymentInvoiceSlice=createSlice({
    name:"payment_invoices",
    initialState,
    reducers:{
        GET_P_INVOICES_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        GET_P_INVOICES_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            state.payment_invoices=action.payload;
        },        
        GET_P_INVOICES_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        } 
    }
})

export const {
    GET_P_INVOICES_START,GET_P_INVOICES_SUCCESS,GET_P_INVOICES_FAIL
}=PaymentInvoiceSlice.actions;
export default PaymentInvoiceSlice.reducer;