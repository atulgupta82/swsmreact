import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import './sanctionOrderModal.css';

const AddChallanPreview = ({showPreview, setShowPreview, formData, snaName, headAccount, handleSubmit}) => {
    // console.log(formData)

    const handleClose = () => setShowPreview(false);

    return (
        <div>
            <Modal
                size="lg"
                show={showPreview} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Challan Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body className='previewModalBody'>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Scheme Name</th>
                            <th>SNA Name</th>
                            <th>Purpose Of Amount Deposited</th>
                            <th>Head Of Account</th>
                            <th>Head Of Account No.</th>
                            <th>Challan No.</th>
                            <th>Challan Date</th>
                            <th>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{snaName?.name || ''}</td>
                            <td>{snaName?.bank_details?.account_name || ''}</td>
                            <td>{formData?.purpose || ''}</td>
                            <td>{headAccount?.name || ''}</td>
                            <td>{headAccount?.account_no || ''}</td>
                            <td>{formData.challan_no}</td>
                            <td>{formData.challan_date}</td>
                            <td>{formData.amount}</td>
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

export default AddChallanPreview
