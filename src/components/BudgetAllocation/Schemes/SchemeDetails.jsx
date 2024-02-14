import React, { useState } from 'react'
import SchemeDetailsHeader from './SchemeDetailsHeader'
import { BiSolidEdit } from 'react-icons/bi';
import { AiOutlineEye } from 'react-icons/ai';
import { CustomPagination } from '../../../helper/Utils';
import DataTable from 'react-data-table-component';

const SchemeDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data,setData]=useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

 // const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const customStyles = {
    headCells: {
        style: {
            fontWeight:"bold",
            fontSize:"14px"
        },
    },
  };
  const columns = [
  
    {
      name: 'Date',
      selector: (row) => row.id,
      wrap:true,
      width:"200px"
    },
    {
      name: 'Subhead Code',
      selector: (row) => row.company_name,
      sortable: true,
      wrap:true,
      width:"200px"
    },
    {
      name: 'Subhead Name',
      selector: (row) => row.contact_person,
      sortable: true,
      wrap:true,
      width:"200px"
    },
    {
      name: 'Sanction Order No.',
      selector: (row) => row.mobile,
      sortable: true,
      wrap:true
    },
    {
      name: 'Voucher No.',
      selector: (row) => row.gst_no,
      sortable: true,
      wrap:true

    },
    {
      name: 'Invoice No.',
      selector: (row) => row.pan_no,
      sortable: true,
      wrap:true
    },
    {
      name: 'Beneficiary Name',
      selector: (row) => row.pan_no,
      sortable: true,
      wrap:true
    },
    {
      name: 'Invoice Amount',
      selector: (row) => row.pan_no,
      sortable: true,
      wrap:true
    },
    {
      name: 'Approval Type',
      selector: (row) => row.pan_no,
      sortable: true,
      wrap:true
    },
    {
      name: 'Receipts',
      selector: (row) => row.pan_no,
      sortable: true,
      wrap:true
    },
    {
      name: 'Payment Balance',
      selector: (row) => row.pan_no,
      sortable: true,
      wrap:true
    },    
    {
      name: 'Files',
     
      selector: (row) => {
        return (
            <>
            <span><AiOutlineEye/></span>
            </>
        );
      },
      sortable: true,
    }
  ];

  const handleChangeRowsPerPage = (currentRowsPerPage, currentPage) => {
    setRowsPerPage(currentRowsPerPage);
    setCurrentPage(1); // Reset to the first page when rows per page changes
  };

  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  return (
    <div>
      <SchemeDetailsHeader/>
      <div className='px-2'>
        <DataTable
          className="dataTables_wrapper"
          customStyles={customStyles}
          // progressPending={loading}
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
    </div>
  )
}

export default SchemeDetails
