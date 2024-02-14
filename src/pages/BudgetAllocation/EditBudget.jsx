import React from 'react'
import Tools from "../../components/Tools/Tools"
import EditBudgetForm from '../../components/BudgetAllocation/Schemes/EditBudgetForm'

const EditBudget = () => {
  return (
    <div>
      <Tools></Tools>
      <div className='scheme'>
        <EditBudgetForm></EditBudgetForm>
      </div>
    </div>
  )
}

export default EditBudget