import React from 'react'
import './BudgetAnalysis.css'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Col, Container, Form, Row } from 'react-bootstrap';


const BudgetAnalysis = () => {
  return (
    <div className="budget_analysis">
        <h1>Dashboard-Budget Analysis</h1>
        <div className="budget_date_wrapper">
          <Container>
            <Row>
              <Col md={4}>
                <Form.Control
                  type="date" />
              </Col>
              <Col md={1}>
                <span className='pt-2'>To</span>
              </Col>
              <Col md={4}>
                <Form.Control
                  type="date" />
              </Col>
            </Row>
          </Container>
        </div>
    </div>
  )
}

export default BudgetAnalysis