import { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./config/UserContext";

function Users() {
  const { apiURL } = useContext(UserContext);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showOtpField, setShowOtpField] = useState(false);
  
  const navigate = useNavigate();

  const handleInitiateSignup = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await axios.post(
        `${apiURL}/api/auth/initiate-signup`,
        { name, email, password }
      );
      
      if (response.data.requireOTP) {
        setShowOtpField(true);
        setMessage("OTP sent to your email. Please check and enter below.");
      }
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred. Please try again.");
      console.log(error);
    }
  };
  
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await axios.post(
        `${apiURL}/api/auth/verify-signup-otp`,
        { name, email, password, otp }
      );
      
      localStorage.setItem("token", response.data.token);
      window.alert("Account created successfully!");
      navigate("/Login"); // Redirect to login page
    } catch (error) {
      setError(error.response?.data?.error || "Invalid OTP. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>{showOtpField ? "Verify Email" : "Register Form"}</h2>
        
        {!showOtpField ? (
          // Initial signup form
          <form onSubmit={handleInitiateSignup}>
            <div className="mb-3">
              <label htmlFor="name">
                <strong>Name</strong>
              </label>
              <input 
                type="text"
                placeholder="Enter Name"
                autoComplete="off"
                name="name"
                className="form-control rounded-0"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
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
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">
                <strong>Password</strong>
              </label>
              <input 
                type="password"
                placeholder="Enter Password"
                autoComplete="off"
                name="password"
                className="form-control rounded-0"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100 rounded-0">Register</button>
          </form>
        ) : (
          // OTP verification form
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-3">
              <label htmlFor="otp">
                <strong>Verification Code</strong>
              </label>
              <input 
                type="text"
                placeholder="Enter OTP sent to your email"
                autoComplete="off"
                name="otp"
                className="form-control rounded-0"
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100 rounded-0">Verify & Complete Signup</button>
            <button 
              type="button" 
              className="btn btn-link w-100" 
              onClick={handleInitiateSignup}
            >
              Resend OTP
            </button>
          </form>
        )}
        
        {message && <p className="text-success mt-3">{message}</p>}
        {error && <p className="text-danger mt-3">{error}</p>}
        
        <p className="mt-3">Already have an Account?</p>
        <Link to="/Login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
          Login Now
        </Link>
      </div>
    </div>
  );
}

export default Users;