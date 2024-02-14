import React from 'react'
import {useSelector} from 'react-redux';
import InterestList from "../../components/Reports/InterestList";
import Tools from "../../components/Tools/Tools";
import {Col, Container, Form, Row} from "react-bootstrap";


const InterestReport = () => {
    const {authData} = useSelector((state) => state.authData);

    return (
        <div>
            <Tools/>
            <div className='addNewScheme'>
                <div className="add_new_user">
                    <div>
                        <Container fluid>
                            <Row>
                                <Col sm={4}>
                                    <h4>Interests</h4>
                                </Col>
                                <Col sm={3}>
                                    <Form.Group className="" controlId="">
                                        <Form.Control type="date" />
                                    </Form.Group>
                                </Col>
                                <Col sm={1}>
                                    <Form.Group className="pt-1" controlId="">
                                        <label htmlFor="">To</label>
                                    </Form.Group>
                                </Col>
                                <Col sm={3}>
                                    <Form.Group className="" controlId="">
                                        <Form.Control type="date" />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                    {/*<div>
                        {authData.user.user_type==='l1'?<Link to="/interest">
                            <button type="button" className="btn btn-primary">Add New Challan</button>
                        </Link>:""}
                    </div>*/}
                </div>
            </div>
            <div className='scheme p-3'>
                <InterestList/>
            </div>
        </div>
    )
}

export default InterestReport
