import React, {useState} from 'react'
import Tools from '../../components/Tools/Tools'
import './Schemes.css';
import BudgetList from '../../components/BudgetAllocation/Schemes/BudgetList';
import {Tab, Tabs} from "react-bootstrap";
import {useSelector} from "react-redux";


const Budgets = () => {
    const {authData} = useSelector((state) => state.authData);
    const [key, setKey] = useState('list');
  return (
    <div>
        <Tools/>
        <div className='addNewScheme' >
            <div className="add_new_user">
              <h4>Budgets</h4>              
            </div>
        </div>
        <div className='scheme p-3'>
            <div className='scheme p-2'>
                <div className='all_tabs'>
                    <Tabs
                        // defaultActiveKey="InvoiceList"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                    >
                        <Tab eventKey="list" title="Budgets List" className='p-2'>
                            <BudgetList listType={key}/>
                        </Tab>
                        {authData.user.user_type != 'l1' ?
                            <Tab eventKey="actionList" title="Pending Action" className='p-2'>
                                <BudgetList listType={key}/>
                            </Tab> : ''}
                    </Tabs>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Budgets
