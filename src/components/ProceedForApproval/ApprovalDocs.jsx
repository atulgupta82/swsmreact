import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { IoIosEye } from 'react-icons/io'

const ApprovalDocs = ({title,file_name,setPreview}) => {
    return (
        <>
        {file_name&&
            <>
            <Row>
                <Col sm="4">
                    <p class="mb-0 text-muted">{title}</p>
                </Col>
                <Col sm="8">
                    <a href="javascript:void(0)" className="text-primary" onClick={()=>setPreview(file_name)}>{file_name.split('/').pop()} <IoIosEye></IoIosEye></a>
                </Col>
            </Row>
            <hr />
            </>
        }
        
        </>
    )
}

export default ApprovalDocs