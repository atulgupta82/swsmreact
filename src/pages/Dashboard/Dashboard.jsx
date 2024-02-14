import React from 'react'
import Tools from '../../components/Tools/Tools'
import BudgetAnalysis from '../../components/BudgetAnalysis/BudgetAnalysis'
import DashboardBox from '../../components/DashboardBox/DashboardBox'
import DashboardBarGraph from '../../components/DashboardBarGraph/DashboardBarGraph'

const Dashboard = () => {
  return (
    <div>
      <Tools/>
      <BudgetAnalysis/>
      <DashboardBox/>
      <DashboardBarGraph/>
    </div>
  )
}

export default Dashboard
