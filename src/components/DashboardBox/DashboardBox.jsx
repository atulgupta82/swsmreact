import React, { useEffect, useState } from 'react'
import './DashboardBox.css'

import GridBox from './GridBox'
import {PiAlarmBold,PiNotepadFill} from 'react-icons/pi'
import {BiBookmarkAltMinus} from 'react-icons/bi'
// import {IoCalendarClearOutline} from 'react-icons/io5'
import {CgCalendar} from 'react-icons/cg'
import { get_dashboard_data } from '../../helper/Api'
import {AddCommasToAmount} from '../../helper/Utils'
import InterestFromBankBox from './InterestFromBankBox'


const DashboardBox = () => {
  const [data,setData]=useState({});

  useEffect(() => {
    fetch_dashboard_data();
  }, []);
  const fetch_dashboard_data=async()=>{
    try {
      const {data}=await get_dashboard_data();
      if(data.status){
        setData(data);
      }else{
        setData({})
      }
    } catch (error) {
      // console.log(error)
      setData({})
    }
  }
  return (
    <div className="dashboardBox">
        <GridBox caption="+8% from last month" icon={<PiAlarmBold/>} title={"Provisioned Budget"} amount={AddCommasToAmount(data.total_provisional_budget)} />
        <GridBox caption="+8% from last month" icon={<PiAlarmBold/>} title={"Released Budget"} amount={AddCommasToAmount(data.total_budget)} />
        <GridBox caption="5% from last month" icon={<PiNotepadFill/>} title={"Utilized Budget"} amount={AddCommasToAmount(data.utilised_budget)} box_bg={'#DAFBEE'} icon_bg="#5CBA96"/>
        <GridBox caption="+2.5% from last month" icon={<BiBookmarkAltMinus/>} title={"Payable Expenses"} amount={AddCommasToAmount(data.payable_expanses)} box_bg={'#FFE7E5'} icon_bg="#EC8D87"/>
        <GridBox caption="+1.5% from last month" icon={<CgCalendar/>} title={"Balance Budget"} amount={AddCommasToAmount(data.balance)} box_bg={'#FFF4DE'} icon_bg="#ECBA5D"/>
        <InterestFromBankBox/>
    </div>
  )
}

export default DashboardBox
