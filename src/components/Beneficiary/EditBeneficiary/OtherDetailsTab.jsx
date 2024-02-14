import React from 'react'
import {Form,Col, Row } from 'react-bootstrap'
import { IoIosInformationCircleOutline } from 'react-icons/io'
import { Link } from 'react-router-dom'

const OtherDetails = ({otherDetails,setOtherDetails}) => {
    const handleFormDataChange=(e,is_file=false)=>{
        const name=e.target.name;
        let value=null;
        if(is_file){
            value=e.target.files;
        }else{
            value=e.target.value;
        }
        setOtherDetails({...otherDetails,[name]:value})
    }
    return (
        <div>
            <Row>
                <Col md="6" className="mb-4">
                    <Form.Label htmlFor="Agreement">Is Vendor Agreement Available ? </Form.Label>
                    <span className="text-danger"> *</span> :
                </Col>
                <Col md="6" className="mb-4">
                    {['radio'].map((type) => (
                        <div key={`inline-${type}`} className="mb-3">
                            <Form.Check
                                inline
                                label="Yes"
                                name="is_agreement_available"
                                type={type}
                                onChange={(e) => handleFormDataChange(e)}
                                id={`inline-${type}-1`}
                                checked={FormData.is_agreement_available==1}
                            />
                            <Form.Check
                                inline
                                label="No"
                                name="is_agreement_available"
                                type={type}
                                onChange={(e) => handleFormDataChange(e)}
                                id={`inline-e${type}-2`}
                                checked={otherDetails.is_agreement_available !==1}
                            />
                        </div>
                    ))}
                </Col>
                <Col md="12" className="mb-4">
                    <div className="d-flex other_bank">
                        <p className="flex_icon"><IoIosInformationCircleOutline></IoIosInformationCircleOutline> </p>
                        <p className="text-muted">
                            Document Upload is required in case of availability of agreement
                        </p>
                    </div>
                </Col>
                <Col md="6" className="mb-4">
                    <Row>
                        <Col sm="6">
                            <Form.Label htmlFor="contract_copy">Contract Copy :</Form.Label> 
                            
                        </Col>
                        <Col sm="6">
                            <Form.Group controlId="formFile" className="mb-3 d-flex">
                                <div>
                                    <label className="input-group-btn my-0">
                                        <input className='form-control'
                                            type="file"
                                            onChange={(e) => handleFormDataChange(e, true)}
                                            accept=".csv,.pdf,.jpeg,.jpg" name="contract_copy" />
                                    </label>
                                    {otherDetails.contract_copy?(<>
                                    <br />
                                    <Link to={otherDetails.contract_copy} target="_blank">Old Contract Copy</Link>
                                    </>):""}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>

                <Col md="6" className="mb-4">
                    <Row>
                        <Col sm="6">
                            <Form.Label htmlFor="reg_cert">Firm Registration Certificate :  </Form.Label>

                        </Col>
                        <Col sm="6">
                            <Form.Group controlId="formFile" className="mb-3 d-flex">
                                <div>
                                    <label className="input-group-btn my-0">
                                        <input className='form-control' type="file"
                                            name="reg_cert"
                                            onChange={(e) => handleFormDataChange(e, true)}
                                            accept=".csv,.pdf,.jpeg,.jpg"
                                        />
                                    </label>
                                    {otherDetails.reg_cert?(<>
                                    <br />
                                    <Link to={otherDetails.reg_cert} target="_blank">Old Registration Certificate</Link>
                                    </>):""}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
                <Col md="6" className="mb-4">
                    <Row>
                        <Col sm="6">
                            <Form.Label htmlFor="pan_card">PAN Card  : </Form.Label>
                        </Col>
                        <Col sm="6">
                            <Form.Group controlId="formFile" className="mb-3 d-flex">
                                <div>
                                    <label className="input-group-btn my-0">
                                        <input className='form-control' type="file"
                                            name="pan_card"
                                            onChange={(e) => handleFormDataChange(e, true)}
                                            accept=".csv,.pdf,.jpeg,.jpg" />
                                    </label>
                                    {otherDetails.pan_card?(<>
                                    <br />
                                    <Link to={otherDetails.pan_card} target="_blank">Old pan card</Link>
                                    </>):""}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>


                <Col md="12" className="mb-4">
                    <div className="d-flex other_bank">
                        <p className="flex_icon">
                            <IoIosInformationCircleOutline/></p>
                        <p className="text-muted">
                            Upload atleast one document
                        </p>
                    </div>
                </Col>

                <Row>
                    <Col md="6" className="mb-4">
                        <Row>
                            <Col sm="6">
                                <Form.Label htmlFor="authority_letter">FC/UBS/NEFT/Authority Letter :  </Form.Label>

                            </Col>
                            <Col sm="6">
                                <Form.Group controlId="formFile" className="mb-3 d-flex">
                                    <div>
                                        <label className="input-group-btn my-0">
                                            <input className='form-control' type="file"
                                                   name="authority_letter"
                                                   onChange={(e) => handleFormDataChange(e, true)}
                                                   accept=".csv,.pdf,.jpeg,.jpg" />
                                        </label>
                                        {otherDetails.authority_letter?(<>
                                            <br />
                                            <Link to={otherDetails.authority_letter} target="_blank">Old Authority Letter</Link>
                                        </>):""}
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>

                    <Col md="6" className="mb-4">
                        <Row>
                            <Col sm="6">
                                <Form.Label htmlFor="letter_head">Invoice /Letter Head : </Form.Label>

                            </Col>
                            <Col sm="6">
                                <Form.Group controlId="formFile" className="mb-3 d-flex">
                                    <div>
                                        <label className="input-group-btn my-0">
                                            <input className='form-control' type="file"
                                                   name="letter_head"
                                                   onChange={(e) => handleFormDataChange(e, true)}
                                                   accept=".csv,.pdf,.jpeg,.jpg" />
                                        </label>
                                        {otherDetails.letter_head?(<>
                                            <br />
                                            <Link to={otherDetails.letter_head} target="_blank">Old letter head</Link>
                                        </>):""}
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Col md="6" className="mb-4">
                    <Row>
                        <Col sm="6">
                            <Form.Label htmlFor="cancel_cheque">Cancel Cheque Copy : </Form.Label>
                        </Col>
                        <Col sm="6">
                            <Form.Group controlId="formFile" className="mb-3 d-flex">
                                <div>
                                    <label className="input-group-btn my-0">
                                        <input className='form-control' type="file"
                                            name="cancel_cheque"
                                            onChange={(e) => handleFormDataChange(e, true)}
                                            accept=".csv,.pdf,.jpeg,.jpg" />
                                    </label>
                                    {otherDetails.cancel_cheque?(<>
                                    <br />
                                    <Link to={otherDetails.cancel_cheque} target="_blank">Old cancel cheque</Link>
                                    </>):""}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default OtherDetails
