import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Form, Row, Table } from 'react-bootstrap'
import Scheme from './Scheme';
import { Button } from '@mui/material';
import {FaPlus, FaTrash} from 'react-icons/fa';
import { get_invoices_by_invoice_no } from '../../helper/Api';
import { check_is_equal_sanctioned_and_schemes_amount, isFilePdf_or_Image } from '../../helper/Utils';
import { toast } from 'react-toastify';

const Invoice = ({ handleInput, formData,setFormData, handleVendor, vendorList, vendor,voucherIndex,invoiceIndex }) => {
  const [paymentType,setPaymentType]=useState('');
  const [invoiceNo,setInvoiceNo]=useState('');
  const [invoiceDate,setInvoiceDate]=useState('');
  const [vendorId,setVendorId]=useState(0);
  const [partialInvoices,setPartialInvoices]=useState([]);


  useEffect(() => {
    if(vendorId>0 && paymentType==2 && invoiceNo && invoiceDate){
      get_invoice_list();
    }else{
      setPartialInvoices([])
    }    
  }, [vendorId,paymentType,invoiceNo,invoiceDate])
  
  const total_sanction_amount = partialInvoices.reduce((total, invoice) => {
    return total + parseInt(invoice.sanction_amount);
  }, 0);
  const get_invoice_list=async()=>{
    let post_data={
      'vendor_id':vendorId,
      'payment_type':paymentType,
      'invoice_no':invoiceNo,
      'invoice_date':invoiceDate,
    }
    const {data}=await get_invoices_by_invoice_no(post_data);
    if(data.status){
      setPartialInvoices(data.list);
      let invoice_ref_no=0;
      let invoice_value=0;
      let taxable_amount=0;
      if(data.list.length>0){
        invoice_ref_no=data.list[0].invoice_ref_no
        invoice_value=data.list[0].invoice_value
        taxable_amount=data.list[0].taxable_amount
      }
      setFormData((prevState) => {
        const newVouchers = [...prevState.vouchers];
        const newInvoices = [...newVouchers[voucherIndex].invoices];
        newInvoices[invoiceIndex]['invoice_ref_no'] = invoice_ref_no;
        newInvoices[invoiceIndex]['invoice_value'] = invoice_value;
        newInvoices[invoiceIndex]['taxable_amount'] = taxable_amount;
        newVouchers[voucherIndex].invoices = newInvoices;
        return { ...prevState, vouchers: newVouchers };
      });
    }
  }

  let data=formData.vouchers[voucherIndex].invoices[invoiceIndex];
  const all_rates = [0,0.1,0.5, 0.7, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const get_rate = (rate) => {
    let taxable_amount=formData.vouchers[voucherIndex].invoices[invoiceIndex].taxable_amount;
    

    if(paymentType==='2'){
      // console.log(partialInvoices)
      if(partialInvoices.length>0){
        taxable_amount=partialInvoices[0].taxable_amount;
        let sanction_amount=formData.vouchers[voucherIndex].invoices[invoiceIndex].sanction_amount;
        let invoice_value=partialInvoices[0].invoice_value;
        let pro_rata_basis=(parseInt(sanction_amount)*100)/parseInt(invoice_value);
        taxable_amount=(pro_rata_basis*taxable_amount)/100;
       // console.log(taxable_amount)
      }else if(partialInvoices.length==0){
        let sanction_amount=formData.vouchers[voucherIndex].invoices[invoiceIndex].sanction_amount;
        let invoice_value=formData.vouchers[voucherIndex].invoices[invoiceIndex].invoice_value;
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
    // console.log('im here')
    var s_gst = get_rate(data.s_gst_rate);
    var i_gst = get_rate(data.i_gst_rate);
    var c_gst = get_rate(data.c_gst_rate);
    var tds_it = get_rate(data.tds_it_rate);
    var other = data.other_deduction;
    var gis = data.gis;
    var nps = data.nps;

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
    let payable_amount = data.sanction_amount ? parseInt(data.sanction_amount) : 0;
    return payable_amount - total_deduct;
    // return 0;
  }

  const addScheme = (v_index, i_index) => {
    setFormData((prevState) => {
      const newVouchers = [...prevState.vouchers];
      const newInvoices = [...newVouchers[v_index].invoices];
      newInvoices[i_index].schemes.push({
        scheme_id: null,
        amount: null,
        subheads: [
          {
            sub_heads_id: null,
            sub_head_amount: null,
          },
        ],
      });
      newVouchers[v_index].invoices = newInvoices;
      return { ...prevState, vouchers: newVouchers };
    });
  };
  const handleInvoiceChange = (e, voucherIndex, invoiceIndex) => {
    let { name, value } = e.target;
    if(name=='vendor_id'){
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
    
    setFormData((prevState) => {
      const newVouchers = [...prevState.vouchers];
      const newInvoices = [...newVouchers[voucherIndex].invoices];
      newInvoices[invoiceIndex][name] = value;
      newVouchers[voucherIndex].invoices = newInvoices;
      return { ...prevState, vouchers: newVouchers };
    });
    
  };

  const handleInvoiceChangeFile = (e, voucherIndex, invoiceIndex) => {
    const { name, files } = e.target;
    if(!isFilePdf_or_Image(files[0])){
      e.target.value = "";
      toast.error("Please select pdf type file.",{
          position: toast.POSITION.TOP_CENTER
      });
      return;
    }else{
      setFormData((prevState) => {
        const newVouchers = [...prevState.vouchers];
        const newInvoices = [...newVouchers[voucherIndex].invoices];
        newInvoices[invoiceIndex][name] = files;
        newVouchers[voucherIndex].invoices = newInvoices;
        return { ...prevState, vouchers: newVouchers };
      });
    }
  };
  
  const deleteInvoice = (voucherIndex, invoiceIndex) => {
    setFormData((prevState) => {
      const newVouchers = [...prevState.vouchers];
      const newInvoices = [...newVouchers[voucherIndex].invoices];
      newInvoices.splice(invoiceIndex, 1);
      newVouchers[voucherIndex].invoices = newInvoices;
      return { ...prevState, vouchers: newVouchers };
    });
  };

  return (
    <>
          {invoiceIndex>0 && (
            <div>
                <button className='btn btn-danger btn-sm' onClick={()=>deleteInvoice(voucherIndex,invoiceIndex)}>Invoice {invoiceIndex+1} <FaTrash/></button>
            </div>
            )}
    <Container fluid>      
      <Row>
      <Col md={6}>
        <Form.Group className="mb-3" controlId="vendor_id">
          <Form.Label>Vendor : <span className='text-danger'>*</span></Form.Label>
          <Form.Select 
          onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
          name="vendor_id" value={formData.vendor_id} required>
            <option value=''>--- Select Vendor ---</option>
            {
              vendorList.map((vendor) => {
                return (
                  vendor.l2_status==1&& vendor.l3_status==1&& <option value={vendor.id} key={vendor.id}>{vendor.company_name}</option>
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
                  <p>{vendor.gst_no ? vendor.gst_no : ''}</p>
                </div>
              </Col>
            </Row>
          </Card>
        
      </Container>
      <Col md={6}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Payment : <span className='text-danger'>*</span></Form.Label>
          <Form.Select 
           onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
          name="payment" value={formData.payment_type} required>
            <option value=''>--- Select Payment ---</option>
            <option value="1">Full Payment</option>
            <option value="2">Part Payment</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className="mb-3" controlId="">
          <Form.Label>Invoice No : <span className='text-danger'>*</span></Form.Label>
          <Form.Control type="text" placeholder="" 
          onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
          name="invoice_no" required />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className="mb-3" controlId="">
          <Form.Label>Invoice Date : <span className='text-danger'>*</span></Form.Label>
          <Form.Control type="date"
                        max={formData.sanction_order_date}
          onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
          name="invoice_date" value={formData.invoice_date} required  />
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
            onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
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
            onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
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
            onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
            value={formData.taxable_amuount} required/>
          }
          
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Sanctioned Amount: <span className='text-danger'>*</span></Form.Label>
          <Form.Control type="number"
           onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
          name="sanction_amount" value={data.sanction_amount} required/>
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
            onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
            name="gst" />
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
            onChange={(e) => handleInvoiceChangeFile(e, voucherIndex, invoiceIndex)} 
            name="invoice" required/>
            </Form.Group>
          </Col>
        }              
          
      <Col md={6}>
          <Form.Group className="mb-3" controlId="">
              <Form.Label>Invoice Ref. : <small className='text-danger'>(only pdf allowed under 5MB.)</small></Form.Label>
              <Form.Control type="file" placeholder="" 
              accept=" .pdf" 
              onChange={(e) => handleInvoiceChangeFile(e, voucherIndex, invoiceIndex)} 
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
                   onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
                  >
                    <option value=''>---select Rate---</option>
                    {
                      all_rates.map((rate) => {
                        return (
                          <option value={rate} key={rate}>{rate}</option>
                        )
                      })
                    } 
                  </Form.Select>
                </td>
                <td>
                  {get_rate(formData.vouchers[voucherIndex].invoices[invoiceIndex].tds_it_rate) ? get_rate(formData.vouchers[voucherIndex].invoices[invoiceIndex].tds_it_rate) : 0}
                  <input type="hidden" name='tds_it_amount' value={get_rate(formData.vouchers[voucherIndex].invoices[invoiceIndex].tds_it_rate) ? get_rate(formData.vouchers[voucherIndex].invoices[invoiceIndex].tds_it_rate) : 0}
                  />
                </td>
              </tr>
              <tr>
                <td>TDS (S-GST)</td>
                <td>
                  <Form.Select name="s_gst_rate" 
                   onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
                  >
                    <option value=''>---select Rate---</option>
                    {
                      all_rates.map((rate) => {
                        return (
                          <option value={rate} key={rate}>{rate}</option>
                        )
                      })
                    }
                  </Form.Select>
                </td>
                <td>
                  {get_rate(formData.vouchers[voucherIndex].invoices[invoiceIndex].s_gst_rate) ? get_rate(formData.vouchers[voucherIndex].invoices[invoiceIndex].s_gst_rate) : 0}
                  <input type="hidden" name='s_gst_amount' value={get_rate(formData.vouchers[voucherIndex].invoices[invoiceIndex].s_gst_rate) ? get_rate(formData.vouchers[voucherIndex].invoices[invoiceIndex].s_gst_rate) : 0} />
                  </td>
              </tr>
              <tr>
                <td>TDS (C-GST)</td>
                <td>
                  <Form.Select name="c_gst_rate" 
                  onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
                  >
                    <option value=''>---select Rate---</option>
                    {
                      all_rates.map((rate) => {
                        return (
                          <option value={rate} key={rate}>{rate}</option>
                        )
                      })
                    }
                  </Form.Select>
                </td>
                <td>
                  {get_rate(data.c_gst_rate) ? get_rate(data.c_gst_rate) : 0}
                  <input type="hidden" name="c_gst_amount" value={get_rate(data.c_gst_rate) ? get_rate(data.c_gst_rate) : 0} />
                  </td>
              </tr>
              <tr>
                <td>TDS (I-GST)</td>
                <td>
                  <Form.Select name="i_gst_rate" 
                  onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
                  >
                    <option value=''>---select Rate---</option>
                    {
                      all_rates.map((rate) => {
                        return (
                          <option value={rate} key={rate}>{rate}</option>
                        )
                      })
                    }
                  </Form.Select>
                </td>
                <td>
                  {get_rate(data.i_gst_rate) ? get_rate(data.i_gst_rate) : 0}
                  <input type="hidden" name="i_gst_amount" value={get_rate(data.i_gst_rate) ? get_rate(data.i_gst_rate) : 0} />
                  </td>
              </tr>
              <tr>
                <td>GIS:</td>
                <td></td>
                <td>
                  <Form.Control type="number" placeholder="Enter GIS" 
                  onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
                  name="gis" />
                </td>
              </tr>
              <tr>
                <td>NPS:</td>
                <td></td>
                <td>
                  <Form.Control type="number" placeholder="Enter NPS" 
                   onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
                  name="nps" />
                </td>
              </tr>
              <tr>
                <td>Other Deduction</td>
                <td><Form.Control type="text" placeholder="Enter Deduction Remarks" 
                   onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
                  name="deduction_remarks" /></td>
                <td><input type="number" className='form-control' value={formData.otherDeduction} placeholder='₹ Enter other deduction' 
                onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
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
          <h6>Sanctioned Amount: <b> ₹ {data.sanction_amount}</b></h6>
        </div>
      </div>
      <br />
      <Col md={2}>
        <h6>Remarks :</h6>
      </Col>
      <Col md={10}>
        <textarea name="remarks" id="" rows="5"
         onChange={(e) => handleInvoiceChange(e, voucherIndex, invoiceIndex)} 
        className='form-control' placeholder='Enter Remarks'>
        </textarea>
      </Col>
        {
          formData.vouchers[voucherIndex].invoices[invoiceIndex].schemes.map((scheme,i)=>{
              return (
                  <>
                   <Scheme handleInput={handleInput} formData={formData} setFormData={setFormData} voucherIndex={voucherIndex} invoiceIndex={invoiceIndex} schemeIndex={i} />
                  </>
              )
          })
        }
        <div className='m-2'>
          {
            check_is_equal_sanctioned_and_schemes_amount(formData.vouchers[voucherIndex].invoices[invoiceIndex].sanction_amount,formData.vouchers[voucherIndex].invoices[invoiceIndex].schemes)?"":
            <Button variant="outlined" onClick={()=>addScheme(voucherIndex,invoiceIndex)}><FaPlus/>&nbsp;Add Another Scheme</Button>
          }
         <br />
        </div>
      </Row>
    </Container>
    </>
  )
}

export default Invoice
