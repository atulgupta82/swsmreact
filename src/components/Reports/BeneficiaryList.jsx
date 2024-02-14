import {useEffect, useState} from 'react';
import DataTable from 'react-data-table-component';
import {useDispatch, useSelector} from 'react-redux';
import {get_beneficiary, getBeneficiaryReports} from "../../helper/Api";
import {Col, Form, Row} from "react-bootstrap";

const subcolumns = [
    {
        name: 'id',
        selector: (row) => '',
        width: "50px"
    },
    {
        name: 'Invoice No.',
        selector: (row) => row.invoice_no,
        wrap: true,
        sortable: true,
        width: "200px",
    },
    {
        name: 'Invoice Date',
        selector: (row) => row.invoice_date,
        wrap: true,
        sortable: true,
        width: "200px",

    },
    {
        name: 'Sanction\n' +
            'Order No',
        selector: (row) => {
            return row.sanction_order_no;
        },
        sortable: true,
        wrap: true,
        width: "200px"
    },
    {
        name: 'Date',
        selector: (row) => row.sanction_order_date,
        sortable: true,
        width: "200px",
        wrap: true
    },
    {
        name: 'Voucher No',
        selector: (row) => row.voucher_no,
        sortable: true,
        width: "200px"
    },
    {
        name: 'Date',
        selector: (row) => row.voucher_date,
        sortable: true,
        width: "200px",
        wrap: true,
        right: true
    },
    {
        name: 'Scheme No',
        selector: (row) => row.scheme_no,
        sortable: true,
        width: "200px",
        wrap: true,
        right: true
    },
    {
        name: 'Sub Head No.',
        selector: (row) => row.sub_head_no,
        sortable: true,
        width: "200px",
        wrap: true,
        right: true
    },
    {
        name: 'Invoice Amount',
        selector: (row) => row.invoice_amount,
        sortable: true,
        wrap: true,
        width: "200px",
        right: true
    }, {
        name: 'Sanctioned Amount',
        selector: (row) => row.sanction_amount || 0,
        sortable: true,
        wrap: true,
        width: "200px",
        right: true
    },
    {
        name: 'Approval Type',
        selector: (row) => row.Approval_type,
        sortable: true,
        width: "200px",
        right: true
    },
    {
        name: 'Date Of Invoice Approval',
        selector: (row) => 'NA',
        sortable: true,
        width: "200px",
        right: true
    },

    {
        name: 'Date Of Payment',
        selector: (row) => row.date_of_payment,
        sortable: true,
        width: "200px",
        right: true
    },
    {
        name: 'Invoice Deduction',
        selector: (row) => row.invoice_deduction,
        sortable: true,
        width: "150px",
        right: false
    },
    {
        name: 'Invoice Amount',
        selector: (row) => row.invoice_amount,
        sortable: true,
        width: "150px",
        right: false
    }, {
        name: 'Invoice Balance %',
        selector: (row) => '0%',
        sortable: true,
        width: "150px",
        right: false
    }, {
        name: 'Invoice Amount (Sanctioned Balance)',
        selector: (row) => '0%',
        sortable: true,
        width: "150px",
        right: false
    },
    {
        name: 'Sanctioned Balance %',
        selector: (row) => '0%',
        sortable: true,
        width: "150px",
        right: false
    },
];
const ExpandedComponent = ({data}) => {
    let sub_heads = data.invoice_details;
    // console.log(sub_heads);
    return (
        <>
            <DataTable
                data={sub_heads}
                columns={subcolumns}
                noTableHead={true}
            />
        </>
    );
};


