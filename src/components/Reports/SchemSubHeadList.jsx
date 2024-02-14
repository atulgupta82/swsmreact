import {useEffect, useState} from 'react';
import DataTable from 'react-data-table-component';
import {useDispatch, useSelector} from 'react-redux';
import {get_financial_year, get_schemes_by_fy_added_pending, getSchemeSubheadReports} from "../../helper/Api";
import {Col, Form, Row} from "react-bootstrap";

const subcolumns = [
    {
        name: 'id',
        selector: (row) => '',
        width: "50px"
    },
    {
        name: 'Scheme Sub Head No.',
        selector: (row) => '-',
        wrap: true,
        sortable: true,
        width: "200px",
    },
    {
        name: 'Scheme Sub Head Name',
        selector: (row) => '-',
        wrap: true,
        sortable: true,
        width: "200px",

    },
    {
        name: 'Financial Year',
        selector: (row) => {
            return '-';
        },
        sortable: true,
        wrap: true,
        width: "200px"
    },
    {
        name: 'Date',
        selector: (row) => row.date || '-',
        sortable: true,
        width: "200px",
        wrap: true
    },
    {
        name: 'Sanction Order No',
        selector: (row) => row.sanction_order_no || '-',
        sortable: true,
        width: "200px"
    },
    {
        name: 'Voucher No',
        selector: (row) => row.voucher_no || '-',
        sortable: true,
        width: "200px",
        wrap: true,
        right: true
    },
    {
        name: 'Voucher Date',
        selector: (row) => row.voucher_date || '-',
        sortable: true,
        width: "200px",
        wrap: true,
        right: true
    },
    {
        name: 'Beneficiary Name',
        selector: (row) => row.company_name || '-',
        sortable: true,
        width: "200px",
        wrap: true,
        right: true
    },
    {
        name: 'Payable Amount',
        selector: (row) => row.payable_amount || '-',
        sortable: true,
        width: "200px",
        wrap: true,
        right: true
    },
    {
        name: 'Total Deduction',
        selector: (row) => row.total_deduction || '-',
        sortable: true,
        wrap: true,
        width: "200px",
        right: true
    }, {
        name: 'INVOICE\n' +
            'AMOUNT',
        selector: (row) => row.invoice_value || '-',
        sortable: true,
        wrap: true,
        width: "200px",
        right: true
    },
    {
        name: 'Sanctioned\n' +
            'AMOUNT',
        selector: (row) => row.sanction_amount || '-',
        sortable: true,
        width: "200px",
        right: true
    },
    {
        name: 'Approval\n' +
            'Type',
        selector: (row) => row.approval_type || '-',
        sortable: true,
        width: "200px",
        right: true
    },

    {
        name: 'Date of\n' +
            'invoice\n' +
            'Approval',
        selector: (row) => row.date_of_invoice_approval || '-',
        sortable: true,
        width: "200px",
        right: true
    },
    {
        name: 'Payment\n' +
            'Date/\n' +
            'Status',
        selector: (row) => row.payment_date_status || '-',
        sortable: true,
        width: "150px",
        right: false
    },
    {
        name: 'INVOICE\n' +
            'Amount\n' +
            '(Balance)',
        selector: (row) => row.invoice_amount_balance || '-',
        sortable: true,
        width: "150px",
        right: false
    }, {
        name: 'INVOICE\n' +
            'Amount\n' +
            '(Balance\n' +
            'Payable)',
        selector: (row) => row.invoice_amount_balance_payable || '-',
        sortable: true,
        width: "150px",
        right: false
    }, {
        name: 'Invoice\n' +
            'Balance %',
        selector: (row) => row.invoice_balance || '-',
        sortable: true,
        width: "150px",
        right: false
    },
    {
        name: 'Amount',
        selector: (row) => row.amount || '-',
        sortable: true,
        width: "150px",
        right: false
    }, {
        name: 'Balance',
        selector: (row) => <b>{row.balance || '-'}</b>,
        sortable: true,
        width: "150px",
        right: false
    },
    {
        name: 'Invoice',
        selector: (row) => {
            const file = row.invoice
            return file ? (
                <a href={file} target="_blank">Attachment</a>

            ) : '-';
        },
        sortable: false,
        width: "150px",
        right: false
    }, {
        name: 'Voucher',
        selector: (row) => {
            const file = row.voucher
            return file ? (
                <a href={file} target="_blank">Attachment</a>

            ) : '-';
        },
        sortable: false,
        width: "150px",
        right: false
    }, {
        name: 'Sanction Order',
        selector: (row) => {
            const file = row.sanction_order
            return file ? (
                <a href={file} target="_blank">Attachment</a>

            ) : '-';
        },
        sortable: true,
        width: "150px",
        right: false
    },
];
const ExpandedComponent = ({data}) => {
    let sub_heads = data.scheme_subhead_details;
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


export function SchemeSubHeadReportList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [schemeList, setSchemeList] = useState([])
    const [schemeId, setSchemeId] = useState('')
    const dispatch = useDispatch();
    const [schemeSubHeadList, setSchemeSubheadList] = useState([]);

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

    const handleFilterClick = () => {
        fetchBeneficiary(schemeId)
    };
    const clearFilter = () => {
        setFromDate(''); // Clear fromDate
        setToDate('');
        fetchBeneficiary(schemeId)
    };

    const fetchBeneficiary = async (id) => {
        // dispatch(GET_BENEFICIARY_START());
        try {
            const response = await getSchemeSubheadReports(id, {
                from: fromDate || '',
                to: toDate || ''
            });
            if (response.data) {
                setSchemeSubheadList(response.data.list)
                // dispatch(GET_BENEFICIARY_SUCCESS(response.data.result));

            } else {
                // dispatch(GET_BENEFICIARY_FAIL(response.data.message));
            }
        } catch (error) {
            // dispatch(GET_BENEFICIARY_FAIL('something went wrong'));
        }

    }

    const fetch_list = async () => {
        const schemeResponse = await get_schemes_by_fy_added_pending();
        if (schemeResponse.data.status) {
            setSchemeList(schemeResponse.data.schemes);
        }
    }
    useEffect(() => {
        // fetchBeneficiary();
        fetch_list()
    }, [dispatch])

    /*useEffect(() => {
        fetchBeneficiary();
        // fetch_list()
    }, [filterDate.fromDate, filterDate.toDate])*/

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    //  const paginatedData = schemeSubHeadList?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
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
            name: 'Scheme Sub Head No.',
            selector: (row) => <b>{row.scheme_subhead_no || '-'}</b>,
            wrap: true,
            sortable: true,
            width: "200px",
        },
        {
            name: 'Scheme Sub Head Name',
            selector: (row) => <b>{row.scheme_subhead_name || '-'}</b>,
            wrap: true,
            sortable: true,
            width: "200px",

        },
        {
            name: 'Financial Year',
            selector: (row) => {
                return (<b>{row.financial_year || '-'}</b>);
            },
            sortable: true,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Date',
            selector: (row) => <b>{row.date || '-'}</b>,
            sortable: true,
            width: "200px",
            wrap: true
        },
        {
            name: 'Sanction Order No',
            selector: (row) => '-',
            sortable: true,
            width: "200px"
        },
        {
            name: 'Voucher No',
            selector: (row) => '-',
            sortable: true,
            width: "200px",
            wrap: true,
            right: true
        },{
            name: 'Voucher Date',
            selector: (row) => '-',
            sortable: true,
            width: "200px",
            wrap: true,
            right: true
        },
        {
            name: 'Beneficiary Name',
            selector: (row) => '-',
            sortable: true,
            width: "200px",
            wrap: true,
            right: true
        },
        {
            name: 'Payable Amount',
            selector: (row) => '-',
            sortable: true,
            width: "200px",
            wrap: true,
            right: true
        },
        {
            name: 'Total Deduction',
            selector: (row) => '-',
            sortable: true,
            wrap: true,
            width: "200px",
            right: true
        }, {
            name: 'INVOICE\n' +
                'AMOUNT',
            selector: (row) => '-',
            sortable: true,
            wrap: true,
            width: "200px",
            right: true
        },
        {
            name: 'Sanctioned\n' +
                'AMOUNT',
            selector: (row) => '-',
            sortable: true,
            width: "200px",
            right: true
        },
        {
            name: 'Approval\n' +
                'Type',
            selector: (row) => '-',
            sortable: true,
            width: "200px",
            right: true
        },

        {
            name: 'Date of\n' +
                'invoice\n' +
                'Approval',
            selector: (row) => '-',
            sortable: true,
            width: "200px",
            right: true
        },
        {
            name: 'Payment\n' +
                'Date/\n' +
                'Status',
            selector: (row) => '-',
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'INVOICE\n' +
                'Amount\n' +
                '(Balance)',
            selector: (row) => '-',
            sortable: true,
            width: "150px",
            right: false
        }, {
            name: 'INVOICE\n' +
                'Amount\n' +
                '(Balance\n' +
                'Payable)',
            selector: (row) => '-',
            sortable: true,
            width: "150px",
            right: false
        }, {
            name: 'Invoice\n' +
                'Balance %',
            selector: (row) => '-',
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Amount',
            selector: (row) => '-',
            sortable: true,
            width: "150px",
            right: false
        }, {
            name: 'Balance',
            selector: (row) => <b>{row.balance || '-'}</b>,
            sortable: true,
            width: "150px",
            right: false
        }, {
            name: 'Invoice',
            selector: (row) => '-',
            sortable: true,
            width: "150px",
            right: false
        }, {
            name: 'Voucher',
            selector: (row) => '-',
            sortable: true,
            width: "150px",
            right: false
        }, {
            name: 'Sanction Order',
            selector: (row) => '-',
            sortable: true,
            width: "150px",
            right: false
        },
    ];

    const handleChangeRowsPerPage = (currentRowsPerPage, currentPage) => {
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(1); // Reset to the first page when rows per page changes
    };

    const paginatedData = schemeSubHeadList?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleSchemeChange = (e, voucherIndex, invoiceIndex, schemeIndex) => {
        const {name, value} = e.target;
        if (name == 'scheme_id') {
            setSchemeId(value)
            fetchBeneficiary(value);
        }
    };

    return (
        <>
            <Row>
                <Col md={5}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Select Scheme :</Form.Label>
                        <Form.Select name="scheme_id"
                                     onChange={(e) => handleSchemeChange(e)}
                                     required
                        >
                            <option value=''>--- Select Scheme ---</option>
                            {
                                schemeList.map((scheme) => {
                                    return (
                                        <option value={scheme.id} key={scheme.id}>{scheme.name}</option>
                                    );
                                })
                            }
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
                                        <button type="button" className="btn btn-outline-primary" onClick={clearFilter}>Clear
                                        </button>
                                    </div>
                                </Col>
                               <Col md={4}>
                                   <div className="text-start">
                                       <button type="button" className="btn btn-primary" onClick={handleFilterClick}>Filter
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
                paginationTotalRows={schemeSubHeadList?.length}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                /*paginationComponent={() => (
                    <CustomPagination
                        rowsPerPage={rowsPerPage}
                        rowCount={schemeSubHeadList?.length}
                        currentPage={currentPage}
                        onChangePage={handleChangePage}
                    />
                )}*/
            />
        </>

    );
}
