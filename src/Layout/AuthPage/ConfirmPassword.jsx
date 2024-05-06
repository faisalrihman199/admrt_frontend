import React, { useState } from 'react'
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import Checkbox from '@mui/material/Checkbox';
import PasswordTwo from './PasswordTwo';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ConfirmPassword = () => {
  const [password, setPassword] = useState("");
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);

  const handleToggle = () => {
    if (type === 'password') {
      setIcon(eye);
      setType('text')
    } else {
      setIcon(eyeOff)
      setType('password')
    }
  }

  return (
    <div class="max-w-screen-2xl  mx-auto h-screen flex justify-center items-center">
      <div class="w-full sm:w-full p-4 md:w-auto p-2 xl:w-3/5 lg:p-2">
        <div>
          <div>
            <h1 class="justify-center font-normal text-3xl lg:text-5xl sm:text-3xl">Setup new one!</h1>
            <p class=" text-base font-light mt-2.5 ">Please enter a new password.</p>
          </div>
        </div>
        <div>
          <div>
            <label class="password-container block mt-8">
              <h1 class="text-lg font-light md:font-normal">New Password</h1>
              <div className='flex'>
                <input className="mt-2.5 px-3 py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-blue-600 block w-full rounded-xl focus:ring-1" type={type} name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                <h1 class="flex justify-around items-center" onClick={handleToggle}>
                  <Icon class="absolute mr-14 mt-2" icon={icon} size={20} />
                </h1>
              </div>
            </label>
            <div>
              <div>
                <label class="password-container block mt-8">
                  <h1 class="text-lg font-light md:font-normal">Confirm-New Password</h1>
                  <PasswordTwo />
                </label>
              </div>
              <div className='mt-8'>
                <div className='flex'>
                  <Checkbox {...label} defaultChecked />
                  <div className='flex justify-center items-center' >
                    <h1 className='text-sm text-gray-500'>By clicking Create account, I agree that I have read and accepted the <a className='text-blue-800'>Terms of Use</a>  and <a className='text-blue-800'>Privacy Policy.</a></h1>
                  </div>
                </div>

              </div>

              <a className='' href='/congratulation'>
                <div class="mt-14 bg-blue-500 text-white border rounded-xl py-2 text-center hover:border-blue-600  hover:shadow-md">
                  <button class="text-center bg-blue-500 text-gray-800 font-normal py-2 px-4 rounded inline-flex items-center">
                    <h1 class="ml-1 text-sm md:ml-2 text-white">Create</h1>
                  </button>
                </div>
              </a>
            </div>
          </div>
        </div>


      </div>
    </div>

  )
}

export default ConfirmPassword