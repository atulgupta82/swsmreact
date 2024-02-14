import React, {useState} from 'react'
import {Button, Card, Col, Form, Image, InputGroup, Row} from 'react-bootstrap'
import {IoIosEye} from "react-icons/io";
import {toast} from 'react-toastify';
import {update_invoice_approvalStatus} from '../../helper/Api';
import {AddCommasToAmount, get_file_ext} from '../../helper/Utils';
import ApprovalDocs from './ApprovalDocs';
import {useSelector} from 'react-redux';
import AddChallanPreview from "../Modal/AddChallanPreview";
import ApprovalFundPreview from "../Modal/ApprovalFundPreview";


const ProceedForApproval = ({invoice, setInvoices, index}) => {
    // console.log(invoice);
    const [data, setData] = useState(invoice);
    const [preview, setPreview] = useState(invoice.sanction_order);
    const {authData} = useSelector((state) => state.authData);
    const [showPreview, setShowPreview] = useState(false);
    const [remarks, setRemarks] = useState(data.remarks ? data.remarks : '');
    const [l2remarks, setl2Remarks] = useState(data.l2remarks ? data.l2remarks : '');
    const [l3remarks, setl3Remarks] = useState(data.l3remarks ? data.l3remarks : '');
    const [schemeStatus, setSchemeStatus] = useState('');

    const update_approvalStatus = async () => {
        if (schemeStatus == 2 && (authData.user.user_type === 'l2' && (l2remarks.trim() == '' || l2remarks.trim() == null)) || (authData.user.user_type === 'l3' && (l3remarks.trim() == '' || l3remarks.trim() == null))) {
            toast.error('Remarks Field required... ', {
                position: toast.POSITION.TOP_CENTER
            });
        } else {
            let post_data = {
                'invoice_id': data.id,
                'remarks': remarks,
                'l2remarks': l2remarks,
                'l3remarks': l3remarks,
            };
            if (authData.user.user_type === 'l3') {
                post_data.l3_approval_status = schemeStatus;
            } else if (authData.user.user_type === 'l2') {
                post_data.approval_status = schemeStatus;
            }

            const status_response = await update_invoice_approvalStatus(post_data)
            // console.log(status_response);return false;
            if (status_response.data.status) {
                setShowPreview(false);
                setData(status_response.data.list[0])
                if (schemeStatus == 2) {
                    toast.error(status_response.data.message, {
                        position: toast.POSITION.TOP_CENTER
                    });
                } else {
                    toast.success(status_response.data.message, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }

                setInvoices(prevArray => {
                    const newArray = [...prevArray];
                    newArray[index] = status_response.data.list[0];
                    return newArray;
                });

            } else {
                setShowPreview(false);
                toast.error(status_response.data.message, {
                    position: toast.POSITION.TOP_CENTER
                });

            }
        }
    }
    const exts = ['jpeg', 'jpg', 'png'];
    const previewHandler = (e) => {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        setSchemeStatus(e);
        setShowPreview(true);

    };

    return (
        <div>
            <ApprovalFundPreview
                showPreview={showPreview}
                setShowPreview={setShowPreview}
                formData={data}
                remarks={remarks}
                handleSubmit={update_approvalStatus}/>
            <Card className="p-4">
                <div className="border-bottom">
                    <Row>
                        <Col md={12}>
                            <Row>
                                <Col md={4}>
                                    <p>Sanction Order No:</p>
                                    <p className="text-muted">{data ? data.sanction_order_no : ''}</p>
                                </Col>
                                <Col md={4}>
                                    <p>Sanction Order Date:</p>
                                    <p className="text-muted">{data ? data.sanction_order_date : ''}</p>
                                </Col>
                                <Col md={4}>
                                    <p>Sanctioned Amount :</p>
                                    <p className="text-muted">₹ {data.sanction_amount ? AddCommasToAmount(data.sanction_amount) : 0}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <p>Voucher No:</p>
                                    <p className="text-muted">{data ? data.voucher_no : ''}</p>
                                </Col>
                                <Col md={4}>
                                    <p>Voucher Date:</p>
                                    <p className="text-muted">{data ? data.voucher_date : ''}</p>
                                </Col>
                                <Col md={4}>
                                    <p>Voucher Amount :</p>
                                    <p className="text-muted">₹ {data.voucher_amount ? AddCommasToAmount(data.voucher_amount) : 0}</p>
                                </Col>
                            </Row>


                            {/*<Row>
                                <Col md={4}>
                                    <p>Invoice No :</p>
                                    <p className="text-muted">{data ? data.invoice_no : ''}</p>
                                </Col>
                                <Col md={4}>
                                    <p>Invoice Date :</p>
                                    <p className="text-muted">{data ? data.invoice_date : ''}</p>
                                </Col>
                                <Col md={4}>
                                    <p>Invoice Amount :</p>
                                    <p className="text-muted">₹ {data ? AddCommasToAmount(data.invoice_value) : 0}</p>
                                </Col>
                            </Row>*/}
                        </Col>
                        {/*<Col md={12}>
                            <Row>
                                <Col md={4}>
                                    <p>Payment type :</p>
                                    <p className="text-muted">{data.payment_type == 1 ? 'Full Payment' : data.payment_type == 2 ? 'Part Payment' : '-'}</p>
                                </Col>
                                <Col md={4}>
                                    <p>Sanctioned Amount :</p>
                                    <p className="text-muted">₹ {data.sanction_amount ? AddCommasToAmount(data.sanction_amount) : 0}</p>
                                </Col>
                                <Col md={4}>
                                    <p>Invoice Value :</p>
                                    <p className="text-muted">₹ {data.invoice_value ? AddCommasToAmount(data.invoice_value) : 0}</p>
                                </Col>
                            </Row>
                        </Col>*/}
                        {
                            data.scheme_list.map((scheme, i) => {
                                return (
                                    <>
                                        {/*<Col md={12}>
                                            <Row>

                                                <Col md={4}>
                                                    <p>Department Name :</p>
                                                    <p className="text-muted">{scheme.department ? scheme.department : ''}</p>
                                                </Col>
                                                <Col md={4}>
                                                    <p>Type of Scheme :</p>
                                                    <p className="text-muted">{scheme.type ? scheme.type : ''}</p>
                                                </Col>
                                                {
                                                    i == 0 && (
                                                        <Col md={4}>
                                                            <p>Company Name :</p>
                                                            <p className="text-muted">{data.company_name ? data.company_name : ''}</p>
                                                        </Col>
                                                    )
                                                }
                                            </Row>
                                        </Col>*/}
                                        <Col md={12}>
                                            <Row>
                                                <Col md={3}>
                                                    <p>Scheme No :</p>
                                                    <p className="text-muted">{scheme.code ? scheme.code : ''}</p>
                                                </Col>
                                                <Col md={3}>
                                                    <p>Scheme Name :</p>
                                                    <p className="text-muted">{scheme.name ? scheme.name : ''}</p>
                                                </Col>

                                                <Col md={3}>
                                                    <p>Scheme Budget :</p>
                                                    <p className="text-muted">₹ {scheme.total_budget ? AddCommasToAmount(scheme.total_budget) : 0}</p>
                                                </Col>
                                                <Col md={3}>
                                                    <p>Utilized Budget :</p>
                                                    <p className="text-muted">₹ {scheme.utilized_budget ? AddCommasToAmount(scheme.utilized_budget) : 0}</p>
                                                </Col>
                                            </Row>
                                        </Col>

                                        {scheme.subheads.length && scheme.subheads.map((subHead) => {
                                            return (
                                                <>
                                                    <Col md={12}>
                                                        <Row>
                                                            <Col md={3}>
                                                                <p>Subhead Name :</p>
                                                                <p className="text-muted">{subHead.name ? subHead.name : ''}</p>
                                                            </Col>
                                                            <Col md={3}>
                                                                <p>Subhead No :</p>
                                                                <p className="text-muted">{subHead.code ? subHead.code : ''}</p>
                                                            </Col>
                                                            <Col md={3}>
                                                                <p>Subhead Balance :</p>
                                                                <p className="text-muted">₹ {subHead.balance ? AddCommasToAmount(subHead.balance) : 0}</p>
                                                            </Col>
                                                            <Col md={3}>
                                                                <p>Sanctioned Amount :</p>
                                                                <p className="text-muted">₹ {subHead.subhead_amount ? AddCommasToAmount(subHead.subhead_amount) : 0}</p>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </>
                                            );
                                        })}
                                    </>
                                );
                            })
                        }

                        <Col md={12}>
                            <Row>
                                <Col md={3}>
                                    <p>Beneficiary Name:</p>
                                    <p className="text-muted">{data ? data.beneficiary_other_details?.beneficiary_company_name : ''}</p>
                                </Col>
                                <Col md={3}>
                                    <p>Invoice No :</p>
                                    <p className="text-muted">{data ? data.invoice_no : ''}</p>
                                </Col>
                                <Col md={3}>
                                    <p>Invoice Date :</p>
                                    <p className="text-muted">{data ? data.invoice_date : ''}</p>
                                </Col>
                                <Col md={3}>
                                    <p>Payment type :</p>
                                    <p className="text-muted">{data.payment_type == 1 ? 'Full Payment' : data.payment_type == 2 ? 'Part Payment' : '-'}</p>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={3}>
                                    <p>Taxable Amount :</p>
                                    <p className="text-muted">₹ {data ? AddCommasToAmount(data.taxable_amount) : 0}</p>
                                </Col>
                                <Col md={3}>
                                    <p>Invoice Amount :</p>
                                    <p className="text-muted">₹ {data ? AddCommasToAmount(data.invoice_value) : 0}</p>
                                </Col>
                                <Col md={3}>
                                    <p>Deduction Amount :</p>
                                    <p className="text-muted">₹ {data ? AddCommasToAmount(data.total_deduction) : 0}</p>
                                </Col><Col md={3}>
                                <p>Payment Amount :</p>
                                <p className="text-muted">₹ {data ? AddCommasToAmount(data.payable_amount) : 0}</p>
                            </Col>
                            </Row>
                        </Col>


                    </Row>
                </div>

                <Row className="pt-5">
                    <Col md="5">
                        {
                            exts.includes(get_file_ext(preview)) ? <Image src={preview} alt={preview} fluid/> :
                                <iframe src={preview} frameborder="0" height="100%" width="100%"></iframe>
                        }


                    </Col>
                    <Col md="7">
                        <Form>
                            <ApprovalDocs title="Sanction Order" file_name={data.sanction_order}
                                          setPreview={setPreview}/>
                            <ApprovalDocs title="Invoice" file_name={data.invoice} setPreview={setPreview}/>
                            <ApprovalDocs title="Invoice Ref" file_name={data.invoice_ref} setPreview={setPreview}/>
                            <ApprovalDocs title="Voucher" file_name={data.voucher} setPreview={setPreview}/>
                            <ApprovalDocs title="Supporting Documents" file_name={data.supporting_docs}
                                          setPreview={setPreview}/>
                            <ApprovalDocs title="Contract" file_name={data.beneficiary_other_details.contract_copy}
                                          setPreview={setPreview}/>
                            <ApprovalDocs title="Authority Letter"
                                          file_name={data.beneficiary_other_details.authority_letter}
                                          setPreview={setPreview}/>
                            <ApprovalDocs title="Cancel Cheque" file_name={data.beneficiary_other_details.cancel_cheque}
                                          setPreview={setPreview}/>
                            <ApprovalDocs title="Letter Head" file_name={data.beneficiary_other_details.letter_head}
                                          setPreview={setPreview}/>
                            <ApprovalDocs title="Pan card" file_name={data.beneficiary_other_details.pan_card}
                                          setPreview={setPreview}/>
                            <ApprovalDocs title="Firm Registration Certificate"
                                          file_name={data.beneficiary_other_details.reg_cert} setPreview={setPreview}/>
                            {
                                data.scheme_list.map((scheme, i) => (
                                    <div key={scheme.id}>
                                        {scheme.attachments.map((att, j) => (
                                            <div key={att.id}>
                                                <ApprovalDocs title={`Scheme-${i + 1} Attachment-${j + 1}`}
                                                              file_name={att.file_url} setPreview={setPreview}/>

                                            </div>
                                        ))}
                                    </div>
                                ))
                            }

                            <Row className="pt-4">
                                <Col sm="4">
                                    <p class="mb-0 text-muted">Amount to Approve <sapn
                                        className="text-danger">*</sapn> :
                                    </p>
                                </Col>
                                <Col sm="8">
                                    <InputGroup.Text>₹ {data.sanction_amount ? AddCommasToAmount(data.sanction_amount) : 0}</InputGroup.Text>
                                </Col>
                            </Row>
                            <Row className="pt-4">
                                <Col sm="4">
                                    <p class="mb-0 text-muted">Remarks
                                        <sapn className="text-danger">*</sapn>
                                        :
                                    </p>
                                </Col>
                                <Col sm="8">
                                    <InputGroup>
                                        <Form.Control as="textarea" aria-label="With textarea"
                                                      disabled={authData.user.user_type !== 'l1'}
                                                      onChange={(e) => setRemarks(e.target.value)} value={remarks}>

                                        </Form.Control>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row className="pt-4">
                                <Col sm="4">
                                    <p class="mb-0 text-muted">L2 Remarks
                                        <sapn className="text-danger">*</sapn>
                                        :
                                    </p>
                                </Col>
                                <Col sm="8">
                                    <InputGroup>
                                        <Form.Control as="textarea" aria-label="With textarea"
                                                      disabled={authData.user.user_type !== 'l2'}
                                                      onChange={(e) => setl2Remarks(e.target.value)} value={l2remarks}>

                                        </Form.Control>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Row className="pt-4">
                                <Col sm="4">
                                    <p class="mb-0 text-muted">L3 Remarks
                                        <sapn className="text-danger">*</sapn>
                                        :
                                    </p>
                                </Col>
                                <Col sm="8">
                                    <InputGroup>
                                        <Form.Control as="textarea" aria-label="With textarea"
                                                      disabled={authData.user.user_type !== 'l3'}
                                                      onChange={(e) => setl3Remarks(e.target.value)} value={l3remarks}>

                                        </Form.Control>
                                    </InputGroup>
                                    <Row className="pt-2">
                                        <Col xs="8">
                                            <div className="d-grid gap-2">
                                                {authData.user.user_type === 'l3' ? (
                                                    <>
                                                        {data.l3_approval_status < 1 ? (
                                                            <>
                                                                <Button variant="primary" size="lg"
                                                                        onClick={() => previewHandler(1)}>
                                                                    Approve
                                                                </Button>
                                                                <Button variant="outline-danger" size="lg"
                                                                        onClick={() => previewHandler(2)}>
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        ) : data.l3_approval_status == 1 ? (
                                                            <Button variant="primary" disabled={true} size="lg">
                                                                Already Approved
                                                            </Button>
                                                        ) : (
                                                            <Button variant="outline-danger" disabled={true} size="lg">
                                                                Already Rejected
                                                            </Button>
                                                        )
                                                        }
                                                    </>
                                                ) : (
                                                    <>
                                                        {data.approval_status < 1 ? (
                                                            <>
                                                                {/*<Button variant="primary" size="lg" onClick={()=>update_approvalStatus(data.id,1)}>
                                                        Approve
                                                    </Button>*/}
                                                                <Button variant="primary" size="lg"
                                                                        onClick={() => previewHandler(1)}>
                                                                    Approve
                                                                </Button>
                                                                <Button variant="outline-danger" size="lg"
                                                                        onClick={() => previewHandler(2)}>
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        ) : data.approval_status == 1 ? (
                                                            <Button variant="primary" disabled={true} size="lg">
                                                                Already Approved
                                                            </Button>
                                                        ) : (
                                                            <Button variant="outline-danger" disabled={true} size="lg">
                                                                Already Rejected
                                                            </Button>
                                                        )
                                                        }
                                                    </>
                                                )}


                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Row className="pt-1">
                    <Col md="5">
                        <div className="text-center pt-2">
                            <p>Preview</p>
                            <a className='btn btn-md btn-primary' href={preview} target='_blank'>Open with new tab</a>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

export default ProceedForApproval
