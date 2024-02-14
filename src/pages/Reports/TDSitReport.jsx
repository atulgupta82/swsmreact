import React from 'react'
import {useSelector} from 'react-redux';
import Tools from "../../components/Tools/Tools";
import TDSReportList from "../../components/Reports/TDSReportList";


const TDSitReport = () => {
    const {authData} = useSelector((state) => state.authData);

    return (
        <div>
            <Tools/>
            <div className='addNewScheme'>
                <div className="add_new_user">
                    <h4>TDS-IT</h4>
                </div>
            </div>
            <div className='scheme p-3'>
                <TDSReportList/>
            </div>
        </div>
    )
}

export default TDSitReport
