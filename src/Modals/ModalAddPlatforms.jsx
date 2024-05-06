import React, { useState } from 'react'
import { VscChromeClose } from "react-icons/vsc";
import icon_youtube from '../svgs/social-media/download (5) 1.svg'
import icon_facebook from '../svgs/social-media/download (6) 1.svg'
import icon_instagram from '../svgs/social-media/download.svg';

import { HiChevronDown } from "@react-icons/all-files/hi/HiChevronDown";

const ModalAddPlatforms = () => {
    const [isActive, setIsActive] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Select your option');
  
    const options = [
        { icon: <img src={icon_facebook}  />, text: 'Facebook' },
        { icon: <img src={icon_youtube} />, text: 'Youtube' },
      { icon: <img src={icon_instagram} />, text: 'Instagram' },
    ];
  
    const toggleMenu = () => {
      setIsActive(!isActive);
    };
  
    const handleOptionClick = (optionText) => {
      setSelectedOption(optionText);
      setIsActive(false);
    };


    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            {showModal ? (
                <>

                    <div
                        className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-[80%]  md:w-1/3 mx-auto">

                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className='px-3 pt-3 rounded-full flex justify-end'
                                    onClick={() => setShowModal(false)}>
                                    <VscChromeClose className=' w-6 h-6 p-1 rounded-full text-red-500 bg-pink-200' />
                                </div>


                                {/*body*/}
                                <div className="relative p-2 md:p-6  flex-auto  justify-center items-start">
                                    <div className=''>
                                        <h1 className='text-lg md:text-3xl font-medium text-center'>Add New Platform</h1>
                                        <p className='mt-7 mb-2 text-lg font-medium text-start'>Select Platform</p>
                                        <div className={`select-menu ${isActive ? 'active' : ''}`}>
      <div className="select-btn" onClick={toggleMenu}>
        <span className="sBtn-text">{selectedOption}</span>
        <HiChevronDown className="bx-chevron-down" />
      </div>
      <ul className="options">
        {options.map((option, index) => (
          <li className="option gap-2" key={index} onClick={() => handleOptionClick(option.text)}>
            {option.icon}
           
          </li>
        ))}
      </ul>
    </div>
                                        <p className='my-6 text-center'>Link your Selected Platform with AdMrt.</p>
                                    </div>
                                </div>

                                {/*footer*/}
                                <div className="flex items-center w-full justify-center p-2 md:p-6 border-t border-solid gap-4 border-blue Gray-200 rounded-b">
                                    <button
                                        className="bg-blue-700 w-[80%] text-white active:bg-blue-600 font-normal p-2 md:px-8 md:py-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <h1 className='text-sm'>
                                            Link Platform
                                        </h1>
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            <button
                onClick={() => {
                    setShowModal(true)
                }}
                className="text-white "
            >
                <h1>+ Add New Platforms</h1>
            </button>

        </div>
    )
}

export default ModalAddPlatforms