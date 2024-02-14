import React, {useEffect, useState} from 'react'
import {Alert, InputGroup, Tab, Tabs} from 'react-bootstrap'
import {Container} from 'react-bootstrap';
import {Row} from 'react-bootstrap';
import {Col} from 'react-bootstrap';
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import {Card} from 'react-bootstrap';
import {Breadcrumb} from 'react-bootstrap';
import {IoIosInformationCircleOutline, IoIosClose,} from "react-icons/io";
import {FaUpload} from "react-icons/fa";
import '../AddBeneficiaryForm.css';
import {useSelector, useDispatch} from 'react-redux';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {
    add_beneficiary,
    get_beneficiary_status,
    get_states,
    get_districts_list,
    get_beneficiary_by_id,
    update_beneficiary_by_id
} from '../../../helper/Api';
import {toast} from 'react-toastify';
import OtherDetailsTab from './OtherDetailsTab';
import PartnerDetailsTab from './PartnerDetails';

const AddBeneficiaryForm = () => {
    const {beneficiaries} = useSelector((state) => state.beneficiaryData);
    const {authData} = useSelector((state) => state.authData);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {id} = useParams();
    const [loading, setLoader] = useState(false);
    const [status_list, setStatus_list] = useState([]);
    const [states_list, setStates_list] = useState([]);
    const [b_district_list, setB_District_list] = useState([]);
    const [district_list, setDistrict_list] = useState([]);
    const [formData, setFormData] = useState({
        "id": "",
        "company_name": "",
        "l3remarks": "",
        "l2remarks": "",
        "address_1": "",
        "address_2": "",
        "state_id": "",
        "district": "",
        "pin_code": "",
        "contact_person": "",
        "email": "",
        "mobile": "",
        "landline_no": "",
        "beneficiary_name": "",
        "bank_name": "",
        "branch_name": "",
        "account_no": "",
        "ifsc_code": "",
        "pan_no": "",
        "pan_holder_name": "",
        "status": "",
        "gst_no": "",
        "reg_no": "",
        "l2_status": "",
        "l3_status": "",
        "added_on": "",
        "added_by": "",
    });

    const [otherDetails, setOtherDetails] = useState({
        "id": "",
        "beneficiary_id": "",
        "is_agrement_available": null,
        "payment_terms": "",
        "cost_code": null,
        "contract_copy": null,
        "reg_cert": null,
        "pan_card": null,
        "authority_letter": null,
        "letter_head": null,
        "cancel_cheque": null,
        "added_on": "",
        "added_by": ""
    })
    const [partnerDetails, setPartnerDetails] = useState({
        "id": "",
        "beneficiary_id": "",
        "p_name": "",
        "p_pan_no": "",
        "p_dob": "",
        "p_mobile": "",
        "p_email": "",
        "p_address_1": "",
        "p_address_2": "",
        "p_state_id": null,
        "p_district": "",
        "p_pincode": "",
        "added_on": "",
        "added_by": ""
    })

    const [error, setError] = useState({
        status: false,
        msg: ''
    });

    useEffect(() => {
        get_status();
    }, []);
    useEffect(() => {
        fetch_beneficiary_details();
    }, [id])

    useEffect(() => {
        get_districts();
    }, [formData.p_state_id]);

    useEffect(() => {
        get_b_districts();
    }, [formData.state_id]);

    const fetch_beneficiary_details = async () => {
        const {data} = await get_beneficiary_by_id(id);

        if (data.status) {
            setFormData(data.list[0]);
            setOtherDetails(data.list[0].beneficiary_other_details);
            setPartnerDetails(data.list[0].beneficiary_partner_details);
        } else {
            setFormData([]);
            setOtherDetails([]);
            setPartnerDetails([]);
        }
    }

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
       /* if (!formData.authority_letter && !formData.letter_head && !formData.cancel_cheque) {
            toast.error('Atlest one document is required in Authority Letter, Letter Head or Cancel Cheque', {
                position: toast.POSITION.TOP_CENTER
            });
            return;
        }*/

        // console.log(formData)
        const post_data = new FormData();

        post_data.append('id', formData.id);
        post_data.append('beneficiary_id', otherDetails.beneficiary_id);
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
        post_data.append('p_name', partnerDetails.p_name);
        post_data.append('p_pan_no', partnerDetails.p_pan_no);
        post_data.append('p_dob', partnerDetails.p_dob);
        post_data.append('p_mobile', partnerDetails.p_mobile);
        post_data.append('p_email', partnerDetails.p_email);
        post_data.append('p_address_1', partnerDetails.p_address_1);
        post_data.append('p_address_2', partnerDetails.p_address_2);
        post_data.append('p_state_id', partnerDetails.p_state_id);
        post_data.append('p_district', partnerDetails.p_district);
        post_data.append('p_pincode', partnerDetails.p_pincode);
        if (otherDetails.contract_copy && otherDetails.contract_copy[0]) {
            post_data.append('contract_copy', otherDetails.contract_copy ? otherDetails.contract_copy[0] : null);
        }
        if (otherDetails.reg_cert && otherDetails.reg_cert[0]) {
            post_data.append('reg_cert', otherDetails.reg_cert ? otherDetails.reg_cert[0] : null);
        }
        if (otherDetails.pan_card && otherDetails.pan_card[0]) {
            post_data.append('pan_card', otherDetails.pan_card ? otherDetails.pan_card[0] : null);
        }
        if (otherDetails.authority_letter && otherDetails.authority_letter[0]) {
            post_data.append('authority_letter', otherDetails.authority_letter ? otherDetails.authority_letter[0] : null);
        }
        if (otherDetails.letter_head && otherDetails.letter_head[0]) {
            post_data.append('letter_head', otherDetails.letter_head ? otherDetails.letter_head[0] : null);
        }
        if (otherDetails.cancel_cheque && otherDetails.cancel_cheque[0]) {
            post_data.append('cancel_cheque', otherDetails.cancel_cheque ? otherDetails.cancel_cheque[0] : null);
        }
        // post_data.append('reg_cert', otherDetails.reg_cert[0]['name']?otherDetails.reg_cert[0]:null);
        // post_data.append('pan_card', otherDetails.pan_card[0]['name']?otherDetails.pan_card[0]:null);
        // post_data.append('authority_letter', otherDetails[0]['name'].authority_letter?otherDetails.authority_letter[0]:null);
        // post_data.append('letter_head', otherDetails[0]['name'].letter_head?otherDetails.letter_head[0]:null);
        // post_data.append('cancel_cheque', otherDetails[0]['name'].cancel_cheque?otherDetails.cancel_cheque[0]:null);

        try {
            setLoader(true);
            const budgetResponse = await update_beneficiary_by_id(post_data);
            const budgetResponseData = budgetResponse.data;
            if (budgetResponseData.status) {
                setLoader(false);
                toast.success(budgetResponseData?.message || budgetResponseData?.error, {
                    position: toast.POSITION.TOP_CENTER
                });
                navigate('/beneficiary')
            } else {
                setLoader(false);
                toast.error(budgetResponseData?.message || budgetResponseData?.error, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        } catch (error) {
            setLoader(false);
            toast.error("Something went wrong...", {
                position: toast.POSITION.TOP_CENTER
            });
        }


    }

    return (
        <div>
            <Container>
                {error.status && (
                    <Alert variant="danger" onClose={() => setError({status: false, msg: ''})} dismissible>
                        {error.msg}
                    </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <div className="add_new_user mt-2">
                        <h4> Update Beneficiary</h4>
                        <div>
                            <Link to="/beneficiary">
                                <button type="button" className="btn btn-light">CANCEL</button>
                            </Link>
                            &nbsp;
                            <button type="submit" disabled={loading}
                                    className="btn btn-primary">{loading ? "LOADING" : "UPDATE"}</button>
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
                                                <Form.Label htmlFor="company_name">Company Name</Form.Label>
                                                <span className="text-danger"> *</span> :
                                            </Col>
                                            <Col sm="9">
                                                <Form.Control
                                                    type="text"
                                                    name='company_name'
                                                    id="company_name"
                                                    value={formData.company_name}
                                                    onChange={(e) => handleFormDataChange(e)}
                                                    placeholder='Enter Company Name'
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
                                                    value={formData.address_1}
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
                                                    value={formData.address_2}
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
                                                            return (<option value={state.id} key={state.id}
                                                                            selected={formData.state_id == state.id}>{state.name}</option>)
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
                                                        return (<option value={district.id} key={district.id}
                                                                        selected={district.id == formData.district}
                                                        >{district.city}</option>)
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
                                                    value={formData.pin_code}
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
                                                    value={formData.contact_person}
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
                                                    value={formData.email}
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
                                                    value={formData.mobile}
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
                                                    value={formData.landline_no}
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
                                                    value={formData.beneficiary_name}
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
                                                    value={formData.bank_name}
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
                                                    value={formData.branch_name}
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
                                                    value={formData.account_no}
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
                                                    value={formData.ifsc_code}
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
                                                    value={formData.pan_no}
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
                                                    value={formData.pan_holder_name}
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
                                                            return (<option value={status.id}
                                                                            key={status.id}
                                                                            selected={status.id == formData.status}
                                                            >{status.title}</option>);
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
                                                    value={formData.gst_no}
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
                                                    value={formData.reg_no}
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
                                <OtherDetailsTab otherDetails={otherDetails} setOtherDetails={setOtherDetails}/>
                            </Tab>
                            <Tab eventKey="Proprietor" title="Proprietor/Partner/Director's PAN Details"
                                 className='p-2'>
                                <PartnerDetailsTab partnerDetails={partnerDetails}
                                                   setPartnerDetails={setPartnerDetails}/>
                            </Tab>
                        </Tabs>
                    </Card>

                    <Card className="mt-2">
                        <Row className="px-4">
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
                                                          value={formData.l3remarks}
                                                          disabled={authData.user.user_type !== 'l3'}
                                            >
                                            </Form.Control>
                                        </InputGroup>
                                    </div>
                                </div>
                            </div>
                        </Row>
                    </Card>
                </Form>
            </Container>
        </div>
    )
}

export default AddBeneficiaryForm
