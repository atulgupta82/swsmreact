import React, {useState} from 'react'
import Tools from '../../components/Tools/Tools'
import ManageDisbursment from '../../components/Disbursment/ManageDisbursment'
import ManageDisbursmentHeader from '../../components/Disbursment/ManageDisbursmentHeader'

const InvoiceList = () => {

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');


    const handleDateChange = (start, end) => {
        setFromDate(start);
        setToDate(end);

    };
    return (
        <div>
            <Tools/>
            <ManageDisbursmentHeader onDateChange={handleDateChange} startDate={fromDate} endDate={toDate} />
            <div className='scheme p-2'>
                <ManageDisbursment fromDate={fromDate} toDate={toDate}/>
            </div>
        </div>
    )
}

export default InvoiceList
