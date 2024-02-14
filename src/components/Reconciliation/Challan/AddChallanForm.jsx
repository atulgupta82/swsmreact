import React, {useEffect, useState} from 'react'
import {Form} from 'react-bootstrap';
import {
    get_schemes,
    getHeadOfAccounts,
    addChallan, getChallanDetails, l1_l2_status, updateChallan
} from '../../../helper/Api';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {ADD_CHALLAN_FAIL, ADD_CHALLAN_START} from "../../../RTK/Slices/ChallanSlice";
import AddChallanPreview from "../../Modal/AddChallanPreview";

const AddChallanForm = () => {

    const [schemes, setSchemes] = useState([]);
    const [headAccounts, setHeadAccounts] = useState([]);
    const [snaName, setSNAName] = useState({});
    const [headAccount, setHeadAcc] = useState({});
    const [showPreview, setShowPreview] = useState(false);
    const {authData} = useSelector((state) => state.authData);
    const [schemeStatus, setSchemeStatus] = useState(false);
    const [submissionType, setSubmissionType] = useState('');
    const [challanDetails, setChallanDetails] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id, type} = useParams();

    const [formData, setFormData] = useState({
        id: '',
        scheme_id: '',
        head_of_account_id: '',
        challan_date: '',
        amount: '',
        challan_no: '',
        purpose: '',
        attachments: [],
        added_by: authData && authData.status ? authData.user.id : null
    });

    const get_challan_details = async () => {
        try {
            const {data} = await getChallanDetails(id);

            if (data?.status) {
                setChallanDetails(data?.result)
                setFormData(data?.result);
            }

        } catch (error) {

        }
    }

    const fetchLists = async () => {

        try {

            const schemes = await get_schemes();
            const accounts = await getHeadOfAccounts();
            if (schemes.data.status) {
                setSchemes(schemes.data.schemes)

            }
            if (accounts.data.status) {
                if (id) {
                    const headAcc = accounts.data.result.find(el => el.id == formData?.head_of_account_id)
                    setHeadAcc(headAcc)
                }
                setHeadAccounts(accounts.data.result)
            }
        } catch (e) {

        }


    }

    useEffect(() => {
        if (id) {
            get_challan_details();
        }
        fetchLists();
    }, [id])

    const handleAttachmentChange = (event) => {
        const files = event.target.files;
        setFormData({
            ...formData,
            attachment: files
        });
    };
    const handleChallanFormData = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        if (name === 'scheme_id') {
            const snaName = schemes.find(el => el.id === value)
            setSNAName(snaName)
        }
        if (name === 'head_of_account_id') {
            const headAcc = headAccounts.find(el => el.id === value)
            setHeadAcc(headAcc)
        }
        setFormData({...formData, [name]: value})
    }

    const handleSubmit = async (e) => {
        if (!id) {
            if (e && typeof e.preventDefault === 'function') {
                e.preventDefault();
            }
        }
        try {

            if (!id && submissionType != 'approval') {
                const post_data = new FormData();
                for (let i = 0; i < formData.attachment.length; i++) {
                    post_data.append('attachment[]', formData.attachment[i]);
                }
                post_data.append('scheme_id', formData.scheme_id);
                post_data.append('head_of_account_id', formData.head_of_account_id);
                post_data.append('challan_date', formData.challan_date);
                post_data.append('amount', formData.amount);
                post_data.append('challan_no', formData.challan_no);
                post_data.append('purpose', formData.purpose);

                dispatch(ADD_CHALLAN_START());
                const response = await addChallan(post_data);
                let addChallanResponseData = response.data;
                if (addChallanResponseData.status) {
                    setShowPreview(false);
                    // dispatch(ADD_CHALLAN_SUCCESS(addChallanResponseData.list[0]));
                    navigate('/challan');
                } else {
                    toast.error(addChallanResponseData.message, {
                        position: toast.POSITION.TOP_CENTER
                    });
                    dispatch(ADD_CHALLAN_FAIL(addChallanResponseData.message));
                }
            } else if (id && submissionType != 'approval') {
                const post_data = new FormData();
                for (let i = 0; i < formData.attachments.length; i++) {
                    post_data.append('attachment[]', formData.attachments[i]);
                }
                post_data.append('scheme_id', formData.scheme_id);
                post_data.append('head_of_account_id', formData.head_of_account_id);
                post_data.append('challan_date', formData.challan_date);
                post_data.append('amount', formData.amount);
                post_data.append('challan_no', formData.challan_no);
                post_data.append('purpose', formData.purpose);

                dispatch(ADD_CHALLAN_START());
                const response = await updateChallan(post_data, id);
                let addChallanResponseData = response.data;
                if (addChallanResponseData.status) {
                    setShowPreview(false);
                    // dispatch(ADD_CHALLAN_SUCCESS(addChallanResponseData.list[0]));
                    navigate('/challan');
                } else {
                    toast.error(addChallanResponseData.message, {
                        position: toast.POSITION.TOP_CENTER
                    });
                    dispatch(ADD_CHALLAN_FAIL(addChallanResponseData.message));
                }
            } else if (submissionType == 'approval') {

                if (formData.id) {
                    let post_data = {};
                    if (authData.user.user_type === 'l3') {
                        post_data = {
                            "is_approved": schemeStatus,
                            "challan_id": formData.id,
                            "user_id": authData.user.id,
                            type: 'L3'
                        };
                    } else if (authData.user.user_type === 'l2') {
                        post_data = {
                            "is_approved": schemeStatus,
                            "challan_id": formData.id,
                            "user_id": authData.user.id,
                            type: 'L2'
                        };
                    }
                    const {data} = await l1_l2_status(post_data);
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
        } catch (error) {
            dispatch(ADD_CHALLAN_FAIL('error getting while updating challan'));

        }
    }

    const previewHandler = (e) => {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        if (formData?.scheme_id) {
            const snaName = schemes.find(el => el.id == formData?.scheme_id)
            setSNAName(snaName);
        }
        if (formData?.head_of_account_id) {
            const headAcc = headAccounts.find(el => el.id == formData?.head_of_account_id)
            setHeadAcc(headAcc);
        }
        setShowPreview(true);
        if (id) {
            setSchemeStatus(e);
            if (e == 1 || e == 0) {
                setSubmissionType('approval')
            }
        }

    };

    const getSnaName = () => {
        if (formData?.scheme_id) {
            const snaName = schemes.find(el => el.id === formData.scheme_id)


            return snaName?.bank_details?.account_name || ''
        }

    }

    const getAccountNo = () => {
        if (formData?.head_of_account_id) {
            const headAcc = headAccounts.find(el => el.id == formData.head_of_account_id)

            return headAcc?.account_no || ''
        }

    }

    return (
        <div>
            <AddChallanPreview
                showPreview={showPreview}
                setShowPreview={setShowPreview}
                formData={formData}
                snaName={snaName}
                headAccount={headAccount}
                handleSubmit={handleSubmit}/>
            <div className="p-3">
                <div className="row">
                    <Form onSubmit={previewHandler}>
                        <div className="col-md-12">
                            <div className="add_new_user">
                                <h4> {type !== 'view' ? 'Add New Challan' : 'View Challan'}</h4>
                                <div>
                                    {
                                        authData.user.user_type === 'l2' ?
                                            <>
                                                {!formData.l2_status ? (<>
                                                    <button type="button" className="btn btn-danger"
                                                            onClick={() => previewHandler(0)}>Reject
                                                    </button>
                                                    &nbsp;
                                                    <button type="button" className="btn btn-primary"
                                                            onClick={() => previewHandler(1)}>Approve
                                                    </button>
                                                </>) : formData.l2_status == 1 ? (<>
                                                    <button type="button" className="btn btn-primary">Already
                                                        Approved
                                                    </button>
                                                </>) : (<>
                                                    <button type="button" className="btn btn-danger">Already
                                                        Rejected
                                                    </button>
                                                </>)}
                                            </> : authData.user.user_type === 'l3' ? (
                                                <>
                                                    {!formData.l3_status ? (<>
                                                        <button type="button" className="btn btn-danger"
                                                                onClick={() => previewHandler(0)}>Reject
                                                        </button>
                                                        &nbsp;
                                                        <button type="button" className="btn btn-primary"
                                                                onClick={() => previewHandler(1)}>Approve
                                                        </button>
                                                    </>) : formData.l3_status == 1 ? (<>
                                                        <button type="button" className="btn btn-primary">Already
                                                            Approved
                                                        </button>
                                                    </>) : (<>
                                                        <button type="button" className="btn btn-danger">Already
                                                            Rejected
                                                        </button>
                                                    </>)}
                                                </>
                                            ) : type != 'view' ? (
                                                <div>
                                                    <a type="button" className="btn btn-light">Cancel</a>

                                                    <button type="submit" className="btn btn-primary">Save
                                                    </button>
                                                </div>
                                            ) : ''
                                    }
                                </div>
                            </div>
                            <div className="card p-3 mt-3">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="scheme_id"
                                                           className="col-sm-4 col-form-label">Select
                                                        Scheme
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <select className="form-control "
                                                                id="scheme_id" name='scheme_id'
                                                                required
                                                                disabled={type === 'view'}
                                                                value={formData.scheme_id}
                                                                onChange={handleChallanFormData}>
                                                            <option>Select Scheme</option>
                                                            {
                                                                schemes.map((st) => {
                                                                    return (
                                                                        <option value={st.id}
                                                                                key={st.id}>{st.name}</option>
                                                                    );
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputType" className="col-sm-4 col-form-label">SNA Name
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className="form-control" id="snaName"
                                                               name='snaName'
                                                               required
                                                               disabled
                                                               value={getSnaName()}
                                                               placeholder="Enter SNA Name"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputScheme" className="col-sm-4 col-form-label">Purpose
                                                        of Amount
                                                        Deposited
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className="form-control" id="name"
                                                               name='purpose'
                                                               required
                                                               disabled={type === 'view'}
                                                               value={formData.purpose}
                                                               onChange={handleChallanFormData}
                                                               placeholder="Enter Amount Deposited"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="head_of_account_id"
                                                           className="col-sm-4 col-form-label">
                                                        Head of Account
                                                        <span className="text-danger">*</span> :
                                                    </label>
                                                    <div className="col-sm-8">
                                                        <select className="form-control "
                                                                id="type" name='head_of_account_id'
                                                                required
                                                                disabled={type === 'view'}
                                                                value={formData.head_of_account_id}
                                                                onChange={handleChallanFormData}>
                                                            <option value="">Select Account</option>
                                                            {
                                                                headAccounts.map((st) => {
                                                                    return (
                                                                        <option value={st.id}
                                                                                key={st.id}>{st.name}</option>
                                                                    );
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputSchemee" className="col-sm-4 col-form-label">Head
                                                        of A/c <span className="text-danger">*</span> :
                                                    </label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className="form-control" id="code"
                                                               name='head_of_account'
                                                               required
                                                               placeholder="Enter Head Of A/C No"
                                                               disabled
                                                               value={getAccountNo()}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputSchemee" className="col-sm-4 col-form-label">Challan
                                                        No <span className="text-danger">*</span> :
                                                    </label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className="form-control" id="challan_no"
                                                               name='challan_no'
                                                               required
                                                               disabled={type === 'view'}
                                                               value={formData.challan_no}
                                                               placeholder="Enter Challan No"
                                                               onChange={handleChallanFormData}
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
                                                            disabled={type === 'view'}
                                                            value={formData.challan_date}
                                                            onChange={handleChallanFormData}
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
                                                               disabled={type === 'view'}
                                                               value={formData.amount}
                                                               onChange={handleChallanFormData}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-12 p-2">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div className="input-group">
                                                            <label className="input-group-btn my-0 mt-2 mr-2">
                                                                Upload Scheme Document
                                                            </label>
                                                            {
                                                                !id && !formData?.attachments?.length ? (
                                                                    <label className='p-1'>
                                                                        <input id="" type="file"
                                                                               className='form-control'
                                                                               onChange={handleAttachmentChange}
                                                                               name='attachment'
                                                                               accept=".pdf,.jpeg,.jpg,.png"
                                                                               multiple/>
                                                                    </label>
                                                                ) : (
                                                                    formData.attachments.map((att, i) => {
                                                                        return (
                                                                            <a className="mt-2 mx-2" href={att.file_url}
                                                                               target='_blank'>Attachment {i + 1}</a>);
                                                                    })
                                                                )
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

export default AddChallanForm
