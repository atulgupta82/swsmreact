import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Radio } from '@mui/material';
import LoginBg from '../../../assets/images/login_bg.png'
import login_logo from '../../../assets/images/login_logo.png'
import login_logo2 from '../../../assets/images/login_logo2.png'
import './Login.css';
import { useState } from 'react';
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai'

import {useDispatch } from 'react-redux';
import { LOGIN_START,LOGIN_SUCCESS,LOGIN_FAIL } from '../../../RTK/Slices/AuthSlice';
import { login_user_via_send_otp,login_user_via_verify_otp } from '../../../helper/Api';
import { toast } from 'react-toastify';

import {Link} from 'react-router-dom'

export default function Login() {
  const [error, setError] = React.useState(null);
  const [formData,setformData]=useState({
      "mobile":null,
      "user_type":null,
      'otp':''
  });

  const [send_otp,setSend_otp]=useState(false);

  const dispatch=useDispatch();
  const handleChange = (event) => {
    const name=event.target.name;
    const value=event.target.value;
    setformData({...formData,[name]:value});
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(send_otp){
      //verify otp
      if(formData.mobile && formData.otp){
        const loginResponse=await login_user_via_verify_otp(formData);  
        // console.log(loginResponse);return false;    
        if(loginResponse.data.status){
          toast.success(loginResponse.data.message,{
            position: toast.POSITION.TOP_CENTER
          });
          dispatch(LOGIN_SUCCESS(loginResponse.data));
          sessionStorage.setItem("is_loggedIn", true);
          sessionStorage.setItem("userDetails", loginResponse.data);
          window.location.href="/";
        }else{
          toast.error(loginResponse.data.message,{
            position: toast.POSITION.TOP_CENTER
          });
        }
      }else{
        toast.error("All the field required",{
          position: toast.POSITION.TOP_CENTER
        });
      }
    }else{
      //send otp
      if(formData.mobile && formData.user_type){
        const loginResponse=await login_user_via_send_otp(formData);  
        // console.log(loginResponse);return false;    
        if(loginResponse.data.status){
          setSend_otp(true)
          toast.success(loginResponse.data.message,{
            position: toast.POSITION.TOP_CENTER
          });
          
        }else{
          toast.error(loginResponse.data.message,{
            position: toast.POSITION.TOP_CENTER
          });
        }
      }else{
        toast.error("All the field required",{
          position: toast.POSITION.TOP_CENTER
        });
      }
    }
  }

  return (
    <Grid container component="div" sx={{ height: '100vh' }}>
    <CssBaseline />
    
    <Grid item xs={12} sm={12} md={12} component='div' className="login_bg_wrapper">
      <div component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent:"start",
            gap:"2rem"
          }}
        > 
          <img src={login_logo2} alt="login_logo" className='login_logo' />
          <Box component="form"  noValidate sx={{ mt: 1 }} onSubmit={handleSubmit} className='form_box'>
            {/* <Typography component="h1" variant="h5">
              Enter Mobile Number to get OTP.
            </Typography>             */}
            <Typography component="p" variant="p" sx={{
                color: "red",
                fontWeight: "bold",
                paddingLeft: "10px",
                paddingTop:"10px",
                }}>
                  {error}
            </Typography>
            {send_otp ? 
              <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="OTP"
              type="number"
              name="otp"
              autoComplete="otp"
              autoFocus
              onChange={handleChange}
              value={formData.otp}
            />
            :
            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              id="Mobile"
              label="Mobile"
              name="mobile"
              autoComplete="mobile"
              autoFocus
              onChange={handleChange}
              value={formData.mobile}
            />
            
            }        
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {send_otp?"VERIFY OTP":"GENERATE OTP"}
            </Button>
            <Grid container>
              {/* <Grid item xs >
                <Link to="/login" variant="body2">
                  Return to Login
                </Link>
              </Grid> */}
              {/* <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid> */}
            </Grid>
            <Box sx={{ display: send_otp?'none':'flex', alignItems:'center', gap: 2 }}>
              <Radio
                checked={formData.user_type === 'l1'}
                onChange={handleChange}
                value="l1"
                name="user_type"
                
              >
              </Radio> L1
              <Radio
                checked={formData.user_type === 'l2'}
                onChange={handleChange}
                value="l2"
                name="user_type"
                label="Outlined"
                
              />
              L2
              <Radio
                checked={formData.user_type === 'l3'}
                onChange={handleChange}
                value="l3"
                name="user_type"
                label="Outlined"
                
              />
              L3
            </Box>
          </Box>
         <small> <b className='text-light'>Copyright &#169; 2023 TM, New Delhi. All Rights Reserved.</b></small>
        </Box>        
      </div>
      </Grid>
      </Grid>
   
  );
}