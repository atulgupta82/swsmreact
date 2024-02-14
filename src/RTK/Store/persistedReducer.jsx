import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';
import userReducer from "../Slices/UserSlice";
import authReducer from "../Slices/AuthSlice";
import SchemeReducer from "../Slices/SchemeSlice";
import BeneficiaryReducer from "../Slices/BeneficiarySlice";
import InvoiceReducer from "../Slices/InvoiceSlice";
import PaymentInvoiceReducer from "../Slices/PaymentInvoiceSlice";
import DisbursmentInvoiceSlice from "../Slices/DisbursmentInvoiceSlice";

    const persistConfig = {
        key: 'persistLocal',
        storage,
    };
  
  const rootReducer = combineReducers({
    user: userReducer,
    authData: authReducer,
    schemeData: SchemeReducer,
    beneficiaryData: BeneficiaryReducer,
    invoiceData: InvoiceReducer,
    payment_invoiceData: PaymentInvoiceReducer,
    disbursment_invoiceData: DisbursmentInvoiceSlice,
    // Other reducers, if any
  });
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  export default persistedReducer;