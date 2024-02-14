import React, { useEffect, useState } from 'react'
import Tools from '../../../components/Tools/Tools'
import { Container, Row,Col, Form, Accordion } from 'react-bootstrap'
import { Button } from '@mui/material'
import paynow_download from '../../../Data/paynow_download.xlsx'
import ProceedForPaymentHeader from '../../../components/ProceedForPayment/ProceedForPaymentHeader'
import ProceedForPaymentPage from '../../../components/ProceedForPayment/ProceedForPayment'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import './ProceedForPayment.css'
import { AddCommasToAmount, numberToWords } from '../../../helper/Utils'
import { toast } from 'react-toastify';
import { send_otp, update_invoice_paymentStatus, verify_otp } from '../../../helper/Api'
import {useSelector} from 'react-redux';
import * as xlsx from 'xlsx';
import { saveAs } from 'file-saver';

const ProceedForPayment = () => {
    const navigate=useNavigate();
    const {authData}=useSelector((state)=>state.authData)
    const [init_payment,setInit_payment]=useState(0);
    const [otp,setOtp]=useState(null);
    const [payment_from,setPayment_from]=useState('');
    let { state } = useLocation();
    const [data,setData]=useState(state && state.data ? state.data:[]);

    const data_ids=[];
    data.map((d)=>{
        data_ids.push(d.id);
    })

    useEffect(() => {
      if(data.length==0){
        navigate('/fund-invoice-list');
      }
    }, [data])
    

    const dataWithStrings = data.map((item) => {
        const newItem = {};
        let scheme_bank=item.scheme_list[0].bank_details;
        newItem.account_name= scheme_bank.account_name;
        newItem.bank_name= scheme_bank.bank_name;
        newItem.branch_name= scheme_bank.branch_name;
        newItem.account_no= scheme_bank.account_no;
        newItem.ifsc_code= scheme_bank.ifsc_code;
        newItem.beneficiary_name= item.beneficiary_name;
        newItem.b_bank_name= item.b_bank_name;
        newItem.b_branch_name= item.b_branch_name;
        newItem.b_account_no= item.b_account_no;
        newItem.b_ifsc_code= item.b_ifsc_code;
        newItem.b_account_no= item.b_account_no;
        newItem.payment_amount= item.payable_amount;
        return newItem;
    });
      
    
       
    const get_total_amount=()=>{
        let amount=0;
        data.map((d)=>{
            amount+=parseFloat(d.payable_amount)
        })
        return AddCommasToAmount(amount)
    }

    const generateExcelAndDownload = () => {
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(dataWithStrings);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        
        const fileName = `payment-${new Date()}.xlsx`;
        const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(excelBlob, fileName);
    };


    const initiate_payment=async(e)=>{
        e.preventDefault();
        
        try {
            let mobile=authData.user.mobile;
            let otpIdentifier='payment-approval';
            if(mobile){
                let post_data={
                    mobile:mobile,
                    identifier:otpIdentifier
                };
               
                const {data}=await send_otp(post_data);
                
                if(data.status){
                    setInit_payment(1);
                    toast.success(data.message,{
                        position: toast.POSITION.TOP_CENTER
                    });
                }else{
                    toast.error(data.message,{
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            }
        } catch (error) {
            toast.error("Code Error.Try Later !",{
                position: toast.POSITION.TOP_CENTER
            });
        }
    }
    
    const handlePayNow=async()=>{
        try {
            let mobile=authData.user.mobile;
            let otpIdentifier='payment-approval';
            if(mobile && otp && otpIdentifier){
                let verify_data={
                    mobile:mobile,
                    identifier:otpIdentifier,
                    otp:otp
                };
                const {data}=await verify_otp(verify_data);
                if(data.status){
                    toast.success(data.message,{
                        position: toast.POSITION.TOP_CENTER
                    });
                    let post_data={
                        invoice_ids:data_ids,
                        payment_from:payment_from,
                        added_by:authData.user.id
                    };
        
                    if(authData.user.user_type==='l3'){
                        post_data.l3_payment_status=1;
                    }else if(authData.user.user_type==='l2'){
                        post_data.payment_status=1;
                    }       
                         
                    const response=await update_invoice_paymentStatus(post_data);
                    let response_data=response.data;
                    if(response_data.status){
                        toast.success(response_data.message,{
                            position: toast.POSITION.TOP_CENTER
                        });
                        setTimeout(function() {
                            window.location.href = "/fund-invoice-list?active=payment-status";
                        }, 1000);
                        if(authData.user.user_type==='l3'){
                           generateExcelAndDownload();
                        }                
                    }else{
                        toast.error(response_data.message,{
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                }else{
                    toast.error(data.message,{
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            }
        } catch (error) {
            toast.error('Code Error. Try Later.',{
                position: toast.POSITION.TOP_CENTER
            });
        }      
    }
  return (
    <div>
        <Tools></Tools>
        <div className='addNewScheme' >
            <ProceedForPaymentHeader/>
        </div>
        <div className='scheme'>
            <Accordion defaultActiveKey="0" flush>
            {
                data.length>0 && data.map((invoice,i)=>{
                return (                
                    <Accordion.Item eventKey={i}>
                    <Accordion.Header>INVOICE- {i+1}</Accordion.Header>
                        <Accordion.Body>
                        <ProceedForPaymentPage invoice={invoice} setInvoices={setData} index={i} />  
                        </Accordion.Body>
                    </Accordion.Item>
                );
                })
            }
            </Accordion>
        </div>
        <div className="border_dotted p-2 m-2">
            <small>Total Amount to Pay Now</small>
            <p className="pt-2">₹ {AddCommasToAmount(get_total_amount())}</p>
            <small className="text-muted text-capitalize">{numberToWords(get_total_amount())}</small>
        </div>
        <div className="p-3 bg-light">
            <Container>
                <Row>
                    <Col md={2}>
                    <Form.Label>
                        {/* Payment From : */}
                         </Form.Label>
                    </Col>
                    <Col md={10}>
                        {/* <div className='w-50'>
                            <Form.Select onChange={(e)=>setPayment_from(e.target.value)}>
                                <option value="">---Select Bank---</option>
                                <option value="2">HDFC BANK </option>
                                <option value="3">STATE BANK OF INDIA</option>
                                <option value="3">PUNJAB NATIONAL BANK</option>
                            </Form.Select>                            
                        </div> */}
                        <Button variant="contained" style={{
                            margin:"10px 0px"
                        }} onClick={initiate_payment}>Initiate Payment</Button>
                    </Col>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Col md={2} class>
                        <Form.Label>OTP : </Form.Label>
                    </Col>
                    <Col md={10}>
                        <div className='w-50'>
                            <Form.Control type="number" name="otp" onChange={(e)=>setOtp(e.target.value)} value={otp} placeholder="Enter OTP" disabled={!init_payment}/>                            
                        </div>
                        <Button variant="contained" style={{
                            margin:"10px 0px"
                        }} disabled={otp ? false: true} onClick={handlePayNow}> PAY NOW </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    </div>
  )
}

export default ProceedForPayment
