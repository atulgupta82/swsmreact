import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Tools from "../../../components/Tools/Tools";
import TDSitList from "../../../components/Reconciliation/TDSit/TDSitList";
import ManageDisbursmentHeader from "../../../components/Disbursment/ManageDisbursmentHeader";


const TDSit = () => {
    const {authData}=useSelector((state)=>state.authData);
    const [selectedTDS,setSelectednvoice]=useState([])
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');


    const handleDateChange = (start, end) => {
        setFromDate(start);
        setToDate(end);
        console.log('dtesss', start, end)
    };

    return (
        <div>
            <Tools/>
            <div className='addNewScheme' >
                <div className="add_new_user">
                    {/*<h4>TDS-IT</h4>*/}
                    <ManageDisbursmentHeader onDateChange={handleDateChange} startDate={fromDate} endDate={toDate} type={'TDS-IT'} />
                    <div>
                        <>
                            {selectedTDS.length>0 ? (
                                <Link to="/add-tds-it" state={{data: selectedTDS }}>
                                    <button type="button" className="btn btn-primary">Add Challan</button>
                                </Link>
                            ):(
                                <button type="button" disabled={true} className="btn btn-primary">Add Challan</button>
                            )}
                        </>
                    </div>
                </div>
            </div>
            <div className='scheme p-3'>
                <TDSitList selectedInvoice={selectedTDS} setSelectednvoice={setSelectednvoice} fromDate={fromDate} toDate={toDate}/>
            </div>
        </div>
    )
}

export default TDSit
