import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import SlideShow from '../SlideShow'
import { auth } from '../../firebase/firebase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      setEmailError('');
      setSuccessMessage('');
      setErrorMessage('');

      if (!/\S+@\S+\.\S+/.test(email)) {
        setEmailError('Invalid email address');
        return;
      }

      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Password reset email sent. Check your inbox for further instructions.');
    } catch (error) {
      console.error(error);
      setErrorMessage('There was an error. Please check your email address and try again.');
    }
  };

  return (
    <div className="login-container min-h-screen md:flex ">
    <div className="md:w-1/2">
      <SlideShow />
    </div>
    <section className="max-w-screen-2xl mx-auto px-4 h-full justify-center items-center">
      <div className="flex w-full h-full flex-col items-center justify-center mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white max-w-2xl rounded-lg md:mt-0 sm:max-w-md xl:p-0">
          <div>
            <h1 className="mb-2 font-normal text-3xl lg:text-5xl sm:text-3xl">
              Forgot Password
            </h1>
            <p className="mt-4 text-base font-light">Please enter the email address associated with your account</p>
            <div className="mt-10 mb-4 ">
              <h3 className="text-base font-medium">
                Email Address
              </h3>
              <input
                type="email"
                name="email"
                className={`mt-2.5 px-3 py-3 md:py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-blue-600 block w-full rounded-xl focus:ring-1 ${emailError ? 'border-red-500' : ''}`}
                placeholder="example@gmail.com|"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            </div>
            <p className="font-light text-gray-500">We will send you a link to reset your password.</p>
            <div className="mt-5 md:mt-12 social-card bg-blue-500 text-white google border rounded-xl py-2 text-center hover:border-blue-600  hover:shadow-md md:px-16">
              <button onClick={handleResetPassword} className="text-center text-gray-800 font-normal py-1 md:py-2 px-4 rounded inline-flex items-center">
                <span className="ml-1 md:ml-2 text-white">Continue</span>
              </button>
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

export default ForgotPassword;
