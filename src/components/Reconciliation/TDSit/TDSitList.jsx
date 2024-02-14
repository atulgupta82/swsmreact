import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux';
import {getInvoiceTDS} from '../../../helper/Api';
import DataTable from 'react-data-table-component';
import {AddCommasToAmount} from "../../../helper/Utils";
import {useLocation} from "react-router-dom";

const TDSitList = ({setSelectednvoice, fromDate, toDate}) => {
    debugger
    const {authData} = useSelector((state) => state.authData);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    let {state} = useLocation();
    const [data, setData] = useState(state && state.data ? state.data : []);

    const fetchChallans = async () => {
        try {
            const data = await getInvoiceTDS({
                from_date: fromDate,
                to_date: toDate
            });
            if (data.data.status) {
                setData(data.data.list);
            }
        } catch (error) {
            setData([]);
        }
    }

    useEffect(() => {
        fetchChallans();

    }, [])

    useEffect(() => {
        fetchChallans();
    }, [fromDate, toDate])


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
            name: 'Invoice No',
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
            name: 'Beneficiary\n' +
                'Name',
            selector: (row) => <b>{row.company_name || ''}</b>,
            sortable: true,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Beneficiary\n' +
                'PAN No.',
            selector: (row) => <b>{row.pan_no}</b>,
            sortable: true,
            width: "200px",
            wrap: true

        },
        {
            name: 'Payment\n' +
                'Type',
            selector: (row) =>
                <b>{row.payment_type === '1' ? "FULL PAYMENT" : row.payment_type === '2' ? 'PART PAYMENT' : ''}</b>,
            sortable: true,
            width: "250px",
            wrap: true,
        },
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
        }, {
            name: 'Transaction\n' +
                'Date',
            selector: (row) => <b>{row.amount || ''}</b>,
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
            name: 'INVOICE\n' +
                'AMOUNT',
            selector: (row) => <b>{row.payable_amount || ''}</b>,
            sortable: true,
            width: "150px",
            right: false
        }, {
            name: 'INVOICE\n' +
                'Amount\n' +
                'Sanctioned',
            selector: (row) => <b>{row.sanction_amount || ''}</b>,
            sortable: true,
            width: "150px",
            right: false
        }, {
            name: 'TDS IT',
            selector: (row) => <b>{row?.tds_it_amount}</b>,
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Details',
            width: "200px",
            selector: (row) => row?.invoice ?
                <a href={row?.invoice} target="_blank" rel="noreferrer">Attachment</a> : '',
            sortable: false,
        },
    ];

    const handleChangeRowsPerPage = (currentRowsPerPage, currentPage) => {
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(1); // Reset to the first page when rows per page changes
    };

    const handleSelectedChange = ({selectedRows}) => {
        setSelectednvoice(selectedRows)
    }

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
        invoice_no: <b>Total</b>,
        tds_it_amount: <b>{AddCommasToAmount(totalInvoiceAmount)}</b>,
    };

    const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    let updatedData = [];
    if (paginatedData?.length) {
        updatedData = [...paginatedData, footerRow];
    } else {
        updatedData = []
    }

    return (
        <div>
            <DataTable
                customStyles={customStyles}
                className="dataTables_wrapper"
                selectableRows={authData.user.user_type === 'l1'}
                onSelectedRowsChange={handleSelectedChange}
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

export default TDSitList
