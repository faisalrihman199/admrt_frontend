import React, { useState } from 'react'
import { VscChromeClose } from "react-icons/vsc";
import svg_facebook from '../svgs/social-media/Rectangle 6590.svg'
import svg_instagram from '../svgs/social-media/Rectangle 6591.svg'
import svg_youtube from '../svgs/social-media/Rectangle 6593.svg'
import svg_linkedin from '../svgs/social-media/Rectangle 6594.svg'
import svg_x from '../svgs/social-media/x.svg'
import svg_tiktok from '../svgs/social-media/tiktok-svgrepo-com.svg'
import svg_whatsapp from '../svgs/social-media/whatsapp-icon-logo-svgrepo-com.svg'
import { HiChevronDown } from "@react-icons/all-files/hi/HiChevronDown";

const ModalAddSocialMedia = ({ onSelectSocialMedia, userId }) => {
    const [isActive, setIsActive] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Select your option');

    const options = [
        { icon: <img src={svg_facebook} alt='' />, text: 'Facebook' },
        { icon: <img src={svg_youtube} alt='' />, text: 'Youtube' },
        { icon: <img src={svg_linkedin} alt='' />, text: 'Linkedin' },
        { icon: <img src={svg_instagram} alt='' />, text: 'Instagram' },
        { icon: <img src={svg_x} alt='' />, text: 'X' },
        { icon: <img src={svg_tiktok} alt='' />, text: 'Tik Tok' },
        { icon: <img src={svg_whatsapp} alt='' />, text: 'WhatsApp' },
    ];

    const toggleMenu = () => {
        setIsActive(!isActive);
    };

    const handleOptionClick = (optionText) => {
        setSelectedOption(optionText);
        setIsActive(false);
    };

    const handleLinkSocialMedia = async () => {
        onSelectSocialMedia(selectedOption);
        setShowModal(false);
    };

    return (
        <div>
            {showModal ? (
                <>
                    <div
                        className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-[80%]  w-1/3 mx-auto">

                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className='px-3 pt-3 rounded-full flex justify-end'
                                    onClick={() => setShowModal(false)}>
                                    <VscChromeClose className=' w-6 h-6 p-1 rounded-full text-red-500 bg-pink-200' />
                                </div>

                                <div className="relative p-2 md:p-6  flex-auto  justify-center items-start">
                                    <div className=''>
                                        <h1 className='text-lg md:text-3xl font-medium text-center'>Add New Social Media</h1>
                                        <p className='mt-7 mb-2 text-lg font-medium text-start'>Select Social Media</p>
                                        <div className={`select-menu ${isActive ? 'active' : ''}`}>
                                            <div className="select-btn" onClick={toggleMenu}>
                                                <span className="sBtn-text">{selectedOption}</span>
                                                <HiChevronDown className="bx-chevron-down" />
                                            </div>
                                            <ul className="options">
                                                {options.map((option, index) => (
                                                    <li className="option gap-2" key={index} onClick={() => handleOptionClick(option.text)}>
                                                        {option.icon}
                                                        <span className="option-text">{option.text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="my-6">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="social-media-link">
                                                Social Media Link
                                            </label>
                                            <input type="text" id="social-media-link" className="w-full px-3 py-2 placeholder-gray-500 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600" placeholder="Enter your social media link here" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center w-full justify-center p-2 md:p-6 border-t border-solid gap-4 border-blue Gray-200 rounded-b">
                                    <button
                                        className="bg-blue-700 w-[80%] text-white active:bg-blue-600 font-normal p-2 md:px-8 md:py-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={handleLinkSocialMedia}
                                    >
                                        <h1 className='text-sm'>
                                            Add Media
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
                className="text-white"
            >
                <h1>+ Add New</h1>
            </button>

        </div>
    )
}

export default ModalAddSocialMedia