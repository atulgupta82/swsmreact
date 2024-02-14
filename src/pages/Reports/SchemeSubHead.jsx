import React, {useState} from 'react'
import Tools from "../../components/Tools/Tools";
import {SchemeSubHeadReportList} from "../../components/Reports/SchemSubHeadList";
import ManageDisbursmentHeader from "../../components/Disbursment/ManageDisbursmentHeader";


const SchemeSubHeadReport = () => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');


    const handleDateChange = (start, end) => {
        setFromDate(start);
        setToDate(end);

    };
    return (
        <div>
            <Tools/>
            <div className='addNewScheme'>
                <div className="add_new_user">
                    <h4>Scheme Sub Head</h4>
                </div>
            </div>
            {/*<ManageDisbursmentHeader onDateChange={handleDateChange} startDate={fromDate} endDate={toDate} type={'Scheme Sub Head'}/>*/}
            <div className='scheme p-3'>
                <SchemeSubHeadReportList/>
            </div>
        </div>
    )
}

export default SchemeSubHeadReport
