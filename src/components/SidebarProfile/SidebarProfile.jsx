import React, { useState } from 'react'
import './SidebarProfile.css';
import {AccountCircle, ArrowDropDown, ArrowDropUp, Inbox, Logout} from '@mui/icons-material';
import { Avatar, Divider, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import logo_circle from '../../assets/images/logo_circle.png';

const SidebarProfile = () => {
  const [showProfile,setShowProfile]=useState(false);
  const {authData}=useSelector((state)=>state.authData);
  const navigate=useNavigate();
  const handleLogout=()=>{
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login")
  }
  return (
    <>
     
    <div className='logout_wrapper'>
       <ListItem alignItems="center" sx={{cursor:"pointer",backgroundColor:"#f9f9f9",borderRadius:"10px"}} onClick={()=>setShowProfile(!showProfile)}>
        <ListItemAvatar>
          {/* <Avatar alt="Cindy Baker" src={logo_circle} /> */}
        </ListItemAvatar>
        <ListItemText
          primary={            
            <Typography
                sx={{ display: 'inline',fontWeight:"bold",fontSize:"13px" }}
                component="span"
                variant="span"
                color="text.primary"
              >
               {authData.user.user_name}
              </Typography>
          }
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="small"
                variant="small"
                color="text.primary"
              >
                @{authData.user.user_name}
              </Typography>              
            </React.Fragment>
          }
        />
        <div onClick={()=>setShowProfile(!showProfile)}>
          {showProfile?<ArrowDropUp/>:<ArrowDropDown/>}
        </div>
      </ListItem>
      {showProfile?
      (
        <>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"      
          open={showProfile} 
          onClose={e=>setShowProfile(false)}       
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem ><IconButton><AccountCircle/></IconButton> View Profile</MenuItem>
          <MenuItem onClick={handleLogout}><IconButton><Logout/></IconButton> Logout</MenuItem>
        </Menu>
        </>
      ):''
    }
     
      {/* <Logout></Logout> */}
    </div>
    </>
  )
}

export default SidebarProfile