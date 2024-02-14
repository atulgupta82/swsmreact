import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import './sanctionOrderModal.css';

const ApprovalFundPreview = ({showPreview, setShowPreview, formData, remarks, handleSubmit}) => {
    const handleClose = () => setShowPreview(false);
    return (
        <div>
            <Modal
                size="xl"
                show={showPreview} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Invoice Approval Preview : </Modal.Title>
                </Modal.Header>
                <Modal.Body className='previewModalBody'>
                    <h6>Basic info:</h6>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Invoice No.</th>
                            <th>Invoice Date</th>
                            <th>Invoice Amount</th>
                            <th>Company Name</th>
                            <th>Payment Type</th>
                            <th>Sanctioned Amount</th>

                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{formData.invoice_no}</td>
                            <td>{formData.invoice_date}</td>
                            <td>{formData.invoice_value}</td>
                            <td>{formData.company_name}</td>
                            <td>{formData.payment_type}</td>
                            <td>{formData.sanction_amount}</td>

                        </tr>
                        </tbody>
                    </Table>
                    <h6>Schemes Details:</h6>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Scheme Code</th>
                            <th>Department Name</th>
                            <th>Type of Scheme</th>
                            <th>Scheme Budget</th>
                            <th>Utilized Budget</th>
                            <th>Remarks</th>
                        </tr>
                        </thead>
                        <tbody>
                        <>
                            {formData.scheme_list.map((scheme, i) => (
                                <tr key={i}>
                                    <td>{scheme.code}</td>
                                    <td>{scheme.department}</td>
                                    <td>{scheme.type}</td>
                                    <td>{scheme.total_budget}</td>
                                    <td>{0}</td>
                                    <td>{remarks}</td>
                                </tr>
                            ))}
                        </>
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
export default ApprovalFundPreview
