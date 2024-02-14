import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux';
import {delete_budget_by_id, getChallans} from '../../../helper/Api';
import DataTable from 'react-data-table-component';
import {CustomPagination, show_challan_edit_btn} from '../../../helper/Utils';
import {AiOutlineEye} from 'react-icons/ai';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import {FaEdit} from "react-icons/fa";

const ChallanList = () => {
    const {authData} = useSelector((state) => state.authData);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);

    const fetchChallans = async () => {
        try {
            const data = await getChallans();
            if (data.data.status) {
                setData(data.data.result);
            }
        } catch (error) {
            setData([]);
        }
    }

    useEffect(() => {
        fetchChallans();
    }, [])

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };


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
            name: 'Scheme',
            selector: (row) => <b>{row.scheme_name}</b>,
            wrap: true,
            sortable: true,
            width: "200px",
        },
        {
            name: 'SNA Name',
            selector: (row) => <b>{row.sna_name}</b>,
            wrap: true,
            sortable: true,
            width: "200px",

        },
        {
            name: 'Purpose',
            selector: (row) => <b>{row.purpose || 'NA'}</b>,
            sortable: true,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Head of A/C',
            selector: (row) => <b>{row.head_of_account_name}</b>,
            sortable: true,
            width: "200px",
            wrap: true

        },
        {
            name: 'Head of A/C Name',
            selector: (row) => <b>{row.head_of_account_no}</b>,
            sortable: true,
            width: "250px",
            wrap: true,
        },
        {
            name: 'Challan No.',
            selector: (row) => <b>{row.challan_no}</b>,
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Date',
            selector: (row) => <b>{row.challan_date}</b>,
            sortable: true,
            width: "150px",
            right: false
        }, {
            name: 'Amount',
            selector: (row) => <b>{row.amount}</b>,
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Status (L2)',
            selector: (row) => !row?.l2_status ? "Pending" : row?.l2_status == 1 ? "Approved" : "Rejected",
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Status (L3)',
            selector: (row) => !row?.l3_status ? "Pending" : row?.l3_status == 1 ? "Approved" : "Rejected",
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Attachment',
            width: "200px",
            selector: (row) => row?.attachment ?
                <a href={row?.attachment?.file_url} target="_blank" rel="noreferrer">Attachment {1}</a> : 'NA',
            sortable: false,
        },
        {
            name: 'Action',
            width: "200px",
            selector: (row) => {
                return (
                    <>
                        <div className='user_action'>
                            <span className='pr-4'><Link to={`/edit-challan/view/${row.id}`}><AiOutlineEye/></Link></span>
                            {
                                show_challan_edit_btn(authData.user.user_type, row.l2_status, row.l3_status) ?
                                    <span className='pr-4'><Link
                                        to={`/edit-challan/edit/${row.id}`}><FaEdit/></Link></span> : ""
                            }
                            {/*{
                                show_l1_action_btn(authData.user.user_type, row.l2_status, row.l3_status) ?
                                    <span className='pr-4 text-danger'
                                          onClick={() => delete_budget(row.id)}><MdDelete/></span> : ""
                            }*/}
                        </div>
                    </>
                );
            },
        }
    ];
    const delete_budget = async (budget_id) => {
        if (budget_id) {
            const result = window.confirm("Are you sure you want to delete the budget?");
            if (result) {
                try {
                    let formData = {
                        "budget_id": budget_id
                    }
                    // console.log(data)
                    // const updated_data=data.splice(0,1);

                    //console.log(updated_data);
                    // return false;
                    const budget_response = await delete_budget_by_id(formData);
                    if (budget_response.data.status) {
                        let index = data.findIndex((u) => u.id === budget_id);


                        if (index >= 0) {
                            const updated_data = data.splice(index, 1);
                            await fetchChallans();
                        }
                        toast.success(budget_response.data.message, {
                            position: toast.POSITION.TOP_CENTER
                        });
                    } else {
                        toast.error(budget_response.data.message, {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                } catch (error) {
                    toast.error("getting error while delete user.", {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            }
        } else {
            toast.error("budget id required.", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

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
                columns={columns}
                data={paginatedData}
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

export default ChallanList
