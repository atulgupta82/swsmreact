import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {Col, Container, Form, Row} from 'react-bootstrap';

import './sanctionOrderModal.css';

const AddInterestModal = ({ showPreview, setShowPreview, formData,setFormData,handleSubmit }) => {
    const handleClose = () => setShowPreview(false);
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value})
    }
    return (
        <div>
            <Modal
                size="lg"
                show={showPreview} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Account Details : </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Container>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Account No <span className='text-danger'>*</span></Form.Label>
                                        <Form.Control type="number" placeholder="Enter Account No" name='account_no' value={formData.account_no} onChange={handleChange} required/>                            
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Account Balance <span className='text-danger'>*</span></Form.Label>
                                        <Form.Control type="text" placeholder="Enter Account Balance" name='account_balance' value={formData.account_balance}  onChange={handleChange} required/>                            
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Closing Balance Date <span className='text-danger'>*</span></Form.Label>
                                        <Form.Control type="date" placeholder="Enter Balance Date" name='balance_date' 
                                        value={formData.balance_date} onChange={handleChange}
                                        required />                            
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Interest <span className='text-danger'>*</span></Form.Label>
                                        <Form.Control type="number" placeholder="Enter Interest" name='interest' 
                                        value={formData.interest} onChange={handleChange} required />                            
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Interest Date <span className='text-danger'>*</span></Form.Label>
                                        <Form.Control type="date" placeholder="Enter Interest Date" name='interest_date'
                                        value={formData.interest_date} onChange={handleChange} required />                            
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button variant="primary" type="submit">
                                ADD
                            </Button>
                        </Container>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        CLOSE
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
export default AddInterestModal
