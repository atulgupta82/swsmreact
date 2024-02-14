import React, {useEffect, useState} from 'react'
import Tools from '../../components/Tools/Tools'
import {Card, Form, InputGroup, Row, Tab, Tabs} from 'react-bootstrap'

import BankDetails from '../../components/Beneficiary/View_beneficiary/BankDetails'
import BasicInfo from '../../components/Beneficiary/View_beneficiary/BasicInfo'
import TaxDetails from '../../components/Beneficiary/View_beneficiary/TaxDetails'
import OtherDetails from '../../components/Beneficiary/View_beneficiary/OtherDetails'
import PartnerDetails from '../../components/Beneficiary/View_beneficiary/PartnerDetails'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {get_beneficiary_by_id, update_beneficiary_status} from '../../helper/Api'
import {useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import ApprovalBeneficiaryPreview from '../../components/Modal/ApprovalBeneficiaryPreview'

const ViewBeneficiary = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {authData} = useSelector((state) => state.authData);
    const [showPreview, setShowPreview] = useState(false);
    const [beneficiaryStatus, setBeneficiaryStatus] = useState(false);
    const [l2remarks, setl2Remarks] = useState('');
    const [l3remarks, setl3Remarks] = useState('');
    const [data, setData] = useState({
        beneficiary_other_details: {},
        beneficiary_partner_details: {}
    });

    useEffect(() => {
        fetch_beneficiary_details();
    }, [id])

    const fetch_beneficiary_details = async () => {
        const {data} = await get_beneficiary_by_id(id);
        if (data.status) {
            setData(data.list[0]);
            setl3Remarks(data.list[0].l3remarks)
            setl2Remarks(data.list[0].l2remarks)
        } else {
            setData([]);
        }
    }

    const update_beneficiary_status_by_id = async () => {

        if (data.id) {
            let post_data = {};
            debugger
            if (authData.user.user_type === 'l3') {
                post_data = {
                    "l3_status": beneficiaryStatus,
                    "beneficiary_id": id,
                    "l3remarks": l3remarks
                };
            } else if (authData.user.user_type === 'l2') {
                post_data = {
                    "l2_status": beneficiaryStatus,
                    "beneficiary_id": id,
                    "l2remarks": l2remarks
                };
            }
            const {data} = await update_beneficiary_status(post_data);
            if (data.status) {
                toast.success(data.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                navigate('/beneficiary');
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
        setBeneficiaryStatus(type);
    };

    return (
        <div>
            <ApprovalBeneficiaryPreview showPreview={showPreview} setShowPreview={setShowPreview} formData={data}
                                        handleSubmit={update_beneficiary_status_by_id}></ApprovalBeneficiaryPreview>
            <Tools></Tools>
            <div className='addNewScheme'>
                <div className="add_new_user">
                    <h4>Beneficiary Details:</h4>
                    <div>
                        {
                            authData.user.user_type === 'l2' ?
                                <>
                                    {data.l2_status == 0 ? (<>
                                        <button type="button" className="btn btn-danger"
                                                onClick={() => previewhandler(2)}>Reject
                                        </button>
                                        &nbsp;
                                        <button type="button" className="btn btn-primary"
                                                onClick={() => previewhandler(1)}>Approve
                                        </button>
                                    </>) : data.l2_status == 1 ? (<>
                                        <button type="button" className="btn btn-primary">Already Approved</button>
                                    </>) : (<>
                                        <button type="button" className="btn btn-danger">Already Rejected</button>
                                    </>)}
                                </> : authData.user.user_type === 'l3' ? (
                                    <>
                                        {data.l3_status === "0" ? (<>
                                            <button type="button" className="btn btn-danger"
                                                    onClick={() => previewhandler(2)}>Reject
                                            </button>
                                            &nbsp;
                                            <button type="button" className="btn btn-primary"
                                                    onClick={() => previewhandler(1)}>Approve
                                            </button>
                                        </>) : data.l3_status === "1" ? (<>
                                            <button type="button" className="btn btn-primary">Already Approved</button>
                                        </>) : (<>
                                            <button type="button" className="btn btn-danger">Already Rejected</button>
                                        </>)}
                                    </>
                                ) : (
                                    ""
                                )
                        }
                    </div>
                </div>
            </div>
            <div className='scheme p-3'>
                <Card>
                    <Tabs
                        defaultActiveKey="BasicInformation"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="BasicInformation" title="Basic Information" className='p-2'>
                            <BasicInfo data={data}/>
                        </Tab>
                        <Tab eventKey="BankDetails" title="Bank Details" className="p-2">
                            <BankDetails data={data}/>
                        </Tab>
                        <Tab eventKey="TaxDetails" title="Statutory Details" className="p-2">
                            <TaxDetails data={data}/>
                        </Tab>
                        <Tab eventKey="OtherDetails" title="Other Details" className='p-2'>
                            <OtherDetails data={data}/>
                        </Tab>
                        <Tab eventKey="Proprietor" title="Proprietor/Partner/Director's PAN Details" className='p-2'>
                            <PartnerDetails data={data}/>
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
                                                      onChange={(e) => setl2Remarks(e.target.value)}
                                                      disabled={authData.user.user_type !== 'l2'}
                                                      value={data.l2remarks}>
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
                                                      onChange={(e) => setl3Remarks(e.target.value)} value={l3remarks}
                                                      disabled={authData.user.user_type !== 'l3'}
                                        >
                                        </Form.Control>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                    </Row>
                </Card>
            </div>

        </div>
    )
}

export default ViewBeneficiary
