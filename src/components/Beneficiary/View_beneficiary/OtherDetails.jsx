import React, { useEffect, useState } from 'react'
import { Card, Col, Form, Row, Tab, Tabs } from 'react-bootstrap'
import { IoIosEye } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { get_file_url_last_name } from '../../../helper/Utils'

const OtherDetails = ({data}) => {
  const [form_data,setForm_data]=useState(data.beneficiary_other_details);
  useEffect(() => {
    setForm_data(data.beneficiary_other_details)
    // console.log(data);
  }, [data]);
  return (
    <div>
      <Form>
        <Row>
          <Col sm="3">
            <p className="mb-0 text-muted">Contract</p>
          </Col>
          <Col sm="9">
            {form_data.contract_copy?(
              <Link  to={form_data.contract_copy} target="_blank" rel="noopener noreferrer" className="text-primary">{get_file_url_last_name(form_data.contract_copy)} <IoIosEye></IoIosEye></Link>
            ):""}
          </Col>
        </Row>
        <hr />
        <Row>
          <Col sm="3">
            <p className="mb-0 text-muted">Firm Registration Certificate</p>
          </Col>
          <Col sm="9">
          
          {form_data.reg_cert?(
              <Link  to={form_data.reg_cert} target="_blank" rel="noopener noreferrer" className="text-primary">{get_file_url_last_name(form_data.reg_cert)} <IoIosEye></IoIosEye></Link>
            ):""}
          </Col>
        </Row>
        <hr />

        <Row>
          <Col sm="3">
            <p className="mb-0 text-muted">PAN Card Copy</p>
          </Col>
          <Col sm="9">
            {form_data.pan_card?(
              <Link  to={form_data.pan_card} target="_blank" rel="noopener noreferrer" className="text-primary">{get_file_url_last_name(form_data.pan_card)} <IoIosEye></IoIosEye></Link>
            ):""}
          </Col>
        </Row>
        <hr />
        <Row>
          <Col sm="3">
            <p className="mb-0 text-muted">FC/UBS/NEFT/Authority Letter</p>
          </Col>
          <Col sm="9">
            {form_data.authority_letter?(
              <Link  to={form_data.authority_letter} target="_blank" rel="noopener noreferrer" className="text-primary">{get_file_url_last_name(form_data.authority_letter)} <IoIosEye></IoIosEye></Link>
            ):""}
            
          </Col>
        </Row>
        <hr />

        <Row>
          <Col sm="3">
            <p className="mb-0 text-muted">Invoice/ Letter Head</p>
          </Col>
          <Col sm="9">
            
            {form_data.letter_head?(
              <Link  to={form_data.letter_head} target="_blank" rel="noopener noreferrer" className="text-primary">{get_file_url_last_name(form_data.letter_head)} <IoIosEye></IoIosEye></Link>
            ):""}
          </Col>
        </Row>
        <hr />

        <Row>
          <Col sm="3">
            <p className="mb-0 text-muted">Cancel Cheque Copy</p>
          </Col>
          <Col sm="9">            
            {form_data.cancel_cheque?(
              <Link  to={form_data.cancel_cheque} target="_blank" rel="noopener noreferrer" className="text-primary">{get_file_url_last_name(form_data.cancel_cheque)} <IoIosEye></IoIosEye></Link>
            ):""}
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default OtherDetails