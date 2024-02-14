import React, { useState } from 'react'
import './AddUser.css';
import finger_print_img from '../../assets/images/finger_print.png';
import { Alert, Form } from 'react-bootstrap';
import {useDispatch, useSelector } from 'react-redux';
import { UPDATE_USER_START,UPDATE_USER_SUCCESS,UPDATE_USER_FAIL } from '../../RTK/Slices/UserSlice';
import { update_user_by_id,get_user_by_id } from '../../helper/Api';
import { useNavigate,useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const EditUserForm = () => {
  const {id} =useParams();
  const {authData}=useSelector((state)=>state.authData);
  const {loading}=useSelector((state)=>state.user);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [formData,setFormData]=useState({
    code:null,
    user_name:null,
    designation:null,
    user_type:null,
    mobile:null,
    email:null,
    password:null,
    added_by:authData.user.id
  });

  const [error,setError]=useState({
    status:false,
    msg:''
  });

  useEffect(() => {
    get_user_details();
  }, [id])

  const get_user_details=async()=>{
    try {
      const {data}=await get_user_by_id(id);
      const user=data.users[0];
      setFormData({
        code:user.code,
        user_name:user.user_name,
        designation:user.designation,
        user_type:user.user_type,
        mobile:user.mobile,
        email:user.email,
        password:'',
        added_by:authData.user.id
      })
    } catch (error) {
     // console.log(error);
    }
  }
  

  const handleFormDataChange=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    setFormData({...formData,[name]:value})
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      dispatch(UPDATE_USER_START());
      const {data}=await update_user_by_id(formData,id);
      
      if(data.status){
        dispatch(UPDATE_USER_SUCCESS(data.users[0]));
        toast.success(data.message,{
          position: toast.POSITION.TOP_CENTER
        });
        navigate('/users');
      }else{
        toast.error(data.message,{
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(UPDATE_USER_FAIL(data.message));
      }
    } catch (error) {
      // console.log(error);
      toast.error("error getting while update user",{
        position: toast.POSITION.TOP_CENTER
      });
      dispatch(UPDATE_USER_FAIL('error getting while update user'));
    }
  }




  return (
    <div>
      <div className="p-3">
        <div className="row">
          {error.status && (
            <Alert variant="danger" onClose={() => setError({status:false,msg:''})} dismissible>
              {error.msg}
            </Alert>
          )}
        
          <Form onSubmit={handleSubmit}>
          <div className="col-md-12">
            <div className="add_new_user">
              <p>UPDATE USER</p>
              <div>
                <button type="button" className="btn btn-light">Cancel</button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'loading':"UPDATE USER"}</button>
              </div>
            </div>
            <div className="card p-3 mt-3">
              <div className="row">
                <div className="col-md-12 ">
                  <div className="form-group row p-2">
                    <label for="inputEmployee" className="col-sm-4 col-form-label">Employee
                      Code<span className="text-danger">*</span> :</label>
                    <div className="col-sm-8">
                      <input type="text" className="form-control" id="inputEmployee"
                        name="code"
                        value={formData.code}
                        onChange={handleFormDataChange}
                        required
                        placeholder="Enter Employee Code"/>
                    </div>
                  </div>

                  <div className="form-group row p-2">
                    <label for="inputUserid" className="col-sm-4 col-form-label">User Name<span
                      className="text-danger">*</span> :</label>
                    <div className="col-sm-8">
                      <input type="text" className="form-control"
                      id="inputUserid"
                      name="user_name"
                      required
                      value={formData.user_name}
                      onChange={handleFormDataChange}
                      placeholder="Enter User Name"/>
                    </div>
                  </div>

                  <div className="form-group row p-2">
                    <label for="inputDesignation"
                      className="col-sm-4 col-form-label">Designation<span
                        className="text-danger">*</span> :</label>
                    <div className="col-sm-8">
                      <input type="text" className="form-control"
                      id="inputDesignation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleFormDataChange}
                      required
                      placeholder="Enter Designation"/>
                    </div>
                  </div>

                  <div className="form-group row p-2">
                    <label for="inputLevel" className="col-sm-4 col-form-label">Level
                      <span className="text-danger">*</span> :</label>
                    <div className="col-sm-8">
                      <select className="form-control " id="inputLevel"
                      name="user_type"
                      value={formData.user_type}
                      onChange={handleFormDataChange}
                      required
                      >
                        <option value="">Select Level</option>
                        <option value="l1">l1</option>
                        <option value="l2">l2</option>
                        <option value="l3">l3</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group row p-2">
                    <label for="inputMobile" className="col-sm-4 col-form-label">Mobile Number<span
                      className="text-danger">*</span> :</label>
                    <div className="col-sm-8">
                      <input type="text" className="form-control"
                      id="inputMobile"
                      pattern="[6789][0-9]{9}"
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleFormDataChange}
                      placeholder="Enter Mobile Number"/>
                    </div>
                  </div>
                  <div className="form-group row p-2">
                    <label for="inputEmail" className="col-sm-4 col-form-label">Email ID<span
                      className="text-danger">*</span> :</label>
                    <div className="col-sm-8">
                      <input type="email" className="form-control"
                      id="inputEmail"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleFormDataChange}
                      placeholder="Enter Email ID"/>
                    </div>
                  </div>
                  <div className="form-group row p-2">
                    <label for="inputPassword" className="col-sm-4 col-form-label">Password</label>
                    <div className="col-sm-8">
                        <div className="input-group" id="show_hide_password">
                          <input className="form-control input_width"
                          type="password"
                          name="password"                          
                          value={formData.password}
                          onChange={handleFormDataChange}
                          placeholder="Password"/>
                            <span className="input-group-addon">
                              <a href=""><i className="fa fa-eye-slash"
                                aria-hidden="true"></i></a>
                            </span>
                        </div>
                    </div>
                  </div>
                </div>
                {/*<div className="col-md-4">
                  <div className="fingrt_print_backgroung">
                    <p className="pt-4 pl-2 text-dark">Biometric Authentication <span
                      className="text-danger">*</span>
                    </p>
                    <p className="pl-4"><span><i className="fa fa-exclamation-circle"></i></span>
                      <small className="text-muted">Place you Finger on Biometric</small>
                    </p>
                    <div className="biometric_image text-center">
                      <img src={finger_print_img} className="img-fluid" alt="Responsive image" />
                      <p className="text-success pt-2"><b>Biometric Authentication Successful</b></p>
                    </div>
                  </div>
                </div>*/}
              </div>
            </div>
          </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default EditUserForm
