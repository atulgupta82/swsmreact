import React, {useEffect, useState} from 'react'
import {Form} from 'react-bootstrap';
import {getChallanDetails, updateChallan} from '../../../helper/Api';
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import ApprovalChallanPreview from "../../Modal/ApprovalChallanPreview";

const ViewChallan = () => {
    const [showPreview, setShowPreview] = useState(false);
    const [schemeStatus, setSchemeStatus] = useState(false);
    const {authData} = useSelector((state) => state.authData);
    const navigate = useNavigate();
    const {id} = useParams();
    const [formData, setFormData] = useState({
        id: '',
        scheme_id: '',
        scheme_name: '',
        sna_name: '',
        head_of_account_name: '',
        l2_status: '',
        l3_status: '',
        head_of_account_id: '',
        head_of_account_no: '',
        challan_date: '',
        amount: '',
        challan_no: '',
        purpose: '',
        attachments: [],
        added_by: authData && authData.status ? authData.user.id : null
    });

    const handleSubmit = () => {

    }
    const get_scheme_details = async () => {
        try {
            const {data} = await getChallanDetails(id);
            if (data?.result) {
                setFormData(data?.result);
            } else {
                setFormData({
                    id: '',
                    scheme_id: '',
                    scheme_name: '',
                    l2_status: '',
                    l3_status: '',
                    sna_name: '',
                    head_of_account_name: '',
                    head_of_account_id: '',
                    head_of_account_no: '',
                    challan_date: '',
                    amount: '',
                    challan_no: '',
                    purpose: '',
                    attachments: [],

                })
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        get_scheme_details();
    }, [id])

    const update_scheme_status_by_id = async () => {
        if (formData.id && schemeStatus) {
            let post_data = {};
            if (authData.user.user_type === 'l3') {
                post_data = {
                    "l3_status": schemeStatus,
                    "challan_id": formData.id,
                    "user_id": authData.user.id
                };
            } else if (authData.user.user_type === 'l2') {
                post_data = {
                    "l2_status": schemeStatus,
                    "challan_id": formData.id,
                    "user_id": authData.user.id
                };
            }
            const {data} = await updateChallan(post_data);
            if (data.status) {
                toast.success(data.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                navigate('/challan');
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

    return (
        <div>
            <ApprovalChallanPreview showPreview={showPreview} setShowPreview={setShowPreview} formData={formData}
                                    handleSubmit={update_scheme_status_by_id}/>
            <div className="p-3">
                <div className="row">
                    <Form onSubmit={handleSubmit}>
                        <div className="col-md-12">
                            <div className="add_new_user">
                                <h4>View Challan</h4>
                                <div>
                                    {
                                        authData.user.user_type === 'l2' ?
                                            <>
                                                {!formData.l2_status ? (<>
                                                    <button type="button" className="btn btn-danger"
                                                            onClick={() => previewhandler(2)}>Reject
                                                    </button>
                                                    &nbsp;
                                                    <button type="button" className="btn btn-primary"
                                                            onClick={() => previewhandler(1)}>Approve
                                                    </button>
                                                </>) : formData.l2_status ? (<>
                                                    <button type="button" className="btn btn-primary">Already Approved
                                                    </button>
                                                </>) : (<>
                                                    <button type="button" className="btn btn-danger">Already Rejected
                                                    </button>
                                                </>)}
                                            </> : authData.user.user_type === 'l3' ? (
                                                <>
                                                    {!formData.l3_status ? (<>
                                                        <button type="button" className="btn btn-danger"
                                                                onClick={() => previewhandler(2)}>Reject
                                                        </button>
                                                        &nbsp;
                                                        <button type="button" className="btn btn-primary"
                                                                onClick={() => previewhandler(1)}>Approve
                                                        </button>
                                                    </>) : formData.l3_status ? (<>
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
                                                    <label htmlFor="scheme_id"
                                                           className="col-sm-4 col-form-label">Select
                                                        Scheme
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <input type="text"
                                                               className="form-control" id="scheme_name"
                                                               name='department'
                                                               value={formData.scheme_name}
                                                               readOnly
                                                               placeholder="Enter Department Name"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label htmlFor="inputType" className="col-sm-4 col-form-label">SNA
                                                        Name
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className="form-control" id="snaName"
                                                               name='snaName'
                                                               required
                                                               readOnly
                                                               value={formData?.sna_name || ''}
                                                               placeholder="Enter SNA Name"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label htmlFor="inputScheme" className="col-sm-4 col-form-label">Purpose
                                                        of Amount
                                                        Deposited
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className="form-control" id="name"
                                                               name='purpose'
                                                               required
                                                               readOnly
                                                               value={formData?.purpose || ''}
                                                               placeholder="Enter Amount Deposited"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label htmlFor="scheme_id"
                                                           className="col-sm-4 col-form-label">Head of Account
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <input type="text"
                                                               className="form-control" id="scheme_name"
                                                               name='department'
                                                               value={formData?.head_of_account_name}
                                                               readOnly
                                                               placeholder="Enter Department Name"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label htmlFor="inputSchemee" className="col-sm-4 col-form-label">Head
                                                        of A/c <span className="text-danger">*</span> :
                                                    </label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className="form-control" id="code"
                                                               name='head_of_account'
                                                               required
                                                               placeholder="Enter Head Of A/C No"
                                                               disabled
                                                               value={formData?.head_of_account_no || ''}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label htmlFor="inputSchemee" className="col-sm-4 col-form-label">Challan
                                                        No <span className="text-danger">*</span> :
                                                    </label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className="form-control" id="challan_no"
                                                               name='challan_no'
                                                               required
                                                               readOnly
                                                               placeholder="Enter Challan No"
                                                               value={formData?.challan_no || ''}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label htmlFor="inputFinancials"
                                                           className="col-sm-4 col-form-label">
                                                        Date
                                                        <span className="text-danger">*</span> :
                                                    </label>
                                                    <div className="col-sm-8 ">
                                                        <Form.Control
                                                            type="date"
                                                            name="challan_date"
                                                            readOnly
                                                            value={formData?.challan_date || ''}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label htmlFor="inputSchemee" className="col-sm-4 col-form-label">Amount
                                                        <span className="text-danger">*</span> :
                                                    </label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className="form-control" id="code"
                                                               name='amount'
                                                               required
                                                               placeholder="Enter Amount"
                                                               value={formData?.amount || ''}
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
                                                                formData.attachments.map((att,i)=>{
                                                                    return (<a href={att.file_url} target='_blank'>Attachment {i+1}</a>);
                                                                })
                                                            }
                                                        </div>
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

export default ViewChallan
