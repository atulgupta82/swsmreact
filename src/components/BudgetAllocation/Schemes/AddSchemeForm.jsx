import React, { useEffect, useState } from 'react'
import './AddSchemeForm.css';
import {Button, Form} from 'react-bootstrap';
import { get_financial_year,get_scheme_type,add_schemes } from '../../../helper/Api';
import { ADD_SCHEME_START,ADD_SCHEME_FAIL,ADD_SCHEME_SUCCESS } from '../../../RTK/Slices/SchemeSlice';
import { useDispatch,useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {FaUpload} from 'react-icons/fa'
import { AddCommasToAmount } from '../../../helper/Utils';
import { DeleteForever } from '@mui/icons-material';
import { toast } from 'react-toastify';
import AddSchemePreview from '../../Modal/AddSchemePreview';

const AddSchemeForm = () => {

    const [fy_list,set_fy_list]=useState([]);
    const [st_list,set_st_list]=useState([]);
    const [showPreview,setShowPreview]=useState(false);
    const dispatch=useDispatch();
    const {authData}=useSelector((state)=>state.authData);
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: '',
        grant_code: '',
        department: '',
        financial_year: '',
        carry_forwarded:'',
        attachment:[],
        sub_heads: [
          { name: '', code: '', financial_year: '', budget: '',provisional_budget:'' },          
        ],
        bank: {
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

    useEffect(() => {
        fetch_list();
    }, [])

    const handleAttachmentChange = (event) => {
        const files = event.target.files;
        // console.log(files);
        setFormData({
            ...formData,
            attachment: files
        });
        // console.log(formData)
    };
    const handleSchemFormData=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        setFormData({...formData,[name]:value})
    } 
   
    const handleSubHeadChange = (index, field, value) => {
        const newSubHeads = [...formData.sub_heads];
        newSubHeads[index][field] = value;
        setFormData({
          ...formData,
          sub_heads: newSubHeads
        });
    };

    const total_scheme_budget=()=>{
        const subheads=formData.sub_heads;
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
          ...formData.bank,
          [field]: value
        };
        setFormData({
          ...formData,
          bank: newBankData
        });
    };
   
    const handleAddSubHead = () => {
        const newSubHeads = [...formData.sub_heads];
        newSubHeads.push({ name: '', code: '', financial_year: '', budget: '' });
        setFormData({
            ...formData,
            sub_heads: newSubHeads
        });
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();
       
        try {
            // console.log(formData);return false;
            const post_data = new FormData();
            for (let i = 0; i < formData.attachment.length; i++) {
                post_data.append('attachment[]', formData.attachment[i]);
            }
            post_data.append('name',formData.name);
            post_data.append('code',formData.code);
            post_data.append('type',formData.type);
            post_data.append('grant_code',formData.grant_code);
            post_data.append('department',formData.department);
            post_data.append('financial_year',formData.financial_year);
            post_data.append('carry_forwarded',formData.carry_forwarded);
            post_data.append('sub_heads',JSON.stringify(formData.sub_heads));
            post_data.append('bank',JSON.stringify(formData.bank));
            post_data.append('added_by',authData.user.id);
            
            
            dispatch(ADD_SCHEME_START());            
            const add_scheme_response=await add_schemes(post_data);
            // console.log(add_scheme_response);
            // return false;
            let addSchemeResponseData=add_scheme_response.data;
            if(addSchemeResponseData.status){
                setShowPreview(false);
                dispatch(ADD_SCHEME_SUCCESS(addSchemeResponseData.list[0]));
                navigate('/schemes');
            }else{
                toast.error(addSchemeResponseData.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                dispatch(ADD_SCHEME_FAIL(addSchemeResponseData.message));
            }
        } catch (error) {
            // console.log(error);
            dispatch(ADD_SCHEME_FAIL('error getting while add scheme'));

        }        
    }

    const deleteSubhead = (index) => {
        const updatedSubHeads = [...formData.sub_heads];
        updatedSubHeads.splice(index, 1);
        setFormData({
          ...formData,
          sub_heads: updatedSubHeads,
        });
    };

    const previewhandler = (e) => {
        e.preventDefault();
        setShowPreview(true);
    };
    
    return (
        <div>
            <AddSchemePreview showPreview={showPreview} setShowPreview={setShowPreview} formData={formData} handleSubmit={handleSubmit}></AddSchemePreview>
            <div className="p-3">
                <div className="row">
                    <Form onSubmit={previewhandler}>
                    <div className="col-md-12">
                        <div className="add_new_user">
                            <h4> Add New Scheme</h4>
                            <div>
                                <a href="#" type="button" className="btn btn-light">Cancel</a>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </div>
                        <div className="card p-3 mt-3">
                            <div className="row">
                                <div className="col-md-12">                                    
                                    <div className="row">
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label for="inputDepartment"
                                                    className="col-sm-4 col-form-label">Department
                                                    Name
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="text" 
                                                    className="form-control" id="department"
                                                    name='department'
                                                    required
                                                    onChange={handleSchemFormData}
                                                    placeholder="Enter Department Name"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label for="inputType" className="col-sm-4 col-form-label">Type of
                                                    Scheme
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <select className="form-control " 
                                                    id="type" name='type'
                                                    required
                                                     onChange={handleSchemFormData}>
                                                        <option value="">Select Scheme Type</option>
                                                        {
                                                            st_list.map((st)=>{
                                                                return (
                                                                    <option value={st.id} key={st.id}>{st.title}</option>
                                                                );
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label for="inputScheme" className="col-sm-4 col-form-label">Scheme Name
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" id="name"
                                                    name='name'
                                                    required
                                                    onChange={handleSchemFormData}
                                                    placeholder="Enter Scheme Name"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label for="inputGrant" className="col-sm-4 col-form-label">Grant Code
                                                    <span className="text-danger">*</span> :
                                                </label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" id="grant_code"
                                                    required
                                                    name='grant_code'
                                                    onChange={handleSchemFormData}
                                                    placeholder="Enter Grant Code"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label for="inputFinancial"
                                                    className="col-sm-4 col-form-label">
                                                    Financial Year
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <select className="form-control " id="financial_year" name='financial_year'
                                                    onChange={handleSchemFormData}
                                                    required
                                                    >
                                                        <option value="">---select year---</option>
                                                        {
                                                            fy_list.map((fy)=>{
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
                                                <label for="inputSchemee" className="col-sm-4 col-form-label">Scheme
                                                    Code <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" id="code"
                                                    name='code'
                                                    required
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
                                                </div>   
                                                <div className="col-sm-6 p-2">
                                                    <div className="form-group row">
                                                        <label for="inputType" className="col-sm-4 col-form-label">Carry forward
                                                            <span className="text-danger">*</span> :</label>
                                                        <div className="col-sm-8">
                                                            <select className="form-control " 
                                                            id="carry_forwarded" name='carry_forwarded'
                                                            required
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
                                            formData.sub_heads.map((subHead,i)=>{
                                                return (
                                                    <>
                                                     <div className='container-fluid'>
                                                        <div className='row eachsubheadBlock'>
                                                            <div className="col-sm-6 p-2">
                                                                <div className="form-group row">
                                                                    <label for="inputSub" className="col-sm-4 col-form-label">Sub Head Name {i+1}
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
                                                                    <label for="inputFinancials"
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
                                                                    <label for="inputHead" className="col-sm-4 col-form-label">Sub Head Code {i+1}
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
                                                                    <label for="inputBudget" className="col-sm-4 col-form-label">Budget {i+1}
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
                                                                    <label for="inputBudget" className="col-sm-4 col-form-label">Provisional  Budget {i+1}
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
                                                        {
                                                            i>0 && <button type="button" className="btn btn-outline-danger mb-2" onClick={()=>deleteSubhead(i)}>Remove Sub Head {i+1}<DeleteForever/></button>

                                                        }
                                                    </div>                                                    
                                                    </>
                                                );
                                            })
                                        }
                                        <div className="col-sm-12 mt-3 mb-3 ">
                                            <button type="button" className="btn btn-outline-primary" onClick={handleAddSubHead}><i className="fa fa-plus"></i>
                                            Add Sub Head</button>
                                        </div>
                                        
                                        <div className="col-sm-12 mt-3 mb-3 border-bottom">
                                            <p>Scheme Bank Account Details :</p>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label for="inputAccount" className="col-sm-4 col-form-label">Account
                                                    Name
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" id="account_name"
                                                    name='account_name'
                                                    required
                                                    value={formData.bank.account_name}
                                                    onChange={(e) => handleBankChange('account_name', e.target.value)}
                                                    placeholder="Enter Account Name"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label for="bank_name" className="col-sm-4 col-form-label">Bank
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" id="bank_name"
                                                    required
                                                    name='bank_name'
                                                    value={formData.bank.bank_name}
                                                    onChange={(e) => handleBankChange('bank_name', e.target.value)}
                                                    placeholder="Enter Bank Name"/>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label for="inputType" className="col-sm-4 col-form-label">Account Type
                                                <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <select className="form-control " id="account_type" 
                                                    name='account_type'
                                                    required
                                                    value={formData.bank.account_type}
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
                                                <label for="inputBranch" className="col-sm-4 col-form-label">Branch 
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" id="branch_name"
                                                    name="branch_name"
                                                    required
                                                    value={formData.bank.branch_name}
                                                    onChange={(e) => handleBankChange('branch_name', e.target.value)}
                                                    placeholder="Enter Branch Name"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label for="account_no" className="col-sm-4 col-form-label">Account No.
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="number" className="form-control" id="account_no"
                                                    required
                                                    value={formData.bank.account_no}
                                                    onChange={(e) => handleBankChange('account_no', e.target.value)}
                                                    name="account_no"
                                                    placeholder="Enter Account Number"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 p-2">
                                            <div className="form-group row">
                                                <label for="ifsc_code" className="col-sm-4 col-form-label">IFSC Code
                                                    <span className="text-danger">*</span> :</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" id="ifsc_code"
                                                    required
                                                    name='ifsc_code'
                                                    value={formData.bank.ifsc_code}
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

export default AddSchemeForm
