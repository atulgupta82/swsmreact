import React, {useState} from 'react'
import {Card, Col, Form, Image, InputGroup, Row} from 'react-bootstrap';
import {AddCommasToAmount, get_file_ext} from '../../helper/Utils';
import ApprovalDocs from '../ProceedForApproval/ApprovalDocs';

const ProceedForPaymentPage = ({invoice, setInvoices, index}) => {

    const [data, setData] = useState(invoice);
    const [preview, setPreview] = useState(invoice.sanction_order);
    const exts = ['jpeg', 'jpg', 'png'];
    return (
        <div>
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


                        <Col md="6">
                            <Row className="pt-4">
                                <Col sm="4">
                                    <p class="mb-0 text-muted">Amount to Pay <sapn className="text-danger">*</sapn> :
                                    </p>
                                </Col>
                                <Col sm="8">
                                    <InputGroup.Text>₹ {AddCommasToAmount(data.payable_amount)}</InputGroup.Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="pt-4">
                        <Col md={6}>
                            <h6 className="text-muted border-bottom"> BENEFICIARY BANK ACCOUNT DETAILS</h6>
                            <Row className="pt-2">
                                <Col sm="4">
                                    <p class="mb-0 text-muted">Account Name <sapn className="text-danger">*</sapn> :</p>
                                </Col>
                                <Col sm="8">
                                    <InputGroup.Text>{data.beneficiary_name}</InputGroup.Text>
                                </Col>
                            </Row>
                            <Row className="pt-2">
                                <Col sm="4">
                                    <p class="mb-0 text-muted">Bank <sapn className="text-danger">*</sapn> :</p>
                                </Col>
                                <Col sm="8">
                                    <InputGroup.Text>{data.b_bank_name}</InputGroup.Text>
                                </Col>
                            </Row>
                            <Row className="pt-2">
                                <Col sm="4">
                                    <p class="mb-0 text-muted">Branch <span className="text-danger">*</span> :</p>
                                </Col>
                                <Col sm="8">
                                    <InputGroup.Text>{data.b_branch_name}</InputGroup.Text>
                                </Col>
                            </Row>
                            <Row className="pt-2">
                                <Col sm="4">
                                    <p class="mb-0 text-muted">IFSC Code <span className="text-danger">*</span> :</p>
                                </Col>
                                <Col sm="8">
                                    <InputGroup.Text>{data.b_ifsc_code}</InputGroup.Text>
                                </Col>
                            </Row>
                            <Row className="pt-2">
                                <Col sm="4">
                                    <p class="mb-0 text-muted">Account No <sapn className="text-danger">*</sapn> :</p>
                                </Col>
                                <Col sm="8">
                                    <InputGroup.Text>{data.b_account_no}</InputGroup.Text>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={6}>
                            <h6 className="text-muted border-bottom"> SCHEME BANK ACCOUNT DETAILS</h6>
                            <Row className="pt-2">
                                <Col sm="4">
                                    <p class="mb-0 text-muted">Account Name <sapn className="text-danger">*</sapn> :</p>
                                </Col>
                                <Col sm="8">
                                    <InputGroup.Text>{data.scheme_list[0].bank_details.account_name}</InputGroup.Text>
                                </Col>
                            </Row>
                            <Row className="pt-2">
                                <Col sm="4">
                                    <p class="mb-0 text-muted">Bank <sapn className="text-danger">*</sapn> :</p>
                                </Col>
                                <Col sm="8">
                                    <InputGroup.Text>{data.scheme_list[0].bank_details.bank_name}</InputGroup.Text>
                                </Col>
                            </Row>
                            <Row className="pt-2">
                                <Col sm="4">
                                    <p class="mb-0 text-muted">Branch <sapn className="text-danger">*</sapn> :</p>
                                </Col>
                                <Col sm="8">
                                    <InputGroup.Text>{data.scheme_list[0].bank_details.branch_name}</InputGroup.Text>
                                </Col>
                            </Row>
                            <Row className="pt-2">
                                <Col sm="4">
                                    <p class="mb-0 text-muted">IFSC Code <sapn className="text-danger">*</sapn> :</p>
                                </Col>
                                <Col sm="8">
                                    <InputGroup.Text>{data.scheme_list[0].bank_details.ifsc_code}</InputGroup.Text>
                                </Col>
                            </Row>
                            <Row className="pt-2">
                                <Col sm="4">
                                    <p class="mb-0 text-muted">Account No <sapn className="text-danger">*</sapn> :</p>
                                </Col>
                                <Col sm="8">
                                    <InputGroup.Text>{data.scheme_list[0].bank_details.account_no}</InputGroup.Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="pt-5">
                        <Col md="5">
                            {
                                exts.includes(get_file_ext(preview)) ? <Image src={preview} alt={preview} fluid/> :
                                    <iframe src={preview} frameborder="0" height="100%" width="100%"></iframe>
                            }

                            <div className="text-center pt-2">
                                <p>Preview</p>
                                <a className='btn btn-md btn-primary' href={preview} target='_blank'>Open with new
                                    tab</a>
                            </div>
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
                                <ApprovalDocs title="Cancel Cheque"
                                              file_name={data.beneficiary_other_details.cancel_cheque}
                                              setPreview={setPreview}/>
                                <ApprovalDocs title="Letter Head" file_name={data.beneficiary_other_details.letter_head}
                                              setPreview={setPreview}/>
                                <ApprovalDocs title="Pan card" file_name={data.beneficiary_other_details.pan_card}
                                              setPreview={setPreview}/>
                                <ApprovalDocs title="Firm Registration Certificate"
                                              file_name={data.beneficiary_other_details.reg_cert}
                                              setPreview={setPreview}/>
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
                            </Form>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    )
}

export default ProceedForPaymentPage
