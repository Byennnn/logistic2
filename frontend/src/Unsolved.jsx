import axios from "axios"
import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { Layout } from 'antd'
import MenuList from "./MenuList"
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";


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
        
            
          
        
            <br></br><h2 className="text-xl font-bold">Inventory Management ( Unsolved Product )</h2><br></br>
            <Link to="/Inventory" className='btn btn-success' >Stock Monitoring</Link>&nbsp;&nbsp;
            <Link to="/Placement" className='btn btn-success'>Stock Placement</Link>&nbsp;&nbsp;
            <Link to="/Quality"className='btn btn-success' >Quality Control</Link>&nbsp;&nbsp;
            <Link to="/Unsolved" className='btn btn-success' >Unsolved Product</Link>&nbsp;&nbsp;
            
          
               
            <table className='table'>
                    <thead>
                        <tr>
                            <th>Receiving Report ID</th>
                            <th>Item Id</th>
                            <th>Quantity Received</th>
                            <th>Received Date</th>
                            <th>Condition</th>
                            <th>Verified By</th>
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
                                    <td>{user.verified}</td>

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