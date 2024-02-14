import React, { useEffect, useState } from 'react'
import './AddVoucherHeadline.css';

import { Button, Container } from '@mui/material';
import {Accordion, Col, Form, Row} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { get_financial_year,get_beneficiary, get_schemes, add_sanction_order } from '../../helper/Api';
import {check_is_equal_sanction_voucher_amount, goback, isFilePdf_or_Image} from '../../helper/Utils';
import Voucher from './Voucher';
import { FaPlus } from 'react-icons/fa';

import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import LootieLoaderDot from '../LootieLoader/LootieLoaderDot';
import SanctionOrderModal from '../Modal/SanctionOrderModal';
import { convertLength } from '@mui/material/styles/cssUtils';

const AddVoucherHeadline = () => {
  const {authData}=useSelector((state)=>state.authData);
  const [formData,setFormData]=useState({
    financial_year:null,
    sanction_order_no:null,
    sanction_order_date:null,
    sanction_order_value:null,
    sanction_order:null,
    vouchers:[{
      voucher_no:null,
      voucher_date:null,
      total_voucher_value:null,
      voucher:null,
      supporting_docs:null,
      invoices:[{
        vendor_id:null,
        payment:null,
        invoice_no:null,
        invoice_ref_no:null,
        invoice_date:null,
        invoice_value:null,
        taxable_amount:null,
        sanction_amount:null,
        invoice:null,
        invoice_ref:null,
        gst:null,
        gis:null,
        nps:null,
        tds_it_rate:null,
        tds_it_amount:null,
        s_gst_rate:null,
        s_gst_amount:null,
        c_gst_rate:null,
        c_gst_amount:null,
        i_gst_rate:null,
        i_gst_amount:null,
        other_deduction:null,
        remarks:null,
        schemes:[{
          scheme_id:null,
          amount:null,
          subheads:[{
            sub_heads_id:null,
            sub_head_amount:null
          }]
        }]
      }] 
    }],
  });
  
  const [vendor,setVendor]=useState({});
  const [vendorList,setVendorList]=useState([])
  const [isLoading,setIsloading]=useState(false);
  const [showPreview,setShowPreview]=useState(false);
  const navigate=useNavigate();

  const fetch_list=async()=>{
    const vendorResponse=await get_beneficiary();     
    if(vendorResponse.data.status){
      setVendorList(vendorResponse.data.list);
    }
  }

  useEffect(() => {
      fetch_list();
  }, [])
  
  const handleInput=(e)=>{
    const name=e.target.name;
    let value=e.target.value;
    if(name=='sanction_order'){
      value=e.target.files;
      
      if(!isFilePdf_or_Image(value[0])){
        e.target.value = "";
        toast.error("Please select pdf type file under 5MB",{
          position: toast.POSITION.TOP_CENTER
        });
        return false;
      }else{
        setFormData({ ...formData, [name]: value });
      }
    }else{
      setFormData({ ...formData, [name]: value });
    } 
  }


  const check_total_invoice_value=()=>{
    let total_voucher = 0;
    let sanction_order_value=parseInt(formData.sanction_order_value>0?formData.sanction_order_value:0);
    let invoice_status=1;
    let scheme_status=1;
    let sub_heads_status=1;
    let msg='';
    formData.vouchers.forEach((voucher) => {
      total_voucher += parseInt(voucher.total_voucher_value || 0);
      let total_invoice_value=0;
      let total_sanction_value=0;
      let each_voucher_value=parseInt(voucher.total_voucher_value);
      voucher.invoices.forEach((invoice)=>{
        total_invoice_value+=parseInt(invoice.invoice_value>0?invoice.invoice_value:0)
        total_sanction_value+=parseInt(invoice.sanction_amount>0?invoice.sanction_amount:0)
        let each_invoice_value=parseInt(invoice.invoice_value);
        let each_invoice_sanction_amount=parseInt(invoice.sanction_amount);
        let total_scheme_value=0;
        invoice.schemes.forEach((scheme)=>{ 
          total_scheme_value+=parseInt(scheme.amount>0?scheme.amount:0);
          let total_subheads_amount=0;
          let each_scheme_amount=parseInt(scheme.amount>0?scheme.amount:0);
          scheme.subheads.forEach((sub_head)=>{
            if(sub_head){
              total_subheads_amount+=parseInt(sub_head.sub_head_amount >0 ? sub_head.sub_head_amount:0);
            }
          })
          // console.log(total_subheads_amount,each_scheme_amount)
          if(total_subheads_amount!==each_scheme_amount){
            sub_heads_status=0;
            msg='subheads amount is not match with scheme amount';
          }
        })
        if(parseInt(invoice.payment)==2){
          if(total_scheme_value!==each_invoice_sanction_amount){
            scheme_status=0;
            msg='scheme amount is not match with each invoice sanction amount';
          }
        }else{
          if(total_scheme_value!==each_invoice_value){
            scheme_status=0;
            msg='scheme amount is not match with each invoice amount';
          }
          if(each_invoice_sanction_amount!==each_invoice_value){
            scheme_status=0;
            msg='scheme amount is not match with each invoice amount';
          }
          
        }
        
      })
      if(total_sanction_value!==each_voucher_value){
        invoice_status=0;
        msg='invoice value is not match with each voucher value';
      }      
    });
    let response={
      status:true,
      msg:msg
    };
    if(sanction_order_value!==total_voucher){
      response.status=false;
      response.msg='Total voucher value is not match with sanction order value...!';
      return response;
    }    
    if(!invoice_status){  
      response.status=false;
      return response;
    }
    if(!scheme_status){
      response.status=false;
      return response;
    }
    if(!sub_heads_status){
      response.status=false;
      return response;
    }
    // console.log(response)
    return response;
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setShowPreview(false);
    // console.log(formData)
    let check_status=check_total_invoice_value();
    if(check_status.status){
        const formDataObject = new FormData();
        formDataObject.append('financial_year', formData.financial_year);
        formDataObject.append('sanction_order_no', formData.sanction_order_no);
        formDataObject.append('sanction_order_date', formData.sanction_order_date);
        formDataObject.append('sanction_order_value', formData.sanction_order_value);
        formDataObject.append('added_by', authData.user.id);

        // Append the `sanction_order` file
        if (formData.sanction_order && formData.sanction_order[0]) {
          formDataObject.append('sanction_order', formData.sanction_order[0]);
        }
        
        formData.vouchers.forEach((voucher, index) => {
          formDataObject.append(`vouchers[${index}][voucher_no]`, voucher.voucher_no);
          formDataObject.append(`vouchers[${index}][voucher_date]`, voucher.voucher_date);
          formDataObject.append(`vouchers[${index}][total_voucher_value]`, voucher.total_voucher_value);
          if (voucher.voucher && voucher.voucher[0]) {
            formDataObject.append(`vouchers[${index}][voucher]`, voucher.voucher[0]);
          }
          if (voucher.supporting_docs && voucher.supporting_docs[0]) {
            formDataObject.append(`vouchers[${index}][supporting_docs]`, voucher.supporting_docs[0]);
          }
          voucher.invoices.forEach((invoice,j)=>{
            if(invoice.invoice){
              formDataObject.append(`invoices[${index}][${j}][invoice]`,invoice.invoice[0]);
            }
            if(invoice.invoice_ref){
              formDataObject.append(`invoices[${index}][${j}][invoice_ref]`,invoice.invoice_ref[0]);
            }
            formDataObject.append(`vouchers[${index}][invoices][${j}]`,JSON.stringify(invoice));
          })          
        });

        try {
          setIsloading(true);
          const sanction_order_response=await add_sanction_order(formDataObject);
          if(sanction_order_response.data.status){
            setIsloading(false);
            toast.success(sanction_order_response.data.message,{
              position: toast.POSITION.TOP_CENTER
            });
            navigate('/fund-invoice-list');
          }else{
            setIsloading(false);
            toast.error(sanction_order_response.data.message,{
              position: toast.POSITION.TOP_CENTER
            });
          }
        } catch (error) {
            setIsloading(false);
            toast.error('Something went wrong',{
              position: toast.POSITION.TOP_CENTER
            });
        }
    }else{
      setIsloading(false);
      toast.error(check_status.msg, {
        position: toast.POSITION.TOP_CENTER
      });
    }
  }
  

  const handleVendor=(e)=>{
    // console.log(e.target.value);
    if(e.target.value){
      const id=e.target.value;
      // console.log(index) 
      if(id>=0){
        let vendor=vendorList.filter((v)=>v.id==id);
        setVendor(vendor[0]);
      }else{
        setVendor({});
      }
    }else{
      setVendor({});
    }
  }

  const addMoreVoucher=()=>{
    // console.log('add voucher clicked')
    const newVoucher = [...formData.vouchers];
    newVoucher.push(
      {
        voucher_no:null,
        voucher_date:null,
        total_voucher_value:null,
        voucher:null,
        supporting_docs:null,
        invoices:[{
          vendor_id:null,
          payment:null,
          invoice_no:null,
          invoice_ref_no:null,
          invoice_date:null,
          invoice_value:null,
          taxable_amount:null,
          sanction_amount:null,
          gst:null,
          gis:null,
          nps:null,
          tds_it_rate:null,
          tds_it_amount:null,
          s_gst_rate:null,
          s_gst_amount:null,
          c_gst_rate:null,
          c_gst_amount:null,
          i_gst_rate:null,
          i_gst_amount:null,
          other_deduction:null,
          remarks:null,
          schemes:[{
            scheme_id:null,
            amount:null,
            subheads:[{
              sub_heads_id:null,
              sub_head_amount:null
            }]
          }]
        }] 
      }
    );
    setFormData({
        ...formData,
        vouchers: newVoucher
    });
  }

  const previewhandler = (e) => {
    e.preventDefault();
    // console.log('i m here', formData.vouchers)
    // checkSubHeadAmount(formData.vouchers)
    // console.log('i ma working', checkSubHeadAmount(formData.vouchers))
    if(!checkSubHeadAmount(formData.vouchers)) {
     return  toast.error('Enter Sub Head Amount',{
        position: toast.POSITION.TOP_CENTER
      });
    }

    setShowPreview(true);
  };

  const checkSubHeadAmount = (data) => {
    for (const voucher of data) {
      const invoices = voucher.invoices || [];
      for (const invoice of invoices) {
        const schemes = invoice.schemes || [];
        for (const scheme of schemes) {
          const subheads = scheme.subheads || [];
          for (const subhead of subheads) {
            const subHeadAmount = subhead.sub_head_amount;
            if (subHeadAmount === null || subHeadAmount === "") {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  
  return (
    <>

    <SanctionOrderModal showPreview={showPreview} setShowPreview={setShowPreview} formData={formData} handleSubmit={handleSubmit} vendorList={vendorList}></SanctionOrderModal>
    <Form onSubmit={previewhandler}>
      {isLoading?<LootieLoaderDot/>:""}     
    <div className="AddVoucherHeadline">
        <h1>Add Sanction Order</h1>
        <div className="">
          <Button variant="outlined" onClick={goback}>GO BACK</Button>&nbsp;
          <Button variant="contained" type='submit' 
          disabled={isLoading}
          >{isLoading ? 'LOADING....':'Submit for Approval'}</Button>
        </div>
    </div>
    <div className='addVoucherForm'>
      <Container>
        <div className='card p-2'>     
        <Row>        
        <Col md={6}>
          <Form.Group className="mb-3" controlId="">
            <Form.Label>Sanction Order No. <span className='text-danger'>*</span> </Form.Label>
            <Form.Control type="text" placeholder="Enter Sanction Order No." value={formData.sanction_order_no} onChange={handleInput} name="sanction_order_no" required/>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="">
            <Form.Label>Sanction Order Date. <span className='text-danger'>*</span></Form.Label>
            <Form.Control type="date" placeholder="Enter Sanction Order Date." onChange={handleInput} name="sanction_order_date" value={formData.sanction_order_date} required/>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="">
            <Form.Label>Sanction Order Value <span className='text-danger'>*</span></Form.Label>
            <Form.Control type="number" placeholder="Enter Sanction Order Value."  onChange={handleInput} name="sanction_order_value" value={formData.sanction_order_value} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="">
            <Form.Label>Upload Sanction Order<span className='text-danger'>*</span> <small className='text-danger'>(only  pdf allowed under 5MB.)</small></Form.Label>
            <Form.Control type="file" accept=".pdf"   onChange={handleInput} name="sanction_order" required  />
          </Form.Group>
        </Col>
        <Accordion defaultActiveKey="v_0">
        {
          formData.vouchers.map((voucher,i)=>{
            return (
              <>
                <Accordion.Item eventKey={`v_${i}`}>
                    <Accordion.Header>Voucher - {i+1} </Accordion.Header>
                    <Accordion.Body>
                      <Voucher handleInput={handleInput} formData={formData} handleVendor={handleVendor} vendorList={vendorList} vendor={vendor} setFormData={setFormData} voucherIndex={i}/>
                    </Accordion.Body>
                </Accordion.Item>
              </>
            );
          })
        }     
        </Accordion>
        <Col md={6} className='pt-2'>
          {
            check_is_equal_sanction_voucher_amount(formData.sanction_order_value,formData.vouchers)?"":<Button variant="outlined" onClick={addMoreVoucher}><FaPlus/>&nbsp;Add Another Voucher</Button>
          }          
        </Col>   
        </Row>
          <div className='m-auto mt-2'>
          <Button variant="contained" type='submit' 
          disabled={isLoading}
          >{isLoading ? 'LOADING....':'Submit for Approval'}</Button>
          </div>
        </div>
      </Container>      
    </div>
    </Form>
    </>
  )
}

export default AddVoucherHeadline;
