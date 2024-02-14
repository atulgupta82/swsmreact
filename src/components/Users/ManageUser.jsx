import React, { useEffect, useState } from 'react'
import { delete_user_by_id, get_users, reset_user_by_id } from '../../helper/Api';
import DataTable from 'react-data-table-component';
import { CustomPagination } from '../../helper/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { GET_USER_FAIL,GET_USER_START,GET_USER_SUCCESS,DELETE_USER_START,DELETE_USER_FAIL,DELETE_USER_SUCCESS } from '../../RTK/Slices/UserSlice';
import {FaRegEdit, FaUserEdit} from "react-icons/fa"
import {MdDelete, MdDeleteForever} from "react-icons/md"
import {Link} from 'react-router-dom';
import './ManageUser.css';
import { toast } from 'react-toastify';

const ManageUser = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const {user,loading}=useSelector((state)=>state.user);
    const {authData}=useSelector((state)=>state.authData);
    const dispatch=useDispatch();
    const user_type=authData.user.user_type;

    const [users,setUsers]=useState(user);

    const fetchUsers=async()=>{
      dispatch(GET_USER_START());
      try {
        const users=await get_users();
        if(users.data.status){
          dispatch(GET_USER_SUCCESS(users.data.users))
          setUsers(users.data.users)
        }else{
          dispatch(GET_USER_FAIL(users.data.message))
        }
      } catch (error) {
        dispatch(GET_USER_FAIL('something went wrong'))
      }
    }

    useEffect(() => {
        fetchUsers();
    }, [dispatch])
    // console.log(authData)
    useEffect(() => {
      setUsers(user) 
    }, [user]);
  
    const handleChangePage = (page) => {
      setCurrentPage(page);
    };
  
    // const paginatedData = users.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
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
        name: 'Empl. Code',
        selector: (row) => row.code,
        sortable: true,
      },
      {
        name: 'Username',
        selector: (row) => row.user_name,
        sortable: true,
        wrap:true
      },
      {
        name: 'Designation',
        selector: (row) => row.designation,
        sortable: true,
        wrap:true
      },
      {
        name: 'Level',
        selector: (row) => row.user_type,
        sortable: true,
        width:"100px"
      },
      {
        name: 'Mobile No',
        selector: (row) => row.mobile,
        sortable: true,
      },
      {
        name: 'Email',
        selector: (row) => row.email,
        sortable: true,
        wrap:true,
      },
      {
        name: 'Action',
        width:"200px",
        omit:user_type==='l3'?false:true,
        selector: (row) => {
          return (
            <div className='user_action'>
              <span className='text-primary' onClick={()=>reset_user(row.id)}>Reset</span>
              <span className='pr-4'><Link to={`/edit-user/${row.id}`}><FaRegEdit/></Link></span>
              <span className='pr-4 text-danger' onClick={()=>delete_user(row.id)}> <MdDelete></MdDelete></span>
            </div>
          );        
        },
        sortable: true,
      }
    ];
  
    const reset_user=async(user_id)=>{
      // console.log(user_id);
      if(user_id){
        const result = window.confirm("Are you sure you want to reset the user");
        if(result){
          try {
            const {data}=await reset_user_by_id(user_id);
            toast.success(data.message,{
              position: toast.POSITION.TOP_CENTER
            });
          } catch (error) {
            toast.error("getting error while reset user.",{
              position: toast.POSITION.TOP_CENTER
            });
          }
        }
      }else{
        toast.error("user id required.",{
          position: toast.POSITION.TOP_CENTER
        });
      }
    }
  
    const delete_user=async(user_id)=>{
      if(user_id){
        const result = window.confirm("Are you sure you want to delete the user");
        if(result){
          try {
            dispatch(DELETE_USER_START());
            let formData={
              "added_by":authData.user.id
            }
            const {data}=await delete_user_by_id(formData,user_id);
            if(data.status){
              dispatch(DELETE_USER_SUCCESS({"id":user_id}));
              toast.success(data.message,{
                position: toast.POSITION.TOP_CENTER
              });
            }else{
              toast.error(data.message,{
                position: toast.POSITION.TOP_CENTER
              });
            }
            
          } catch (error) {
            toast.error("getting error while delete user.",{
              position: toast.POSITION.TOP_CENTER
            });
          }
        }
      }else{
        toast.error("user id required.",{
          position: toast.POSITION.TOP_CENTER
        });
      }
    }
    const handleChangeRowsPerPage = (currentRowsPerPage, currentPage) => {
        setRowsPerPage(currentRowsPerPage);
        setCurrentPage(1); // Reset to the first page when rows per page changes
    };

    const paginatedData = users.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
    <div>
        <DataTable
            customStyles={customStyles}
            className="dataTables_wrapper"
            progressPending={loading}
            columns={columns}
            data={paginatedData}
            fixedHeader
            fixedHeaderScrollHeight="600px"
            pagination
            paginationPerPage={rowsPerPage}
            paginationTotalRows={users.length}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            /*paginationComponent={()=>(
                <CustomPagination
                rowsPerPage={rowsPerPage}
                rowCount={users.length}
                currentPage={currentPage}
                onChangePage={handleChangePage}
            />
            )}*/
        />
    </div>
  )
}

export default ManageUser
