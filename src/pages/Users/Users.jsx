import React from 'react'
import Tools from "../../components/Tools/Tools"
import ManageUser from '../../components/Users/ManageUser'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Users = () => {
  const {authData}=useSelector((state)=>state.authData);

  return (
    <div>
      <Tools></Tools>
      <div className='addNewScheme' >
        <div className="add_new_user">
          <h4>User List</h4>
          <div>
            {authData.user.user_type=='l3'? <Link to="/add-user">
              <button type="button" className="btn btn-primary">Add New User</button>
            </Link>:""}           
          </div>
        </div>
      </div>
      <div className='scheme p-2'>
        <ManageUser></ManageUser>
      </div>
    </div>
  )
}

export default Users