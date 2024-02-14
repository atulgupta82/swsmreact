import React, { useEffect, useState } from 'react'
import { Card, Col, Form, Row, Tab, Tabs } from 'react-bootstrap'
import { IoIosEye } from 'react-icons/io'

const PartnerDetails = ({data}) => {
    const [form_data,setForm_data]=useState(data.beneficiary_partner_details);
    useEffect(() => {
      setForm_data(data.beneficiary_partner_details)
    //   console.log(data);
    }, [data]);
    return (
        <div>
            <Form>
                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">Name</p>
                    </Col>
                    <Col sm="9">
                        <p className=" mb-0">{form_data.p_name?form_data.p_name:''}</p>
                    </Col>
                </Row>
                <hr />

                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">PAN No</p>
                    </Col>
                    <Col sm="9">
                        <p className="text_green mb-0">{form_data.p_pan_no?form_data.p_pan_no:''}</p>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">Address</p>
                    </Col>
                    <Col sm="9">
                        <p className=" mb-0">{form_data.p_address_1?form_data.p_address_1:''}</p>
                        <p className=" mb-0">{form_data.p_address_2?form_data.p_address_2:''}</p>
                    </Col>
                </Row>
                <hr />

                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">Contact No</p>
                    </Col>
                    <Col sm="9">
                    <p className=" mb-0">{form_data.p_mobile?form_data.p_mobile:''}</p>

                    </Col>
                </Row>
                <hr />

                <Row>
                    <Col sm="3">
                        <p className="mb-0 text-muted">Email ID</p>
                    </Col>
                    <Col sm="9">
                        <a href="#" className="text-primary">{form_data.p_email?form_data.p_email:''} </a>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default PartnerDetails