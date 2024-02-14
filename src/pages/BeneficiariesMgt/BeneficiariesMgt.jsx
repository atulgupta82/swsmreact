import React, {useState} from 'react'
import Tools from '../../components/Tools/Tools'
import {Link} from 'react-router-dom'
import ManageBeneficiary from '../../components/Beneficiary/ManageBeneficiary'
import {useSelector} from 'react-redux'
import {Tab, Tabs} from "react-bootstrap";


const BeneficiariesMgt = () => {
    const {authData} = useSelector((state) => state.authData);
    const [key, setKey] = useState('list');


    return (
        <div>
            <Tools/>
            <div className='addNewScheme'>
                <div className="add_new_user">
                    <h4>Beneficiaries</h4>
                    <div>
                        {authData.user.user_type == 'l1' ? <Link to="/add-beneficiary">
                            <button type="button" className="btn btn-primary">Add New Beneficiary</button>
                        </Link> : ""}
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
                            <Tab eventKey="list" title="Beneficiaries List" className='p-2'>
                                <ManageBeneficiary listType={key}/>
                            </Tab>
                            {authData.user.user_type != 'l1' ?
                            <Tab eventKey="actionList" title="Pending Action" className='p-2'>
                                <ManageBeneficiary listType={key}/>
                            </Tab> : ''}
                        </Tabs>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default BeneficiariesMgt
