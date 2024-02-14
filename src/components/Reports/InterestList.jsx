import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux';
import DataTable from 'react-data-table-component';
import {AiOutlineEye} from 'react-icons/ai';
import {Link} from 'react-router-dom';
import {getInterestReports} from "../../helper/Api";
import {CustomPagination} from "../../helper/Utils";

const InterestList = () => {
    const {authData} = useSelector((state) => state.authData);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);

    const fetchReports = async () => {
        try {
            const data = await getInterestReports();
            if (data.data.status) {
                setData(data.data.result);
            }
        } catch (error) {
            setData([]);
        }
    }

    useEffect(() => {
        fetchReports();
    }, [])

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

    const getBalanceInterest = (rowD) => {
        const rowIndex = data.findIndex(el => el.id == rowD.id)
        let balance = 0;
        for (let i = 0; i <= rowIndex; i++) {
            const row = data[i];
            if (row.deposite_amount !== "") {
                balance += parseInt(row.deposite_amount);
            }
            if (row.interest_earned !== "") {
                balance -= parseInt(row.interest_earned);
            }
        }
        return Math.abs(balance);
    }

    const columns = [
        {
            name: 'Transaction Date',
            selector: (row) => <span>{row.transaction_date}</span>,
            wrap: true,
            sortable: true,
            width: "180px",
        },
        {
            name: 'Transaction /Challan reference Number',
            selector: (row) => <span>{row.transaction_no}</span>,
            wrap: true,
            sortable: true,
            width: "300px",

        },
        {
            name: 'Particulars',
            selector: (row) => {
                if (!row.isFooter) {
                    return <span>{row.particulars || 'NA'}</span>;
                }
            },
            sortable: true,
            wrap: true,
            width: "150px"
        },
        {
            name: 'Deposit Amount',
            selector: (row) => <span>{row.deposite_amount || 0}</span>,
            sortable: true,
            width: "180px",
            wrap: true

        },
        {
            name: 'Interest Earned',
            selector: (row) => <span>{row.interest_earned || 0}</span>,
            sortable: true,
            width: "180px",
            wrap: true,
        },
        {
            name: 'Balance Interest',
            selector: (row) =>
                <span>{getBalanceInterest(row) ? getBalanceInterest(row) : row?.balance_interest ? row.balance_interest : 0}</span>,
            sortable: true,
            width: "200px",
            right: false
        },
        {
            name: 'Verification Status',
            selector: (row) => {
                if (!row.isFooter) {
                    return <span>{row.verification_status || 'NA'}</span>;
                }
            },
            sortable: true,
            width: "200px",
            right: false
        },
        {
            name: 'Details',
            width: "100px",
            selector: (row) => {
                return (
                    <>
                        {row.deposite_amount && !row?.isFooter ? (
                            <div className='user_action'>
                            <span className='pr-4'><Link
                                to={`/edit-challan/view/${row.id}`}><AiOutlineEye/></Link></span>
                            </div>
                        ) : ''
                        }
                    </>
                );
            },
        }
    ];

    const calculateTotalDepositAmount = () => {
        let total = 0;
        data.forEach((row) => {
            const depositAmount = parseFloat(row.deposite_amount);
            if (!isNaN(depositAmount)) {
                total += depositAmount;
            }
        });
        return total.toFixed(2); // Format the total to a fixed number of decimal places if needed.
    };
    const calculateTotalInterestAmount = () => {
        let total = 0;
        data.forEach((row) => {
            const interest_earned = parseFloat(row.interest_earned);
            if (!isNaN(interest_earned)) {
                total += interest_earned;
            }
        });
        return total.toFixed(2); // Format the total to a fixed number of decimal places if needed.
    };

    const totalDepositAmount = calculateTotalDepositAmount();
    const totalInterestEarned = calculateTotalInterestAmount();
    const lastDataItem = data[data.length - 1];
    const balanceInterest = getBalanceInterest(lastDataItem);
    // const balanceInterest = getBalanceInterest(lastDataItem);
    const footerRow = {
        isFooter: true,
        transaction_date: <b>Total</b>,
        deposite_amount: <b>{totalDepositAmount}</b>,
        interest_earned: <b>{totalInterestEarned}</b>,
        balance_interest: <b>{balanceInterest}</b>,
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

export default InterestList
