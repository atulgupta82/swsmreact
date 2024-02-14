import React, { useEffect, useState } from 'react'
import { get_financial_year, get_schemes,get_schemes_by_fy, get_schemes_by_fy_added_pending } from '../../helper/Api';
import { Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { get_schemes_entered_amount } from '../../helper/Utils';

const Scheme = ({handleInput,formData,setFormData,voucherIndex,invoiceIndex,schemeIndex}) => {
    const [scheme,setScheme]=useState({});
    const [schemeList,setSchemeList]=useState([])
    const [subhead_list,setSubhead_list]=useState([]);
    const [fy_list,set_fy_list]=useState([]);
    const [financial_year,setFinancialYear]=useState(0);
    const [schemeEnteredAmount,setSchemeEnteredAmount]=useState({
      'subheads':{},
      'totalAmount':0
    })
    const [changeAmount,setChangeAmount]=useState(0)
    const fetch_list=async()=>{
        const fy=await get_financial_year();   
        const schemeResponse=await get_schemes_by_fy_added_pending();
        if(schemeResponse.data.status){
          setSchemeList(schemeResponse.data.schemes);
        }
        if(fy.data.status){
          set_fy_list(fy.data.list)
        }  
    }

    const get_schemes_details=async(scheme_id,financial_year)=>{
      const {data}=await get_schemes_by_fy_added_pending(scheme_id,financial_year);
      if(data.status){
        if(data.schemes.length>0){
          setScheme(data.schemes[0]);
          setSubhead_list(data.schemes[0].sub_heads_list)
        }
        // setSchemeList(schemeResponse.data.schemes);
      }
    }

    useEffect(() => {
      if(scheme.id>0){
        get_schemes_details(scheme.id,financial_year)
        update_scheme_balance_amount(formData)
      }      
    }, [financial_year]);

    useEffect(() => {
      update_scheme_balance_amount();
    }, [changeAmount])
    

    const update_scheme_balance_amount=(e)=>{
      if(scheme.id>0){
        let scheme_amount=get_schemes_entered_amount(formData);
        // console.log(scheme_amount)
        if(scheme_amount[scheme.id]){
          let current_scheme=scheme_amount[scheme.id];
          setSchemeEnteredAmount(current_scheme)
        }else{
          setSchemeEnteredAmount({
            'subheads':{},
            'totalAmount':0
          })
        }
      } 
    }
    
    const handleScheme=(e)=>{
        const id=e.target.value;
        // console.log(id)
        if(id>0){
          let scheme=schemeList.filter((v)=>v.id==id);
          // console.log(scheme)
          setScheme(scheme[0]);
          setSubhead_list(scheme[0].sub_heads_list)
        }else{
          setScheme({name:null});
          setSubhead_list([])
        }
      }
    useEffect(() => {
        fetch_list();
    }, [])


    const handleSchemeChange = (e, voucherIndex, invoiceIndex, schemeIndex) => {
        const { name, value } = e.target;
        if(name=='scheme_id'){
            handleScheme(e);
            setFinancialYear(0);
        }
        if(name=='financial_year'){
          setFinancialYear(value);          
        }

        setFormData((prevState) => {
            const newVouchers = [...prevState.vouchers];
            const newInvoices = [...newVouchers[voucherIndex].invoices];
            const newSchemes = [...newInvoices[invoiceIndex].schemes];
            newSchemes[schemeIndex][name] = value;
            newInvoices[invoiceIndex].schemes = newSchemes;
            newVouchers[voucherIndex].invoices = newInvoices;
            return { ...prevState, vouchers: newVouchers };
        });
    };

    const handleSubheadChange = (e, voucherIndex, invoiceIndex, schemeIndex, subheadIndex,sub_heads_id) => {
        const { name, value } = e.target;
        // console.log(voucherIndex,invoiceIndex,schemeIndex,subheadIndex)
        setFormData((prevState) => {
          const newVouchers = [...prevState.vouchers];
          const newInvoices = [...newVouchers[voucherIndex].invoices];
          const newSchemes = [...newInvoices[invoiceIndex].schemes];
          const newSubheads = [...newSchemes[schemeIndex].subheads];
          // Initialize the subhead object if it's undefined
          if (!newSubheads[subheadIndex]) {
            newSubheads[subheadIndex] = {};
          }
          newSubheads[subheadIndex].sub_head_amount = value;
          newSubheads[subheadIndex].sub_heads_id = sub_heads_id;
          newSchemes[schemeIndex].subheads = newSubheads;
          newInvoices[invoiceIndex].schemes = newSchemes;
          newVouchers[voucherIndex].invoices = newInvoices;
          return { ...prevState, vouchers: newVouchers };
        });
        
    };

    const deleteScheme = (voucherIndex, invoiceIndex, schemeIndex) => {
      setFormData((prevState) => {
        const newVouchers = [...prevState.vouchers];
        const newInvoices = [...newVouchers[voucherIndex].invoices];
        const newSchemes = [...newInvoices[invoiceIndex].schemes];
        newSchemes.splice(schemeIndex, 1);
        newInvoices[invoiceIndex].schemes = newSchemes;
        newVouchers[voucherIndex].invoices = newInvoices;
        return { ...prevState, vouchers: newVouchers };
      });
    };
  
  return (
    <>
    {schemeIndex>0 && (
      <div className='pt-2'>
          <button className='btn btn-danger btn-sm' onClick={()=>deleteScheme(voucherIndex,invoiceIndex,schemeIndex)}>Scheme {schemeIndex+1} <FaTrash/></button>
      </div>
    )}

    <Container fluid>
     <Row className='pt-2'>
        <Col md={6}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Scheme Code :</Form.Label>
            <Form.Select  name="scheme_id" 
            onChange={(e) => handleSchemeChange(e, voucherIndex, invoiceIndex, schemeIndex)}
            required
            >
            <option value=''>--- Select Scheme Code ---</option>
            {
                schemeList.map((scheme)=>{
                return (
                  <option value={scheme.id} key={scheme.id}>{scheme.code}</option>
                );
                })
            }
            </Form.Select>
        </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="">
            <Form.Label>Financial Year <span className='text-danger'>*</span></Form.Label>
            <Form.Select id="financial_year" name='financial_year'
            value={financial_year}
            onChange={(e) => handleSchemeChange(e, voucherIndex, invoiceIndex, schemeIndex)}
            required>
                <option value="">---select year---</option>
                {
                    fy_list.map((fy)=>{
                        return (
                            <option value={fy.id} key={fy.id}>{fy.year}</option>
                        );
                    })
                }
            </Form.Select>
          </Form.Group>
        </Col>
    </Row>
    <Card className='p-3 scheme_card'>
          <h6><b>Scheme Name:</b></h6>
          <p> {scheme&&scheme.name ? scheme.name : ''} </p>
          <h6><b>Available Budget Balance:</b></h6>
          <p>₹ {scheme&&scheme.balance ? (scheme.balance-parseInt(schemeEnteredAmount.totalAmount)) : 0 }</p>
          <div className='w-50'>
            <Form.Group className="mb-3" controlId="">
              <Form.Label>Amount:</Form.Label>
              <Form.Control type="number" max={scheme.balance} placeholder="Enter Amount" 
              onChange={(e) => {handleSchemeChange(e, voucherIndex, invoiceIndex, schemeIndex);setChangeAmount(!changeAmount);}}
              name="amount" value={formData.amount} required/>
            </Form.Group>
          </div>
          <Table  bordered>
          <thead className='bg-light' striped>
            <tr>
              <td colSpan={3}><small className='text-danger'><b>Amount Should be less than equal to balance amount*</b></small></td>
              </tr>
            <tr>
              <th>Expendature Head</th>
              <th>Available Balance</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {
                subhead_list.map((sub,j)=>{
                    return (
                        <tr key={sub.id}>
                            <td>
                                {sub.name}
                                <input type="hidden" name="sub_heads_id" value={sub.id} />
                            </td>
                            <td>{sub.balance-(schemeEnteredAmount.subheads[sub.id]>0?schemeEnteredAmount.subheads[sub.id]:0)}</td>
                            <td>
                                <input type="number" name="sub_head_amount" max={sub.balance} placeholder='Enter Amount' className='form-control' 
                                onChange={(e) =>
                                    {
                                      handleSubheadChange(e, voucherIndex, invoiceIndex, schemeIndex, j,sub.id);
                                      setChangeAmount(!changeAmount);
                                    }
                                  }
                                value={formData.expendature_name} />
                            </td>
                      </tr>
                    );
                })
            }
          </tbody>
        </Table>
        </Card>
    </Container>
    </>
  )
}

export default Scheme
