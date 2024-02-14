import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import './sanctionOrderModal.css';

const ApprovalBeneficiaryPreview = ({showPreview,setShowPreview,formData,handleSubmit}) => {
    // console.log(formData);
    const handleClose = () => setShowPreview(false);
    return (
        <div>
            <Modal
             size="xl"
            show={showPreview} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Beneficiary Preview : </Modal.Title>
                </Modal.Header>
                <Modal.Body className='previewModalBody'>
                    <h6>Basic info:</h6>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Company Name</th>
                                <th>Address 1</th>
                                <th>Address 2</th>
                                <th>State</th>
                                <th>District</th>
                                <th>Pin Code</th>
                                <th>Contact Person</th>
                                <th>Email</th>
                                <th>Mobile No</th>
                                <th>Landline No.</th>
                            </tr>
                        </thead>
                        <tbody> 
                            <tr>
                                <td>{formData.company_name}</td>
                                <td>{formData.address_1}</td>
                                <td>{formData.address_2}</td>
                                <td>{formData.state_id}</td>
                                <td>{formData.district}</td>
                                <td>{formData.pin_code}</td>
                                <td>{formData.contact_person}</td>
                                <td>{formData.email}</td>
                                <td>{formData.mobile}</td>
                                <td>{formData.landline_no}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <h6>Bank Details:</h6>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Beneficiary Name</th>
                                <th>Bank Name</th>
                                <th>Branch Name</th>
                                <th>Account No</th>
                                <th>IFSC Code</th>
                            </tr>
                        </thead>
                        <tbody> 
                            <tr>
                                <td>{formData.beneficiary_name}</td>
                                <td>{formData.bank_name}</td>
                                <td>{formData.branch_name}</td>
                                <td>{formData.account_no}</td>
                                <td>{formData.ifsc_code}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <h6>Statutory Details:</h6>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Pan</th>
                                <th>Pan holder name</th>
                                <th>Status</th>
                                <th>GST No.</th>
                                <th>Reg No MSME Act 2006</th>
                            </tr>
                        </thead>
                        <tbody> 
                            <tr>
                                <td>{formData.pan_no}</td>
                                <td>{formData.pan_holder_name}</td>
                                <td>{formData.status}</td>
                                <td>{formData.gst_no}</td>
                                <td>{formData.reg_no}</td>
                            </tr>                         
                        </tbody>
                    </Table>
                    <h6>Other Details:</h6>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Is vendor agreement available</th>
                                <th>Contract copy</th>
                                <th>Firm Registration Cert.</th>
                                <th>Pan card</th>
                                <th>Authority letter/fc/UBS/NEFT</th>
                                <th>Invoice /letter head</th>
                                <th>cancel cheque</th>
                            </tr>
                        </thead>
                        <tbody> 
                            <tr>
                                <td>{formData.beneficiary_other_details.is_agreement_available}</td>
                                <td>{formData.beneficiary_other_details.contract_copy ?"Yes":"No"}</td>
                                <td>{formData.beneficiary_other_details.pan_card?"Yes":"No"}</td>
                                <td>{formData.beneficiary_other_details.authority_letter?"Yes":"No"}</td>
                                <td>{formData.beneficiary_other_details.authority_letter?"Yes":"No"}</td>
                                <td>{formData.beneficiary_other_details.cancel_cheque ?"Yes":"No"}</td>
                            </tr>                         
                        </tbody>
                    </Table>
                    <h6>Proprieter/Partner/Director Details:</h6>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Pan</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>address 1</th>
                                <th>address 2</th>
                                <th>state</th>
                                <th>district</th>
                                <th>pin code</th>
                            </tr>
                        </thead>
                        <tbody> 
                            <tr>
                                <td>{formData.beneficiary_partner_details.p_name}</td>
                                <td>{formData.beneficiary_partner_details.p_pan_no}</td>
                                <td>{formData.beneficiary_partner_details.p_mobile}</td>
                                <td>{formData.beneficiary_partner_details.p_email}</td>
                                <td>{formData.beneficiary_partner_details.p_address_1}</td>
                                <td>{formData.beneficiary_partner_details.p_address_2}</td>
                                <td>{formData.beneficiary_partner_details.p_state_id}</td>
                                <td>{formData.beneficiary_partner_details.p_district}</td>
                                <td>{formData.beneficiary_partner_details.p_pincode}</td>
                            </tr>                         
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
export default ApprovalBeneficiaryPreview
