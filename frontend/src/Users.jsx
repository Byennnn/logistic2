import { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./config/UserContext";

function App() {
  const context = useContext(UserContext);
  const { apiURL } = context;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showOtpField, setShowOtpField] = useState(false);
  
  const navigate = useNavigate();

  const handleInitiateLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await axios.post(
        `${apiURL}/api/auth/initiate-login`,
        { email, password }
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
        `${apiURL}/api/auth/verify-login-otp`,
        { email, otp }
      );
      
      localStorage.setItem("token", response.data.token);
      console.log(response.data.token);
      console.log(response.data.user);
      window.alert("Login Successful!");
      navigate("/FinishedProductTransfers");
    } catch (error) {
      setError(error.response?.data?.error || "Invalid OTP. Please try again.");
      console.log(error);
    }
  };

  return (
    <section className="Design grid md:grid-cols-2 grid-cols-1">
      <div className="Loginform">
        <h1 align="left" className="text-xl font-bold">Log in</h1><br />
        
        {!showOtpField ? (
          // Initial login form
          <div>
            <form onSubmit={handleInitiateLogin}>
              <div className="mb-3" align="left">
                <label htmlFor="email"><strong>Email</strong></label>
                <input 
                  type="email" 
                  placeholder="Enter your Email" 
                  name="email" 
                  autoComplete="off" 
                  className="form-control rounded-0" 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3" align="left">
                <label htmlFor="password"><strong>Password</strong></label>
                <input 
                  type="password" 
                  placeholder="Enter your Password" 
                  name="password" 
                  autoComplete="off" 
                  className="form-control rounded-0" 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100 rounded-0">Continue</button>
            </form>
          </div>
        ) : (
          // OTP verification form
          <div>
            <form onSubmit={handleVerifyOTP}>
              <div className="mb-3" align="left">
                <label htmlFor="otp"><strong>Verification Code</strong></label>
                <input 
                  type="text" 
                  placeholder="Enter OTP sent to your email" 
                  name="otp" 
                  autoComplete="off" 
                  className="form-control rounded-0" 
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100 rounded-0">Verify & Login</button>
              <button 
                type="button" 
                className="btn btn-link w-100" 
                onClick={handleInitiateLogin}
              >
                Resend OTP
              </button>
            </form>
          </div>
        )}
        
        {message && <p className="text-success mt-3">{message}</p>}
        {error && <p className="text-danger mt-3">{error}</p>}
      </div>
      
      <div className="Loginform">
        <h2>Logistic II</h2>
      </div>
    </section>
  );
}

export default App;