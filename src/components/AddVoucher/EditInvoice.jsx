import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Form, Row, Table } from 'react-bootstrap'
import Scheme from './Scheme';
import { Button } from '@mui/material';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { get_beneficiary, get_invoice_details_by_invoice_id, get_invoices_by_invoice_no, update_invoice } from '../../helper/Api';
import { check_is_equal_sanctioned_and_schemes_amount, goback, isFilePdf_or_Image } from '../../helper/Utils';
import { toast } from 'react-toastify';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EditScheme from './EditScheme';
import EditInvoiceSchemeVeiw from './EditInvoiceSchemeVeiw';


const EditInvoice = () => {
  const all_rates = [0, 0.1, 0.5, 0.7, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const { invoice_id } = useParams();
  const { authData } = useSelector((state) => state.authData);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [formData, setFormData] = useState({
    vendor_id: null,
    payment: null,
    invoice_no: null,
    invoice_ref_no: null,
    invoice_date: null,
    invoice_value: null,
    taxable_amount: null,
    sanction_amount: null,
    invoice: null,
    invoice_ref: null,
    gst: null,
    gis: null,
    nps: null,
    tds_it_rate: null,
    tds_it_amount: null,
    s_gst_rate: null,
    s_gst_amount: null,
    c_gst_rate: null,
    c_gst_amount: null,
    i_gst_rate: null,
    i_gst_amount: null,
    other_deduction: null,
    remarks: null,
    schemes: [{
      scheme_id: null,
      amount: null,
      subheads: [{
        sub_heads_id: null,
        sub_head_amount: null
      }]
    }]
  });

  const [viewData, setViewData] = useState({});
  const [paymentType, setPaymentType] = useState('');
  const [vendor, setVendor] = useState({});
  const [vendorList, setVendorList] = useState([])
  const [isLoading, setIsloading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [partialInvoices, setPartialInvoices] = useState([]);
  const [vendorId, setVendorId] = useState(0);

  const navigate = useNavigate();
  let data = [];
  const handleInvoiceChange = (e) => {
    let { name, value } = e.target;
    console.log(name, value)
    setFormData({ ...formData, [name]: value });
    if(name == 'vendor_id') {
      handleVendor(e)
      setVendorId(value)
    }
    if(name=='payment'){
      setPaymentType(value)
    }
    if(name=='invoice_no'){
      setInvoiceNo(value)
    }
    if(name=='invoice_date'){
      setInvoiceDate(value)
    }
  };

  const handleVendor = (e) => {
    // console.log(e.target.value);
    if (e.target.value) {
      const id = e.target.value;
      // console.log(index) 
      if (id >= 0) {
        let vendor = vendorList.filter((v) => v.id == id);
        setVendor(vendor[0]);
      } else {
        setVendor({});
      }
    } else {
      setVendor({});
    }
  }

  const get_rate = (rate) => {
    let taxable_amount=formData.taxable_amount;

    if(paymentType==='2'){
      // console.log(partialInvoices)
      if(partialInvoices.length>0){
        taxable_amount=partialInvoices[0].taxable_amount;
        let sanction_amount=viewData.sanction_amount;
        let invoice_value=partialInvoices[0].invoice_value;
        let pro_rata_basis=(parseInt(sanction_amount)*100)/parseInt(invoice_value);
        taxable_amount=(pro_rata_basis*taxable_amount)/100;
        console.log(taxable_amount)
      }else if(partialInvoices.length==0){
        let sanction_amount=viewData.sanction_amount;
        let invoice_value=formData.invoice_value;
        let pro_rata_basis=(parseInt(sanction_amount)*100)/parseInt(invoice_value);
        taxable_amount=(pro_rata_basis*taxable_amount)/100;
      }
    }
    if (taxable_amount) {
      let amount = 0;
      amount = (taxable_amount * rate) / 100;
      return Math.round(amount);
    } else {
      return 0;
    }
  }
  const calculateResult = () => {
    var s_gst = get_rate(formData.s_gst_rate);
    var i_gst = get_rate(formData.i_gst_rate);
    var c_gst = get_rate(formData.c_gst_rate);
    var tds_it = get_rate(formData.tds_it_rate);
    var other = formData.other_deduction;
    var gis = formData.gis;
    var nps = formData.nps;

    if (!other) {
      other = 0;
    } else {
      other = parseInt(other);
    }
    if (!gis) {
      gis = 0;
    } else {
      gis = parseInt(gis);
    }
    if (!nps) {
      nps = 0;
    } else {
      nps = parseInt(nps);
    }

    if (!s_gst) {
      s_gst = 0;
    }
    if (!i_gst) {
      i_gst = 0;
    }
    if (!c_gst) {
      c_gst = 0;
    }
    if (!tds_it) {
      tds_it = 0;
    }

    let total = 0;
    total = s_gst + i_gst + c_gst + tds_it + other +gis+nps;

    return total;
  };

  const total_payable_amount = () => {
    const total_deduct = calculateResult();
    let payable_amount = formData.invoice_value ? parseInt(viewData.sanction_amount) : 0;
    return payable_amount - total_deduct;
    // return 0;
  }

  const get_invoice_details = async () => {
    try {
      const { data } = await get_invoice_details_by_invoice_id(invoice_id);
      if (data.status) {
        setViewData(data.details);
        setFormData({
          vendor_id: data.details.vendor_id,
          payment: data.details.payment_type,
          invoice_no: data.details.invoice_no,
          invoice_ref_no: data.details.invoice_ref_no,
          invoice_date: data.details.invoice_date,
          invoice_value: data.details.invoice_value,
          taxable_amount: data.details.taxable_amount,
          sanction_amount: data.details.sanction_amount,
          invoice: '',
          invoice_ref: '',
          gst: data.details.gst,
          gis: data.details.gis,
          nps: data.details.nps,
          tds_it_rate: data.details.tds_it_rate,
          tds_it_amount: data.details.tds_it_amount,
          s_gst_rate: data.details.s_gst_rate,
          s_gst_amount: data.details.s_gst_amount,
          c_gst_rate: data.details.c_gst_rate,
          c_gst_amount: data.details.c_gst_amount,
          i_gst_rate: data.details.i_gst_rate,
          i_gst_amount: data.details.i_gst_amount,
          other_deduction: data.details.other_deduction,
          remarks: data.details.remarks,
          schemes: [{
            scheme_id: null,
            amount: null,
            subheads: [{
              sub_heads_id: null,
              sub_head_amount: null
            }]
          }]
        });
        setVendorId(data.details.vendor_id)
        setPaymentType(data.details.payment_type)
        setInvoiceNo(data.details.invoice_no)
        setInvoiceDate(data.details.invoice_date)

        if (data.details.beneficiary) {
          setVendor(data.details.beneficiary)
        } else {
          setVendor({})
        }
      }
    } catch (error) {

    }
  }
  const get_vendor_list = async () => {
    const vendorResponse = await get_beneficiary();
    if (vendorResponse.data.status) {
      setVendorList(vendorResponse.data.list);
    }
  }

  useEffect(() => {
    // console.log(vendorId, paymentType, invoiceNo, invoiceDate)
    // console.log(formData)
    if (vendorId > 0 && paymentType == 2 && invoiceNo && invoiceDate) {
      get_invoice_list();
    } else {
      setPartialInvoices([])
    }
  }, [vendorId, paymentType, invoiceNo, invoiceDate])

  useEffect(() => {

    get_invoice_details();
    get_vendor_list();
  }, [invoice_id])

  const get_invoice_list = async () => {
    let post_data = {
      'vendor_id': vendorId,
      'payment_type': paymentType,
      'invoice_no': invoiceNo,
      'invoice_date': invoiceDate,
    }
    const { data } = await get_invoices_by_invoice_no(post_data);
    if (data.status) {
      setPartialInvoices(data.list);
      let invoice_ref_no = 0;
      let invoice_value = 0;
      let taxable_amount = 0;
      if (data.list.length > 0) {
        invoice_ref_no = data.list[0].invoice_ref_no
        invoice_value = data.list[0].invoice_value
        taxable_amount = data.list[0].taxable_amount
      }
      setFormData((prevState) => ({
        ...prevState,
        invoice_ref_no,
        invoice_value,
        taxable_amount,
      }));

    }
  }

  const handleInvoiceChangeFile = (e) => {
    const { name, files } = e.target;
    console.log(name,files)
    if (!isFilePdf_or_Image(files[0])) {
      e.target.value = "";
      toast.error("Please select pdf type file.", {
        position: toast.POSITION.TOP_CENTER
      });
      return;
    } else {
      setFormData({ ...formData, [name]: files });
    }
    // console.log(files)
  };
  const addScheme = () => {
    // Create a new scheme object
    const newScheme = {
      scheme_id: null,
      amount: null,
      subheads: [
        {
          sub_heads_id: null,
          sub_head_amount: null,
        },
      ],
    };

    // Update the state to add the new scheme
    setFormData((prevState) => ({
      ...prevState,
      schemes: [...prevState.schemes, newScheme],
    }));
  };

  const check_total_invoice_value=()=>{    
    let invoice_status=1;
    let scheme_status=1;
    let sub_heads_status=1;
    let msg='';
    let total_invoice_value=parseInt(formData.invoice_value>0?formData.invoice_value:0)
        let each_invoice_value=parseInt(formData.invoice_value);
        let each_invoice_sanction_amount=parseInt(formData.sanction_amount);
        let total_scheme_value=0;
        formData.schemes.forEach((scheme)=>{ 
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
        if(parseInt(formData.payment)==2){
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
    let response={
      status:true,
      msg:msg
    };
      
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
    let check_status=check_total_invoice_value();
    if(check_status.status){
      try {
        setIsloading(true);
        // console.log(formData)
        const formDataObject = new FormData();
        formDataObject.append('financial_year', viewData.financial_year);
        formDataObject.append('sanction_order_no', viewData.sanction_order_no);
        formDataObject.append('sanction_order_date', viewData.sanction_order_date);
        formDataObject.append('sanction_order_value', viewData.sanction_order_value);
        formDataObject.append('sanction_order_id', viewData.sanction_order_id);
        formDataObject.append('voucher_id', viewData.voucher_id);
        formDataObject.append('sanction_order_no', viewData.sanction_order_no);
        formDataObject.append('voucher_no', viewData.voucher_no);
        formDataObject.append('invoice_id', invoice_id);
        formDataObject.append('added_by', authData.user.id);
        formDataObject.append(`invoice`,JSON.stringify(formData));
        if(formData.invoice){
          formDataObject.append(`invoice`,formData.invoice[0]);
        }
        if(formData.invoice_ref){
          formDataObject.append(`invoice_ref`,formData.invoice_ref[0]);
        }
        const {data}=await update_invoice(formDataObject);
        if(data.status){
          setIsloading(false);
          toast.success(data.message,{
            position: toast.POSITION.TOP_CENTER
          });
          navigate('/fund-invoice-list');
        }else{
          setIsloading(false);
          toast.error(data.message,{
            position: toast.POSITION.TOP_CENTER
          });
        }
      } catch (error) {
        console.log('error',error)
      }
    }else{
      setIsloading(false);
      toast.error(check_status.msg, {
        position: toast.POSITION.TOP_CENTER
      });
    }    
  }

  return (
    <div className='card pt-2'>
      <Form onSubmit={handleSubmit}>
      <div className="AddVoucherHeadline">
          <h1>Update Invoice</h1>
          <div className="">
            {/* <Button variant="outlined" onClick={goback}>GO BACK</Button>&nbsp; */}
            <Button variant="contained" type='submit' 
            disabled={isLoading}
            >{isLoading ? 'LOADING....':'Submit for Approval'}</Button>
          </div>
      </div>
      <Container fluid>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Sanction Order No</Form.Label>
              <Form.Control type="text" placeholder="Sanction Order No" disabled value={viewData.sanction_order_no} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Sanction Order Value</Form.Label>
              <Form.Control type="text" placeholder="Sanction Order Value" disabled value={viewData.sanction_order_value} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Sanction Order Date</Form.Label>
              <Form.Control type="date" placeholder="Sanction Order Date" disabled value={viewData.sanction_order_date} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Voucher No</Form.Label>
              <Form.Control type="text" placeholder="Voucher No" disabled value={viewData.voucher_no} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Voucher Value</Form.Label>
              <Form.Control type="text" placeholder="Voucher Value" disabled value={viewData.total_voucher_value} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Voucher Date</Form.Label>
              <Form.Control type="date" placeholder="Voucher Date" disabled value={viewData.voucher_date} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Sanction Doc:</Form.Label>
              <Form.Label><Link to={viewData.sanction_order} target='_blank'>Link:</Link></Form.Label>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Voucher Doc:</Form.Label>
              <Form.Label><Link to={viewData.voucher} target='_blank'>Link:</Link></Form.Label>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Supporting Doc:</Form.Label>
              <Form.Label><Link to={viewData.supporting_docs} target='_blank'> {viewData.supporting_docs ? "Link :" : ""}</Link></Form.Label>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="vendor_id">
              <Form.Label>Vendor : <span className='text-danger'>*</span></Form.Label>
              <Form.Select
                onChange={(e) => handleInvoiceChange(e)}
                name="vendor_id" required >
                <option value=''>--- Select Vendor ---</option>
                {
                  vendorList.map((vendor) => {
                    return (
                      vendor.l2_status == 1 && vendor.l3_status == 1 && <option value={vendor.id} key={vendor.id} selected={vendor.id == formData.vendor_id ? "selected" : ""}>{vendor.company_name}</option>
                    );
                  })
                }
              </Form.Select>
            </Form.Group>
          </Col>
          <Container fluid>
            <Card className="pt-3 mb-3 bg-light">
              <Row>
                <Col md={3}>
                  <div>
                    <h6>vendor Code :</h6>
                    <p> {vendor.id ? "B-" + vendor.id : ''} </p>
                  </div>
                </Col>
                <Col md={3}>
                  <div>
                    <h6>Contact Person :</h6>
                    <p>{vendor.contact_person ? vendor.contact_person : ''}</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div>
                    <h6>Mobile :</h6>
                    <p>{vendor.mobile ? vendor.mobile : ''}</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div>
                    <h6>GSTN No. :</h6>
                    <p>{vendor.gst_no && vendor.gst_no != 'null' ? vendor.gst_no : ''}</p>
                  </div>
                </Col>
              </Row>
            </Card>
          </Container>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Payment : <span className='text-danger'>*</span></Form.Label>
              <Form.Select
                onChange={(e) => handleInvoiceChange(e)}
                name="payment" value={formData.payment} required>
                <option value=''>--- Select Payment ---</option>
                <option value="1" selected={formData.payment == 1 ? 'selected' : ''}>Full Payment</option>
                <option value="2" selected={formData.payment == 2 ? 'selected' : ''}>Part Payment</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="">
              <Form.Label>Invoice No : <span className='text-danger'>*</span></Form.Label>
              <Form.Control type="text" placeholder=""
                onChange={(e) => handleInvoiceChange(e)}
                name="invoice_no" required value={formData.invoice_no} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="">
              <Form.Label>Invoice Date : <span className='text-danger'>*</span></Form.Label>
              <Form.Control type="date"
                onChange={(e) => handleInvoiceChange(e)}
                name="invoice_date" value={formData.invoice_date} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="">
              <Form.Label>Invoice Ref No : </Form.Label>
              {
                partialInvoices.length > 0 ?
                  <p>{partialInvoices[0].invoice_ref_no}</p>
                  :
                  <Form.Control type="text" placeholder=""
                    onChange={(e) => handleInvoiceChange(e)}
                    name="invoice_ref_no"
                    value={formData.invoice_ref_no} />
              }
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Invoice value : <span className='text-danger'>*</span></Form.Label>
              {
                partialInvoices.length > 0 ?
                  <p>{partialInvoices[0].invoice_value}</p>
                  :
                  <Form.Control type="number" placeholder=""
                    onChange={(e) => handleInvoiceChange(e)}
                    name="invoice_value" value={formData.invoice_value} required />
              }
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="">
              <Form.Label>Taxable Amount: <span className='text-danger'>*</span></Form.Label>
              {
                partialInvoices.length > 0 ?
                  <p>{partialInvoices[0].taxable_amount}</p>
                  :
                  <Form.Control type="number" placeholder="" name="taxable_amount"
                    onChange={(e) => handleInvoiceChange(e)}
                    value={formData.taxable_amount} required />
              }

            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Sanctioned Amount: <span className='text-danger'>*</span></Form.Label>
              <Form.Control type="number"
                            disabled={true}
                onChange={(e) => handleInvoiceChange(e)}
                name="sanction_amount" value={formData.sanction_amount} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="">
              <Form.Label>GST:</Form.Label>
              {
                partialInvoices.length > 0 ?
                  <p>{partialInvoices[0].gst}</p>
                  :
                  <Form.Control type="number" placeholder="Enter GST"
                    onChange={(e) => handleInvoiceChange(e)}
                    name="gst" value={formData.gst} />
              }
            </Form.Group>
          </Col>

          {
            partialInvoices.length > 0 ?
              ""
              :
              <Col md={6}>
                <Form.Group className="mb-3" controlId="">
                  <Form.Label>Invoice : <span className='text-danger'>*</span> <small className='text-danger'>(only pdf allowed under 5MB.)</small></Form.Label>
                  <Form.Control type="file" placeholder=""
                    accept=".pdf"
                    onChange={(e) => handleInvoiceChangeFile(e)}
                    name="invoice" required />
                </Form.Group>
              </Col>
          }

          <Col md={6}>
            <Form.Group className="mb-3" controlId="">
              <Form.Label>Invoice Ref. : <small className='text-danger'>(only pdf allowed under 5MB.)</small></Form.Label>
              <Form.Control type="file" placeholder=""
                accept=" .pdf"
                onChange={(e) => handleInvoiceChangeFile(e)}
                name="invoice_ref" />
            </Form.Group>
          </Col>
          <Container fluid>
            <Table striped bordered>
              <thead className='bg-light'>
                <tr>
                  <th>Deduction</th>
                  <th>Rate (%)</th>
                  <th align='right'>Amount (Taxable value * Rate%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>TDS (IT)</td>
                  <td>
                    <Form.Select name="tds_it_rate"
                      onChange={(e) => handleInvoiceChange(e)}
                    >
                      <option value=''>---select Rate---</option>
                      {
                        all_rates.map((rate) => {
                          return (
                            <option value={rate} key={rate} selected={formData.tds_it_rate == rate ? 'selected' : ''}>{rate}</option>
                          )
                        })
                      }
                    </Form.Select>
                  </td>
                  <td>
                    {get_rate(formData.tds_it_rate) ? get_rate(formData.tds_it_rate) : 0}
                    <input type="hidden" name='tds_it_amount' value=''
                    />
                  </td>
                </tr>
                <tr>
                  <td>TDS (S-GST)</td>
                  <td>
                    <Form.Select name="s_gst_rate"
                      onChange={(e) => handleInvoiceChange(e)}
                    >
                      <option value=''>---select Rate---</option>
                      {
                        all_rates.map((rate) => {
                          return (
                            <option value={rate} key={rate} selected={formData.s_gst_rate == rate ? 'selected' : ''}>{rate}</option>
                          )
                        })
                      }
                    </Form.Select>
                  </td>
                  <td>
                    {get_rate(formData.s_gst_rate) ? get_rate(formData.s_gst_rate) : 0}
                    <input type="hidden" name='s_gst_amount' value='' />
                  </td>
                </tr>
                <tr>
                  <td>TDS (C-GST)</td>
                  <td>
                    <Form.Select name="c_gst_rate"
                      onChange={(e) => handleInvoiceChange(e)}
                    >
                      <option value=''>---select Rate---</option>
                      {
                        all_rates.map((rate) => {
                          return (
                            <option value={rate} key={rate} selected={formData.c_gst_rate == rate ? 'selected' : ''}>{rate}</option>
                          )
                        })
                      }
                    </Form.Select>
                  </td>
                  <td>
                  {get_rate(formData.c_gst_rate) ? get_rate(formData.c_gst_rate) : 0}
                    <input type="hidden" name="c_gst_amount" value="" />
                  </td>
                </tr>
                <tr>
                  <td>TDS (I-GST)</td>
                  <td>
                    <Form.Select name="i_gst_rate"
                      onChange={(e) => handleInvoiceChange(e)}
                    >
                      <option value=''>---select Rate---</option>
                      {
                        all_rates.map((rate) => {
                          return (
                            <option value={rate} key={rate} selected={formData.i_gst_rate == rate ? 'selected' : ''}>{rate}</option>
                          )
                        })
                      }
                    </Form.Select>
                  </td>
                  <td>
                  {get_rate(formData.i_gst_rate) ? get_rate(formData.i_gst_rate) : 0}
                    <input type="hidden" name="i_gst_amount" value='' />
                  </td>
                </tr>
                <tr>
                  <td>GIS:</td>
                  <td></td>
                  <td>
                    <Form.Control type="number" placeholder="Enter GIS"
                      onChange={(e) => handleInvoiceChange(e)}
                      name="gis" value={formData.gis} />
                  </td>
                </tr>
                <tr>
                  <td>NPS:</td>
                  <td></td>
                  <td>
                    <Form.Control type="number" placeholder="Enter NPS"
                      onChange={(e) => handleInvoiceChange(e)}
                      name="nps" value={formData.nps} />
                  </td>
                </tr>
                <tr>
                  <td>Other Deduction</td>
                  <td><Form.Control type="text" placeholder="Enter Deduction Remarks"
                    onChange={(e) => handleInvoiceChange(e)}
                    name="deduction_remarks" value={formData.deduction_remarks} /></td>
                  <td><input type="number" className='form-control' value={formData.other_deduction} placeholder='₹ Enter other deduction'
                    onChange={(e) => handleInvoiceChange(e)}
                    name="other_deduction" /></td>
                </tr>
              </tbody>
            </Table>
          </Container>
          <hr />
          <div className='total_amount_wrapper'>
            <div>
              <h6>Total Deduction: <b> ₹ {calculateResult()}</b></h6>
              <h6>Net Payable Amount: <b> ₹ {total_payable_amount()}</b></h6>
              <h6>Sanctioned Amount: <b> ₹ {formData.sanction_amount}</b></h6>
            </div>
          </div>
          <br />
          <Col md={2}>
            <h6>Remarks :</h6>
          </Col>
          <Col md={10}>
            <textarea name="remarks" id="" rows="5"
              onChange={(e) => handleInvoiceChange(e)}
              className='form-control' placeholder='Enter Remarks' value={formData.remarks}>
              {formData.remarks}
            </textarea>
          </Col>
          <EditInvoiceSchemeVeiw schemes={viewData.scheme_list?viewData.scheme_list:[]}/>
          {
            formData.schemes.map((scheme,i)=>{
              return (
                <>
                <EditScheme formData={formData} setFormData={setFormData} schemeIndex={i} />
                </>
              )
            })
          }
          <div className='m-2'>
            {
            check_is_equal_sanctioned_and_schemes_amount(formData.sanction_amount,formData.schemes)?"":
            <Button variant="outlined" onClick={()=>addScheme()}><FaPlus/>&nbsp;Add Another Scheme</Button>
          }
            <br />
          </div>
        </Row>
      </Container>
      </Form>
    </div>
  )
}

export default EditInvoice
