import React from 'react';
import svg from './images/applause 1.svg'
import svg2 from './images/Frame 427321033 (4).svg'

const Congratulation = () => {
    return (
        <div className='max-w-screen-2xl  mx-auto px-4 h-screen justify-center items-center'>
            <div class="w-full h-full px-2 flex justify-center items-center ">
                <div className=''>
                    <img src={svg2} />
                    <div className='py-8 px-8'>
                    <h1 class="mb-2 font-normal text-3xl lg:text-5xl sm:text-3xl">
            Forgot Password
          </h1>
          <p className='font-light'>Your New Password is Successfully Created!</p>
                        <div className='my-8 flex justify-center items-center'>
                            <img src={svg} alt="" />
                        </div>
                        <div class=" social-card bg-blue-500 text-white google border rounded-xl  py-2 text-center hover:border-blue-600  hover:shadow-md md:px-16">
              <button class=" text-center   text-gray-800 font-normal py-1 md:py-2 px-4 rounded inline-flex items-center">
                <span class="ml-1 md:ml-2 text-white"><a href="/">Login now</a></span>
              </button>
            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Congratulation
