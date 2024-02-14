import React from 'react'
import './DashboardBox.css';
import {PiAlarmBold} from 'react-icons/pi'
const GridBox = ({icon,amount,title,caption,box_bg,icon_bg}) => {
  return (
    <div className='eac_grid' style={{backgroundColor:box_bg}}>
        <div className='amount_icon_wrapper'> 
            <div className='grid_icon' style={{backgroundColor:icon_bg}}>
                <span>{icon}</span>
            </div>
            <span className='amountText'>{amount}</span>
        </div>
        <span className='grid_title'>{title}</span>
        <span className='grid_caption'>{caption}</span>
    </div>
  )
}

export default GridBox