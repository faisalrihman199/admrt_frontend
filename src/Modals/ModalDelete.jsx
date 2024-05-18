import React, { useEffect, useState } from 'react'
import { VscChromeClose } from "react-icons/vsc";
import delete_svg from '../image/Delete.svg'
import { doc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase'
import { FaTrash } from 'react-icons/fa';

const ModalDelete = ({ onDeleteMedia, name }) => {
    const [showModal, setShowModal] = useState(false);


    const handleDelete = async () => {
        try {
            onDeleteMedia();
            setShowModal(false);
        } catch (error) {
            console.error('Error removing document: ', error);
        }
    }




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
                                <div className="relative p-2 md:p-6  flex-auto flex justify-center items-start">
                                    <div>
                                        <h1 className='text-center mb-6 text-2xl md:text-3xl font-semibold'>Are you sure to Delete?</h1>
                                        <h1 className='text-center my-3'>This action will not be reverse-able to make sure to do this delete action.</h1>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center p-2 md:p-6 border-t border-solid gap-4 border-blue Gray-200 rounded-b">
                                    <button
                                        className="bg-blue-700 text-white active:bg-blue-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <h1 className='text-xs md:text-sm'>
                                            Cansel
                                        </h1>
                                    </button>
                                    <button
                                        className="bg-red-700 text-white active:bg-red-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            <button onClick={() => { setShowModal(true) }} >
                {/* <img src={delete_svg} className='h-6 w-6' alt='' /> */}
                <FaTrash />
            </button>
        </div>
    )
}

export default ModalDelete