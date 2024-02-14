import React from 'react'
import Tools from '../../components/Tools/Tools'
import EditSchemeForm from '../../components/BudgetAllocation/Schemes/EditSchemeForm'


const EditScheme = () => {
  return (
    <div>
        <Tools></Tools>
        <div className='scheme'>
            <EditSchemeForm></EditSchemeForm>
        </div>
    </div>
  )
}

export default EditScheme