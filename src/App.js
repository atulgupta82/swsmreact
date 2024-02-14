import {BrowserRouter as Router ,Route,Routes, useNavigate} from 'react-router-dom'
import PrivateRoute from './route/PrivateRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login/Login';
import LoginOtp from './pages/Auth/Login/LoginOtp';
import Schemes from './pages/BudgetAllocation/Schemes';
import AddBudget from './pages/BudgetAllocation/AddBudget';
import AddNewScheme from './pages/BudgetAllocation/AddNewScheme';
import BeneficiariesMgt from './pages/BeneficiariesMgt/BeneficiariesMgt';
import InvoiceList from './pages/Disbursment/InvoiceList';
import AddVoucher from './pages/Disbursment/AddVoucher/AddVoucher';
import FundInvoice from './pages/FundRelease/Invoice/FundInvoice';
import Users from "./pages/Users/Users.jsx";
import AddBeneficiary from './pages/BeneficiariesMgt/AddBeneficiary';
import AddUser from './pages/Users/AddUser';
import Approval from "./pages/FundRelease/Approval/Approval.jsx"
import PaymentStatus from './pages/FundRelease/PaymentStatus/PaymentStatus';
import ProceedForPayment from './pages/FundRelease/PaymentStatus/ProceedForPayment';
import PaymentReport from './pages/Reconciliation/PaymentReport';
import {useSelector } from 'react-redux';
import EditUser from './pages/Users/EditUser';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import SchemeDetails from './pages/BudgetAllocation/SchemeDetails';
import ViewScheme from './components/BudgetAllocation/Schemes/ViewScheme';
import Budgets from './pages/BudgetAllocation/Budgets';
import ViewBudgetForm from './components/BudgetAllocation/Schemes/ViewBudgetForm';
import ViewBeneficiary from './pages/BeneficiariesMgt/ViewBeneficiary';
import EditScheme from './pages/BudgetAllocation/EditScheme';
import EditBudget from './pages/BudgetAllocation/EditBudget';
import EditBeneficiary from './pages/BeneficiariesMgt/EditBeneficiary';
import {useEffect, useState} from 'react';
import Challan from "./pages/Reconciliation/challan/Challan";
import AddChallan from "./pages/Reconciliation/challan/AddChallan";
import InterestReport from "./pages/Reports/Interest";
import UpdateInvoice from './pages/FundRelease/Invoice/UpdateInvoice';
import BeneficiaryReport from "./pages/Reports/Beneficiary";
import SchemeSubHeadReport from "./pages/Reports/SchemeSubHead";
import TDSit from "./pages/Reconciliation/TDSit/TDSit";
import AddTDSITChallan from "./pages/Reconciliation/TDSit/AddTDSITChallan";
import TDSitReport from "./pages/Reports/TDSitReport";

function App() {
  const {authData}=useSelector((state)=>state.authData);
  
  // const isSignedIn=authData && authData.status ? authData.status:false;
  const isSignedIn=sessionStorage.getItem("is_loggedIn");
  

  const [lastActivity, setLastActivity] = useState(new Date().getTime());
  // Function to update the last activity timestamp
  const updateActivity = () => {
    
    setLastActivity(new Date().getTime());
  };

  const handleBeforeUnload = (e) => {
    // You can show a confirmation message if needed
    //e.returnValue = ''; // This line prevents the default browser confirmation dialog
     // Call your logout function
    localStorage.clear();
    sessionStorage.clear();
  };


  // Event listeners for user activity
  useEffect(() => {
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    // window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      // window.removeEventListener('beforeunload', handleBeforeUnload);

    };
  }, []);
  
  // Function to check for inactivity and log out if needed
  const checkInactivity = () => {
    if(isSignedIn){
      const currentTime = new Date().getTime();
      const inactivityPeriod = 10 * 60 * 1000; // 10 minutes in milliseconds
      if (currentTime - lastActivity > inactivityPeriod) {
        // Perform logout action here (e.g., clear user credentials)
        console.log('You have been automatically logged out due to inactivity.');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href="/login"; 
      }
    }
  };

  // Check for inactivity periodically (every minute)
  useEffect(() => {
    // console.log(lastActivity)
    const inactivityCheckInterval = 60 * 1000; // 1 minute in milliseconds

    const intervalId = setInterval(checkInactivity, inactivityCheckInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastActivity]);
  
  return (
    <>
    <ToastContainer/>
      <Router>
        <Routes>
          <Route exact path='/login' element={<Login/>}></Route>
          <Route exact path='/login-with-otp' element={<LoginOtp/>}></Route>
          <Route path="" element={<PrivateRoute isSignedIn={isSignedIn} />}>
            <Route path="" element={<Dashboard/>} />
            <Route path="/users" element={<Users/>} />
            <Route path="/add-user" element={<AddUser/>} />
            <Route path="/edit-user/:id" element={<EditUser/>} />
            <Route path="/add-scheme" element={<AddNewScheme/>} />
            <Route path="/schemes" element={<Schemes/>} />
            <Route path="/schemes/:id" element={<SchemeDetails/>} />
            <Route path="/view-scheme/:id" element={<ViewScheme/>} />
            <Route path="/edit-scheme/:id" element={<EditScheme/>} />
            <Route path="/budgets" element={<Budgets/>} />
            <Route path="/view-budget/:id" element={<ViewBudgetForm/>} />
            <Route path="/edit-budget/:id" element={<EditBudget/>} />
            <Route path="/add-budget" element={<AddBudget/>} />
            <Route path="/beneficiary" element={<BeneficiariesMgt/>} />
            <Route path="/beneficiary/:id" element={<ViewBeneficiary/>} />
            <Route path="/edit-beneficiary/:id" element={<EditBeneficiary/>} />
            <Route path="/add-beneficiary" element={<AddBeneficiary/>} />
            <Route path="/invoices" element={<InvoiceList/>} />
            <Route path="/add-sanction-order" element={<AddVoucher/>} />
            <Route path="/fund-invoice-list" element={<FundInvoice/>} />
            <Route path="/edit-invoice/:invoice_id" element={<UpdateInvoice/>} />
            <Route path="/fund-approval" element={<Approval/>} />
            <Route path="/fund-payment-status" element={<PaymentStatus/>} />
            <Route path="/fund-proceed-for-payment" element={<ProceedForPayment/>} />
            <Route path="/payment-report" element={<PaymentReport/>} />
            <Route path="/challan" element={<Challan/>}/>
            <Route path="/add-challan" element={<AddChallan/>}/>
            <Route path="/edit-challan/:type/:id" element={<AddChallan/>}/>
            <Route path="/interest" element={<InterestReport/>}/>
            <Route path="/beneficiary-report" element={<BeneficiaryReport/>}/>
            <Route path="/scheme-subhead" element={<SchemeSubHeadReport/>}/>
            <Route path="/tds-it" element={<TDSit/>}/>
            <Route path="/add-tds-it" element={<AddTDSITChallan/>}/>

            <Route path="/tds-it-report" element={<TDSitReport/>}/>
          </Route>
          <Route path='*' element={<h1>404 page not found</h1>}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
