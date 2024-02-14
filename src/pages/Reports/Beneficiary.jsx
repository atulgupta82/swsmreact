import React from 'react'
import {useSelector} from 'react-redux';
import Tools from "../../components/Tools/Tools";
import {BeneficiaryReportList} from "../../components/Reports/BeneficiaryList";


const BeneficiaryReport = () => {
    const {authData} = useSelector((state) => state.authData);

    return (
        <div>
            <Tools/>
            <div className='addNewScheme'>
                <div className="add_new_user">
                    <h4>Beneficiary</h4>
                </div>
            </div>
            <div className='scheme p-3'>
                <BeneficiaryReportList/>
            </div>
        </div>
    )
}

export default BeneficiaryReport
