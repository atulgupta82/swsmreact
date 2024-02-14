import React, { useEffect, useState } from 'react'
import './AddSchemeForm.css';
import {Button, Form} from 'react-bootstrap';
import { get_financial_year,get_scheme_type,add_schemes, get_schemes_details_by_id, update_scheme_by_id } from '../../../helper/Api';
import { ADD_SCHEME_START,ADD_SCHEME_FAIL,ADD_SCHEME_SUCCESS } from '../../../RTK/Slices/SchemeSlice';
import { useDispatch,useSelector } from 'react-redux';
import {Link, useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {FaUpload} from 'react-icons/fa'
import { AddCommasToAmount } from '../../../helper/Utils';
import { DeleteForever } from '@mui/icons-material';
import { toast } from 'react-toastify';

const EditSchemeForm = () => {

    const [fy_list,set_fy_list]=useState([]);
    const [st_list,set_st_list]=useState([]);
    const {id}=useParams();
    const dispatch=useDispatch();
    const {authData}=useSelector((state)=>state.authData);
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type_id: '',
        grant_code: '',
        department: '',
        financial_year_id: '',
        carry_forwarded:'',
        attachments:[],
        sub_head_list: [
          { name: '', code: '', financial_year: '', budget: '',provisional_budget:'' },          
        ],
        bank_details: {
          account_name: '',
          bank_name: '',
          branch_name: '',
          account_no: '',
          account_type: '',
          ifsc_code: ''
        },
        added_by: authData && authData.status ? authData.user.id:null
      });
    const fetch_list=async()=>{
        const fy=await get_financial_year();
        const st=await get_scheme_type();
        if(fy.data.status){
            set_fy_list(fy.data.list)
        }
        if(st.data.status){
            set_st_list(st.data.list)
        }        
    }

    const get_scheme_details=async()=>{
        try {
            const  {data}=await get_schemes_details_by_id(id);
            // console.log(data)
            if(data.schemes.length>0){
                setFormData(data.schemes[0]);
                
            }else{
                setFormData({
                    name: '',
                    code: '',
                    type: '',
                    grant_code: '',
                    department: '',
                    financial_year: '',
                    attachments:[],
                    sub_head_list: [
                              
                    ],
                    bank_details: {
                        account_name: '',
                        bank_name: '',
                        branch_name: '',
                        account_no: '',
                        account_type: '',
                        ifsc_code: ''
                    },
                    
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetch_list();
        get_scheme_details();
    }, [id])

    const handleAttachmentChange = (event) => {
        const files = event.target.files;
        // console.log(files);
        setFormData({
            ...formData,
            attachments: files
        });
        // console.log(formData)
    };
    const handleSchemFormData=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        setFormData({...formData,[name]:value})
    } 
   
    const handleSubHeadChange = (index, field, value) => {
        const newSubHeads = [...formData.sub_head_list];
        newSubHeads[index][field] = value;
        setFormData({
          ...formData,
          sub_head_list: newSubHeads
        });
    };

    const total_scheme_budget=()=>{
        const subheads=formData.sub_head_list;
        let total_budget=0;
        subheads.map((sub)=>{

            if(sub.budget){
                total_budget=total_budget+parseFloat(sub.budget)
            }
            return {

            }
        })
        return AddCommasToAmount(total_budget.toFixed(2));
    }


    const handleBankChange = (field, value) => {
        const newBankData = {
          ...formData.bank_details,
          [field]: value
        };
        setFormData({
          ...formData,
          bank_details: newBankData
        });
    };
   
    const handleAddSubHead = () => {
        const newSubHeads = [...formData.sub_head_list];
        newSubHeads.push({ name: '', code: '', financial_year: '', budget: '' });
        setFormData({
            ...formData,
            sub_head_list: newSubHeads
        });
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();
       
        try {
            // console.log(formData);return false;
            const post_data = new FormData();
            for (let i = 0; i < formData.attachments.length; i++) {
                post_data.append('attachment[]', formData.attachments[i]);
            }
            post_data.append('name',formData.name);
            post_data.append('code',formData.code);
            post_data.append('type',formData.type_id);
            post_data.append('grant_code',formData.grant_code);
            post_data.append('department',formData.department);
            post_data.append('financial_year',formData.financial_year_id);
            post_data.append('carry_forwarded',formData.carry_forwarded);
            post_data.append('sub_heads',JSON.stringify(formData.sub_head_list));
            post_data.append('bank',JSON.stringify(formData.bank_details));
            post_data.append('added_by',authData.user.id);
                      
            const add_scheme_response=await update_scheme_by_id(post_data,id);
            
            let addSchemeResponseData=add_scheme_response.data;
            if(addSchemeResponseData.status){
                toast.success(addSchemeResponseData.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                
                navigate('/schemes');
            }else{
                toast.error(addSchemeResponseData.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                
            }
        } catch (error) {
            console.log(error);
        }        
    }

    const deleteSubhead = (index) => {
        const updatedSubHeads = [...formData.sub_head_list];
        updatedSubHeads.splice(index, 1);
        setFormData({
          ...formData,
          sub_head_list: updatedSubHeads,
        });
    };
    
    return (
        <div>
            <div className="p-3">
                <div className="row">
                    <Form onSubmit={handleSubmit}>
                    <div className="col-md-12">
                        <div className="add_new_user">
                            <h4>Update Scheme</h4>
                            <div>
                                <Link to="/schemes">
                                <button type="button" className="btn btn-light">CANCEL</button>
                                </Link>&nbsp;
                                <button type="submit" className="btn btn-primary">UPDATE</button>
                            </div>
                        </div>
                        <div className="card p-3 mt-3">
                            <div className="row">
                                <div className="col-md-12">                                    
                                    <div className="row">
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label htmlFor="inputDepartment"
                                                    className="col-sm-4 col-form-label">Department
                                                    Name
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="text" 
                                                    className="form-control" id="department"
                                                    name='department'
                                                    required
                                                    value={formData.department}
                                                    onChange={handleSchemFormData}
                                                    placeholder="Enter Department Name"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label htmlFor="type_id" className="col-sm-4 col-form-label">Type of
                                                    Scheme
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <select className="form-control " 
                                                    id="type_id" name='type_id'
                                                    
                                                    required
                                                     onChange={handleSchemFormData}>
                                                        <option value="">Select Scheme Type</option>
                                                        {
                                                            st_list.map((st)=>{
                                                                return (
                                                                    <option 
                                                                    selected={st.id === formData.type_id}
                                                                    value={st.id} key={st.id}>{st.title}</option>
                                                                );
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label htmlFor="inputScheme" className="col-sm-4 col-form-label">Scheme Name
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" id="name"
                                                    name='name'
                                                    required
                                                    value={formData.name}
                                                    onChange={handleSchemFormData}
                                                    placeholder="Enter Scheme Name"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label htmlFor="inputGrant" className="col-sm-4 col-form-label">Grant Code
                                                    <span className="text-danger">*</span> :
                                                </label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" id="grant_code"
                                                    required
                                                    value={formData.grant_code}
                                                    name='grant_code'
                                                    onChange={handleSchemFormData}
                                                    placeholder="Enter Grant Code"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label htmlFor="financial_year_id"
                                                    className="col-sm-4 col-form-label">
                                                    Financial Year
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <select className="form-control " id="financial_year_id" name='financial_year_id'
                                                    onChange={handleSchemFormData}
                                                    required
                                                    >
                                                        <option value="">---select year---</option>
                                                        {
                                                            fy_list.map((fy)=>{
                                                                return (
                                                                    <option value={fy.id} key={fy.id} 
                                                                    selected={fy.id === formData.financial_year_id}
                                                                    >{fy.year}</option>
                                                                );
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label htmlFor="inputSchemee" className="col-sm-4 col-form-label">Scheme
                                                    Code <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" id="code"
                                                    name='code'
                                                    required
                                                    value={formData.code}
                                                    placeholder="Enter Scheme Code"
                                                    onChange={handleSchemFormData}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 p-2">
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="input-group">
                                                        <label className="input-group-btn my-0">
                                                        Upload Scheme Document
                                                        
                                                        </label>
                                                        <label className='p-1'><input id="" type="file"
                                                        className='form-control'
                                                                onChange={handleAttachmentChange}
                                                                name='attachment'
                                                                    accept=".pdf,.jpeg,.jpg,.png" multiple/></label>
                                                                   
                                                    </div>
                                                    {
                                                                    formData.attachments.map((att,i)=>{
                                                                        return (<a href={att.file_url} target='_blank'>Attachment {i+1}</a>);
                                                                    })
                                                                }  
                                                </div>   
                                                <div className="col-sm-6 p-2">
                                                    <div className="form-group row">
                                                        <label htmlFor="inputType" className="col-sm-4 col-form-label">Carry forward
                                                            <span className="text-danger">*</span> :</label>
                                                        <div className="col-sm-8">
                                                            <select className="form-control " 
                                                            id="carry_forwarded" name='carry_forwarded'
                                                            required
                                                            value={formData.carry_forwarded}
                                                            onChange={handleSchemFormData}>
                                                               <option value="">---Select---</option>
                                                               <option value="1">Enable</option>
                                                               <option value="2">Disable</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>                                             
                                            </div>
                                        </div>
                                        <div className="col-sm-12 p-2">
                                            <div className="border mt-3">
                                                <div className="p-1">
                                                    <p><span>Total Scheme Budget </span>: <span className='scheme_budget'>{total_scheme_budget()}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                        {                                            
                                            formData.sub_head_list.map((subHead,i)=>{
                                                return (
                                                    <>
                                                    {subHead.id>0 ? <input type="hidden" name="subhead_id" value={subHead.id} />:""}
                                                    
                                                     <div className='container-fluid'>
                                                        <div className='row eachsubheadBlock'>
                                                            <div className="col-sm-6 p-2">
                                                                <div className="form-group row">
                                                                    <label htmlFor="inputSub" className="col-sm-4 col-form-label">Sub Head Name {i+1}
                                                                        <span className="text-danger">*</span> :
                                                                    </label>
                                                                    <div className="col-sm-8">
                                                                        <input type="text" className="form-control" id="name"
                                                                        value={subHead.name}
                                                                        required
                                                                        onChange={(e) => handleSubHeadChange(i, 'name', e.target.value)}
                                                                        placeholder="Enter Sub Head Name"/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6 p-2">
                                                                <div className="form-group row">
                                                                    <label htmlFor="inputFinancials"
                                                                        className="col-sm-4 col-form-label">
                                                                        Budget Date {i+1}
                                                                        <span className="text-danger">*</span> :</label>
                                                                    <div className="col-sm-8 ">
                                                                        <Form.Control
                                                                        type="date"
                                                                        name="budget_date"
                                                                        value={subHead.budget_date}
                                                                        onChange={(e) => handleSubHeadChange(i, 'budget_date', e.target.value)}
                                                                        />
                                                                        
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6 p-2">
                                                                <div className="form-group row">
                                                                    <label htmlFor="inputHead" className="col-sm-4 col-form-label">Sub Head Code {i+1}
                                                                        <span className="text-danger">*</span> :</label>
                                                                    <div className="col-sm-8">
                                                                        <input type="text" 
                                                                        required
                                                                        className="form-control" id="code"
                                                                        value={subHead.code}
                                                                        onChange={(e) => handleSubHeadChange(i, 'code', e.target.value)}
                                                                        placeholder="Enter Sub Head Code"/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6 p-2">
                                                                <div className="form-group row">
                                                                    <label htmlFor="inputBudget" className="col-sm-4 col-form-label">Budget {i+1}
                                                                     :</label>
                                                                    <div className="col-sm-8">
                                                                        <input type="number" className="form-control" id="budget"
                                                                        
                                                                        value={subHead.budget}
                                                                        onChange={(e) => handleSubHeadChange(i, 'budget', e.target.value)}
                                                                        placeholder="₹ Enter Budget Amount"/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6 p-2">
                                                                <div className="form-group row">
                                                                    <label htmlFor="inputBudget" className="col-sm-4 col-form-label">Provisional  Budget {i+1}
                                                                     :</label>
                                                                    <div className="col-sm-8">
                                                                        <input type="number" className="form-control" id="provisional_budget"
                                                                        
                                                                        value={subHead.provisional_budget}
                                                                        onChange={(e) => handleSubHeadChange(i, 'provisional_budget', e.target.value)}
                                                                        placeholder="₹ Enter Provisional Budget Amount"/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                                    
                                                    </>
                                                );
                                            })
                                        }
                                        
                                        
                                        <div className="col-sm-12 mt-3 mb-3 border-bottom">
                                            <p>Scheme Bank Account Details :</p>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label htmlFor="inputAccount" className="col-sm-4 col-form-label">Account
                                                    Name
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" id="account_name"
                                                    name='account_name'
                                                    required
                                                    value={formData.bank_details.account_name}
                                                    onChange={(e) => handleBankChange('account_name', e.target.value)}
                                                    placeholder="Enter Account Name"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label htmlFor="bank_name" className="col-sm-4 col-form-label">Bank
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" id="bank_name"
                                                    required
                                                    name='bank_name'
                                                    value={formData.bank_details.bank_name}
                                                    onChange={(e) => handleBankChange('bank_name', e.target.value)}
                                                    placeholder="Enter Bank Name"/>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label htmlFor="inputType" className="col-sm-4 col-form-label">Account Type
                                                <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <select className="form-control " id="account_type" 
                                                    name='account_type'
                                                    required
                                                    value={formData.bank_details.account_type}
                                                    onChange={(e) => handleBankChange('account_type', e.target.value)} 
                                                    >
                                                        <option value="">Select Account Type</option>
                                                        <option value="saving">Saving Account</option>
                                                        <option value="current">Current Account</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        {/* bank */}
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label htmlFor="inputBranch" className="col-sm-4 col-form-label">Branch 
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" id="branch_name"
                                                    name="branch_name"
                                                    required
                                                    value={formData.bank_details.branch_name}
                                                    onChange={(e) => handleBankChange('branch_name', e.target.value)}
                                                    placeholder="Enter Branch Name"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label htmlFor="account_no" className="col-sm-4 col-form-label">Account No.
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="number" className="form-control" id="account_no"
                                                    required
                                                    value={formData.bank_details.account_no}
                                                    onChange={(e) => handleBankChange('account_no', e.target.value)}
                                                    name="account_no"
                                                    placeholder="Enter Account Number"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label htmlFor="ifsc_code" className="col-sm-4 col-form-label">IFSC Code
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" id="ifsc_code"
                                                    required
                                                    name='ifsc_code'
                                                    value={formData.bank_details.ifsc_code}
                                                    onChange={(e) => handleBankChange('ifsc_code', e.target.value)}
                                                    placeholder="Enter IFSC Code"/>
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

export default EditSchemeForm