import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import './sanctionOrderModal.css';

const SanctionOrderModal = ({showPreview,setShowPreview,formData,handleSubmit,vendorList}) => {
    // console.log(formData)

    const handleClose = () => setShowPreview(false);
    // const handleShow = () => setShow(true);

    const get_beneficiary_name=(id)=>{
        if(id){            
            let beneficiary=vendorList.filter((beneficiary)=>beneficiary.id===id)
            if(beneficiary.length>0){                
                return beneficiary[0].company_name;
            }
        }else{
            return '';
        }
    }
    
    return (
        <div>
            <Modal
             size="lg"
            show={showPreview} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sanction Order Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body className='previewModalBody'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Sr.No.</th>
                                <th>Sanction Order No.</th>
                                <th>Sanction Order Date</th>
                                <th>Voucher No.</th>
                                <th>Voucher Date</th>
                                <th>Beneficiary Name</th>
                                <th>Invoice No.</th>
                                <th>Invoice Date.</th>
                                <th>Payment Type</th>
                                <th>Invoice Amount</th>
                                <th>Sanction Amount</th>
                                <th>Taxable Amount</th>
                            </tr>
                        </thead>
                        <tbody> 
                        {formData.vouchers.map((voucher, voucherIndex) => (
                            <>                           
                            {voucher.invoices.map((invoice, invoiceIndex) => (
                                <tr key={invoiceIndex}>
                                    <td>{invoiceIndex+1}</td>
                                    <td>{formData.sanction_order_no}</td>
                                    <td>{formData.sanction_order_date}</td>
                                    <td>{voucher.voucher_no}</td>
                                    <td>{voucher.voucher_date}</td>
                                    <td>{get_beneficiary_name(invoice.vendor_id)} </td>
                                    <td>{invoice.invoice_no}</td>
                                    <td>{invoice.invoice_date}</td>
                                    <td>{invoice.payment==1?"Full payment":"Part Payment"}</td>
                                    <td>{invoice.invoice_value}</td>
                                    <td>{invoice.sanction_amount}</td>
                                    <td>{invoice.taxable_amount}</td>
                                </tr>
                            ))}
                            </>
                        ))}
                        </tbody>    
                        
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Change
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        SUBMIT
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default SanctionOrderModal
