import React from 'react'
import Tools from '../../../components/Tools/Tools';
import EditInvoice from '../../../components/AddVoucher/EditInvoice';

const UpdateInvoice = () => {
  return (
    <div>
        <Tools></Tools>
        <div className='scheme p-2'>
          <EditInvoice></EditInvoice>
        </div>
    </div>
  )
}

export default UpdateInvoice