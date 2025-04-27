import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "./config/UserContext";
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const {apiURL} = useContext(UserContext);
  


  useEffect(() => {
    axios.get(`${apiURL}/api/warehouses`)
      .then((response) => setWarehouses(response.data))
      .catch((error) => console.error("Error fetching warehouses:", error));
  }, []);


  return (
    <div className="flex">
    <Sidebar />
     <div className="flex-col w-full">
     <Search />
    

    <div className='p-6'>
        <div className="Receivingform">
        <h1 className="text-2x1 font-bold">Warehouse System</h1>
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
                            <th>Company ID</th>
                            <th>Company Name</th>
                            <th>Company Address</th>
                            <th>Product Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
      <tbody>
        {warehouses.map((warehouse) => {
             return <tr>
                <td>{warehouse._id}</td>
                <td>{warehouse.name}</td>
                <td>{warehouse.location}</td>
                <td>{warehouse.description}</td>
                
                 <th>
                    <button to="/delete" className='btn btn-success'>Update</button>&nbsp; &nbsp;
                      <button to="/delete" className='btn btn-danger'>Delete</button>
                  </th>

          </tr>
})}
      
      </tbody>
      </table>
    </div>

    </div>
    </div>
  );
};

export default WarehouseList;