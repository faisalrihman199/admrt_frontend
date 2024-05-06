import React from 'react'
import svg from './images/email 1.svg'

const CheckEmail = () => {
   return (
      <div className='max-w-screen-2xl  mx-auto px-4 h-screen justify-center items-center'>
         <div class="w-full h-full px-2 flex justify-center items-center ">
            <div className='box-shadow-emailBox rounded-lg'>
               <div className='py-8 px-8'>
                  <div className='flex justify-center items-center'>
                     <img src={svg} alt="" />
                  </div>
                  <div className='mt-10 text-center'>
                     <h1 className='text-3xl font-normal'>Check Email</h1>
                     <h1 className='mt-3 font-light text-gray-400'>The reset password link was sent to your email</h1>
                  </div>
                  <div className='mt-14 text-center underline text-blue-500 cursor-pointer hover:text-blue-800 '>
                     <a href='/confirmPassword'><h1>Close</h1></a>
                  </div>
               </div>
            </div>
         </div>
      </div>

   )
}

export default CheckEmail