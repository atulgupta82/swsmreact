import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import './sanctionOrderModal.css';

const ApprovalBudgetPreview = ({showPreview,setShowPreview,formData,handleSubmit}) => {
    
   // console.log(formData);
    const handleClose = () => setShowPreview(false);
    
    
    

    return (
        <div>
            <Modal
             size="lg"
            show={showPreview} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Budget Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body className='previewModalBody'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Scheme Name</th>
                                <th>Scheme Code.</th>
                                <th>Financial Year</th>
                                <th>Doc Uploaded</th>
                                <th>Total Scheme Budget</th>
                            </tr>
                        </thead>
                        <tbody> 
                            <tr>
                                <td>{formData.scheme_name}</td>
                                <td>{formData.scheme_code}</td>
                                <td>{formData.financial_year}</td>
                                <td>{formData.attachments && formData.attachments.length ? "Yes":"No"}</td>
                                <td>{formData.budget}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <h6>Sub Head Details:</h6>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Sr.No</th>
                                <th>SubHead Name</th>
                                <th>SubHead Code</th>
                                <th>Budget Date</th>
                                <th>Budget</th>
                                <th>Provisional Budget</th>
                            </tr>
                        </thead>
                        <tbody> 
                            <tr>
                                <td>1.</td>
                                <td>{formData.subhead_name}</td>
                                <td>{formData.subhead_code}</td>
                                <td>{formData.budget_date}</td>
                                <td>{formData.budget}</td>
                                <td>{formData.provisional_budget}</td>
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
export default ApprovalBudgetPreview
