import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    success: true,
    challans: [],
};

export const ChallanSlice = createSlice({
    name: "challan",
    initialState,
    reducers: {
        GET_CHALLAN_START: (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
            // console.log(state);
        },
        GET_CHALLAN_SUCCESS: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.challans = action.payload;
        },
        GET_CHALLAN_FAIL: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
            console.log(action.payload);
        },
        ADD_CHALLAN_START: (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
            // console.log(state);
        },
        ADD_CHALLAN_SUCCESS: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            // state.challans=action.payload;
            const old_challans = state.challans;
            let new_scheme = [...old_challans, action.payload];
            state.challans = new_scheme;
        },
        ADD_CHALLAN_FAIL: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
            console.log(action.payload);
        },
        //DELETE CHALLAN
        DELETE_CHALLAN_START: (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
            // console.log(state);
        },
        DELETE_CHALLAN_SUCCESS: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            let old_challans_list = state.challans;
            let index = old_challans_list.findIndex((u) => u.id === action.payload.id);
            if (index >= 0) {
                old_challans_list.splice(index, 1);
                state.challans = old_challans_list;
            }
        },
        DELETE_CHALLAN_FAIL: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = false;
            console.log(action.payload);
        },

    }
})

export const {
    GET_CHALLAN_START, GET_CHALLAN_SUCCESS, GET_CHALLAN_FAIL,
    ADD_CHALLAN_START, ADD_CHALLAN_SUCCESS, ADD_CHALLAN_FAIL,
    DELETE_CHALLAN_START, DELETE_CHALLAN_SUCCESS, DELETE_CHALLAN_FAIL
} = ChallanSlice.actions;
export default ChallanSlice.reducer;
