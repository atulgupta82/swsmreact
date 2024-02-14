import React from 'react'
import { Card, Col, Form, Row, Tab, Tabs } from 'react-bootstrap'
import { IoIosEye } from 'react-icons/io'

const BankDetails = ({data}) => {
  return (
    <div>
      <Form>
        <Row>
          <Col sm="3">
            <p className="mb-0 text-muted">Beneficiary Name</p>
          </Col>
          <Col sm="9">
            <p className=" mb-0">{data.beneficiary_name? data.beneficiary_name:''}</p>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col sm="3">
            <p className="mb-0 text-muted">Bank Name</p>
          </Col>
          <Col sm="9">
            <p className="text_green mb-0">{data.bank_name? data.bank_name:''}</p>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col sm="3">
            <p className="mb-0 text-muted">Account Number</p>
          </Col>
          <Col sm="9">
            <p className=" mb-0">{data.account_no? data.account_no:''}</p>

          </Col>
        </Row>
        <hr />
        <Row>
          <Col sm="3">
            <p className="mb-0 text-muted">Branch Name</p>
          </Col>
          <Col sm="9">
            <p className=" mb-0">{data.branch_name? data.branch_name:''}</p>
          </Col>
        </Row>
        <hr />

        <Row>
          <Col sm="3">
            <p className="mb-0 text-muted">IFSC CODE</p>
          </Col>
          <Col sm="9">
            <p className=" mb-0">{data.ifsc_code? data.ifsc_code:''}</p>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default BankDetails