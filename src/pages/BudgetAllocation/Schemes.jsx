import React, {useState} from 'react'
import Tools from '../../components/Tools/Tools'
import './Schemes.css';
import { SchemesList } from '../../components/BudgetAllocation/Schemes/SchemesList';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {Tab, Tabs} from "react-bootstrap";

const Schemes = () => {
    const {authData} = useSelector((state) => state.authData);
    const [key, setKey] = useState('list');

  return (
    <div>
        <Tools></Tools>
        <div className='addNewScheme' >
            <div className="add_new_user">
              <h4>Schemes</h4>
              <div>
                {authData.user.user_type=='l1'?<Link to="/add-scheme">
                <button type="button" className="btn btn-primary">Add New Scheme</button>
              </Link>:""}              
              </div>
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
                        <Tab eventKey="list" title="Schemes List" className='p-2'>
                            <SchemesList listType={key}/>
                        </Tab>
                        {authData.user.user_type != 'l1' ?
                            <Tab eventKey="actionList" title="Pending Action" className='p-2'>
                                <SchemesList listType={key}/>
                            </Tab> : ''}
                    </Tabs>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Schemes
