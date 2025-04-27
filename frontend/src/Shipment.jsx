
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
            

            <div className='p-6'>
                <div className="Receivingform">
                <h1 className="text-2x1 font-bold">Shipment Scheduling</h1>
                <br></br>
                </div>
            <div className="flex justify-between items-center">
                    <input
                        type="text"
                        placeholder="Search By"
                        className="px-4 py-0.5 border"
                    />
                    <div className="space-x-4">
                    <button className="px-2 py-1 bg-teal-700 text-white hover:bg-teal-800">Pending </button>
                    <button className="px-2 py-1 bg-teal-700 text-white hover:bg-teal-800">Approved </button>
                    <button className="px-2 py-1 bg-teal-700 text-white hover:bg-teal-800">Rejected </button></div>
            </div>
            <br></br>
            <table className='table'>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Received From</th>
                            <th>Quantity Received</th>
                            <th>Received Date</th>
                            <th>Shipment Schedule</th>
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
                                    <td>{user.condition2}</td>
                                    <td>{user.verified}</td>

                                    <th>
                                        <Link to={`/viewship/${user._id}`} className='btn btn-success'>View</Link>
                                        &nbsp; &nbsp;
                                        <button to="/delete" className='btn btn-danger' 
                                        onClick={(e) => handleDelete(user._id)}>Delete</button>
                                    </th>
                                    

                                </tr>
                            })
                        }
                    </tbody>

                </table>
                
                  
                
            </div>
            </div>        
            
            
               
                
        </div>
     
        
    )
}

export default Users;