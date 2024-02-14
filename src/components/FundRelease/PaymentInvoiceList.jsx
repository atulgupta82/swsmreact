import React, {useEffect, useState} from 'react'
import {get_payment_invoices} from '../../helper/Api';
import DataTable from 'react-data-table-component';
import {AddCommasToAmount, CustomPagination} from '../../helper/Utils';
import {useDispatch, useSelector} from 'react-redux';

import {GET_P_INVOICES_START, GET_P_INVOICES_SUCCESS, GET_P_INVOICES_FAIL} from '../../RTK/Slices/PaymentInvoiceSlice';

// import './ManageDisbursment.css';

const columns = [
    {
        name: 'Payment Status (L2)',
        selector: (row) => {
            let status = row.payment_status;
            return (
                <b>{status == 1 ? 'COMPLETED' : 'PENDING'}</b>
            );
        },
        sortable: true,
        width: "200px"
    },
    {
        name: 'Payment Status (L3)',
        selector: (row) => {
            let status = row.l3_payment_status;
            return (
                <b>{status == 1 ? 'COMPLETED' : 'PENDING'}</b>
            );
        },
        sortable: true,
        width: "200px"
    },
    {
        name: 'Sanction Order No.',
        selector: (row) => row.sanction_order_no,
        width: "200px",
        wrap: true,
        sortable: true,
    },
    {
        name: 'Sanction Order Date',
        selector: (row) => row.sanction_order_date,
        width: "200px",
        wrap: true,
        sortable: true,
    },
    {
        name: 'Voucher No.',
        selector: (row) => row.voucher_no,
        width: "150px",
        wrap: true,
        sortable: true,
    },
    {
        name: 'Voucher Date',
        selector: (row) => row.voucher_date,
        sortable: true,
        width: "150px",
        wrap: true,
    },
    {
        name: 'Benificiary Name',
        selector: (row) => row.company_name,
        sortable: true,
        wrap: true,
        width: "200px"
    },
    {
        name: 'Invoice No.',
        selector: (row) => row.invoice_no,
        width: "150px",
        wrap: true,
        sortable: true,
    },
    {
        name: 'Invoice Date',
        selector: (row) => row.invoice_date,
        sortable: true,
        width: "150px",
        wrap: true,
    },
    {
        name: 'Payment Type',
        selector: (row) => row.payment_type === '1' ? "FULL PAYMENT" : 'PART PAYMENT',
        sortable: true,
        wrap: true,
        width: "150px"
    },
    {
        name: 'Invoice Amount',
        selector: (row) => {
            return (
                <b>{AddCommasToAmount(row.invoice_value)}</b>
            );
        },
        sortable: true,
        width: "200px",
        wrap: true,
        right: true
    },
    {
        name: 'Sanction Amount',
        selector: (row) => {
            return (
                <b>{AddCommasToAmount(row.sanction_amount)}</b>
            );
        },
        sortable: true,
        width: "200px",
        wrap: true,
        right: true
    },
    {
        name: 'Payable Amount',
        selector: (row) => {
            return (
                <b>{AddCommasToAmount(row.payable_amount)}</b>
            );
        },
        sortable: true,
        width: "200px",
        wrap: true,
        right: true
    },
    {
        name: 'Transaction Date',
        selector: (row) => (row.payment_status == 1 && row.l3_payment_status == 1) ? row.transaction_date : "",
        sortable: true,
        width: "200px",
        wrap: true
    },

];
const PaymentInvoiceList = ({setSelectedPaymentInvoice, fromDate, toDate, isChecked = false}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const {payment_invoices, loading} = useSelector((state) => state.payment_invoiceData);
    const {authData} = useSelector((state) => state.authData);
    const dispatch = useDispatch();
    const [data, setData] = useState(payment_invoices);

    const fetchInvoices = async () => {
        dispatch(GET_P_INVOICES_START());
        try {
            const invoices_response = await get_payment_invoices({
                user_type: authData?.user?.user_type?.toUpperCase() || 'L1',
                from_date: fromDate || '',
                to_date: toDate || '',
                isAll: isChecked
            });
            // console.log(invoices_response)
            if (invoices_response.data.status) {
                dispatch(GET_P_INVOICES_SUCCESS(invoices_response.data.list))
                setData(invoices_response.data.list)
            } else {
                dispatch(GET_P_INVOICES_FAIL(invoices_response.data.message))
            }
        } catch (error) {
            dispatch(GET_P_INVOICES_FAIL('something went wrong'))
        }
    }
    useEffect(() => {
        fetchInvoices();
    }, [fromDate, toDate])
    useEffect(() => {
        fetchInvoices();
    }, [isChecked])

    useEffect(() => {
        fetchInvoices();
    }, [dispatch])

    useEffect(() => {
        setData(payment_invoices)
    }, [payment_invoices]);

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    // const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleSelectedChange = ({selectedRows}) => {
        setSelectedPaymentInvoice(selectedRows)
    }
    const customStyles = {

        headCells: {
            style: {
                fontWeight: "bold",
                fontSize: "14px"
            },
        },
    };
    const rowDisabledCriteria = row => {
        if (authData.user.user_type === 'l2') {
            if (row.payment_status == 1) {
                return true;
            } else {
                return false;
            }
        } else if (authData.user.user_type === 'l3') {
            if (row.l3_payment_status == 1) {
                return true;
            } else {
                return false;
            }
        } else if (authData.user.user_type === 'l1') {
            return true;
        } else {
            return true;
        }
    };

    const handleChangeRowsPerPage = (currentRowsPerPage, currentPage) => {
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(1); // Reset to the first page when rows per page changes
    };

    const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div>
            <DataTable
                className="dataTables_wrapper"
                customStyles={customStyles}
                selectableRowDisabled={rowDisabledCriteria}
                selectableRows
                onSelectedRowsChange={handleSelectedChange}
                progressPending={loading}
                columns={columns}
                data={paginatedData}
                fixedHeader
                fixedHeaderScrollHeight="600px"
                pagination
                paginationPerPage={rowsPerPage}
                paginationTotalRows={data.length}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                /*paginationComponent={()=>(
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

export default PaymentInvoiceList
