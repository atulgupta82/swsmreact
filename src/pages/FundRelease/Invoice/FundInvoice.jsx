import React, {useEffect, useState} from 'react'
import "./FundInvoice.css";
import Tools from '../../../components/Tools/Tools';
import FundReleaseHeader from './FundReleaseHeader';
import {Tab, Tabs} from 'react-bootstrap';
import InvoiceList from '../../../components/FundRelease/InvoiceList';
import PaymentInvoiceList from '../../../components/FundRelease/PaymentInvoiceList';
import {Link, useLocation, useParams} from 'react-router-dom';
import {useSelector} from "react-redux";


const FundInvoice = () => {
    const location = useLocation();
    const [selectedInvoice, setSelectednvoice] = useState([])
    const [selectedPaymentInvoice, setSelectedPaymentInvoice] = useState([])
    const [key, setKey] = useState('InvoiceList');
    const searchParams = new URLSearchParams(location.search);
    const active = searchParams.get('active');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const {authData} = useSelector((state) => state.authData);

    const handleDateChange = (start, end) => {
        setFromDate(start);
        setToDate(end);

    };

    useEffect(() => {
        if (active == 'payment-status') {
            setKey('paymentStatus');
        } else {
            setKey('InvoiceList');
        }
    }, [active])


    const download_xml_as_zip_file = () => {

        const apiURL = 'https://devapi.uatesting.in/schemes/download_xml_as_zip';

        const link = document.createElement('a');
        link.href = apiURL;
        link.target = '_blank'; // Open the API URL in a new tab/window
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    return (
        <div>
            <Tools/>
            <FundReleaseHeader selectedInvoice={selectedInvoice} setSelectednvoice={setSelectednvoice}
                               selectedPaymentInvoice={selectedPaymentInvoice} activeTab={key}
                               onDateChange={handleDateChange} startDate={fromDate} endDate={toDate}/>
            <div className='scheme p-2'>
                <div className="d-flex">
                    <button type="button" onClick={download_xml_as_zip_file}
                            className='btn btn-md btn-primary m-2'>Download
                        XML
                    </button>
                    {authData.user.user_type != 'l1' ?
                        <label className="switch">
                            <input className="switch-input" type="checkbox" checked={isChecked}
                                   onChange={handleCheckboxChange}/>
                            <span className="switch-label" data-on="All" data-off="Pending"/>
                            <span className="switch-handle"/>
                        </label> : ''
                    }

                </div>

                <div className='all_tabs'>
                    <Tabs
                        // defaultActiveKey="InvoiceList"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                    >
                        <Tab eventKey="InvoiceList" title="Invoice List" className='p-2'>
                            <InvoiceList selectedInvoice={selectedInvoice} setSelectednvoice={setSelectednvoice}
                                         fromDate={fromDate} toDate={toDate} isChecked={isChecked}/>
                        </Tab>
                        <Tab eventKey="paymentStatus" title="Payment Status" className='p-2'>
                            <PaymentInvoiceList selectedPaymentInvoice={selectedPaymentInvoice}
                                                setSelectedPaymentInvoice={setSelectedPaymentInvoice}
                                                fromDate={fromDate} toDate={toDate} isChecked={isChecked}/>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default FundInvoice
