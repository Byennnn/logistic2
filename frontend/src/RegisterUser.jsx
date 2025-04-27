import { useContext, useState } from "react";
import"./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { UserContext } from "./config/UserContext";

function Users () {

    const {apiURL} = useContext(UserContext); 
        const [name, setName] = useState()
        const [email, setEmail] = useState()
        const [password, setPassword] = useState()
        const navigate = useNavigate()

        const handleSubmit = (e) => {
            e.preventDefault();
            axios.post(`${apiURL}/register`, {name, email, password})
            .then(result => {console.log(result)
            navigate('/Users')
        })
            .catch(err => console.log(err))
        }   

    return (
        <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Register Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb 3">
                        <label htmlFor="email">
                            <strong>Name</strong>
                        </label>
                        <input 
                            type="text"
                            placeholder="Enter Name"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e) => setName(e.target.value)}
                            ></input>
                    </div>
                    <div className="mb 3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input 
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e) => setEmail(e.target.value)}
                            ></input>
                    </div>
                    <div className="mb 3">
                        <label htmlFor="email">
                            <strong>Password</strong>
                        </label>
                        <input 
                            type="password"
                            placeholder="Enter Password"
                            autoComplete="off"
                            name="password"
                            className="form-control rounded-0"
                            onChange={(e) => setPassword(e.target.value)}
                            ></input>
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">Register</button>
                    
                    <p>Already have an Account ?</p>
                    <Link to="/Users" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">LogIn Now</Link>
                </form>

            </div>

        </div>

    )
}

export default Users