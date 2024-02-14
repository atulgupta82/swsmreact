import { Grid } from '@mui/material'
import React from 'react'
import leftbar from '../../assets/images/leftbar.png'
import rightbar from '../../assets/images/rightbar.png'
import './DashboardBarGraph.css'
import SchemeBarGraph from './SchemeBarGraph'
import BarLineGraph from './BarLineGraph'


const DashboardBarGraph = () => {
  return (
    <div >
        <Grid container > 
            <Grid item md={6}>
                <div className='schemeBarGraphWrapper'>
                   <SchemeBarGraph/>
                </div>
            </Grid>
            <Grid item md={6}>
                <div className='schemeBarGraphWrapper'>
                    {/* <img src={rightbar} className='barGraphImg' alt="leftbar" /> */}
                    <BarLineGraph/>
                </div>
            </Grid>
        </Grid>
    </div>
  )
}

export default DashboardBarGraph
