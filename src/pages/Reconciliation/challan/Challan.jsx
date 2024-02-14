import React from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Tools from "../../../components/Tools/Tools";
import ChallanList from "../../../components/Reconciliation/Challan/ChallanList";


const Challan = () => {
    const {authData}=useSelector((state)=>state.authData);

    return (
        <div>
            <Tools/>
            <div className='addNewScheme' >
                <div className="add_new_user">
                    <h4>Challans</h4>
                    <div>
                        {authData.user.user_type==='l1'?<Link to="/add-challan">
                            <button type="button" className="btn btn-primary">Add New Challan</button>
                        </Link>:""}
                    </div>
                </div>
            </div>
            <div className='scheme p-3'>
                <ChallanList/>
            </div>
        </div>
    )
}

export default Challan
