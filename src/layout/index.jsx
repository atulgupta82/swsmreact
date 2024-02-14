import React from 'react'
import { Outlet } from 'react-router-dom'
import {Grid} from '@mui/material'
import Sidebar from './Sidebar/Sidebar'
import '../App.css'
const Layout = ({children}) => {
  return (
    <div className='main_page'>  
        <Grid container >
            <Grid item md={2}>
                <Sidebar/>
            </Grid>
            <Grid item md={10}>
                <Outlet></Outlet> 
                {children} 
            </Grid>
        </Grid> 
    </div>
  )
}

export default Layout