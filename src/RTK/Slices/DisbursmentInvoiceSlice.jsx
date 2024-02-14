import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    success: false,
    disbursment_invoices:[],
};

export const DisbursmentInvoiceSlice=createSlice({
    name:"disbursment_invoices",
    initialState,
    reducers:{
        GET_D_INVOICES_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        GET_D_INVOICES_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            state.payment_invoices=action.payload;
        },        
        GET_D_INVOICES_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        } 
    }
})

export const {
    GET_D_INVOICES_START,GET_D_INVOICES_SUCCESS,GET_D_INVOICES_FAIL
}=DisbursmentInvoiceSlice.actions;
export default DisbursmentInvoiceSlice.reducer;