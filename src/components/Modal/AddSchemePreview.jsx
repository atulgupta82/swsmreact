import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import './sanctionOrderModal.css';

const AddSchemePreview = ({showPreview,setShowPreview,formData,handleSubmit}) => {
    // console.log(formData)

    const handleClose = () => setShowPreview(false);
    
    return (
        <div>
            <Modal
             size="lg"
            show={showPreview} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Scheme Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body className='previewModalBody'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Dept. Name</th>
                                <th>Scheme Name</th>
                                <th>Scheme Code.</th>
                                <th>Scheme Type</th>
                                <th>Grant Code</th>
                                <th>Financial Year</th>
                                <th>Carry Forward</th>
                                <th>Total Scheme Budget</th>
                                <th>Scheme Doc Uploaded</th>
                                <th>Account Name</th>
                                <th>Account Type</th>
                                <th>Account No</th>
                                <th>Bank</th>
                                <th>Branch</th>
                                <th>IFSC Code</th>
                            </tr>
                        </thead>
                        <tbody> 
                            <tr>
                                <td>{formData.department}</td>
                                <td>{formData.name}</td>
                                <td>{formData.code}</td>
                                <td>{formData.type}</td>
                                <td>{formData.grant_code}</td>
                                <td>{formData.financial_year}</td>
                                <td>{formData.carry_forwarded==1?"Yes":"No"}</td>
                                <td>{formData.department}</td>
                                <td>{formData.attachment && formData.attachment.length ? "Yes":"No"}</td>
                                <td>{formData.bank.account_name?formData.bank.account_name:''}</td>
                                <td>{formData.bank.account_type?formData.bank.account_type:''}</td>
                                <td>{formData.bank.account_no?formData.bank.account_no:''}</td>
                                <td>{formData.bank.bank_name?formData.bank.bank_name:''}</td>
                                <td>{formData.bank.branch_name?formData.bank.branch_name:''}</td>
                                <td>{formData.bank.ifsc_code?formData.bank.ifsc_code:''}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <h6>Sub Head List:</h6>
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
                            {
                                formData.sub_heads && formData.sub_heads.map((subhead,i)=>{
                                    return (
                                        <tr>
                                            <td>{i+1}</td>
                                            <td>{subhead.name}</td>
                                            <td>{subhead.code}</td>
                                            <td>{subhead.budget_date}</td>
                                            <td>{subhead.budget}</td>
                                            <td>{subhead.provisional_budget}</td>
                                        </tr>
                                    );
                                })
                            }
                            
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

export default AddSchemePreview