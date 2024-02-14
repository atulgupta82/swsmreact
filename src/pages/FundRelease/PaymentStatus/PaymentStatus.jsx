import React from 'react'
import Tools from '../../../components/Tools/Tools'
import paymentStatusHeadline from '../../../assets/images/design/paymentStatusHeadline.png'
import paymentStatusList from '../../../assets/images/design/paymentStatusList.png'

const PaymentStatus = () => {
  return (
    <div>
        <Tools></Tools>
        <div className='addNewScheme' >
            <img src={paymentStatusHeadline} alt="paymentStatusHeadline" />
        </div>
        <div className='scheme'>
            <img src={paymentStatusList} alt="paymentStatusList" />
        </div>
    </div>
  )
}

export default PaymentStatus