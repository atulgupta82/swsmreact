import React from 'react'
import {Card, Col, Form, Row, Tab, Tabs} from 'react-bootstrap'
import {IoIosEye} from 'react-icons/io'

const TaxDetails = ({data}) => {

    return (
        <div>
            <Form>
                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">PAN</p>
                    </Col>
                    <Col sm="9">
                        <p className=" mb-0">{data.pan_no ? data.pan_no : ""}</p>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">PAN Holder Name</p>
                    </Col>
                    <Col sm="9">
                        <p className="text_green mb-0">{data.pan_holder_name ? data.pan_holder_name : ""}</p>
                    </Col>
                </Row>
                <hr/>

                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">Status</p>
                    </Col>
                    <Col sm="9">
                        <p className=" mb-0">{data.beneficiar_status ? data.beneficiar_status : ""}</p>

                    </Col>
                </Row>
                <hr/>

                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">GST Number</p>
                    </Col>
                    <Col sm="9">
                        <p className=" mb-0">{data.gst_no ? data.gst_no : ""}</p>
                    </Col>
                </Row>
                <hr/>

                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">Reg No. MSME Act,2006</p>
                    </Col>
                    <Col sm="9">
                        <p className=" mb-0">{data.reg_no ? data.reg_no : ""}</p>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default TaxDetails
