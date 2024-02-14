import React, {useState} from 'react'
import {Card, Col, Form, InputGroup, Row, Tab, Tabs} from 'react-bootstrap'
import {useSelector} from "react-redux";

const BasicInfo = ({data}) => {
    const {authData} = useSelector((state) => state.authData);
    const [l3remarks, setl3Remarks] = useState(data.l3remarks ? data.l3remarks : '');
    const [l2remarks, setl2Remarks] = useState(data.l2remarks ? data.l2remarks : '');
    // console.log(data)
    return (
        <div>
            <Form>
                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">Approval Status (L2)</p>
                    </Col>
                    <Col sm="9">
                        {data.l2_status == 0 ? (
                            <p className="text-warning mb-0">Pending</p>
                        ) : data.l2_status == 1 ? (
                            <p className="text-success mb-0">Approved</p>
                        ) : (
                            <p className="text-danger mb-0">Rejected</p>
                        )}
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">Approval Status (L3)</p>
                    </Col>
                    <Col sm="9">
                        {data.l3_status == 0 ? (
                            <p className="text-warning mb-0">Pending</p>
                        ) : data.l3_status == 1 ? (
                            <p className="text-success mb-0">Approved</p>
                        ) : (
                            <p className="text-danger mb-0">Rejected</p>
                        )}
                    </Col>
                </Row>
                <hr/>

                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">Company Name</p>
                    </Col>
                    <Col sm="9">
                        <p className="text_green mb-0">{data.company_name ? data.company_name : ''}</p>
                    </Col>
                </Row>
                <hr/>

                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">Address</p>
                    </Col>
                    <Col sm="9">
                        <p className=" mb-0">{data.address_1 ? data.address_1 : ''}</p>
                        <p className=" mb-0">{data.address_2 ? data.address_2 : ''}</p>
                    </Col>
                </Row>
                <hr/>

                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">Contact Person Name</p>
                    </Col>
                    <Col sm="9">
                        <p className=" mb-0">{data.contact_person ? data.contact_person : ""}</p>
                    </Col>
                </Row>
                <hr/>

                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">Email ID</p>
                    </Col>
                    <Col sm="9">
                        <p className=" mb-0">{data.email ? data.email : ""}</p>
                    </Col>
                </Row>
                <hr/>

                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">Mobile No</p>
                    </Col>
                    <Col sm="9">
                        <p className=" mb-0">{data.mobile ? data.mobile : ""}</p>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">Landline No</p>
                    </Col>
                    <Col sm="9">
                        <p className=" mb-0">{data.landline_no ? data.landline_no : ""}</p>
                    </Col>
                </Row>
                <hr/>

            </Form>
        </div>
    )
}

export default BasicInfo
