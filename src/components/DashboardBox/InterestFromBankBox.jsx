import React, { useEffect, useState } from 'react'
import './DashboardBox.css';
import {MdAddCircle} from 'react-icons/md';
import { useSelector } from 'react-redux';
import AddInterestModal from '../Modal/AddInterestModal';
import { add_account_balance_interest, get_account_balance_interest } from '../../helper/Api';
import { toast } from 'react-toastify';

const InterestFromBankBox = () => {
  const {authData}=useSelector((state)=>state.authData);
  const [showPreview,setShowPreview]=useState(false);
  const [formData,setFormData]=useState({
    "account_no":"",
    "account_balance":"",
    "balance_date":"",
    "interest":"",
    "interest_date":"",
    'added_by':authData.user.id
  });
  const [viewData,setViewData]=useState({
    "account_no":"",
    "account_balance":"",
    "balance_date":"",
    "interest":"",
    "interest_date":"",
  });

  const get_balance_interest=async()=>{
    try {
      const {data}=await get_account_balance_interest();
      // console.log(data)
      if(data.status){
        setFormData(data.data)
        setViewData(data.data)
      }else{
        
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    get_balance_interest();
    // console.log(formData)
  }, [])

  const interest_modal=(e)=>{
    e.preventDefault();
    setShowPreview(true);
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    // console.log(authData.user)
    try {
      const {data}=await add_account_balance_interest(formData);
      if(data.status){
        setShowPreview(false);
        toast.success(data.message, {
            position: toast.POSITION.TOP_CENTER
        });
        get_balance_interest();
      }else{
        toast.error(data.message, {
            position: toast.POSITION.TOP_CENTER
        });
      }
    } catch (error) {
      console.log(error)
      toast.error("System Error. Try Later!", {
          position: toast.POSITION.TOP_CENTER
      });
    }
  }

  return (
    <>
      <AddInterestModal showPreview={showPreview} setShowPreview={setShowPreview} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit}></AddInterestModal>
      <div className='eac_grid'>        
          <span className='grid_title'>Account No: {viewData.account_no}</span>
          <span className='grid_title'>Account Balance: {viewData.account_balance-viewData.total_payable_amount}</span>
          <span className='grid_title'>Balance As On: {viewData.balance_date}</span>
          <span className='grid_title'>Interest: {viewData.interest}</span>
          <span className='grid_title'>Interest Date: {viewData.interest_date}</span>
          {authData.user.user_type==='l1'?(
            <span className='add_interesetBtn' onClick={interest_modal}><MdAddCircle/></span>
          ):""}
      </div>
    </>
  )
}

export default InterestFromBankBox
