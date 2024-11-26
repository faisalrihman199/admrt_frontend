import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import SlideShow from '../SlideShow'
import { auth } from '../../firebase/firebase';
import { resetPasswordApi } from '../../service/auth';
import { useLogIn } from '../../hooks/useLogin';

const PasswordReest = () => {
//   const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const logIn = useLogIn();


  //get the email from router state location
  const location= useLocation();
  const email = location.state?.email || '';
  const navigate = useNavigate();
  
    console.log(email);
  const handleResetPassword =async () => {
    try{
    setOtpError('');
    setPasswordError('');
    setErrorMessage('');
    setLoading(true);

    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    const response = await resetPasswordApi(otp, newPassword, email.toLowerCase());
    console.log(response);

    if (response.status == 200) {
        logIn(email, newPassword)
    }

    setSuccessMessage('Your password has been reset successfully.');
    setLoading(false);
    }catch(error){
        setLoading(false);
        console.error(error);
        setErrorMessage('There was an error. Please check your email address and try again.');
    }
  };

  return (
    <div className="login-container min-h-screen md:flex">
      <div className="md:w-1/2">
        <SlideShow />
      </div>
      <section className="max-w-screen-2xl mx-auto px-4 h-full justify-center items-center">
        <div className="flex w-full h-full flex-col items-center justify-center mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white max-w-2xl rounded-lg md:mt-0 sm:max-w-md xl:p-0">
            <div>
              <h1 className="mb-2 font-normal text-3xl lg:text-5xl sm:text-3xl">
                Reset Password
              </h1>
              <p className="mt-4 text-base font-light">
                Password reset code has been sent to your email. Please enter it below.
              </p>

                <div className="mt-10">
                  <div className="mb-4">
                    <h3 className="text-base font-medium">OTP</h3>
                    <input
                      type="text"
                      name="otp"
                      className={`mt-2.5 px-3 py-3 md:py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-blue-600 block w-full rounded-xl focus:ring-1 ${otpError ? 'border-red-500' : ''}`}
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <p className="text-red-500 text-sm mt-1">{otpError}</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-base font-medium">New Password</h3>
                    <input
                      type="password"
                      name="newPassword"
                      className={`mt-2.5 px-3 py-3 md:py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-blue-600 block w-full rounded-xl focus:ring-1`}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <h3 className="text-base font-medium">Confirm New Password</h3>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      className={`mt-2.5 px-3 py-3 md:py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-blue-600 block w-full rounded-xl focus:ring-1 ${passwordError ? 'border-red-500' : ''}`}
                      placeholder="Confirm New Password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                  </div>

                  <div className="mt-5 md:mt-12 social-card bg-blue-500 text-white google border rounded-xl py-2 text-center hover:border-blue-600 hover:shadow-md md:px-16">
                    <button onClick={handleResetPassword} className={`text-center text-gray-800 font-normal py-1 md:py-2 px-4 rounded inline-flex items-center ${loading ? 'cursor-not-allowed' : ''} ${loading ? 'opacity-75' : ''}`}>
                      <span className="ml-1 md:ml-2 text-white">Submit</span>
                      <span className={`${loading ? 'animate-spin' : 'hidden'} mx-2 h-5 w-5 text-white`}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd"
                            d="M12 2a10 10 0 0 0-9.707 6.293A10 10 0 0 0 5.293 15.707a10 10 0 0 0 10.586 10.586c2.33 0 4.66-.919 6.38-2.44l1.414 1.414a1 1 0 0 0 1.414 0l1.414-1.414A10 10 0 0 0 12 22.707A10 10 0 0 0 22.707 12a10 10 0 0 0-10.586-10.586c-2.33 0-4.66.919-6.38 2.44l-1.414-1.414a1 1 0 0 0-1.414 0l-1.414 1.414A10 10 0 0 0 12 2z" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>

              {successMessage && <p className="text-green-500 my-4">{successMessage}</p>}
              {errorMessage && <p className="text-red-500 my-4">{errorMessage}</p>}
              <div className="my-4 text-center underline decoration-solid text-blue-600 cursor-pointer hover:text-blue-600">
                <Link to={"/login"}>Back to Login</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PasswordReest;
