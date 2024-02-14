import React from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const ProceedForApprovalHeader = () => {
  return (
    <div className='addNewScheme' >
      <div className="add_new_user">
        <div>
          <h4>Approval</h4>
        </div>
        <div>
          <Link to="/fund-invoice-list">
            <button type="button" className="btn btn-light">GO BACK</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProceedForApprovalHeader