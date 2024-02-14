import React, {useEffect, useState} from 'react'
import './AddSchemeForm.css';
import {Form, InputGroup} from 'react-bootstrap';
import {
    get_financial_year,
    get_scheme_type,
    get_schemes_details_by_id,
    update_scheme_status
} from '../../../helper/Api';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {AddCommasToAmount} from '../../../helper/Utils';
import {toast} from 'react-toastify';
import ApprovalSchemePreview from '../../Modal/ApprovalSchemePreview';

const ViewScheme = () => {
    const [fy_list, set_fy_list] = useState([]);
    const [st_list, set_st_list] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [schemeStatus, setSchemeStatus] = useState(false);
    // const [l2remarks, setl2Remarks] = useState(data.l2remarks ? data.l2remarks : '');
    const {authData} = useSelector((state) => state.authData);
    const navigate = useNavigate();
    const {id} = useParams();
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: '',
        l2remarks: '',
        l3remarks: '',
        grant_code: '',
        department: '',
        financial_year: '',
        attachments: [],
        sub_head_list: [
            {name: '', code: '', financial_year: '', budget: ''},
        ],
        bank_details: {
            account_name: '',
            bank_name: '',
            branch_name: '',
            account_no: '',
            account_type: '',
            ifsc_code: ''
        },
        added_by: authData && authData.status ? authData.user.id : null
    });
    const fetch_list = async () => {
        const fy = await get_financial_year();
        const st = await get_scheme_type();
        if (fy.data.status) {
            set_fy_list(fy.data.list)
        }
        if (st.data.status) {
            set_st_list(st.data.list)
        }
    }


    const handleSubmit = () => {

    }
    const get_scheme_details = async () => {
        try {
            const {data} = await get_schemes_details_by_id(id);
            // console.log(data)
            if (data.schemes.length > 0) {
                setFormData(data.schemes[0]);
            } else {
                setFormData({
                    name: '',
                    code: '',
                    type: '',
                    l2remarks: '',
                    l3remarks: '',
                    grant_code: '',
                    department: '',
                    financial_year: '',
                    attachments: [],
                    sub_head_list: [],
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

        }
    }
    useEffect(() => {
        fetch_list();
        get_scheme_details();
    }, [id])


    const total_scheme_budget = () => {
        const subheads = formData.sub_head_list;
        let total_budget = 0;
        subheads.map((sub) => {

            if (sub.budget) {
                total_budget = total_budget + parseFloat(sub.budget)
            }
            return {}
        })
        return AddCommasToAmount(total_budget.toFixed(2));
    }

    const update_scheme_status_by_id = async () => {
        if (formData.id && schemeStatus) {
            let post_data = {};
            if (authData.user.user_type === 'l3') {
                post_data = {
                    "l3_status": schemeStatus,
                    "scheme_id": formData.id,
                    "l3remarks": formData.l3remarks
                };
            } else if (authData.user.user_type === 'l2') {
                post_data = {
                    "l2_status": schemeStatus,
                    "scheme_id": formData.id,
                    "l2remarks": formData.l2remarks
                };
            }
            debugger
            const {data} = await update_scheme_status(post_data);
            if (data.status) {
                toast.success(data.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                navigate('/schemes');
            } else {
                toast.error(data.message, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        }
    }

    const previewhandler = (type) => {
        // console.log(type);
        setShowPreview(true);
        setSchemeStatus(type);
    };

    const handleInvoiceChange = (e) => {
        let {name, value} = e.target;
        // console.log(name, value)
        setFormData({...formData, [name]: value});
    };

    return (
        <div>
            <ApprovalSchemePreview showPreview={showPreview} setShowPreview={setShowPreview} formData={formData}
                                   handleSubmit={update_scheme_status_by_id}></ApprovalSchemePreview>
            <div className="p-3">
                <div className="row">
                    <Form onSubmit={handleSubmit}>
                        <div className="col-md-12">
                            <div className="add_new_user">
                                <h4>View Scheme</h4>
                                <div>
                                    {
                                        authData.user.user_type === 'l2' ?
                                            <>
                                                {formData.l2_status == 0 ? (<>
                                                    <button type="button" className="btn btn-danger"
                                                            onClick={() => previewhandler(2)}>Reject
                                                    </button>
                                                    &nbsp;
                                                    <button type="button" className="btn btn-primary"
                                                            onClick={() => previewhandler(1)}>Approve
                                                    </button>
                                                </>) : formData.l2_status == 1 ? (<>
                                                    <button type="button" className="btn btn-primary">Already Approved
                                                    </button>
                                                </>) : (<>
                                                    <button type="button" className="btn btn-danger">Already Rejected
                                                    </button>
                                                </>)}
                                            </> : authData.user.user_type === 'l3' ? (
                                                <>
                                                    {formData.l3_status === "0" ? (<>
                                                        <button type="button" className="btn btn-danger"
                                                                onClick={() => previewhandler(2)}>Reject
                                                        </button>
                                                        &nbsp;
                                                        <button type="button" className="btn btn-primary"
                                                                onClick={() => previewhandler(1)}>Approve
                                                        </button>
                                                    </>) : formData.l3_status === "1" ? (<>
                                                        <button type="button" className="btn btn-primary">Already Approved
                                                        </button>
                                                    </>) : (<>
                                                        <button type="button" className="btn btn-danger">Already Rejected
                                                        </button>
                                                    </>)}
                                                </>
                                            ) : (
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
                                                           className="col-sm-4 col-form-label">L2 Status
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <input type="text"
                                                               className="form-control"
                                                               value={formData.l2_status == 0 ? "Pending" : formData.l2_status == 1 ? "Approved" : "Rejected"}
                                                               readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputDepartment"
                                                           className="col-sm-4 col-form-label">L3 Status
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <input type="text"
                                                               className="form-control" id="department"
                                                               name='department'
                                                               value={formData.l3_status == 0 ? "Pending" : formData.l3_status == 1 ? "Approved" : "Rejected"}
                                                               readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
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
                                                               value={formData.department}
                                                               readOnly
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
                                                        <input type="text" name="" id="" className='form-control'
                                                               value={formData.type} readOnly/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputScheme" className="col-sm-4 col-form-label">Scheme
                                                        Name
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className="form-control" id="name"
                                                               name='name'

                                                               value={formData.name}
                                                               readOnly
                                                               placeholder="Enter Scheme Name"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputGrant" className="col-sm-4 col-form-label">Grant
                                                        Code
                                                        <span className="text-danger">*</span> :
                                                    </label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className="form-control" id="grant_code"
                                                               value={formData.grant_code}
                                                               readOnly
                                                               name='grant_code'
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
                                                        <input type="text" name="" id="" className='form-control'
                                                               value={formData.financial_year} readOnly/>
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
                                                               value={formData.code}
                                                               readOnly

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
                                                            {
                                                                formData.attachments.map((att, i) => {
                                                                    return (<a href={att.file_url}
                                                                               target='_blank'>Attachment {i + 1}</a>);
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 p-2">
                                                <div className="border mt-3">
                                                    <div className="p-1">
                                                        <p><span>Total Scheme Budget </span>: <span
                                                            className='scheme_budget'>{total_scheme_budget()}</span></p>
                                                    </div>
                                                </div>
                                            </div>


                                            {
                                                formData.sub_head_list.map((subHead, i) => {
                                                    return (
                                                        <>
                                                            <div className='container-fluid'>
                                                                <div className='row eachsubheadBlock'>
                                                                    <div className="col-sm-6 p-2">
                                                                        <div className="form-group row">
                                                                            <label for="inputSub"
                                                                                   className="col-sm-4 col-form-label">Sub
                                                                                Head Name {i + 1}
                                                                                <span className="text-danger">*</span> :
                                                                            </label>
                                                                            <div className="col-sm-8">
                                                                                <input type="text"
                                                                                       className="form-control"
                                                                                       id="name"
                                                                                       value={subHead.name}
                                                                                       readOnly
                                                                                       placeholder="Enter Sub Head Name"/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6 p-2">
                                                                        <div className="form-group row">
                                                                            <label for="inputFinancials"
                                                                                   className="col-sm-4 col-form-label">
                                                                                Budget Date {i + 1}
                                                                                <span className="text-danger">*</span> :</label>
                                                                            <div className="col-sm-8 ">
                                                                                <Form.Control
                                                                                    type="date"
                                                                                    name="budget_date"
                                                                                    value={subHead.budget_date}
                                                                                    readOnly
                                                                                />

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6 p-2">
                                                                        <div className="form-group row">
                                                                            <label for="inputHead"
                                                                                   className="col-sm-4 col-form-label">Sub
                                                                                Head Code {i + 1}
                                                                                <span className="text-danger">*</span> :</label>
                                                                            <div className="col-sm-8">
                                                                                <input type="text"
                                                                                       required
                                                                                       className="form-control"
                                                                                       id="code"
                                                                                       value={subHead.code}
                                                                                       readOnly
                                                                                       placeholder="Enter Sub Head Code"/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6 p-2">
                                                                        <div className="form-group row">
                                                                            <label for="inputBudget"
                                                                                   className="col-sm-4 col-form-label">Budget {i + 1}
                                                                                <span className="text-danger">*</span> :</label>
                                                                            <div className="col-sm-8">
                                                                                <input type="number"
                                                                                       className="form-control"
                                                                                       id="budget"
                                                                                       required
                                                                                       value={subHead.budget}
                                                                                       readOnly
                                                                                       placeholder="₹ Enter Budget Amount"/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6 p-2">
                                                                        <div className="form-group row">
                                                                            <label for="inputBudget"
                                                                                   className="col-sm-4 col-form-label">Provisional
                                                                                Budget {i + 1}
                                                                                <span className="text-danger">*</span> :</label>
                                                                            <div className="col-sm-8">
                                                                                <input type="number"
                                                                                       className="form-control"
                                                                                       id="provisional_budget"
                                                                                       required
                                                                                       value={subHead.provisional_budget}
                                                                                       readOnly
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
                                                    <label for="inputAccount" className="col-sm-4 col-form-label">Account
                                                        Name
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className="form-control" id="account_name"
                                                               name='account_name'
                                                               required
                                                               value={formData.bank_details.account_name}
                                                               readOnly
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
                                                               value={formData.bank_details.bank_name}
                                                               readOnly
                                                               placeholder="Enter Bank Name"/>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputType" className="col-sm-4 col-form-label">Account
                                                        Type
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <select className="form-control " id="account_type"
                                                                name='account_type'
                                                                required
                                                                value={formData.bank_details.account_type}
                                                                readOnly
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
                                                               value={formData.bank_details.branch_name}
                                                               readOnly
                                                               placeholder="Enter Branch Name"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="account_no" className="col-sm-4 col-form-label">Account
                                                        No.
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <input type="number" className="form-control" id="account_no"
                                                               required
                                                               value={formData.bank_details.account_no}
                                                               readOnly
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
                                                               value={formData.bank_details.ifsc_code}
                                                               readOnly
                                                               placeholder="Enter IFSC Code"/>
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

export default ViewScheme
