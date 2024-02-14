import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    success: false,
    beneficiaries:[],
};

export const BeneficiarySlice=createSlice({
    name:"beneficiaries",
    initialState,
    reducers:{
        GET_BENEFICIARY_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        GET_BENEFICIARY_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            state.beneficiaries=action.payload;
        },        
        GET_BENEFICIARY_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        },
        //update sub topic
        UPDATE_SUB_TOPIC_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
        },
        UPDATE_SUB_TOPIC_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            // console.log(action.payload);            
            let index = state.sub_topics.findIndex((sub_topic) => sub_topic._id === action.payload._id);
            if(index>=0){
                state.sub_topics[index] = action.payload;
            }
            // state.sub_topics=action.payload;
        },        
        UPDATE_SUB_TOPIC_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
        }, 
        //DELETE BENEICIARY
        DELETE_BENEFICIARY_START:(state)=>{
            state.loading = true;
            state.error = null;
            state.success = false;
            // console.log(state);
        },
        DELETE_BENEFICIARY_SUCCESS:(state,action)=>{
            state.loading = false;
            state.error = null;
            state.success = true;
            let old_beneficiary_list=state.beneficiaries;
            let index = old_beneficiary_list.findIndex((u) => u.id === action.payload.id);
            if(index>=0){
                old_beneficiary_list.splice(index,1);
                state.beneficiaries = old_beneficiary_list;
            }
        },        
        DELETE_BENEFICIARY_FAIL:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.success = false;
            console.log(action.payload);
        }, 
    }
})

export const {
    GET_BENEFICIARY_START,GET_BENEFICIARY_SUCCESS,GET_BENEFICIARY_FAIL,
    UPDATE_SUB_TOPIC_START,UPDATE_SUB_TOPIC_SUCCESS,UPDATE_SUB_TOPIC_FAIL,
    DELETE_BENEFICIARY_START,DELETE_BENEFICIARY_SUCCESS,DELETE_BENEFICIARY_FAIL

}=BeneficiarySlice.actions;
export default BeneficiarySlice.reducer;