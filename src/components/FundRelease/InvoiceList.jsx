import React, { useEffect, useState } from 'react'
import { get_fund_invoices } from '../../helper/Api';
import DataTable from 'react-data-table-component';
import {
    AddCommasToAmount,
    CustomPagination,
    show_challan_edit_btn,
    show_invoice_edit_btn,
    show_l1_action_btn_view
} from '../../helper/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { GET_INVOICES_START,GET_INVOICES_SUCCESS,GET_INVOICES_FAIL } from '../../RTK/Slices/InvoiceSlice';
import { BiEdit } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import {AiOutlineEye} from "react-icons/ai";
import {FaEdit} from "react-icons/fa";

// import './ManageDisbursment.css';

const InvoiceList = ({setSelectednvoice, fromDate, toDate, isChecked=false}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const {invoices,loading}=useSelector((state)=>state.invoiceData);
    const {authData}=useSelector((state)=>state.authData);
    const dispatch=useDispatch();
    const [data,setData]=useState(invoices);


    const columns = [
        {
            name: 'L2 Approval',
            selector: (row) => {
                let status=row.approval_status;
                return (
                    <b>{status==0 ? 'PENDING':status==1?"APPROVED":'REJECTED'}</b>
                );
            },
            sortable: true,
            width:"150px",
            wrap:true,
        },
        {
            name: 'L3 Approval',
            selector: (row) => {
                let status=row.l3_approval_status;
                return (
                    <b>{status==0 ? 'PENDING':status==1?"APPROVED":'REJECTED'}</b>
                );
            },
            sortable: true,
            width:"150px",
            wrap:true,
        },
        {
            name: 'Sanction Order No.',
            selector: (row) => row.sanction_order_no,
            width:"200px",
            wrap:true,
            sortable: true,
        },
        {
            name: 'Sanction Order Date',
            selector: (row) => row.sanction_order_date,
            width:"200px",
            wrap:true,
            sortable: true,
        },
        {
            name: 'Voucher No.',
            selector: (row) => row.voucher_no,
            width:"150px",
            wrap:true,
            sortable: true,
        },
        {
            name: 'Voucher Date',
            selector: (row) => row.voucher_date,
            sortable: true,
            width:"150px",
            wrap:true,
        },
        {
            name: 'Benificiary Name',
            selector: (row) => row.company_name,
            sortable: true,
            wrap:true,
            width:"200px"
        },
        {
            name: 'Invoice No.',
            selector: (row) => row.invoice_no,
            width:"150px",
            wrap:true,
            sortable: true,
        },
        {
            name: 'Invoice Date',
            selector: (row) => row.invoice_date,
            sortable: true,
            width:"150px",
            wrap:true,
        },
        {
            name: 'Payment Type',
            selector: (row) => row.payment_type==='1'?"FULL PAYMENT":'PART PAYMENT',
            sortable: true,
            wrap:true,
            width:"150px"
        },
        {
            name: 'Invoice Amount',
            selector: (row) => {
                return (
                    <b>{AddCommasToAmount(row.invoice_value)}</b>
                )
            },
            sortable: true,
            width:"200px",
            wrap:true,
            right:true
        },
        {
            name: 'Sanctioned Amount',
            selector: (row) => {
                return (
                    <b>{AddCommasToAmount(row.sanction_amount)}</b>
                )
            },
            sortable: true,
            width:"200px",
            wrap:true,
            right:true
        },{
            name: 'Invoice Deduction',
            selector: (row) => {
                return (
                    <b>{AddCommasToAmount(row.total_deduction)}</b>
                )
            },
            sortable: true,
            width:"200px",
            wrap:true,
            right:true
        }, {
            name: 'Invoice Payment Amount',
            selector: (row) => {
                return (
                    <b>{AddCommasToAmount(row.payable_amount)}</b>
                )
            },
            sortable: true,
            width: "200px",
            wrap: true,
            right: true
        },
        {
            name: 'Action',
            width:"150px",
            selector: (row) => {
                return (
                    <>
                        <div className='user_action'>
                            {
                                show_invoice_edit_btn(authData.user.user_type, row.approval_status, row.l3_approval_status) ?
                                    <span className='pr-4'><Link
                                        to={`/edit-invoice/${row.id}`}><FaEdit/></Link></span> : ""
                            }
                        </div>
                    </>
                )
            },
            wrap:true,
            right:true
        },
    ];

    const fetchInvoices=async()=>{
      dispatch(GET_INVOICES_START());
      try {
        const invoices_response=await get_fund_invoices({user_type: authData?.user?.user_type?.toUpperCase() || 'L1', from_date: fromDate || '',
            to_date: toDate || '', isAll: isChecked});
        // console.log(invoices_response)
        if(invoices_response.data.status){
          dispatch(GET_INVOICES_SUCCESS(invoices_response.data.list))
          setData(invoices_response.data.list)
        }else{
          dispatch(GET_INVOICES_FAIL(invoices_response.data.message))
        }
      } catch (error) {
        dispatch(GET_INVOICES_FAIL('something went wrong'))
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
      setData(invoices)
    }, [invoices]);

    const handleChangePage = (page) => {
      setCurrentPage(page);
    };

    // const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleSelectedChange=({selectedRows })=>{
      setSelectednvoice(selectedRows)
    }

    const customStyles = {

      headCells: {
          style: {
              fontWeight:"bold",
              fontSize:"14px"
          },
      },
    };

    const handleChangeRowsPerPage = (currentRowsPerPage, currentPage) => {
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(1); // Reset to the first page when rows per page changes
    };

    const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  return (
    <div>
        <DataTable
            customStyles={customStyles}
            className="dataTables_wrapper"
            selectableRowDisabled={(row) => (row.approval_status == 2 || row.l3_approval_status == 2)}
            selectableRows={authData.user.user_type=='l1'?false:true}
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

export default InvoiceList
