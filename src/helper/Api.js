import axios from "axios";

// const URL=process.env.REACT_APP_BACKEND_URL;
const API = axios.create({baseURL: 'https://udibabanews.com/swsmfms/'});
//user
export const login_user = (FormData) => API.post('users/site_login', FormData);
export const login_user_via_send_otp = (FormData) => API.post('users/user_send_otp', FormData);
export const login_user_via_verify_otp = (FormData) => API.post('users/user_verify_otp', FormData);
export const get_users = () => API.get('users/user');
export const get_user_by_id = (id) => API.get(`users/user/${id}`);
export const add_user = (formData) => API.post('users/user', formData);
export const update_user_by_id = (formData, id) => API.post(`users/update_user/${id}`, formData);
export const reset_user_by_id = (id) => API.post(`users/user_reset/${id}`);
export const delete_user_by_id = (formData, id) => API.post(`users/delete_user/${id}`, formData);

//scheme
export const get_schemes = () => API.get('schemes/scheme');
export const get_schemes_details_by_id = (id) => API.get(`schemes/scheme/${id}`);
export const add_schemes = (formData) => API.post('schemes/scheme', formData);
export const update_scheme_by_id = (formData, id) => API.post(`schemes/update_scheme/${id}`, formData);
export const delete_scheme_by_id = (formData) => API.post('schemes/delete_scheme', formData);
export const update_scheme_status = (formData) => API.post('schemes/scheme_status_update', formData);
export const add_budget = (formData) => API.post('schemes/add_budget', formData);
export const update_budget_by_id = (formData) => API.post('schemes/update_budget', formData);
export const delete_budget_by_id = (formData) => API.post('schemes/delete_budget', formData);
export const get_budget_list = (formData, id) => API.post(`schemes/get_budget_list/${id}`, formData);
export const update_budget_status = (formData) => API.post('schemes/budget_status_update', formData);
export const generate_xml_of_payment_by_scheme_id = (formData) => API.post('schemes/generate_xml_of_scheme_payment', formData);
export const download_xml_as_zip = () => API.get('schemes/download_xml_as_zip');

export const get_schemes_by_fy = (scheme_id = 0, fy_id = 0) => API.get(`schemes/scheme_details_by_fy/${scheme_id}/${fy_id}`);
export const get_schemes_by_fy_added_pending = (scheme_id = 0, fy_id = 0) => API.get(`schemes/scheme_details_by_fy_added_pending/${scheme_id}/${fy_id}`);

//beneficiary
export const get_beneficiary = () => API.get('beneficiary/beneficiary');
export const get_beneficiary_by_id = (id) => API.get('beneficiary/beneficiary/' + id);
export const add_beneficiary = (formData) => API.post('beneficiary/beneficiary', formData);
export const update_beneficiary_by_id = (formData) => API.post('beneficiary/update_beneficiary', formData);
export const delete_beneficiary_by_id = (formData) => API.post('beneficiary/delete_beneficiary', formData);
export const update_beneficiary_status = (formData) => API.post('beneficiary/beneficiary_status_update', formData);


//sanction order
export const add_sanction_order = (formData) => API.post('sanctions_order/sanction_order', formData);
export const get_invoices_by_invoice_no = (formData) => API.post('sanctions_order/invoice_list_by_invoice_no', formData);
export const get_invoice_details_by_invoice_id = (invoice_id) => API.get(`sanctions_order/invoice_details/${invoice_id}`);


// fund invocie list
export const get_fund_invoices = (data) => API.post(`sanctions_order/invoices`, data);
export const get_disbursment_invoices = (data) => API.post('sanctions_order/disbursment_invoice', data);
export const get_payment_invoices = (data) => API.post('sanctions_order/payment_invoices', data);
export const update_invoice_approvalStatus = (formData) => API.post('sanctions_order/update_invoice_approval_status', formData);
export const update_invoice_paymentStatus = (formData) => API.post('sanctions_order/update_invoice_payment_status', formData);
export const update_invoice = (formData) => API.post('sanctions_order/edit_invoice', formData);

// dashboard
export const get_dashboard_data = () => API.get('dashboard/dashboard');
export const add_account_balance_interest = (formData) => API.post('dashboard/add_account_balance_interest', formData);
export const get_account_balance_interest = () => API.get('dashboard/account_balance_interest',);

// utils
export const get_financial_year = () => API.get('utils/financial_year');
export const get_scheme_type = () => API.get('utils/scheme_type');
export const get_beneficiary_status = () => API.get('utils/beneficiary_status');
export const get_states = () => API.get('utils/states');
export const get_districts_list = (state_id) => API.get(`utils/districts/${state_id}`);
export const send_otp = (formData) => API.post(`utils/send_otp`, formData);
export const verify_otp = (formData) => API.post(`utils/verify_otp`, formData);

// Challan
export const getHeadOfAccounts = () => API.get(`v2/Headofaccounts`);
export const addChallan = (formData) => API.post('v2/Challans', formData);
export const getChallans = () => API.get(`v2/Challans`);

export const getInvoiceTDS = (data) => API.get(`v2/Invoice/invoice_tds`, {
    params: {
        from_date: data.from_date,
        to_date: data.to_date
    }
});

export const getTDSReports = (data) => API.get(`v2/Invoice/invoice_tds_challans`, {
    params: {
        from: data.from,
        from_date: data.from_date,
        to_date: data.to_date
    }
});

export const getChallanDetails = (id) => API.get(`v2/Challans/single/${id}`);
export const updateChallan = (formData, id) => API.post(`v2/Challans/edit/${id}`, formData);
export const l1_l2_status = (formData) => API.post(`v2/Challans/l2_l3_Approval`, formData);

export const get_tds_codes = () => API.get('/v2/Invoice/tdc_codes');

// Reports
export const getInterestReports = () => API.get(`v2/Report/interest`);
export const getBeneficiaryReports = (id, data) => API.get(`v2/Beneficiary/beneficiary_report`, {
    params: {
        beneficiary_id: id,
        from_date: data.from,
        to_date: data.to
    }
});
export const getSchemeSubheadReports = (id, data) => API.get(`v2/Schemes/schemes_subhead_report`, {
    params: {
        scheme_id: id,
        from_date: data.from,
        to_date: data.to
    }
});

export const addTDSChallan = (formData) => API.post('v2/Invoice/create_tds_challan', formData);
