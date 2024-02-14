import React from 'react'
import Tools from '../../components/Tools/Tools'
import AddSchemeForm from '../../components/BudgetAllocation/Schemes/AddSchemeForm'


const AddNewScheme = () => {
  return (
    <div>
        <Tools></Tools>
        <div className='scheme'>
            <AddSchemeForm></AddSchemeForm>
        </div>
    </div>
  )
}

export default AddNewScheme