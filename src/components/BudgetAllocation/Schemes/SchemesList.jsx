import {useEffect, useState} from 'react';
import DataTable from 'react-data-table-component';
import {delete_scheme_by_id, generate_xml_of_payment_by_scheme_id, get_schemes} from '../../../helper/Api';
import {CustomPagination, AddCommasToAmount, show_l1_action_btn} from '../../../helper/Utils';
import {
    DELETE_SCHEME_START,
    DELETE_SCHEME_SUCCESS,
    GET_SCHEME_FAIL,
    GET_SCHEME_START,
    GET_SCHEME_SUCCESS
} from '../../../RTK/Slices/SchemeSlice';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {AiOutlineEye} from 'react-icons/ai';
import {FaEdit, FaInfoCircle} from 'react-icons/fa';
import {MdDelete} from 'react-icons/md';
import {toast} from 'react-toastify';

const subcolumns = [

    {
        name: 'id',
        selector: (row) => '',
        width: "50px"
    },
    {
        name: 'Code',
        selector: (row) => row.code,
        width: "150px",
    },
    {
        name: 'Department Name',
        selector: (row) => "",
        width: "260px",
        wrap: true,

    },
    {
        name: 'Scheme Name',
        selector: (row) => row.name,
        sortable: true,
        wrap: true,
        width: "350px"
    },
    {
        name: 'Scheme Type',
        selector: (row) => row.type,
        sortable: true,
        width: "240px"
    },
    {
        name: 'Financial Year',
        selector: (row) => row.financial_year,
        sortable: true,
        width: "200px"
    },
    {
        name: 'Provisioned Budget',
        selector: (row) => <b>{AddCommasToAmount(row.provisional_budget)}</b>,
        sortable: true,
        width: "200px",
        wrap: true,
        right: true
    },
    {
        name: 'Released Budget',
        selector: (row) => AddCommasToAmount(row.budget),
        sortable: true,
        width: "200px",
        wrap: true,
        right: true
    },
    {
        name: 'Under Approval',
        selector: (row) => AddCommasToAmount(row.pending_budget),
        sortable: true,
        width: "200px",
        wrap: true,
        right: true
    },
    {
        name: 'Sanction Amount',
        selector: (row) => row.utilised_budget ? AddCommasToAmount(row.utilised_budget) : 0,
        sortable: true,
        right: true
    },
    {
        name: 'Paid Payment',
        selector: (row) => row.total_payment ? AddCommasToAmount(row.total_payment) : 0,
        sortable: true,
        right: true
    },
    {
        name: 'Pending Payment',
        selector: (row) => row.total_payment ? AddCommasToAmount(row.utilised_budget - row.total_payment) : 0,
        sortable: true,
        right: true
    },
    {
        name: 'Budget Balance',
        selector: (row) => row.balance ? AddCommasToAmount(row.balance) : 0,
        sortable: true,
        right: true
    },
    {
        name: 'Status (l2)',
        selector: (row) => "",
        sortable: true,
        width: "150px",
        right: false
    },
    {
        name: 'Status (l3)',
        selector: (row) => "",
        sortable: true,
        width: "150px",
        right: false
    },
    {
        name: 'attachment',
        selector: (row) => '',
        width: "200px",
    },
    {
        name: 'Action',
        selector: (row) => '',
        width: "200px",
    }
];
const ExpandedComponent = ({data}) => {
    let sub_heads = data.sub_head_list;
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

export function SchemesList(listType) {
    const {authData} = useSelector((state) => state.authData);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const {schemes, loading} = useSelector((state) => state.schemeData);
    const dispatch = useDispatch();
    const [schemesList, setSchemesList] = useState(schemes);

    const fetchSchemes = async () => {
        dispatch(GET_SCHEME_START());
        try {
            const schemes = await get_schemes();
            if (schemes.data.status) {
                if (schemes.data.schemes) {
                    if (listType.listType === 'list') {
                        dispatch(GET_SCHEME_SUCCESS(schemes.data.schemes));
                    } else if (listType.listType === 'actionList' && authData.user.user_type == 'l2') {
                        const list = schemes.data.schemes.filter(el => el.l2_status == 0);
                        dispatch(GET_SCHEME_SUCCESS(list));
                    } else if (listType.listType === 'actionList' && authData.user.user_type == 'l3') {
                        const list = schemes.data.schemes.filter(el => el.l3_status == 0);
                        dispatch(GET_SCHEME_SUCCESS(list));
                    }

                }
                // dispatch(GET_SCHEME_SUCCESS(schemes.data.schemes));

            } else {
                dispatch(GET_SCHEME_FAIL(schemes.data.message));
            }
        } catch (error) {
            dispatch(GET_SCHEME_FAIL('something went wrong'));
        }

    }
    useEffect(() => {
        fetchSchemes();
    }, [dispatch])

    useEffect(() => {
        fetchSchemes();
    }, [listType.listType])

    useEffect(() => {
        setSchemesList(schemes)
    }, [schemes]);
    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

   // const paginatedData = schemesList?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
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
            selector: (row) => <b>{row.code}</b>,
            wrap: true,
            sortable: true,
            width: "200px",
        },
        {
            name: 'Department Name',
            selector: (row) => <b>{row.department}</b>,
            wrap: true,
            sortable: true,
            width: "200px",

        },
        {
            name: 'Scheme Name',
            selector: (row) => {
                return (<b>{row.name}</b>);
            },
            sortable: true,
            wrap: true,
            width: "400px"
        },
        {
            name: 'Scheme Type',
            selector: (row) => <b>{row.type}</b>,
            sortable: true,
            width: "200px",
            wrap: true
        },
        {
            name: 'Financial Year',
            selector: (row) => row.financial_year,
            sortable: true,
            width: "200px"
        },
        {
            name: 'Provisioned Budget',
            selector: (row) => <b>{AddCommasToAmount(row.total_provisional_budget)}</b>,
            sortable: true,
            width: "200px",
            wrap: true,
            right: true
        },
        {
            name: 'Released Budget',
            selector: (row) => <b>{AddCommasToAmount(row.total_budget)}</b>,
            sortable: true,
            width: "200px",
            wrap: true,
            right: true
        },
        {
            name: 'Under Approval',
            selector: (row) => <b>{AddCommasToAmount(row.pending_budget)}</b>,
            sortable: true,
            width: "200px",
            wrap: true,
            right: true
        },
        {
            name: 'Sanction Amount',
            selector: (row) => <b>{row.utilised_budget ? AddCommasToAmount(row.utilised_budget) : 0}</b>,
            sortable: true,
            wrap: true,
            width: "200px",
            right: true
        },
        {
            name: 'Paid Payment',
            selector: (row) => <b>{row.total_payment ? AddCommasToAmount(row.total_payment) : 0}</b>,
            sortable: true,
            width: "200px",
            right: true
        },
        {
            name: 'Pending Payment',
            selector: (row) =>
                <b>{row.total_payment ? AddCommasToAmount(row.utilised_budget - row.total_payment) : 0}</b>,
            sortable: true,
            width: "200px",
            right: true
        },

        {
            name: 'Budget Balance',
            selector: (row) => <b>{row.balance ? AddCommasToAmount(row.balance) : 0}</b>,
            sortable: true,
            width: "200px",
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
            name: 'Attachment',
            width: "200px",
            selector: (row) => {
                const files = row.attachments
                return (
                    files.map((file, i) => {
                        return (
                            <a href={file.file_url} target="_blank">attachment {i + 1}</a>
                        );
                    })
                );
            },
            sortable: true,
        },
        {
            name: 'Action',
            width: "200px",
            selector: (row) => {
                return (
                    <>
                        <div className='user_action'>
                            <span className='pr-4'><Link to={`/schemes/${row.id}`}><FaInfoCircle/></Link></span>
                            <span className='pr-4'><Link to={`/view-scheme/${row.id}`}><AiOutlineEye/></Link></span>
                            {
                                show_l1_action_btn(authData.user.user_type, row.l2_status, row.l3_status) ?
                                    <span className='pr-4'><Link
                                        to={`/edit-scheme/${row.id}`}><FaEdit/></Link></span> : ""
                            }
                            {
                                show_l1_action_btn(authData.user.user_type, row.l2_status, row.l3_status) ?
                                    <span className='pr-4 text-danger'
                                          onClick={() => delete_scheme(row.id)}><MdDelete></MdDelete></span> : ""
                            }
                        </div>
                    </>
                );
            },
        }
    ];

    const delete_scheme = async (scheme_id) => {
        if (scheme_id) {
            const result = window.confirm("Are you sure you want to delete the scheme?");
            if (result) {
                try {
                    dispatch(DELETE_SCHEME_START());
                    let formData = {
                        "scheme_id": scheme_id
                    }
                    const {data} = await delete_scheme_by_id(formData);
                    if (data.status) {
                        dispatch(DELETE_SCHEME_SUCCESS({"id": scheme_id}));
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
            toast.error("scheme id required.", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    const handleChangeRowsPerPage = (currentRowsPerPage, currentPage) => {
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(1); // Reset to the first page when rows per page changes
    };

    const paginatedData = schemesList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <DataTable
            customStyles={customStyles}
            className="dataTables_wrapper"
            columns={columns}
            progressPending={loading}
            data={paginatedData}
            fixedHeader
            fixedHeaderScrollHeight="600px"
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            pagination
            paginationPerPage={rowsPerPage}
            paginationTotalRows={schemesList?.length}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            /*paginationComponent={() => (
                <CustomPagination
                    rowsPerPage={rowsPerPage}
                    rowCount={schemesList?.length}
                    currentPage={currentPage}
                    onChangePage={handleChangePage}
                />
            )}*/
        />
    );
}
