import React, { useEffect, useState } from 'react'
import './AddBudgetForm.css'
import {Form, InputGroup} from 'react-bootstrap';
import { get_financial_year, get_scheme_type, get_schemes, add_budget, get_budget_list, update_budget_status } from '../../../helper/Api';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {toast} from 'react-toastify';
import Tools from '../../Tools/Tools'
import ApprovalBudgetPreview from '../../Modal/ApprovalBudgetPreview';

const ViewBudgetForm = () => {
    const { id } = useParams();
    const { authData } = useSelector((state) => state.authData);
    const [fy_list, set_fy_list] = useState([]);
    const [showPreview,setShowPreview]=useState(false);
    const [budgetStatus,setBudgetStatus]=useState(false);
    const [formData, setFormData] = useState({
        "id": "",
        "l3remarks":"",
        "l2remarks":"",
        "subhead_id": "",
        "scheme_id": "",
        "financial_year": "",
        "budget": "",
        "budget_date": "",
        "l2_status": "",
        "l3_status": "",
        "added_on": "",
        "added_by": "",
        "subhead_code": "",
        "subhead_name": "",
        "scheme_code": "",
        "scheme_name": "",
        "attachments":[]
    });

    const navigate=useNavigate();
    const fetch_list = async () => {
        const fy = await get_financial_year();        
        if (fy.data.status) {
            set_fy_list(fy.data.list)
        }
    }

    useEffect(() => {
        fetch_list();
        get_budget_details();
    }, [id])

    const get_budget_details = async () => {
        const { data } = await get_budget_list(null, id);
        if (data.status) {
            setFormData(data.budgets[0]);
        } else {
            setFormData([]);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    const update_budget_status_by_id=async()=>{
        if(formData.id && budgetStatus){
            let post_data={};
            // console.log(authData);
            if(authData.user.user_type==='l3'){
                post_data={
                    "l3_status":budgetStatus,
                    "budget_id":formData.id,
                    "l3remarks":formData.l3remarks
                };
            }else if(authData.user.user_type==='l2'){
                post_data={
                    "l2_status":budgetStatus,
                    "budget_id":formData.id,
                    "l2remarks":formData.l2remarks
                };
            }
            debugger
            const {data}=await update_budget_status(post_data);
            if(data.status){
                toast.success(data.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                setShowPreview(false);
                navigate('/budgets');
            }else{
                toast.error(data.message, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        }
    }

    const previewhandler = (type) => {
        setShowPreview(true);
        setBudgetStatus(type);
    };

    const handleInvoiceChange = (e) => {
        let {name, value} = e.target;
        // console.log(name, value)
        setFormData({...formData, [name]: value});
         console.log('formDataformDataformData', formData)
    };

    return (
        <div>
           <Tools></Tools>
           <ApprovalBudgetPreview showPreview={showPreview} setShowPreview={setShowPreview} formData={formData} handleSubmit={update_budget_status_by_id}></ApprovalBudgetPreview>
            <div className="p-3">
                <div className="row">
                    <Form onSubmit={handleSubmit}>
                        <div className="col-md-12">
                            <div className="add_new_user">
                                <h4>View Budget</h4>
                                <div>
                                    {
                                    authData.user.user_type==='l2'?
                                    <>
                                        {formData.l2_status==0?(<>
                                            <button type="button" className="btn btn-danger" onClick={()=>previewhandler(2)}>Reject</button>&nbsp;                                
                                            <button type="button" className="btn btn-primary" onClick={()=>previewhandler(1)}>Approve</button>
                                        </>):formData.l2_status==1?(<>
                                            <button type="button" className="btn btn-primary">Already Approved</button>
                                        </>):(<>
                                            <button type="button" className="btn btn-danger" >Already Rejected</button>
                                        </>)}
                                    </>:authData.user.user_type==='l3'?(
                                        <>
                                        {formData.l3_status==="0"?(<>
                                            <button type="button" className="btn btn-danger" onClick={()=>previewhandler(2)}>Reject</button>&nbsp;                                
                                            <button type="button" className="btn btn-primary" onClick={()=>previewhandler(1)}>Approve</button>
                                        </>):formData.l3_status==="1"?(<>
                                            <button type="button" className="btn btn-primary">Already Approved</button>
                                        </>):(<>
                                            <button type="button" className="btn btn-danger" >Already Rejected</button>
                                        </>)}
                                        </>
                                    ):(
                                        ""
                                    )
                                } 
                                    
                                </div>
                            </div>
                            <div className="card p-3 mt-3">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputDepartment"
                                                        className="col-sm-4 col-form-label">Scheme Code
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className='form-control' readOnly value={formData.scheme_code} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputType" className="col-sm-4 col-form-label">
                                                        Scheme Name
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <label htmlFor="">{formData.scheme_name}</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-sm-6 p-2'>
                                                <div className="form-group row">
                                                    <label for="inputFinancial"
                                                        className="col-sm-4 col-form-label">
                                                        Financial Year
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <select className="form-control " id="financial_year" name='financial_year'
                                                            value={formData.financial_year}
                                                            readOnly
                                                            required
                                                            disabled
                                                        >
                                                            <option value="">---select year---</option>
                                                            {
                                                                fy_list.map((fy) => {
                                                                    return (
                                                                        <option value={fy.id} key={fy.id}>{fy.year}</option>
                                                                    );
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputSub" className="col-sm-4 col-form-label">Sub Head Code
                                                        <span className="text-danger">*</span> :
                                                    </label>
                                                    <div className="col-sm-8">
                                                        <input type="text" value={formData.subhead_code} className='form-control' readOnly />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputHead" className="col-sm-4 col-form-label">Sub Head Name
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8 col-form-label">
                                                        <label >
                                                            <input type="text" value={formData.subhead_name} className='form-control' />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputFinancials"
                                                        className="col-sm-4 col-form-label">
                                                        Budget Date
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8 ">
                                                        <Form.Control
                                                            type="date"
                                                            name="budget_date"
                                                            value={formData.budget_date}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputBudget" className="col-sm-4 col-form-label">Budget
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className="form-control" id="budget"
                                                        required
                                                        value={formData.budget}
                                                        readOnly
                                                        placeholder="₹ Enter Budget Amount" />
                                                    </div>
                                                </div>
                                            </div>  
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputBudget" className="col-sm-4 col-form-label">Provisional Budget
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className="form-control" id="provisional_budget"
                                                        required
                                                        value={formData.provisional_budget}
                                                        readOnly
                                                        placeholder="₹ Enter Budget Amount" />
                                                    </div>
                                                </div>
                                            </div>                                            
                                            <div className="col-sm-12 p-2">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div className="input-group">
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label htmlFor="inputBranch" className="col-sm-4 col-form-label">L2
                                                        Remark
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <InputGroup>
                                                            <Form.Control as="textarea" aria-label="With textarea"
                                                                          name='l2remarks'
                                                                          id="l2remarks"
                                                                          onChange={(e) => handleInvoiceChange(e)}
                                                                          disabled={authData.user.user_type !== 'l2'}
                                                                          value={formData.l2remarks}>
                                                            </Form.Control>
                                                        </InputGroup>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label htmlFor="inputBranch" className="col-sm-4 col-form-label">L3
                                                        Remark
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <InputGroup>
                                                            <Form.Control as="textarea" aria-label="With textarea"
                                                                          name='l3remarks'
                                                                          id="l3remarks"
                                                                          onChange={(e) => handleInvoiceChange(e)}
                                                                          disabled={authData.user.user_type !== 'l3'}
                                                                          value={formData.l3remarks}>
                                                            </Form.Control>
                                                        </InputGroup>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 p-2">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div className="input-group">
                                                            <label className="input-group-btn my-0">
                                                            Upload Budget Document
                                                            </label>
                                                            {
                                                                formData.attachments.map((att,i)=>{
                                                                    return (<a href={att.file_url} target='_blank'>&nbsp;Attachment {i+1}</a>);
                                                                })
                                                            }                                                       
                                                        </div>
                                                    </div>                                                
                                                </div>
                                            </div>

                                            <div className="col-sm-12 p-2">
                                                <div className="border mt-3">
                                                    <div className="p-1 pt-2 pb-2">
                                                        <p><b>Total Scheme Budget </b>: {formData.budget}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default ViewBudgetForm
