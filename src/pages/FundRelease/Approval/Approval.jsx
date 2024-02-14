import React, { useState } from 'react'
import Tools from '../../../components/Tools/Tools'
import ProceedForApproval from '../../../components/ProceedForApproval/ProceedForApproval'
import ProceedForApprovalHeader from '../../../components/ProceedForApproval/ProceedForApprovalHeader'
import { useLocation } from 'react-router-dom'
import { Accordion } from 'react-bootstrap'


const Approval = () => {
  let { state } = useLocation();
  const [data,setData]=useState(state && state.data ? state.data:[]);

  return (
    <div>
        <Tools/>
        <ProceedForApprovalHeader/>   
        <div className='scheme p-2'>
        <Accordion defaultActiveKey="approval_invoice_0" flush>
          {
            data.length>0 && data.map((invoice,i)=>{
              return (                
                <Accordion.Item eventKey={"approval_invoice_"+i}>
                  <Accordion.Header>INVOICE- {i+1}</Accordion.Header>
                    <Accordion.Body>
                      <ProceedForApproval invoice={invoice} setInvoices={setData} index={i} />  
                    </Accordion.Body>
                </Accordion.Item>
              );
            })
          }
          </Accordion>
          
        </div>
    </div>
  )
}

export default Approval
