import React from 'react'
import Tools from '../../components/Tools/Tools'
import PaymentReportHeadline from '../../assets/images/design/PaymentReportHeadline.png'
import PaymentReportList from '../../assets/images/design/paymentReportList.png'
import {Button} from "@mui/material";
import TreasuryReport from '../../Data/TreasuryReport.xlsx'


const PaymentReport = () => {
    const handleTreasuryReport=()=>{        
        var link = document.createElement('a');
        link.href = TreasuryReport;
        link.download = 'TreasuryReport.xlsx';
        link.click();
    }
  return (
    <div>
        <Tools></Tools>
        <div className='addNewScheme' >
            <img src={PaymentReportHeadline} alt="paymentForApprovalHeadline" />
        </div>
        <div className='scheme'>
            <img src={PaymentReportList} alt="paymentForApproval" />
        </div>
        <div className="text-center">
            <Button variant="contained" style={{
                margin:"10px 0px"
            }} onClick={handleTreasuryReport}> TREASURY REPORT </Button>
        </div>
    </div>
  )
}

export default PaymentReport