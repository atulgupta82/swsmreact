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
import { useState,useEffect } from 'react';
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai'
import {Link, useNavigate} from 'react-router-dom'
import {useDispatch } from 'react-redux';
import { LOGIN_START,LOGIN_SUCCESS,LOGIN_FAIL } from '../../../RTK/Slices/AuthSlice';
import { login_user, login_user_via_send_otp, login_user_via_verify_otp } from '../../../helper/Api';
import { toast } from 'react-toastify';


export default function Login() {
  const [error, setError] = React.useState(null);
  const [formData,setformData]=useState({
      "email":null,
      "password":null,
      "user_type":null,
      "mobile":null,
      "otp":null
  });

  const [show_password,setShow_password]=useState(false);
  const [isDisabled,setDisabled]=useState(false);
  const [send_otp,setSend_otp]=useState(false);
  const navigate=useNavigate()
  const dispatch=useDispatch();
  const handleChange = (event) => {
    const name=event.target.name;
    const value=event.target.value;
    setformData({...formData,[name]:value});
  };

  const handleSubmit=async(e)=>{
    setDisabled(true)
    e.preventDefault();
    if(send_otp){
      await verify_otp_for_login()
    }else{
      if(formData.email && formData.password && formData.user_type){
        dispatch(LOGIN_START);
        setDisabled(true)
        const loginResponse=await login_user(formData);      
        if(loginResponse.data.status){

          // console.log(loginResponse.data);
          toast.success("Password verified successfully.",{
            position: toast.POSITION.TOP_CENTER
          });
          setformData({
            ...formData,
            "mobile":loginResponse.data.user.mobile
          })
          // setDisabled(false)
          await send_otp_for_login(loginResponse.data.user.mobile);
          // dispatch(LOGIN_SUCCESS(loginResponse.data));
          // sessionStorage.setItem("is_loggedIn", true);
          // sessionStorage.setItem("userDetails", loginResponse.data);
          // window.location.href="/";
          setDisabled(false)
        }else{
          setDisabled(false)
          dispatch(LOGIN_FAIL('Invalid username and password'))
          // setError('Invalid username and password')
          toast.error("Invalid username and password",{
            position: toast.POSITION.TOP_CENTER
          });
        }

      }else{
          toast.error("All fields Required.!",{
            position: toast.POSITION.TOP_CENTER
          });
        setDisabled(false)
      }
    }
  }

  const verify_otp_for_login=async()=>{
    if(formData.mobile && formData.otp){
      setDisabled(true)
      const loginResponse=await login_user_via_verify_otp(formData);  
      // console.log(loginResponse);return false;    
      if(loginResponse.data.status){
        toast.success(loginResponse.data.message,{
          position: toast.POSITION.TOP_CENTER
        });
        dispatch(LOGIN_SUCCESS(loginResponse.data));
        sessionStorage.setItem("is_loggedIn", true);
        sessionStorage.setItem("userDetails", loginResponse.data);
        // window.location.href="/";
        navigate('/')
        setDisabled(false)
      }else{
        toast.error(loginResponse.data.message,{
          position: toast.POSITION.TOP_CENTER
        });
        setDisabled(false)
      }

    }else{
      toast.error("All the field required",{
        position: toast.POSITION.TOP_CENTER
      });
      setDisabled(false)
    }
  }

  const send_otp_for_login=async(mobile)=>{
    // console.log(formData);return false;
    if(mobile && formData.user_type){
      let post_data={
        "mobile":mobile,
        "user_type":formData.user_type
      };
      setDisabled(true)
      const loginResponse=await login_user_via_send_otp(post_data);  
       // console.log('loginResponse', loginResponse);
      if(loginResponse.data.status){
        setSend_otp(true)
        setDisabled(false)
        toast.success(loginResponse.data.message,{
          position: toast.POSITION.TOP_CENTER
        });
      }else{
        setDisabled(false)
        toast.error(loginResponse.data.message,{
          position: toast.POSITION.TOP_CENTER
        });
      }

    }else{
      toast.error("All the field required",{
        position: toast.POSITION.TOP_CENTER
      });
      setDisabled(false)
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
              Login
            </Typography>             */}
            <Typography component="p" variant="p" sx={{
                color: "red",
                fontWeight: "bold",
                paddingLeft: "10px",
                paddingTop:"10px",
                }}>
                  {error}
            </Typography>
            {send_otp?<Typography component="p" variant="p" sx={{
                color: "blue",
                fontWeight: "bold",
                paddingLeft: "10px",
                paddingTop:"10px",
                cursor:"pointer"
                }} onClick={()=>setSend_otp(false)}>
                  Edit Email ?
            </Typography>:""}
            {
              send_otp?
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
              <>
                <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleChange}
                value={formData.email}
              />
                <span className='password_wrapper'>
                  <TextField
                    onChange={handleChange}
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={show_password?"text":"password"}
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                  />
                  <span className='view_password' onClick={()=>setShow_password(!show_password)}>{show_password?<AiFillEye/>:<AiFillEyeInvisible/>}</span>
                </span>
              </>
            }
                        
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{ mt: 3, mb: 2 }}
            >
              {send_otp?"VERIFY OTP":"Log In"}              
            </Button>
            {!send_otp ? (<>
              <Grid container>
                <Grid item xs>
                  <Link to="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                {/* <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid> */}
              </Grid>
              <Box sx={{ display: 'flex', alignItems:'center', gap: 2 }}>
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
            </>):""}
            
          </Box>
         <small> <b className='text-light'>Copyright &#169; 2023 TM, New Delhi. All Rights Reserved.</b></small>
        </Box>        
      </div>
      </Grid>
      </Grid>
   
  );
}
