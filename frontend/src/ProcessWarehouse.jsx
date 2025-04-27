import axios from "axios"
import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { Layout } from 'antd'
import MenuList from "./MenuList"
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";
import { useContext } from "react";
import { UserContext } from "./config/UserContext";



function Users () {
    const [users, setUsers] = useState([])
    const {Header, Sider} = Layout;

    const {apiURL} = useContext(UserContext);
    
    useEffect(() => {
        axios.get(`${apiURL}`)
        .then(result => setUsers(result.data))
        .catch(err => console.log(err))
    }, [])

    const handleDelete = (id) => {
        axios.delete(`${apiURL}/deleteUser/`+id)
        .then(res => {console.log(res)
            window.location.reload()})
        .catch(errr => console.log(errr))
    }
    return (
        <div className="flex">
        <Sidebar />
        <div className="flex-col w-full">
          <Search />
          
        
        
            
                
          <br></br> <h2 className="text-xl font-bold">Warehouse Management ( Process )</h2><br></br>
                <Link to="/Warehouse" className='btn btn-success' >Receiving Item</Link>&nbsp;&nbsp;
                <Link to="/Process" className='btn btn-success'>Processs</Link>&nbsp;&nbsp;
                <Link to="/Stock" className='btn btn-success' >Stock Placement</Link>&nbsp;&nbsp;
                <Link to="/Out" className='btn btn-success' >Outbound</Link>&nbsp;&nbsp;
            
               
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Receiving Report ID</th>
                            <th>Item Id</th>
                            <th>Quantity Received</th>
                            <th>Received Date</th>
                            <th>Condition</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user) => {
                                return <tr>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.age}</td>
                                    <td>{user.date}</td>
                                    <td>{user.condition}</td>

                                    <th>
                                        <Link to={`/update/${user._id}`} className='btn btn-success'>Update</Link>
                                        &nbsp; &nbsp;
                                        <button to="/delete" className='btn btn-danger' 
                                        onClick={(e) => handleDelete(user._id)}>Delete</button>
                                    </th>

                                </tr>
                            })
                        }
                    </tbody>

                </table>
                <Link to="/create" className='btn btn-success'>Add Product</Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                               &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  
                
            </div>
            </div>
           
     
        
    )
}

export default Users;