import React from 'react'
import { Col, Container, Form, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const SchemeDetailsHeader = () => {
    return (
        <div>
            <div className='addNewScheme' >
                <div className="add_new_user">
                    <div>
                        <h4>Scheme Details</h4>
                    </div>
                    <div>
                        <Container fluid>
                            <Row>
                                <Col sm={6}>
                                    <Form.Group className="" controlId="">
                                        <Form.Control type="date" />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group className="" controlId="">
                                        <Form.Control type="date" />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            </div>
            <div className='add_new_user addNewScheme'>
                <Table  bordered hover>
                    <thead>
                        <tr>
                            <th>Scheme Code</th>
                            <th>Financial Year</th>
                            <th>Department Name</th>
                            <th>Scheme Name</th>
                            <th>Type of Scheme</th>
                            <th>Budget</th>
                            <th>Sanction Amount</th>
                            <th>Total Payment</th>
                            <th>Budget Balance</th>
                            <th>Other Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default SchemeDetailsHeader