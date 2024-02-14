import React, { useEffect, useState } from 'react'
import {Form,Col, Row } from 'react-bootstrap'
import { IoIosInformationCircleOutline } from 'react-icons/io'
import { get_beneficiary_status, get_districts_list, get_states } from '../../../helper/Api';


const PartnerDetails = ({partnerDetails,setPartnerDetails}) => {

    const [states_list,setStates_list]=useState([]);
    const [b_district_list,setB_District_list]=useState([]);
    const [district_list,setDistrict_list]=useState([]);
    const [status_list,setStatus_list]=useState([]);

    
    useEffect(() => {
        get_status();
    }, []);

    useEffect(() => {
        get_districts();    
    }, [partnerDetails.p_state_id]);
    
    const get_districts=async()=>{        
        try {
            const {data}=await get_districts_list(partnerDetails.p_state_id);
            if(data.status){
                setDistrict_list(data.list);
            }else{
                setDistrict_list([])
            } 
        } catch (error) {
            setDistrict_list([])
        }
    }

    const get_status=async()=>{
        try {
            const {data}=await get_beneficiary_status();
            if(data.status){
                setStatus_list(data.list);
            }else{
                setStatus_list([])
            } 
            const states_response=await get_states();
            if(states_response.data.status){
                setStates_list(states_response.data.list);
            }else{
                setStates_list([])
            } 
        } catch (error) {
            setStatus_list([])
        }
    }

    const handleFormDataChange=(e,is_file=false)=>{
        const name=e.target.name;
        let value=null;
        if(is_file){
            value=e.target.files;
        }else{
            value=e.target.value;
        }
        setPartnerDetails({...partnerDetails,[name]:value})
    }
    return (
        <div>
            <Row>
                <Col md="6" className="mb-4">
                    <Row>
                        <Col sm="6">
                            <Form.Label htmlFor="p_name">Name  </Form.Label>
                        </Col>
                        <Col sm="6">
                            <Form.Control
                                type="text"
                                id="p_name"
                                name="p_name"
                                value={partnerDetails.p_name}
                                onChange={(e) => handleFormDataChange(e)}
                                placeholder='Enter Name'
                                aria-describedby="" />
                        </Col>
                    </Row>
                </Col>
                <Col md="6" className="mb-4">
                    <Row>
                        <Col sm="6">
                            <Form.Label htmlFor="p_pan_no">PAN  :</Form.Label>
                        </Col>
                        <Col sm="6">
                            <Form.Control
                                type="text"
                                id="p_pan_no"
                                name="p_pan_no"
                                value={partnerDetails.p_pan_no}
                                onChange={(e) => handleFormDataChange(e)}
                                placeholder='Enter PAN Number '
                                aria-describedby="" />
                        </Col>
                    </Row>
                </Col>

                <Col md="6" className="mb-4">
                    <Row>
                        <Col sm="6">
                            <Form.Label htmlFor="p_mobile">Enter Phone Number  </Form.Label>
                        </Col>
                        <Col sm="6">
                            <Form.Control
                                type="number"
                                id="p_mobile"
                                name="p_mobile"
                                value={partnerDetails.p_mobile}
                                onChange={(e) => handleFormDataChange(e)}
                                placeholder='Enter Phone Number '
                                aria-describedby="" />
                        </Col>
                    </Row>
                </Col>
                <Col md="6" className="mb-4">
                    <Row>
                        <Col sm="6">
                            <Form.Label htmlFor="p_email">Email </Form.Label>
                        </Col>
                        <Col sm="6">
                            <Form.Control
                                type="email"
                                id="p_email"
                                name="p_email"
                                value={partnerDetails.p_email}
                                onChange={(e) => handleFormDataChange(e)}
                                placeholder='Enter Email'
                                aria-describedby="" />
                        </Col>
                    </Row>
                </Col>

                <Col md="12" className="mb-4">
                    <Row>
                        <Col sm="3">
                            <Form.Label htmlFor="p_address_1">Address </Form.Label>

                        </Col>
                        <Col sm="9">
                            <Form.Control
                                type="text"
                                id="p_address_1"
                                name="p_address_1"
                                value={partnerDetails.p_address_1}
                                onChange={(e) => handleFormDataChange(e)}
                                placeholder='Address L1'
                                aria-describedby="" />
                        </Col>
                    </Row>
                </Col>
                <Col md="12" className="mb-4">
                    <Row>
                        <Col sm="3"></Col>
                        <Col sm="9">
                            <Form.Control
                                type="text"
                                id="p_address_2"
                                name="p_address_2"
                                value={partnerDetails.p_address_2}
                                onChange={(e) => handleFormDataChange(e)}
                                placeholder='Address L2'
                                aria-describedby="" />
                        </Col>
                    </Row>
                </Col>
                <Col md="6" className="mb-4">
                    <Row>
                        <Col sm="6">
                            <Form.Label htmlFor="p_state_id">State :</Form.Label>
                        </Col>
                        <Col sm="6">
                            <Form.Select aria-label="p_state_id" id="p_state_id" name="p_state_id"
                                onChange={(e) => handleFormDataChange(e)}
                            >
                                <option value=''>--Select State--</option>
                                {states_list.map((state) => {
                                    return (<option value={state.id} 
                                    key={state.id}
                                    selected={state.id===partnerDetails.p_state_id}
                                    >{state.name}</option>)
                                })}
                            </Form.Select>
                        </Col>
                    </Row>
                </Col>
                <Col md="6" className="mb-4">
                    <Row>
                        <Col sm="6">
                            <Form.Label htmlFor="p_district">District  </Form.Label>

                        </Col>
                        <Col sm="6">
                            <Form.Select aria-label="District" id="p_district" name="p_district"
                                onChange={(e) => handleFormDataChange(e)}
                            >
                                <option value=''>--Select District--</option>
                                {district_list.map((district) => {
                                    return (<option value={district.id}
                                    key={district.id}
                                    selected={district.id==partnerDetails.p_district}
                                    >{district.city}</option>)
                                })}
                            </Form.Select>
                        </Col>
                    </Row>
                </Col>

                <Col md="6" className="mb-4">
                    <Row>
                        <Col sm="6">
                            <Form.Label htmlFor="p_pincode">PIN Code </Form.Label>

                        </Col>
                        <Col sm="6">
                            <Form.Control
                                type="number"
                                name="p_pincode"
                                id="p_pincode"
                                value={partnerDetails.p_pincode}
                                onChange={(e) => handleFormDataChange(e)}
                                placeholder='PIN Code'
                                aria-describedby="" />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default PartnerDetails