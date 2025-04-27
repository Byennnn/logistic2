// REFENCE COPY
import { useContext, useState } from "react";

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// REFENCE COPY
import { UserContext } from "./config/UserContext";

function CreateUser () {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [age, setAge] = useState()
    const [date, setDate] = useState()
    const [condition, setCondition] = useState()
    const [condition2, setCondition2] = useState()
    const [verified, setVerified] = useState()
    const navigate = useNavigate()
    

    // REFENCE COPY
    const {apiURL} = useContext(UserContext); 

    const Submit = (e) => {
        e.preventDefault();
        axios.post(`${apiURL}/createUser`, {name, email,age,date,condition,condition2,verified})
        .then(result => {
            console.log(result)
            navigate('/Warehouse')

        })
        .catch(err => console.log(err))
    }

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className='w-50 bg-white rounded p-3'>
                <form onSubmit={Submit}>
                    <h2>Add Product</h2>
                    <div className='mb=2'>
                        <label htmlFor="">Product Name</label>
                        <input type="text" placeholder='Enter the Product Name' className='form-control' 
                        onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className='mb=2'>
                        <label htmlFor="">Received From</label>
                        <input type="text" placeholder='Enter the Store/Company' className='form-control'
                        onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='mb=2'>
                        <label htmlFor="">Quantity</label>
                        <input type="text" placeholder='Enter the Quantity' className='form-control'
                        onChange={(e) => setAge(e.target.value)} />
                    </div>
                    <div className='mb=2'>
                        <label htmlFor="">Date</label>
                        <input type="text" placeholder='Enter the Date' className='form-control'
                        onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className='mb=2'>
                        <label htmlFor="">Status</label>
                        <input type="text-bold" placeholder='Pending Order' className='form-control' defaultValue={"Pending Orders"}
                        onChange={(e) => setCondition(e.target.value)} />
                    </div>
                    <div className='mb=2'>
                        <label htmlFor="">Shipment Schedule</label>
                        <input type="text-bold" placeholder='No Schedule' className='form-control' defaultValue={"No Schedule"}
                        onChange={(e) => setCondition2(e.target.value)} />
                    </div>
                    <div className='mb=2'>
                        <label htmlFor="">Verified By</label>
                        <input type="text" placeholder='Name who verified ?' className='form-control'
                        onChange={(e) => setVerified(e.target.value)} />
                    </div>
                    <br></br>
                    <button className='btn btn-success'>Submit</button>
                </form>
            </div>
        </div>    
    )
}

export default CreateUser;