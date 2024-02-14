import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import './sanctionOrderModal.css';

const AddBudgetPreview = ({showPreview,setShowPreview,formData,handleSubmit,schemes,subheadsList,total_scheme_budget}) => {

    const handleClose = () => setShowPreview(false);
    
    const get_scheme_details = (id) => {
        if (id) {
            const filter = schemes.filter((scheme) => scheme.id == id);
            if (filter.length > 0) {
                // console.log(filter);
                return filter[0];
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    const get_subhead_details = (id) => {
        if (id) {
            const filter = subheadsList.filter((subhead) => subhead.id == id);
            if (filter.length > 0) {
                // console.log(filter);
                return filter[0];
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

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
                                <td>{get_scheme_details(formData.scheme_id)?get_scheme_details(formData.scheme_id).name:""}</td>
                                <td>{get_scheme_details(formData.scheme_id)?get_scheme_details(formData.scheme_id).code:""}</td>
                                <td>{formData.financial_year}</td>
                                <td>{formData.attachment && formData.attachment.length ? "Yes":"No"}</td>
                                <td>{total_scheme_budget()}</td>
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
                                            <td>{get_subhead_details(subhead.id)?get_subhead_details(subhead.id).name:""}</td>
                                            <td>{get_subhead_details(subhead.id)?get_subhead_details(subhead.id).code:""}</td>
                                            <td>{subhead.budget_date}</td>
                                            <td>{subhead.budget}</td>
                                            <td>{subhead.provisional_budget}</td>
                                        </tr>
                                    );
                                })
                            }
                            
                        </tbody>
                    </Table>
                    <h6>Create New Sub Head List:</h6>
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
                                formData.newSub_heads && formData.newSub_heads.map((subhead,i)=>{
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
export default AddBudgetPreview