import React from 'react'
import {Accordion, Col, Container, Form, Row} from 'react-bootstrap'
import Invoice from './Invoice'
import {Button} from '@mui/material';
import {FaPlus, FaTrash} from 'react-icons/fa';
import {check_is_equal_voucher_invoices_amount, isFilePdf_or_Image} from '../../helper/Utils';
import {toast} from 'react-toastify';

const Voucher = ({handleInput, formData, handleVendor, vendorList, vendor, setFormData, voucherIndex}) => {
    const addInvoice = (voucherIndex) => {
        // console.log(voucherIndex)
        // console.log(formData)
        setFormData((prevState) => {
            const newVouchers = [...prevState.vouchers];
            newVouchers[voucherIndex].invoices.push({
                vendor_id: null,
                payment: null,
                invoice_no: null,
                invoice_ref_no: null,
                invoice_date: null,
                invoice_value: null,
                taxable_amount: null,
                sanction_amount: null,
                gst: null,
                gis: null,
                nps: null,
                tds_it_rate: null,
                tds_it_amount: null,
                s_gst_rate: null,
                s_gst_amount: null,
                c_gst_rate: null,
                c_gst_amount: null,
                i_gst_rate: null,
                i_gst_amount: null,
                other_deduction: null,
                remarks: null,
                schemes: [
                    {
                        scheme_id: null,
                        amount: null,
                        subheads: [
                            {
                                sub_heads_id: null,
                                sub_head_amount: null,
                            },
                        ],
                    },
                ],
            });
            return {...prevState, vouchers: newVouchers};
        });
    };

    const handleVoucherChange = (e, voucherIndex) => {
        const {name, value} = e.target;
        setFormData((prevState) => {
            const newVouchers = [...prevState.vouchers];
            newVouchers[voucherIndex][name] = value;
            return {...prevState, vouchers: newVouchers};
        });
    };
    const handleVoucherChangeFile = (e, voucherIndex) => {
        const {name, files} = e.target;
        if (!isFilePdf_or_Image(files[0])) {
            e.target.value = "";
            toast.error("Please select pdf type file.", {
                position: toast.POSITION.TOP_CENTER
            });
            return;
        } else {
            setFormData((prevState) => {
                const newVouchers = [...prevState.vouchers];
                newVouchers[voucherIndex][name] = files;
                return {...prevState, vouchers: newVouchers};
            });
        }
    };
    const deleteVoucher = (voucherIndex) => {
        if (voucherIndex > 0) {
            setFormData((prevState) => {
                const newVouchers = [...prevState.vouchers];
                newVouchers.splice(voucherIndex, 1);
                return {...prevState, vouchers: newVouchers};
            });
        }
    };

    return (
        <>
            {voucherIndex > 0 && (
                <div>
                    <button className='btn btn-danger btn-sm'
                            onClick={() => deleteVoucher(voucherIndex)}>Voucher {voucherIndex + 1} <FaTrash/></button>
                </div>
            )}
            <Container fluid>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="voucher_no">
                            <Form.Label>Voucher No <span className='text-danger'>*</span></Form.Label>
                            <Form.Control type="text"
                                          placeholder="Enter Voucher No."
                                          required
                                          name="voucher_no" value={formData.voucher_no}
                                          onChange={(e) => handleVoucherChange(e, voucherIndex)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Voucher Date: <span className='text-danger'>*</span></Form.Label>
                            <Form.Control type="date"
                                          required min={formData.sanction_order_date}
                                          max={new Date().toISOString().split('T')[0]}
                                          placeholder="date" onChange={(e) => handleVoucherChange(e, voucherIndex)}
                                          name="voucher_date" value={formData.voucher_date}/>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Total Voucher Value: <span className='text-danger'>*</span></Form.Label>
                            <Form.Control type="number" placeholder=""
                                          required
                                          onChange={(e) => handleVoucherChange(e, voucherIndex)}
                                          name="total_voucher_value" value={formData.total_voucher_value}/>
                        </Form.Group>
                    </Col>
                    <Col md={6}></Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="">
                            <Form.Label>Voucher : <span className='text-danger'>*</span> <small className='text-danger'>(only
                                pdf allowed under 5MB.)</small></Form.Label>
                            <Form.Control type="file" placeholder=""
                                          required
                                          accept=" .pdf"
                                          onChange={(e) => handleVoucherChangeFile(e, voucherIndex)}
                                          name="voucher"/>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="">
                            <Form.Label>Supporting Document : <small className='text-danger'>(only pdf allowed under
                                5MB.)</small></Form.Label>
                            <Form.Control type="file"
                                          accept=".pdf"
                                          onChange={(e) => handleVoucherChangeFile(e, voucherIndex)}
                                          name="supporting_docs"/>
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
            <Accordion defaultActiveKey="invoice_0">
                {
                    formData.vouchers[voucherIndex].invoices.map((invoice, i) => {
                        return (
                            <>
                                <Accordion.Item eventKey={`invoice_${i}`}>
                                    <Accordion.Header>Invoice - {i + 1} </Accordion.Header>
                                    <Accordion.Body>
                                        <Invoice handleInput={handleInput} formData={formData}
                                                 handleVendor={handleVendor} vendorList={vendorList} vendor={vendor}
                                                 setFormData={setFormData} voucherIndex={voucherIndex}
                                                 invoiceIndex={i}/>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </>
                        )
                    })
                }
            </Accordion>

            <div className='m-2'>
                {check_is_equal_voucher_invoices_amount(formData.vouchers[voucherIndex].total_voucher_value, formData.vouchers[voucherIndex].invoices) ? "" :
                    <Button variant="outlined" onClick={() => addInvoice(voucherIndex)}><FaPlus/>&nbsp; Add Another
                        Invoice</Button>}
                <br/>
            </div>


        </>
    )
}

export default Voucher
