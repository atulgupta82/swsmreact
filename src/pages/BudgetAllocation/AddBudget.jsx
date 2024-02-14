import React from 'react'
import Tools from "../../components/Tools/Tools"
import addBudgetHeadline from '../../assets/images/design/AddBudgetHeadline.png'
import AddBudgetForm from '../../components/BudgetAllocation/Schemes/AddBudgetForm'

const AddBudget = () => {
  return (
    <div>
      <Tools></Tools>
      <div className='scheme'>
        <AddBudgetForm></AddBudgetForm>
      </div>
    </div>
  )
}

export default AddBudget