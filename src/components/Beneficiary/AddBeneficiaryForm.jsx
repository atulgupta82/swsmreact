import React, {useEffect, useState} from 'react'
import {Alert, Tab, Tabs} from 'react-bootstrap'
import {Container} from 'react-bootstrap';
import {Row} from 'react-bootstrap';
import {Col} from 'react-bootstrap';
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import {Card} from 'react-bootstrap';
import {Breadcrumb} from 'react-bootstrap';
import {IoIosInformationCircleOutline, IoIosClose,} from "react-icons/io";
import {FaUpload} from "react-icons/fa";
import './AddBeneficiaryForm.css';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {add_beneficiary, get_beneficiary_status, get_states, get_districts_list} from '../../helper/Api';
import {toast} from 'react-toastify';
import AddBeneficiaryPreview from '../Modal/AddBeneficiaryPreview';


const AddBeneficiaryForm = () => {
    const {beneficiaries, loading} = useSelector((state) => state.beneficiaryData);
    const {authData} = useSelector((state) => state.authData);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [status_list, setStatus_list] = useState([]);
    const [states_list, setStates_list] = useState([]);
    const [b_district_list, setB_District_list] = useState([]);
    const [district_list, setDistrict_list] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState({
        "company_name": null,
        "address_1": null,
        "address_2": null,
        "state_id": null,
        "district": null,
        "pin_code": null,
        "contact_person": null,
        "email": null,
        "mobile": null,
        "landline_no": null,
        "beneficiary_name": null,
        "bank_name": null,
        "branch_name": null,
        "account_no": null,
        "ifsc_code": null,
        "pan_no": null,
        "pan_holder_name": null,
        "status": null,
        "gst_no": null,
        "reg_no": null,
        "added_by": authData.user.id,
        "p_name": null,
        "p_pan_no": null,
        "p_dob": null,
        "p_mobile": null,
        "p_email": null,
        "p_address_1": null,
        "p_address_2": null,
        "p_state_id": null,
        "p_district": null,
        "p_pincode": null,
        "payment_terms": null,
        "cost_code": null,
    });

    const [error, setError] = useState({
        status: false,
        msg: ''
    });

    useEffect(() => {
        get_status();
    }, []);

    useEffect(() => {
        get_districts();
    }, [formData.p_state_id]);

    useEffect(() => {
        get_b_districts();
    }, [formData.state_id]);

    const get_status = async () => {
        try {
            const {data} = await get_beneficiary_status();
            if (data.status) {
                setStatus_list(data.list);
            } else {
                setStatus_list([])
            }
            const states_response = await get_states();
            if (states_response.data.status) {
                setStates_list(states_response.data.list);
            } else {
                setStates_list([])
            }
        } catch (error) {
            setStatus_list([])
        }
    }

    const get_districts = async () => {
        try {
            const {data} = await get_districts_list(formData.p_state_id);
            if (data.status) {
                setDistrict_list(data.list);
            } else {
                setDistrict_list([])
            }
        } catch (error) {
            setDistrict_list([])
        }
    }

    const get_b_districts = async () => {
        try {
            const {data} = await get_districts_list(formData.state_id);
            if (data.status) {
                setB_District_list(data.list);
            } else {
                setB_District_list([])
            }
        } catch (error) {
            setB_District_list([])
        }
    }

    const handleFormDataChange = (e, is_file = false) => {
        const name = e.target.name;
        let value = null;
        if (is_file) {
            value = e.target.files;
        } else {
            value = e.target.value;
        }
        setFormData({...formData, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        /*if (!formData?.authority_letter?.[0] && !formData?.letter_head?.[0] && !formData?.cancel_cheque?.[0]) {
            toast.error('Atlest one document is required in Authority Letter, Letter Head or Cancel Cheque', {
                position: toast.POSITION.TOP_CENTER
            });
            return;
        }*/

        // console.log(formData)
        const post_data = new FormData();
        post_data.append('company_name', formData.company_name);
        post_data.append('address_1', formData.address_1);
        post_data.append('address_2', formData.address_2);
        post_data.append('state_id', formData.state_id);
        post_data.append('district', formData.district);
        post_data.append('pin_code', formData.pin_code);
        post_data.append('contact_person', formData.contact_person);
        post_data.append('email', formData.email);
        post_data.append('mobile', formData.mobile);
        post_data.append('landline_no', formData.landline_no);
        post_data.append('beneficiary_name', formData.beneficiary_name);
        post_data.append('bank_name', formData.bank_name);
        post_data.append('branch_name', formData.branch_name);
        post_data.append('account_no', formData.account_no);
        post_data.append('ifsc_code', formData.ifsc_code);
        post_data.append('pan_no', formData.pan_no);
        post_data.append('pan_holder_name', formData.pan_holder_name);
        post_data.append('status', formData.status);
        post_data.append('gst_no', formData.gst_no);
        post_data.append('reg_no', formData.reg_no);
        post_data.append('added_by', formData.added_by);
        post_data.append('p_name', formData.p_name);
        post_data.append('p_pan_no', formData.p_pan_no);
        post_data.append('p_dob', formData.p_dob);
        post_data.append('p_mobile', formData.p_mobile);
        post_data.append('p_email', formData.p_email);
        post_data.append('p_address_1', formData.p_address_1);
        post_data.append('p_address_2', formData.p_address_2);
        post_data.append('p_state_id', formData.p_state_id);
        post_data.append('p_district', formData.p_district);
        post_data.append('p_pincode', formData.p_pincode);
        post_data.append('payment_terms', formData.payment_terms);

        post_data.append('contract_copy', formData.contract_copy ? formData.contract_copy[0] : null);
        post_data.append('reg_cert', formData.reg_cert ? formData.reg_cert[0] : null);
        post_data.append('pan_card', formData.pan_card ? formData.pan_card[0] : null);

        post_data.append('authority_letter', formData.authority_letter ? formData.authority_letter[0] : null);
        post_data.append('letter_head', formData.letter_head ? formData.letter_head[0] : null);
        post_data.append('cancel_cheque', formData.cancel_cheque ? formData.cancel_cheque[0] : null);

        const documents = [
            /*'contract_copy',
            'reg_cert',
            'pan_card',*/
            'authority_letter',
            'letter_head',
            'cancel_cheque'
        ];

        let hasUploadedDocument = false;

        for (const doc of documents) {
            const docFile = formData[doc] ? formData[doc][0] : null;
            post_data.append(doc, docFile);

            if (docFile !== null) {
                hasUploadedDocument = true;
            }
        }

        if (!hasUploadedDocument) {
            toast.error('Upload atleast one document', {
                position: toast.POSITION.TOP_CENTER
            });
            return;
        }

        try {
            const budgetResponse = await add_beneficiary(post_data);
            const budgetResponseData = budgetResponse.data;
            if (budgetResponseData.status) {
                setError({
                    status: false,
                    msg: budgetResponseData?.message || budgetResponseData?.error || 'Something went wrong'
                })
                setShowPreview(false);
                navigate('/beneficiary')
            } else {
                toast.error(budgetResponseData?.message || budgetResponseData?.error || 'Something went wrong', {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        } catch (error) {
            toast.error("Something went wrong...", {
                position: toast.POSITION.TOP_CENTER
            });

            console.log(error)
        }
    }

    const previewhandler = (e) => {
        e.preventDefault();
        setShowPreview(true);
    };

    return (
        <div>
            <Container>
                <AddBeneficiaryPreview showPreview={showPreview} setShowPreview={setShowPreview} formData={formData}
                                       handleSubmit={handleSubmit}></AddBeneficiaryPreview>
                {error.status && (
                    <Alert variant="danger" onClose={() => setError({status: false, msg: ''})} dismissible>
                        {error.msg}
                    </Alert>
                )}
                <Form onSubmit={previewhandler}>
                    <div className="add_new_user mt-2">
                        <h4> Add Beneficiary</h4>
                        <div>
                            <button type="button" className="btn btn-light">Cancel</button>
                            &nbsp;&nbsp;
                            <button type="submit" className="btn btn-primary">Subimt for Approval</button>
                        </div>
                    </div>
                    <Card className='mt-2'>
                        <Tabs
                            defaultActiveKey="BasicInformation"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                        >
                            <Tab eventKey="BasicInformation" title="Basic Information" className='p-2'>
                                <Row>
                                    <Col md="12" className="mb-4">
                                        <Row>
                                            <Col sm="3">
                                                <Form.Label htmlFor="company_name">Beneficiary Name</Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="9">
                                                <Form.Control
                                                    type="text"
                                                    name='company_name'
                                                    id="company_name"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Enter Beneficiary Name'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="12" className="mb-4">
                                        <Row>
                                            <Col sm="3">
                                                <Form.Label htmlFor="address_1">Address </Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="9">
                                                <Form.Control
                                                    type="text"
                                                    name='address_1'
                                                    id="address_1"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Address Line 1'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="12" className="mb-4">
                                        <Row>
                                            <Col sm="3">
                                            </Col>
                                            <Col sm="9">
                                                <Form.Control
                                                    type="text"
                                                    id="address_2"
                                                    name='address_2'
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Address Line 2'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="state_id">State </Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="6">
                                                <Form.Select aria-label="state_id" id="state_id" name='state_id'
                                                             onChange={(e) => handleFormDataChange(e)}
                                                >
                                                    <option value="">--Select state--</option>
                                                    {
                                                        states_list.map((state) => {
                                                            return (<option value={state.id}
                                                                            key={state.id}>{state.name}</option>)
                                                        })
                                                    }
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="district">District </Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="6">
                                                <Form.Select aria-label="district" id="district" name='district'
                                                             onChange={(e) => handleFormDataChange(e)}
                                                >
                                                    <option value="">--Select District--</option>
                                                    {b_district_list.map((district) => {
                                                        return (<option value={district.id}>{district.city}</option>)
                                                    })}
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="pin_code">PIN Code </Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="number"
                                                    id="pin_code"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    name='pin_code'
                                                    placeholder='Enter PIN Code'
                                                    aria-describedby="pin_code"/>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="contact_person">Contact Person </Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="text"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    name='contact_person'
                                                    id="contact_person"
                                                    placeholder='Enter Contact Person'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="email">Email ID </Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="email"
                                                    id="email"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    name='email'
                                                    placeholder='Enter Email ID'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="mobile">Mobile No </Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="tel"
                                                    id="mobile"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    name='mobile'
                                                    maxLength="10"
                                                    onKeyPress={(e) => {
                                                        if (!(e.keyCode === 8 || (e.charCode >= 48 && e.charCode <= 57))) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    placeholder='Enter Mobile No'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="landline_no">Landline No </Form.Label>
                                            </Col>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="number"
                                                    id="landline_no"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    name='landline_no'
                                                    placeholder='Enter Landline No'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="BankDetails" title="Bank Details" className="p-2">
                                <Row>
                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="4">
                                                <Form.Label htmlFor="beneficiary_name">Beneficiary Name </Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name='beneficiary_name'
                                                    id="beneficiary_name"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Enter Beneficiary Name'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="4">
                                                <Form.Label htmlFor="bank_name">Bank Name </Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    id="bank_name"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    name='bank_name'
                                                    placeholder='Enter Bank Name'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="4">
                                                <Form.Label htmlFor="branch_name">Branch Name </Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name='branch_name'
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    id="branch_name"
                                                    placeholder='Enter Branch Name'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>


                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="4">
                                                <Form.Label htmlFor="account_no">Account No </Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    id="account_no"
                                                    name='account_no'
                                                    placeholder='Enter Account No'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="4">
                                                <Form.Label htmlFor="ifsc_code">IFSC Code </Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    id="ifsc_code"
                                                    name='ifsc_code'
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Enter IFSC Code'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4"></Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="TaxDetails" title="Statutory Details" className="p-2">
                                <Row>
                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="4">
                                                <Form.Label htmlFor="pan_no">PAN </Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    id="pan_no"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Enter PAN Number'
                                                    name='pan_no'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="4">
                                                <Form.Label htmlFor="pan_holder_name">PAN Holder Name </Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    id="pan_holder_name"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Enter PAN Holder Name'
                                                    name='pan_holder_name'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="4">
                                                <Form.Label htmlFor="status">Status </Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="8">
                                                <Form.Select

                                                    id="status"
                                                    name='status'
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Enter Status'
                                                    aria-describedby="">
                                                    <option value="">---Select Status---</option>
                                                    {
                                                        status_list.map((status) => {
                                                            return (<option value={status.id}>{status.title}</option>);
                                                        })
                                                    }

                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="4">
                                                <Form.Label htmlFor="gst_no">GST No : </Form.Label>

                                            </Col>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    id="gst_no"
                                                    name='gst_no'
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Enter GST No'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="4">
                                                <Form.Label htmlFor="reg_no">Reg No. MSME Act,2006 : </Form.Label>

                                            </Col>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    id="reg_no"
                                                    name='reg_no'
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Enter Reg No. MSME Act,2006'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4"></Col>

                                </Row>
                            </Tab>
                            <Tab eventKey="OtherDetails" title="Other Details" className='p-2'>
                                <Row>
                                    <Col md="6" className="mb-4">
                                        <Form.Label htmlFor="Agreement">Is Vendor Agreement Available ? </Form.Label>
                                        <span className="text-danger"> *</span> :
                                    </Col>


                                    <Col md="6" className="mb-4">
                                        {['radio'].map((type) => (
                                            <div key={`inline-${type}`} className="mb-3">

                                                <Form.Check
                                                    inline
                                                    label="Yes"
                                                    name="is_agreement_available"
                                                    type={type}
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    id={`inline-${type}-1`}
                                                />
                                                <Form.Check
                                                    inline
                                                    label="No"
                                                    name="is_agreement_available"
                                                    type={type}
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    id={`inline-e${type}-2`}
                                                />
                                            </div>
                                        ))}
                                    </Col>
                                    <Col md="12" className="mb-4">
                                        <div className="d-flex other_bank">
                                            <p className="flex_icon">
                                                <IoIosInformationCircleOutline></IoIosInformationCircleOutline></p>
                                            <p className="text-muted">
                                                Document Upload is required in case of availability of agreement
                                            </p>
                                        </div>
                                    </Col>
                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="contract_copy">Contract Copy :</Form.Label>
                                            </Col>
                                            <Col sm="6">
                                                <Form.Group controlId="formFile" className="mb-3 d-flex">
                                                    <div>
                                                        <label className="input-group-btn my-0">
                                                            <input className='form-control'
                                                                   type="file"
                                                                   onChange={(e) => handleFormDataChange(e, true)}
                                                                   accept=".csv,.pdf,.jpeg,.jpg" name="contract_copy"/>
                                                        </label>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="reg_cert">Firm Registration Certificate
                                                    : </Form.Label>

                                            </Col>
                                            <Col sm="6">
                                                <Form.Group controlId="formFile" className="mb-3 d-flex">
                                                    <div>
                                                        <label className="input-group-btn my-0">
                                                            <input className='form-control' type="file"
                                                                   name="reg_cert"
                                                                   onChange={(e) => handleFormDataChange(e, true)}
                                                                   accept=".csv,.pdf,.jpeg,.jpg"
                                                            />
                                                        </label>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="pan_card">PAN Card : </Form.Label>
                                            </Col>
                                            <Col sm="6">
                                                <Form.Group controlId="formFile" className="mb-3 d-flex">
                                                    <div>
                                                        <label className="input-group-btn my-0">
                                                            <input className='form-control' type="file"
                                                                   name="pan_card"
                                                                   onChange={(e) => handleFormDataChange(e, true)}
                                                                   accept=".csv,.pdf,.jpeg,.jpg"/>

                                                        </label>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="12" className="mb-4">
                                        <div className="d-flex other_bank">
                                            <p className="flex_icon">
                                                <IoIosInformationCircleOutline></IoIosInformationCircleOutline></p>
                                            <p className="text-muted">
                                                Upload atleast one document
                                            </p>
                                        </div>
                                    </Col>
                                    <Row>
                                        <Col md="6" className="mb-4">
                                            <Row>
                                                <Col sm="6">
                                                    <Form.Label htmlFor="authority_letter">FC/UBS/NEFT/Authority Letter
                                                        : </Form.Label>

                                                </Col>
                                                <Col sm="6">
                                                    <Form.Group controlId="formFile" className="mb-3 d-flex">
                                                        <div>
                                                            <label className="input-group-btn my-0">
                                                                <input className='form-control' type="file"
                                                                       name="authority_letter"
                                                                       onChange={(e) => handleFormDataChange(e, true)}
                                                                       accept=".csv,.pdf,.jpeg,.jpg"/>
                                                            </label>
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>

                                        <Col md="6" className="mb-4">
                                            <Row>
                                                <Col sm="6">
                                                    <Form.Label htmlFor="letter_head">Invoice /Letter Head : </Form.Label>

                                                </Col>
                                                <Col sm="6">
                                                    <Form.Group controlId="formFile" className="mb-3 d-flex">
                                                        <div>
                                                            <label className="input-group-btn my-0">
                                                                <input className='form-control' type="file"
                                                                       name="letter_head"
                                                                       onChange={(e) => handleFormDataChange(e, true)}
                                                                       accept=".csv,.pdf,.jpeg,.jpg"/>
                                                            </label>
                                                        </div>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>


                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="cancel_cheque">Cancel Cheque Copy : </Form.Label>
                                            </Col>
                                            <Col sm="6">
                                                <Form.Group controlId="formFile" className="mb-3 d-flex">
                                                    <div>
                                                        <label className="input-group-btn my-0">
                                                            <input className='form-control' type="file"
                                                                   name="cancel_cheque"
                                                                   onChange={(e) => handleFormDataChange(e, true)}
                                                                   accept=".csv,.pdf,.jpeg,.jpg"/>
                                                        </label>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="Proprietor" title="Proprietor/Partner/Director's PAN Details"
                                 className='p-2'>
                                <Row>
                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="p_name">Name </Form.Label>
                                            </Col>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="text"
                                                    id="p_name"
                                                    name="p_name"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Enter Name'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="p_pan_no">PAN :</Form.Label>
                                            </Col>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="text"
                                                    id="p_pan_no"
                                                    name="p_pan_no"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Enter PAN Number '
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="p_mobile">Enter Phone Number </Form.Label>
                                            </Col>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="number"
                                                    id="p_mobile"
                                                    name="p_mobile"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Enter Phone Number '
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="p_email">Email </Form.Label>
                                            </Col>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="email"
                                                    id="p_email"
                                                    name="p_email"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Enter Email'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="12" className="mb-4">
                                        <Row>
                                            <Col sm="3">
                                                <Form.Label htmlFor="p_address_1">Address </Form.Label>

                                            </Col>
                                            <Col sm="9">
                                                <Form.Control
                                                    type="text"
                                                    id="p_address_1"
                                                    name="p_address_1"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Address L1'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="12" className="mb-4">
                                        <Row>
                                            <Col sm="3"></Col>
                                            <Col sm="9">
                                                <Form.Control
                                                    type="text"
                                                    id="p_address_2"
                                                    name="p_address_2"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Address L2'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="p_state_id">State :</Form.Label>
                                            </Col>
                                            <Col sm="6">
                                                <Form.Select aria-label="p_state_id" id="p_state_id" name="p_state_id"
                                                             onChange={(e) => handleFormDataChange(e)}
                                                >
                                                    <option value=''>--Select State--</option>
                                                    {states_list.map((state) => {
                                                        return (<option value={state.id}>{state.name}</option>)
                                                    })}
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="p_district">District </Form.Label>

                                            </Col>
                                            <Col sm="6">
                                                <Form.Select aria-label="District" id="p_district" name="p_district"
                                                             onChange={(e) => handleFormDataChange(e)}
                                                >
                                                    <option value=''>--Select District--</option>
                                                    {district_list.map((district) => {
                                                        return (<option value={district.id}>{district.city}</option>)
                                                    })}
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md="6" className="mb-4">
                                        <Row>
                                            <Col sm="6">
                                                <Form.Label htmlFor="p_pincode">PIN Code </Form.Label>

                                            </Col>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="number"
                                                    name="p_pincode"
                                                    id="p_pincode"
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='PIN Code'
                                                    aria-describedby=""/>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                    </Card>
                </Form>
            </Container>
        </div>
    )
}

export default AddBeneficiaryForm
