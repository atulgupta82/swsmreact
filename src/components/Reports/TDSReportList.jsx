import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux';
import DataTable from 'react-data-table-component';
import {useLocation} from "react-router-dom";
import {getTDSReports} from "../../helper/Api";
import {AddCommasToAmount} from "../../helper/Utils";
import {Col, Form, Row} from "react-bootstrap";

const TDSReportList = () => {
    const {authData} = useSelector((state) => state.authData);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    let {state} = useLocation();
    const [data, setData] = useState(state && state.data ? state.data : []);
    const [vendor, setVendorData] = useState('');

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');


    const customStyles = {
        headCells: {
            style: {
                fontWeight: "bold",
                fontSize: "14px"
            },
        },
    };

    const columns = [
        {
            name: 'Voucher No',
            selector: (row) => <b>{row.voucher_no}</b>,
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Voucher\n' +
                'Date',
            selector: (row) => <b>{row.voucher_date}</b>,
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Beneficiary\n' +
                'Name',
            selector: (row) => <b>{row.company_name || ''}</b>,
            sortable: true,
            wrap: true,
            width: "200px"
        },
        {
            name: 'INVOICE\n' +
                'AMOUNT',
            selector: (row) => <b>{row.payable_amount || ''}</b>,
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Taxable\n' +
                'Amount',
            selector: (row) => <b>{row.taxable_amount || ''}</b>,
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'TDS IT',
            selector: (row) => <b>{row?.tds_it_amount}</b>,
            sortable: true,
            width: "150px",
            right: false
        },{
            name: 'Code',
            selector: (row) => <b>{row?.code}</b>,
            sortable: true,
            width: "150px",
            right: false
        },{
            name: 'BSR Code',
            selector: (row) => <b>{row?.bsr_code}</b>,
            sortable: true,
            width: "150px",
            right: false
        },{
            name: 'Challan Date',
            selector: (row) => <b>{row?.challan_date}</b>,
            sortable: true,
            width: "150px",
            right: false
        },{
            name: 'Challan No',
            selector: (row) => <b>{row?.challan_no}</b>,
            sortable: true,
            width: "150px",
            right: false
        },{
            name: 'Diposited\n' +
                'Amount',
            selector: (row) => <b>{row?.deposite_amount}</b>,
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Beneficiary\n' +
                'PAN No.',
            selector: (row) => <b>{row.pan_no}</b>,
            sortable: true,
            width: "200px",
            wrap: true

        },
    ];

    const handleChangeRowsPerPage = (currentRowsPerPage, currentPage) => {
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(1); // Reset to the first page when rows per page changes
    };


    const calculateTotalAmount = (propertyName) => {
        let total = 0;
        data.forEach((row) => {
            const depositAmount = Number(parseFloat(row[propertyName]));
            if (!isNaN(depositAmount)) {
                total += depositAmount;
            }
        });
        return total.toFixed(2);
    };

    const totalInvoiceAmount = calculateTotalAmount('tds_it_amount');

    const footerRow = {
        isFooter: true,
        selectableRowsSingle: false,
        voucher_no: <b>Total</b>,
        tds_it_amount: <b>{AddCommasToAmount(totalInvoiceAmount)}</b>,
    };

    const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
   // console.log('data', data, paginatedData);

    let updatedData = [];

    if(paginatedData.length) {
        updatedData = [...paginatedData, footerRow];
    } else {
        updatedData = [];
    }


    // console.log('updatedDataupdatedData', updatedData)

    const handleInvoiceChange = (e) => {
        let {name, value} = e.target;
        if (name == 'vendor_id') {
            // console.log('valuevaluevaluevalue', value, name)
            setVendorData(value);
            // fetchChallans(value);
        }

    };

    const handleInput = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        if (name === 'fromDate') {
            setFromDate(value);
        } else {
            setToDate(value);
        }
    }

    const handleFilterClick = async () => {
        // await fetchBeneficiary(schemeId)
        setData([]);
        await fetchChallans()
    };
    const clearFilter = async () => {
        setFromDate(''); // Clear fromDate
        setToDate('');
        await fetchChallans()
        // await fetchBeneficiary(schemeId)
    };

    const fetchChallans = async () => {
        // setData([]);
        try {

            const resp = await getTDSReports({
                from: vendor || '',
                from_date: fromDate || '',
                to_date: toDate || ''
            });
            if (resp.data.status) {
                setData(resp.data.list);
            }
        } catch (error) {
            setData([]);
        }
    }

    useEffect(() => {
        fetchChallans();

    }, [])



    return (
        <div>

            <Row className="mb-4">
                <Col md={5}>
                    <Form.Group className="mb-3" controlId="vendor_id">
                        <Form.Label>
                            Select From : <span className='text-danger'>*</span>
                        </Form.Label>
                        <Form.Select
                            onChange={(e) => handleInvoiceChange(e)}
                            name="vendor_id"
                            required
                        >
                            <option value=''>--- Select From ---</option>
                            {['24Q', '26Q'].map((vendor) => {
                                return (
                                    <option value={vendor} key={vendor}>{vendor}</option>
                                );
                            })}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={7}>
                    <Form.Label>Select Filter :</Form.Label>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="" controlId="">
                                <Form.Control type="date" name="fromDate"
                                              value={fromDate}
                                              onChange={handleInput}/>
                            </Form.Group>

                        </Col>
                        <Col md={4}>
                            <Form.Group className="" controlId="">
                                <Form.Control type="date" name="toDate"
                                              value={toDate}
                                              onChange={handleInput}/>
                            </Form.Group>
                        </Col>

                        <Col md={4} className="flex-row">
                            <Row>
                                <Col md={4}>
                                    <div className="text-start mx-2">
                                        <button type="button" className="btn btn-outline-primary"
                                                onClick={clearFilter}>Clear
                                        </button>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="text-start">
                                        <button type="button" className="btn btn-primary"
                                                onClick={handleFilterClick}>Filter
                                        </button>
                                    </div>
                                </Col>

                                <Col md={4}>
                                </Col>

                            </Row>

                        </Col>


                    </Row>

                </Col>
            </Row>


            <DataTable
                customStyles={customStyles}
                className="dataTables_wrapper"
                columns={columns}
                data={updatedData}
                fixedHeader
                fixedHeaderScrollHeight="600px"
                pagination
                paginationPerPage={rowsPerPage}
                paginationTotalRows={data.length}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                /*paginationComponent={() => (
                    <CustomPagination
                        rowsPerPage={rowsPerPage}
                        rowCount={data.length}
                        currentPage={currentPage}
                        onChangePage={handleChangePage}
                    />
                )}*/
            />
        </div>
    )
}

export default TDSReportList
