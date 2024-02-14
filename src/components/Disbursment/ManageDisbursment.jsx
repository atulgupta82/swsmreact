import React, {useEffect, useState} from 'react'
import {get_disbursment_invoices} from '../../helper/Api';
import DataTable from 'react-data-table-component';
import {AddCommasToAmount, CustomPagination} from '../../helper/Utils';
import {useDispatch, useSelector} from 'react-redux';

import {
    GET_D_INVOICES_START,
    GET_D_INVOICES_SUCCESS,
    GET_D_INVOICES_FAIL
} from '../../RTK/Slices/DisbursmentInvoiceSlice';

// import './ManageDisbursment.css';

const columns = [
    {
        name: 'Payment Status (L2)',
        selector: (row) => {
            let status = row.payment_status;
            return !row.isFooter ? (
                <b>{status == 1 ? 'COMPLETED' : 'PENDING'}</b>
            ) : <b>Total</b>;
        },
        sortable: true,
        width: "200px"
    },
    {
        name: 'Payment Status (L3)',
        selector: (row) => {
            let status = row.l3_payment_status;
            return !row.isFooter ? (
                <b>{status == 1 ? 'COMPLETED' : 'PENDING'}</b>
            ) : ''
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
        selector: (row) => row.payment_type === '1' ? "FULL PAYMENT" : row.payment_type === '2' ? 'PART PAYMENT' : '',
        sortable: true,
        wrap: true,
        width: "150px"
    },
    {
        name: 'Invoice Amount',
        selector: (row) => {
            return (
                <b>{row?.invoice_value}</b>
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
                <b>{row.sanction_amount}</b>
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
                <b>{row.payable_amount}</b>
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

const ManageDisbursment = (filterDate) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const {disbursment_invoices, loading} = useSelector((state) => state.disbursment_invoiceData);
    const {authData} = useSelector((state) => state.authData);
    const dispatch = useDispatch();
    const [data, setData] = useState(disbursment_invoices);

    const fetchInvoices = async () => {
        dispatch(GET_D_INVOICES_START());
        try {
            const invoices_response = await get_disbursment_invoices({
                from: filterDate.fromDate,
                to: filterDate.toDate
            });
            // console.log(invoices_response)
            if (invoices_response.data.status) {
                dispatch(GET_D_INVOICES_SUCCESS(invoices_response.data.list))
                setData(invoices_response.data.list)
            } else {
                dispatch(GET_D_INVOICES_FAIL(invoices_response.data.message))
            }
        } catch (error) {
            dispatch(GET_D_INVOICES_FAIL('something went wrong'))
        }
    }

    useEffect(() => {
        fetchInvoices();
    }, [dispatch])

    useEffect(() => {
        fetchInvoices();
    }, [filterDate.fromDate, filterDate.toDate])

    useEffect(() => {
        setData(disbursment_invoices)
    }, [disbursment_invoices]);

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    // const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const customStyles = {

        headCells: {
            style: {
                fontWeight: "bold",
                fontSize: "14px"
            },
        },
    };
    const calculateTotalAmount = (propertyName) => {
        let total = 0;
        data.forEach((row) => {
            const depositAmount = parseFloat(row[propertyName]);
            if (!isNaN(depositAmount)) {
                total += depositAmount;
            }
        });
        return total.toFixed(2);
    };

    const totalInvoiceAmount = calculateTotalAmount('invoice_value');
    const totalSanctionAmount = calculateTotalAmount('sanction_amount');
    const totalPayableAmount = calculateTotalAmount('payable_amount');

    const footerRow = {
        isFooter: true,
        payment_status: <b>Total</b>,
        invoice_value: <b>{AddCommasToAmount(totalInvoiceAmount)}</b>,
        sanction_amount: <b>{AddCommasToAmount(totalSanctionAmount)}</b>,
        payable_amount: <b>{AddCommasToAmount(totalPayableAmount)}</b>,
    };



    const handleChangeRowsPerPage = (currentRowsPerPage, currentPage) => {
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(1); // Reset to the first page when rows per page changes
    };

    const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const updatedData = [...paginatedData, footerRow];
    return (
        <div>
            <DataTable
                customStyles={customStyles}
                className="dataTables_wrapper"
                progressPending={loading}
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

export default ManageDisbursment
