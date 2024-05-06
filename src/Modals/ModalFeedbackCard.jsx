import React, { useState } from 'react'
import { VscChromeClose } from "react-icons/vsc";
import { Rating } from '@mui/material';

const ModalFeedbackCard = () => {
    const [value, setValue] = useState()
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <div>
                {showModal ? (
                    <>

                        <div
                            className="flex h-screen justify-center p-4 items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative h-full sm:w-[80%] xl:w-1/2 mx-auto">

                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <div className='px-3 pt-3 rounded-full flex justify-end'
                                        onClick={() => setShowModal(false)}>
                                        <VscChromeClose className=' w-6 h-6 p-1 rounded-full text-red-500 bg-pink-200' />
                                    </div>
                                    <div className="relative bg-white p-2 px-4 md:px-6  flex-auto ">
                                        <div>
                                            <h1 className='text-lg md:text-3xl font-medium'>Please add your review here.</h1>
                                            <div className='border-b md:my-6'></div>
                                            <h1 className='md:text-2xl font-medium'>I confirmed that</h1>
                                            <div>
                                                <div className='my-2 md:my-4'>
                                                    <input checked id="default-radio" type="radio" value="1" name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 accent-blue-700" />
                                                    <label for="default-radio" class="ms-2 text-sm md:text-base  text-gray-900 ">Zhenhao helped me archive my goal completely.</label>
                                                </div>
                                                <div className='my-2 md:my-4'>
                                                    <input checked id="default-radio-2" type="radio" value="2" name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 accent-blue-700" />
                                                    <label for="default-radio-2" class="ms-2 text-sm md:text-base  text-gray-900 dark:text-gray-300">Zhenhao helped me archive my goal partially.</label>
                                                </div>
                                                <div className='my-2 md:my-4'>
                                                    <input checked id="default-radio-3" type="radio" value="3" name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 accent-blue-700" />
                                                    <label for="default-radio-3" class="ms-2 text-sm md:text-base  text-gray-900 dark:text-gray-300">Zhenhao did not help me in any way.</label>
                                                </div>
                                                <div className='my-2 md:my-4'>
                                                    <input id="default-radio-4" type="radio" value="4" name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 accent-blue-700" />
                                                    <label for="default-radio-4" class="ms-2 text-sm md:text-base  text-gray-900 dark:text-gray-300">Zhenhao didn’t show up.</label>
                                                </div>
                                            </div>
                                            <h1 className='md:text-2xl font-medium'>Leave your review (optional):</h1>
                                            <div className='justify-between flex my-4 text-sm md:text-base'>
                                                <h1>Seller communication Level</h1>

                                                <Rating
                                                    name="simple-controlled"
                                                    value={value}
                                                    onChange={(event, newValue) => {
                                                        setValue(newValue);
                                                    }}
                                                    className="text-base"
                                                />
                                            </div>
                                            <div className='justify-between flex my-4 text-sm md:text-base'>
                                                <h1>Recommend to a friend</h1>

                                                <Rating
                                                    name="simple-controlled"
                                                    value={value}
                                                    onChange={(event, newValue) => {
                                                        setValue(newValue);
                                                    }}
                                                />
                                            </div>
                                            <div className='justify-between flex my-4 text-sm md:text-base'>
                                                <h1>Service as described</h1>

                                                <Rating
                                                    name="simple-controlled"
                                                    value={value}
                                                    onChange={(event, newValue) => {
                                                        setValue(newValue);
                                                    }}
                                                />
                                            </div>
                                            <div class="w-full mt-6">
                                                <div class="relative textarea cursor-pointer">
                                                    <label for="messag" class="leading-7 font-medium cursor-pointer text-sm">Write Review</label>
                                                    <textarea class="py-3 px-2 font-light h-24 border w-full bg-opacity-50 text-sm rounded-lg border-gray-300  focus:bg-white focus:ring-2 focus:ring-white outline-none text-gray-700 resize-none leading-6 transition-colors duration-200 ease-in-out" placeholder='Write your review there...'></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex bg-white items-center justify-center p-2 md:p-6 border-t border-solid gap-4 border-blue Gray-200 rounded-b">
                                        <button
                                            className="bg-[#DFDFDF] text-gray-600 active:bg-gray-200 font-bold  text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                        >
                                            <h1 className='text-xs md:text-sm'>
                                                Cansel
                                            </h1>
                                        </button>
                                        <button
                                            className="bg-blue-700 text-white active:bg-blue-600 font-bold  text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => {
                                                setShowModal(false)
                                            }}
                                        >
                                            Save
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
                    className="w-24 bg-blue-700 text-sm px-2 py-1 text-white rounded-md"
                >
                    <h1>+ Feedback</h1>
                </button>
            </div>
        </div>
    )
}

export default ModalFeedbackCard