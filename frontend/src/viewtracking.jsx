import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from "react";
import { UserContext } from "./config/UserContext";
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";
import"./App.css";


function UpdateUser () {
    const {id} = useParams()
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [age, setAge] = useState()
    const [date, setDate] = useState()
    const [condition, setCondition] = useState()
    const [condition2, setCondition2] = useState()
    const [verified, setVerified] = useState()
    const navigate = useNavigate()
    const {apiURL} = useContext(UserContext); 

    useEffect(() => {
        axios.get(`${apiURL}/getUser/`+id)
        .then(result => {console.log(result)
            setName(result.data.name)
            setEmail(result.data.email)
            setAge(result.data.age)
            setDate(result.data.date)
            setCondition(result.data.condition)
            setCondition2(result.data.condition2)
            setVerified(result.data.verified)

        })
        .catch(err => console.log(err))
    }, [] )

const Update = (e) => {
    e.preventDefault();
    axios.put(`${apiURL}/updateUser/`+id, {name, email, age, date, condition, condition2, verified})
        .then(result => {
            console.log(result)
            navigate('/Tracking')

            

        })
        .catch(err => console.log(err))
}





    return (
        <div className="flex">
      <Sidebar />
      <div className="flex-col w-full">
        <Search />
        
        <div className="max-w-3xl mx-auto mt-8 bg-white p-8 rounded-md shadow-md text-black">
               <div className='Receivingform'>
               <form onSubmit={Update}>
                <h1 className="text-2xl font-bold mb-8 text-center">Tracking System</h1>
                <br></br>
                
        <div className="flex space-x-3 mb-3">
            <p className="text-lg font-bold">Product :</p>
            <p className="font-medium">{name}</p>
        </div> 
        <div className="flex space-x-3 mb-3">
            <p className="text-lg font-bold">Received From :</p>
            <p className="font-medium">{email}</p>
            
        </div> 
        <div className="flex space-x-3 mb-3">
            <p className="text-lg font-bold">Quantity :</p>
            <p className="font-medium">{age}</p>
            
        </div> 
        <div className="flex space-x-3 mb-3">
            <p className="text-lg font-bold">Date of Purchase :</p>
            <p className="font-medium">{date}</p>
            
        </div> 
        <div className="flex space-x-3 mb-3">
            <p className="text-lg font-bold">Status : </p>
            <p className="font-medium">{condition}</p>
            
        </div> 
        <div className="flex space-x-3 mb-3">
            <p className="text-lg font-bold">Date of Shipment :</p>
            <p className="font-medium">{condition2}</p>
            
        </div> 
        <div className="flex space-x-3 mb-3">
            <p className="text-lg font-bold">Accept By :</p>
            <p className="font-medium">{verified}</p>
            </div>

          
                    <br></br>
                    <button className='btn btn-success'>Back</button>

            </form>
        </div>  
        </div>
        </div>
        </div>
    )
}

export default UpdateUser;