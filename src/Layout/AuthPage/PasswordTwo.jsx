import React, {useState} from 'react'
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'

const PasswordTwo = () => {
    const [password, setPassword] = useState("");
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);

    const handleToggle2 = () => {
        if (type==='password'){
           setIcon(eye);
           setType('text')
        } else {
           setIcon(eyeOff)
           setType('password')
        }
      }

  return (
    <>
         <div className='flex'>
              <input className="mt-2.5 px-3 py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-blue-600 block w-full rounded-xl focus:ring-1"  type={type} name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"  />
              <span class="flex justify-around items-center" onClick={handleToggle2}>
                  <Icon class="absolute mr-14 mt-2" icon={icon} size={20}/>
              </span>
          </div>
    </>
  )
}

export default PasswordTwo;