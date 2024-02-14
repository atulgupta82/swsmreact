import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {delete_budget_by_id, get_budget_list} from '../../../helper/Api';
import DataTable from 'react-data-table-component';
import {AddCommasToAmount, CustomPagination, show_l1_action_btn} from '../../../helper/Utils';
import {AiOutlineEye} from 'react-icons/ai';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import {MdDelete} from 'react-icons/md';
import {FaEdit} from 'react-icons/fa';
import {GET_BENEFICIARY_SUCCESS} from "../../../RTK/Slices/BeneficiarySlice";

const BudgetList = (listType) => {
    const {authData} = useSelector((state) => state.authData);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);

    const fetchBudgets = async () => {
        try {
            const {data} = await get_budget_list('', '');
            setData([])

            if (data.budgets) {
                if (listType.listType === 'list') {
                    setData(data.budgets)
                } else if (listType.listType === 'actionList' && authData.user.user_type == 'l2') {
                    const list = data.budgets.filter(el => el.l2_status == 0);
                    setData(list)
                } else if (listType.listType === 'actionList' && authData.user.user_type == 'l3') {
                    const list = data.budgets.filter(el => el.l3_status == 0);
                    setData(list)
                }

            }
            // setData(data.budgets);
        } catch (error) {
            setData([]);
        }
    }

    useEffect(() => {
        fetchBudgets();
    }, [])

    useEffect(() => {
        fetchBudgets();
    }, [listType.listType])


    // const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
            name: 'Scheme code',
            selector: (row) => <b>{row.scheme_code}</b>,
            wrap: true,
            sortable: true,
            width: "200px",
        },
        {
            name: 'Subhead Code',
            selector: (row) => <b>{row.subhead_code}</b>,
            wrap: true,
            sortable: true,
            width: "200px",

        },
        {
            name: 'Financial Year',
            selector: (row) => {
                return (<b>{row.start_year + "-" + row.end_year}</b>);
            },
            sortable: true,
            wrap: true,
            width: "150px"
        },
        {
            name: 'Budget Date',
            selector: (row) => <b>{row.budget_date}</b>,
            sortable: true,
            width: "150px",
            wrap: true

        },
        {
            name: 'Budget',
            selector: (row) => <b>{AddCommasToAmount(row.budget)}</b>,
            sortable: true,
            width: "150px",
            wrap: true,
            right: true
        },
        {
            name: 'Status (L2)',
            selector: (row) => row.l2_status == 0 ? "Pending" : row.l2_status == 1 ? "Approved" : "Rejected",
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Status (L3)',
            selector: (row) => row.l3_status == 0 ? "Pending" : row.l3_status == 1 ? "Approved" : "Rejected",
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Action',
            width: "200px",
            selector: (row) => {
                return (
                    <>
                        <div className='user_action'>
                            <span className='pr-4'><Link to={`/view-budget/${row.id}`}><AiOutlineEye/></Link></span>
                            {
                                show_l1_action_btn(authData.user.user_type, row.l2_status, row.l3_status) ?
                                    <span className='pr-4'><Link
                                        to={`/edit-budget/${row.id}`}><FaEdit/></Link></span> : ""
                            }
                            {
                                show_l1_action_btn(authData.user.user_type, row.l2_status, row.l3_status) ?
                                    <span className='pr-4 text-danger'
                                          onClick={() => delete_budget(row.id)}><MdDelete></MdDelete></span> : ""
                            }
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
                            fetchBudgets();
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

    const handleChangePage = (page) => {
       // console.log('page', page)
        setCurrentPage(page);
    };

    const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  //  console.log('currentPagecurrentPage', currentPage)

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

export default BudgetList