export function BeneficiaryReportList() {
    const {authData} = useSelector((state) => state.authData);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [vendorList, setVendorList] = useState([])
    const dispatch = useDispatch();
    const [beneficiaryList, setBeneficiaryList] = useState([]);
    const [schemeId, setSchemeId] = useState('')
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

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
        await fetchBeneficiary(schemeId)
    };
    const clearFilter = async () => {
        setFromDate(''); // Clear fromDate
        setToDate('');
        await fetchBeneficiary(schemeId)
    };
    const fetch_list = async () => {
        const vendorResponse = await get_beneficiary();
        if (vendorResponse.data.status) {
            setVendorList(vendorResponse.data.list);
        }
    }

    const fetchBeneficiary = async (id) => {
        // console.log('iididdid', id);
        // dispatch(GET_BENEFICIARY_START());
        try {
            const response = await getBeneficiaryReports(id, {
                from: fromDate || '',
                to: toDate || ''
            });
            if (response.data) {
                setBeneficiaryList(response.data.list)
                // dispatch(GET_BENEFICIARY_SUCCESS(response.data.result));

            } else {
                // dispatch(GET_BENEFICIARY_FAIL(response.data.message));
            }
        } catch (error) {
            // dispatch(GET_BENEFICIARY_FAIL('something went wrong'));
        }

    }
    useEffect(() => {
        // fetchBeneficiary();
        fetch_list();
    }, [dispatch])

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    // const paginatedData = beneficiaryList?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
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
            name: 'Invoice No.',
            selector: (row) => <b>{row.invoice_no}</b>,
            wrap: true,
            sortable: true,
            width: "200px",
        },
        {
            name: 'Invoice Date',
            selector: (row) => <b>{row.invoice_date}</b>,
            wrap: true,
            sortable: true,
            width: "200px",

        },
        {
            name: 'Sanction\n' +
                'Order No',
            selector: (row) => {
                return (<b>{row.sanction_order_no}</b>);
            },
            sortable: true,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Date',
            selector: (row) => <b>{row.sanction_order_date}</b>,
            sortable: true,
            width: "200px",
            wrap: true
        },
        {
            name: 'Voucher No',
            selector: (row) => <b>{row.voucher_no}</b>,
            sortable: true,
            width: "200px"
        },
        {
            name: 'Voucher Date',
            selector: (row) => <b>{row.voucher_date}</b>,
            sortable: true,
            width: "200px",
            wrap: true,
            right: true
        },
        {
            name: 'Scheme No',
            selector: (row) => <b>{row.scheme_no}</b>,
            sortable: true,
            width: "200px",
            wrap: true,
            right: true
        },
        {
            name: 'Sub Head No.',
            selector: (row) => <b>{row.sub_head_no}</b>,
            sortable: true,
            width: "200px",
            wrap: true,
            right: true
        },
        {
            name: 'Invoice Amount',
            selector: (row) => <b>{row.invoice_amount}</b>,
            sortable: true,
            wrap: true,
            width: "200px",
            right: true
        }, {
            name: 'Sanctioned Amount',
            selector: (row) => <b>{row.sanction_amount || 0}</b>,
            sortable: true,
            wrap: true,
            width: "200px",
            right: true
        },
        {
            name: 'Approval Type',
            selector: (row) => <b>{row.Approval_type}</b>,
            sortable: true,
            width: "200px",
            right: true
        },
        {
            name: 'Date Of Invoice Approval',
            selector: (row) => 'NA',
            sortable: true,
            width: "200px",
            right: true
        },

        {
            name: 'Date Of Payment',
            selector: (row) => <b>{row.date_of_payment}</b>,
            sortable: true,
            width: "200px",
            right: true
        },
        {
            name: 'Invoice Deduction',
            selector: (row) => <b>{row.invoice_deduction}</b>,
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Invoice Amount',
            selector: (row) => <b>{row.invoice_amount}</b>,
            sortable: true,
            width: "150px",
            right: false
        }, {
            name: 'Invoice Balance %',
            selector: (row) => <b>{row.invoice_balance || 0}</b>,
            sortable: true,
            width: "150px",
            right: false
        }, {
            name: 'Invoice Amount (Sanctioned Balance)',
            selector: (row) => <b>{row.invoice_sanctioned_balance || 0}</b>,
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Sanctioned Balance %',
            selector: (row) => <b>{row.sanctioned_balance || 0}</b>,
            sortable: true,
            width: "150px",
            right: false
        },
    ];

    const handleChangeRowsPerPage = (currentRowsPerPage, currentPage) => {
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(1); // Reset to the first page when rows per page changes
    };

    const paginatedData = beneficiaryList?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);


    const handleInvoiceChange = (e) => {
        let {name, value} = e.target;
        if (name == 'vendor_id') {
            setSchemeId(value)
            // console.log('valuevaluevaluevalue', value, name)
            fetchBeneficiary(value);
        }

    };
    return (
        <>
            <Row>
                <Col md={5}>
                    <Form.Group className="mb-3" controlId="vendor_id">
                        <Form.Label>
                            Select Vendor : <span className='text-danger'>*</span>
                        </Form.Label>
                        <Form.Select
                            onChange={(e) => handleInvoiceChange(e)}
                            name="vendor_id"
                            required
                        >
                            <option value=''>--- Select Vendor ---</option>
                            {vendorList.map((vendor) => {
                                return (
                                    vendor.l2_status == 1 && vendor.l3_status == 1 &&
                                    <option value={vendor.id} key={vendor.id}>{vendor.company_name}</option>
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
                data={paginatedData}
                fixedHeader
                fixedHeaderScrollHeight="600px"
                pagination
                paginationPerPage={rowsPerPage}
                paginationTotalRows={beneficiaryList?.length}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                /* paginationComponent={() => (
                     <CustomPagination
                         rowsPerPage={rowsPerPage}
                         rowCount={beneficiaryList?.length}
                         currentPage={currentPage}
                         onChangePage={handleChangePage}
                     />
                 )}*/
            />
        </>
    );
}
