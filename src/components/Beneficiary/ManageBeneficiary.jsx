import React, {useEffect, useState} from 'react'
import {delete_beneficiary_by_id, get_beneficiary, get_users} from '../../helper/Api';
import DataTable from 'react-data-table-component';
import {CustomPagination, show_l1_action_btn, show_l1_action_btn_view} from '../../helper/Utils';
import {useDispatch, useSelector} from 'react-redux';
import {BiSolidEdit} from 'react-icons/bi'
import {AiOutlineEye} from 'react-icons/ai'
import {
    DELETE_BENEFICIARY_START,
    DELETE_BENEFICIARY_SUCCESS,
    GET_BENEFICIARY_FAIL,
    GET_BENEFICIARY_START,
    GET_BENEFICIARY_SUCCESS
} from '../../RTK/Slices/BeneficiarySlice';
import {Link} from 'react-router-dom';
import {MdDelete} from 'react-icons/md';
import {toast} from 'react-toastify';

const ManageBeneficiary = (listType) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const {beneficiaries, loading} = useSelector((state) => state.beneficiaryData);
    const {authData} = useSelector((state) => state.authData);
    const dispatch = useDispatch();

    const [beneficiariesList, setBeneficiaries] = useState(beneficiaries);
    const columns = [
        {
            name: 'Action',
            selector: (row) => {
                return (
                    <span className='user_action'>
                        {show_l1_action_btn_view(authData.user.user_type, row.l2_status, row.l3_status) ?
                            <Link to={`/beneficiary/${row.id}`}>
                                <span><AiOutlineEye/></span>
                            </Link> : ''
                        }

                        {show_l1_action_btn(authData.user.user_type, row.l2_status, row.l3_status) ?
                            <Link to={`/edit-beneficiary/${row.id}`}>
                                <span><BiSolidEdit/></span>
                            </Link> : ""}
                        {show_l1_action_btn(authData.user.user_type, row.l2_status, row.l3_status) ?
                            <span className='pr-4 text-danger'
                                  onClick={() => delete_beneficiary(row.id)}><MdDelete></MdDelete></span> : ""}
              </span>
                );
            },
            sortable: true,
        },
        {
            name: 'Status (L2)',
            selector: (row) => row.l2_status == 0 ? "Pending" : row.l2_status == 1 ? "Approved" : "Rejected",
            sortable: true,
            wrap: true,
            width: "150px"
        },
        {
            name: 'Status (L3)',
            selector: (row) => row.l3_status == 0 ? "Pending" : row.l3_status == 1 ? "Approved" : "Rejected",
            sortable: true,
            wrap: true,
            width: "150px"
        },
        {
            name: 'Beneficiary Name',
            selector: (row) => row.company_name || '-',
            sortable: true,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Bank Name',
            selector: (row) => row.bank_name || '-',
            sortable: true,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Account No',
            selector: (row) => row.account_no || '-',
            sortable: true,
            wrap: true,
            width: "200px"
        },{
            name: 'IFSC',
            selector: (row) => row.ifsc_code || '-',
            sortable: true,
            wrap: true,
            width: "200px"
        },


        {
            name: 'GST No',
            selector: (row) => row.gst_no || '-',
            sortable: true,
            wrap: true,
            width: "150px"
        },
        {
            name: 'PAN',
            selector: (row) => row.pan_no || '-',
            sortable: true,
            wrap: true,
            width: "150px"

        },
        {
            name: 'Contact Person',
            selector: (row) => row.contact_person || '-',
            sortable: true,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Mobile',
            selector: (row) => row.mobile || '-',
            sortable: true,
            wrap: true,
            width: "150px"
        },

    ];
    const fetchBeneficiaries = async () => {
        dispatch(GET_BENEFICIARY_START());
        try {
            const beneficiaries = await get_beneficiary();

            if (beneficiaries.data.status) {
                //
                setBeneficiaries([])
                if (beneficiaries.data.list) {
                    if (listType.listType === 'list') {
                        dispatch(GET_BENEFICIARY_SUCCESS(beneficiaries.data.list))
                        setBeneficiaries(beneficiaries.data.list)
                    } else if (listType.listType === 'actionList' && authData.user.user_type == 'l2') {
                        const list = beneficiaries.data.list.filter(el => el.l2_status == 0);
                        dispatch(GET_BENEFICIARY_SUCCESS(list))
                        setBeneficiaries(list)
                    } else if (listType.listType === 'actionList' && authData.user.user_type == 'l3') {
                        const list = beneficiaries.data.list.filter(el => el.l3_status == 0);
                        dispatch(GET_BENEFICIARY_SUCCESS(list))
                        setBeneficiaries(list)
                    }

                }

            } else {
                dispatch(GET_BENEFICIARY_FAIL(beneficiaries.data.message))
            }
        } catch (error) {
            dispatch(GET_BENEFICIARY_FAIL('something went wrong'))
        }
    }

    useEffect(() => {
        fetchBeneficiaries();
    }, [dispatch])
    // console.log(authData)
    useEffect(() => {
        setBeneficiaries(beneficiaries)
    }, [beneficiaries]);

    useEffect(() => {
        setBeneficiaries(beneficiariesList)
    }, [beneficiariesList]);

    useEffect(() => {
        fetchBeneficiaries();
    }, [listType.listType])

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };
    // console.log(beneficiariesList)
    // const paginatedData = beneficiariesList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const customStyles = {
        headCells: {
            style: {
                fontWeight: "bold",
                fontSize: "14px"
            },
        },
    };

    const delete_beneficiary = async (beneficiary_id) => {
        if (beneficiary_id) {
            const result = window.confirm("Are you sure you want to delete the beneficiary?");
            if (result) {
                try {
                    dispatch(DELETE_BENEFICIARY_START());
                    let formData = {
                        "beneficiary_id": beneficiary_id
                    }
                    const {data} = await delete_beneficiary_by_id(formData);
                    if (data.status) {
                        dispatch(DELETE_BENEFICIARY_SUCCESS({"id": beneficiary_id}));
                        toast.success(data.message, {
                            position: toast.POSITION.TOP_CENTER
                        });
                    } else {
                        toast.error(data.message, {
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
            toast.error("beneficiary id required.", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }
    const handleChangeRowsPerPage = (currentRowsPerPage, currentPage) => {
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(1); // Reset to the first page when rows per page changes
    };

    const paginatedData = beneficiariesList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    return (
        <div>
            <DataTable
                className="dataTables_wrapper"
                customStyles={customStyles}
                progressPending={loading}
                columns={columns}
                data={paginatedData}
                fixedHeader
                fixedHeaderScrollHeight="600px"
                pagination
                paginationPerPage={rowsPerPage}
                paginationTotalRows={beneficiariesList.length}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                /*paginationComponent={() => (
                    <CustomPagination
                        rowsPerPage={rowsPerPage}
                        rowCount={beneficiariesList.length}
                        currentPage={currentPage}
                        onChangePage={handleChangePage}
                    />
                )}*/
            />
        </div>
    )
}

export default ManageBeneficiary
