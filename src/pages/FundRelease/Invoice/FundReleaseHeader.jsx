import React, {useState} from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const FundReleaseHeader = ({selectedInvoice,activeTab,selectedPaymentInvoice, onDateChange}) => {

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');


    const handleInput = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        if (name === 'fromDate') {
            setFromDate(value);
        } else {
            setToDate(value);
        }
    }

    const handleFilterClick = () => {
        if (onDateChange) {
            onDateChange(fromDate, toDate);
        }
    };
    const clearFilter = () => {
        setFromDate(''); // Clear fromDate
        setToDate('');
        if (onDateChange) {
            onDateChange('', '');
        }
    };
  return (
    <div className='addNewScheme' >
            <div className="add_new_user">
                <div className="d-flex">
                    <Container fluid>
                        <Row>
                            <Col sm={4}>
                                <h4>Fund Release</h4>
                            </Col>
                            <Col sm={4}>
                                <Form.Group className="" controlId="">
                                    <Form.Control type="date" name="fromDate"
                                                  value={fromDate}
                                                  onChange={handleInput}/>
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                                <Form.Group className="" controlId="">
                                    <Form.Control type="date" name="toDate"
                                                  value={toDate}
                                                  onChange={handleInput}/>
                                </Form.Group>
                            </Col>

                        </Row>
                    </Container>
                    <div className="text-start mx-2">
                        <button type="button" className="btn btn-outline-primary" onClick={clearFilter}>Clear</button>
                    </div>
                    <div className="text-start">
                        <button type="button" className="btn btn-primary" onClick={handleFilterClick}>Filter</button>
                    </div>

                </div>
                <div>
                    {activeTab=='InvoiceList' ? <>
                        {selectedInvoice.length>0 ? (
                        <Link to="/fund-approval" state={{data: selectedInvoice }}>
                            <button type="button" className="btn btn-primary">Proceed for Approval</button>
                        </Link>
                        ):(
                            <button type="button" disabled={true} className="btn btn-primary">Proceed for Approval</button>
                        )}
                    </>:<>
                        {selectedPaymentInvoice.length>0 ? (
                            <Link to="/fund-proceed-for-payment" state={{data: selectedPaymentInvoice }}>
                                <button type="button" className="btn btn-primary">Proceed for Payment</button>
                            </Link>
                        ):(
                            <button type="button" disabled={true} className="btn btn-primary">Proceed for Payment</button>
                        )}
                    </>}                     
                </div>
            </div>
        </div>
  )
}

export default FundReleaseHeader
