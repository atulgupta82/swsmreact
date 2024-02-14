import React, {useState} from 'react'
import {Col, Container, Form, Row} from 'react-bootstrap'
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom'

const ManageDisbursmentHeader = ({onDateChange, type}) => {
    const {authData} = useSelector((state) => state.authData);
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
        <div className='addNewScheme w-80'>
            <div className="add_new_user">
                <div className="d-flex">
                    <Container fluid>
                        <Row>
                            <Col sm={4}>
                                {type ? <h4>{type}</h4> : <h4>Invoices</h4>}
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
                    {type !== 'TDS-IT' && authData.user.user_type == 'l1' ?
                        <Link to="/add-sanction-order">
                            <button type="button" className="btn btn-primary">Add Sanction order</button>
                        </Link> : ""
                    }
                </div>
            </div>
        </div>
    )
}

export default ManageDisbursmentHeader
