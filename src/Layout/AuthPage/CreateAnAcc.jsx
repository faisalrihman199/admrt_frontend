import React, { useState } from 'react';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import Checkbox from '@mui/material/Checkbox';
import SlideShow from '../SlideShow';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, usersCollection } from '../../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { userRegisterApi } from '../../service/auth';
import { useLogIn } from '../../hooks/useLogin';


const CreateAnAcc = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);
  const [loading, setLoading] = useState(false);
  const { split } = useParams();
  const navigate = useNavigate();
  const logIn = useLogIn();

  const handleToggle = () => {
    if (type === 'password') {
      setIcon(eye);
      setType('text');
    } else {
      setIcon(eyeOff);
      setType('password');
    }
  };

  const handleConfimAuth = async (e) => {
    e.preventDefault();
    setLoading(true)
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !password.trim() || !country.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Invalid email address');
      return;
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[@$!%*#?&]/.test(password)) {
      setErrorMessage('Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return;
    }

    try {

      await userRegisterApi({ full_name: fullName, email, phone: phoneNumber, password, country, user_role: split });
      await logIn(email, password);
    } catch (err) {
      console.error(err);
      setErrorMessage('Something Went Wrong');
      setLoading(false)
    }
  };

  return (
    <div className="login-container min-h-screen md:flex">
      <div className="md:w-1/2">
        <SlideShow />
      </div>
      <div className="w-full px-2 md:flex justify-center items-center  ">
        <div className="w-full sm:w-full p-2 md:w-auto p-2 xl:w-3/5 lg:p-2">
          <div>
            <div>
              <h1 className="justify-center mb-2 font-normal text-3xl lg:text-5xl sm:text-3xl">Create An Account</h1>
              <p className="mt-2 text-base font-light md:mt-12">Already have an account?<span className="text-purple-700 font-normal cursor-pointer "><Link to="/login"> Login </Link></span></p>
            </div>
          </div>
          <form className='' onSubmit={handleConfimAuth}>
            <div>
              <label className="block mt-8">
                <h3 className="text-lg font-normal">Full Name / Business Name</h3>
                <input type="text" name="text" className="mt-2.5 px-3 py-3 md:py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-blue-600 block w-full rounded-xl focus:ring-1" onChange={(e) => setFullName(e.target.value)} />
              </label>
            </div>
            <div>
              <label className="block mt-8">
                <h3 className="text-lg font-normal">Email Address</h3>
                <input type="email" name="email" className="mt-2.5 px-3 py-3 md:py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-blue-600 block w-full rounded-xl focus:ring-1" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
            </div>
            <div>
              <label className="block mt-8">
                <h3 className="text-lg font-normal">Phone Number</h3>
                <input type="tel" name="tel" className="mt-2.5 px-3 py-3 md:py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-blue-600 block w-full rounded-xl focus:ring-1" onChange={(e) => setPhoneNumber(e.target.value)} />
              </label>
            </div>
            <div>
              <label className="password-container block mt-8">
                <h3 className="text-lg font-normal">Password</h3>
                <div className='flex'>
                  <input
                    className="mt-2.5 px-3 py-3 md:py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-blue-600 block w-full rounded-xl focus:ring-1"
                    type={type}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <span className="flex justify-around items-center" onClick={handleToggle}>
                    <Icon className="absolute mr-14 mt-2" icon={icon} size={20} />
                  </span>
                </div>
              </label>
            </div>
            <div>
              <label htmlFor="countries" className="password-container block mt-8">
                <h3 className="text-lg font-light md:font-normal">Country</h3>
              </label>
              <select id="countries" className="mt-2.5 px-3  py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-blue-600 block w-full rounded-xl focus:ring-1" onChange={(e) => setCountry(e.target.value)}>
                <option selected>Choose a country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
              </select>
            </div>
            <div className="flex justify-center items-center mt-8">
              <div className='flex'>
                <Checkbox defaultChecked />
                <div className='flex justify-center items-center' >
                  <p className='text-sm'>By clicking Create account, I agree that I have read and accepted the <span className="text-blue-600">Terms of Use</span> and <span className="text-blue-600">Privacy Policy.</span> </p>
                </div>
              </div>
            </div>
            {errorMessage && <p className="p-2 rounded-lg error-message text-white bg-red-400 border-2 border-red-800 text-center">{errorMessage}</p>}
            <button type='submit' className="w-full mt-2 social-card bg-blue-500 text-white google border rounded-xl  py-2 text-center hover:border-blue-600  hover:shadow-md md:px-16">
              <div className="text-center text-gray-800 font-normal py-2 px-4 rounded inline-flex items-center">
                <span className="ml-1 md:ml-2 text-white">{loading ? "Loading..." : "Sign Up"}</span>
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAnAcc;
