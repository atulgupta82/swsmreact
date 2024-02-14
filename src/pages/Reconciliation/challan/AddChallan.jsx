import React from 'react'
import Tools from "../../../components/Tools/Tools";
import AddChallanForm from "../../../components/Reconciliation/Challan/AddChallanForm";


const AddChallan = () => {
    return (
        <div>
            <Tools/>
            <div className='scheme'>
                <AddChallanForm/>
            </div>
        </div>
    )
}

export default AddChallan
