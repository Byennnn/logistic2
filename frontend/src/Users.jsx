import { useState } from "react";
import"./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./config/UserContext";
import {useContext} from 'react'


function App () {

    const context = useContext(UserContext) ;

    const {apiURL} = context; 
       const [email, setEmail] = useState('')
       const [password, setPassword] = useState('')
       const [error, setError] = useState(null)
       const navigate = useNavigate()

       const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post(
                `${apiURL}/api/auth/login`,
                { email, password }
                    
            );
            localStorage.setItem("token",response.data.token)
            console.log(response.data.token)
            console.log(response.data.user)
            window.alert("Login Successfully!")
            navigate("/FinishedProductTransfers")
        }catch (error) {
            console.log(error);
        }
    };
 
    return (
        <section className="Design grid md:grid-cols-2 grid-cols-1" >    
     
           
            <div className="Loginform">
                <h1 align="left" className="text-xl font-bold">Log in</h1><br></br>
                
               
                <div>
                <form onSubmit={handleSubmit}>
                    <div className= 'mb-3' align="left">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder='Enter your Email' name='email' autoComplete='off' 
                        className='form-control rounded-0' onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    <div className= 'mb-3'align="left">
                        <label htmlFor="email"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter your Password' name='email' required
                         autoComplete='off' className='form-control rounded-0' onChange={(e) => setPassword(e.target.value)}></input>
                    </div>

                    <button type="submit" className="btn btn-success w-100 rounded-0">Log In</button>

                    {error && <p className="text-white-500">{error}</p>}
                     
                   
                   
                </form>
              
                </div>

          
           
            
            </div>
            <div className="Loginform">
            <h2>Logistic II</h2>
        
            </div>
        </section> 
    )
}

export default App