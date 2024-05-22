import React, { useEffect, useState } from 'react'
import typesSvg from '../../svgs/specification/types.svg'
import typicalSvg from '../../svgs/specification/typical.svg'
import serviseSvg from '../../svgs/specification/servise.svg'
import languageSvg from '../../svgs/specification/language.svg'
import edit_svg_blue from '../../image/edit_svg_blue.svg'
import openSvg from '../../image/chevron-down (1) 2.svg'
import closed from '../../image/chevron-down (1) 1.svg'
import targetSvg from '../../svgs/specification/target.svg'
import { useParams, useLocation } from 'react-router-dom'
import { auth, usersCollection } from '../../firebase/firebase'
import { VscChromeClose } from "react-icons/vsc";
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { MdDelete } from "react-icons/md";
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { addLanguage, updateProfile } from '../../service/profile'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import AuthenticatedUserViewPermission from '../../components/Permissions/AuthenticatedUserViewPermission'
import Select from 'react-select';

export const Specification = ({ long_term_service_availability, languages }) => {
    const { split, userUID } = useParams();
    const [open, setOpen] = useState(true);
    const [meId, setMeId] = useState(null);
    const [modal, setModal] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        experitise: [],
        topicalTime: '',
        long_term_service_availability: '',
        language: ''
    });

    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const location = useLocation();
    const { pathname } = location;

    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged((user) => {
    //         if (user) {
    //             setMeId(user.uid);
    //         } else {
    //             setMeId(null)
    //         }
    //     })
    //     return () => unsubscribe();
    // }, []);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (userUID) {
    //             const dataRef = await getDoc(doc(usersCollection, userUID));
    //             if (dataRef.exists()) {
    //                 const data = dataRef.data();
    //                 setFormData(data);
    //             }
    //         }
    //     }

    //     fetchData();
    // }, [userUID]);

    const handleOpen = () => {
        setOpen(!open);
    };

    const authHeader = useAuthHeader()
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries('loggedInUser')

        }
    })

    const languageMutation = useMutation({
        mutationFn: addLanguage,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries('loggedInUser')

        }
    })

    const options = [
        { value: 'English', label: 'English' },
        { value: 'French', label: 'French' },
        { value: 'German', label: 'German' },
        { value: 'Spanish', label: 'Spanish' }
    ];
    const handleSaveDatabase = async (e) => {
        e.preventDefault();
        try {

            mutation.mutate({
                authHeader,
                data: {
                    long_term_service_availability: formData.long_term_service_availability,
                    languages: selectedLanguages.map(lang => lang.value).join(', ')
                }
            })

            if (mutation.isError) {
                console.error("Error saving changes");
                setError('something went wrong')
            }

            setModal(false);
        } catch (err) {
            console.error(err);
        } finally {
            // setModal(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // const handleExperitiseChange = (index, value) => {
    //     const updatedExperitise = [...formData.experitise];
    //     updatedExperitise[index] = value;
    //     setFormData({
    //         ...formData,
    //         experitise: updatedExperitise
    //     });
    // };

    // const handleAddExperitise = () => {
    //     if (formData.experitise && Array.isArray(formData.experitise)) {
    //         if (formData.experitise.length < 3) {
    //             setFormData(prevState => ({
    //                 ...prevState,
    //                 experitise: [...prevState.experitise, '']
    //             }));
    //         }
    //     }
    // };

    // const handleRemoveExperitise = (index) => {
    //     const updatedExperitise = [...formData.experitise];
    //     updatedExperitise.splice(index, 1);
    //     setFormData({
    //         ...formData,
    //         experitise: updatedExperitise
    //     });
    // };

    return (
        <div>
            {
                <div
                    // onClick={handleOpen}
                    className={`flex justify-between border mt-8 py-2 px-3 md:py-4 md:px-7 ${open ? `rounded-t-xl` : `rounded-xl`}`}>
                    <div className='flex items-start'>
                        <button>
                            <h1 className='text-base md:text-2xl font-semibold'>Specification</h1>
                        </button>
                        <AuthenticatedUserViewPermission>
                            <div className='flex justify-center items-center m-1 p-1 rounded-sm   cursor-pointer hover:bg-gray-100'
                                onClick={() => setModal(true)}
                            >
                                <img src={edit_svg_blue} alt="edit" className='' />
                                {/* <p className='text-blue-700'>edit</p> */}
                            </div>
                        </AuthenticatedUserViewPermission>

                    </div>
                    <div className='flex justify-center items-center'>
                        {open ? <div>
                            <img src={openSvg} alt='' />
                        </div> : <div>
                            <img src={closed} alt='' />
                        </div>}
                    </div>
                </div>
            }
            {open ? (
                <div className='border rounded-b-xl'>
                    <div className='px-2 md:px-8 mt-6'>
                        {
                            // <div className='flex justify-end  '>

                            //     <div className='flex justify-center   m-1 p-1 rounded-sm w-44 cursor-pointer hover:bg-gray-100'
                            //         onClick={() => setModal(true)}
                            //     >
                            //         <img src={edit_svg_blue} alt="edit" className='' />
                            //         {/* <p className='text-blue-700'>edit</p> */}
                            //     </div>
                            // </div>
                        }
                        <ul className="menu gap-5">

                            {/* <li className="menu-item flex justify-between">
                                <div
                                    className="flex justify-center items-center text-xs md:text-sm md:font-semibold text-gray-400">
                                    <img className='h-6 my-2 mr-1' src={typesSvg} alt='' />
                                    <h1>Ad Types:</h1>
                                </div>
                                <div
                                    className='text-xs md:text-sm md:font-semibold text-[#2B59FF] flex items-center justify-center'>
                                    <h1>{formData.experitise ? formData.experitise.join(', ') : "none"}</h1>
                                </div>
                            </li> */}
                            {/* <li className="menu-item flex justify-between">
                                <div
                                    className="flex justify-center items-center text-xs md:text-sm md:font-semibold text-gray-400">
                                    <img className='h-6 my-2 mr-1' src={typicalSvg} alt='' />
                                    <h1>Typical Response Time:</h1>
                                </div>
                                <div
                                    className='text-xs md:text-sm md:font-semibold text-[#2B59FF] flex items-center justify-center'>
                                    <h1>{formData.topicalTime || 'none'} <span className='text-gray-500'>hours</span></h1>
                                </div>
                            </li> */}
                            <li className="menu-item flex justify-between">
                                <div
                                    className="flex justify-center items-center text-xs md:text-sm md:font-semibold text-gray-400">
                                    <img className='h-6 my-2 mr-1' src={serviseSvg} alt="" />
                                    <h1>Long-Term Service Availability:</h1>
                                </div>
                                <div
                                    className='text-xs md:text-sm md:font-semibold text-[#2B59FF] flex justify-center items-center  gap-4'>
                                    <h1>{long_term_service_availability || 'none'}</h1>
                                </div>
                            </li>
                            <li className="menu-item flex justify-between">
                                <div
                                    className="flex justify-center items-center text-xs md:text-sm md:font-semibold text-gray-400">
                                    <img className='h-6 my-2 mr-1' src={languageSvg} alt='' />
                                    <h1>Languages</h1>
                                </div>
                                <div
                                    className='text-xs md:text-sm md:font-semibold text-[#2B59FF] flex justify-center items-center  gap-4'>
                                    <h1>
                                        {/* {languages && languages.length > 0
                                            ? languages.map(lang => lang.language).join(', ')
                                            : 'No languages found'} */}
                                        {languages ? languages : 'No languages found'}
                                    </h1>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            ) : null}

            {modal && (
                <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-20">
                    <div className="relative w-[80%]  md:w-1/2 mx-auto">
                        <div className="border rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className='flex justify-end'>
                                <div className='px-3 pt-3 rounded-full cursor-pointer'
                                    onClick={() => setModal(false)}
                                >
                                    <VscChromeClose className='w-6 h-6 p-1 rounded-full text-white bg-gray-400 hover:bg-gray-500 ' />
                                </div>
                            </div>
                            <div className="relative p-2 md:p-6 border-b flex-auto flex justify-center items-start">
                                <div>
                                    <h1 className='text-center mb-3 text-2xl md:text-3xl font-semibold'>Edit Specification</h1>
                                    <h1 className='text-center my-3'>Writing your Specification informations!</h1>
                                </div>
                            </div>
                            <form onSubmit={handleSaveDatabase}>
                                <div className='mx-8 mt-5'>

                                    {/* {(formData.experitise || []).map((item, index) => (
                                        <div className='m-1 flex gap-4' key={index}>
                                            <input type="text"
                                                className='border rounded-lg w-full p-2'
                                                placeholder='type...'
                                                value={item}
                                                onChange={(e) => handleExperitiseChange(index, e.target.value)}
                                            />
                                            <button type="button"
                                                className="m-auto"
                                                onClick={() => handleRemoveExperitise(index)}
                                            >
                                                <MdDelete className='text-red-600 h-6 w-6' />
                                            </button>
                                        </div>
                                    ))} */}
                                    {/* <button type="button"
                                        className={`bg-blue-600 text-white p-2 rounded-lg ${formData.experitise?.length === 4 && 'opacity-50 cursor-not-allowed'}`}
                                        onClick={handleAddExperitise}
                                        disabled={formData.experitise?.length >= 4}
                                    >
                                        Add Experitise
                                    </button> */}
                                    {/* <div className='m-1'>
                                        <label>Typical Response Time</label>
                                        <input type="text"
                                            name="topicalTime"
                                            className='border rounded-lg w-full p-2'
                                            value={formData.topicalTime}
                                            onChange={handleChange}
                                        />
                                    </div> */}
                                    <div className='m-1'>
                                        <label>Long-Term Service Availability</label>
                                        <input type="text"
                                            name="long_term_service_availability"
                                            className='border rounded-lg w-full p-2'
                                            defaultValue={long_term_service_availability}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className='m-1'>
                                        <label>Language</label>
                                        {/* <select name="language" className='border rounded-lg w-full p-2'
                                            defaultValue={language}
                                            onChange={handleChange}>
                                            <option value="English">English</option>
                                            <option value="French">French</option>
                                            <option value="German">German</option>
                                            <option value="Spanish">Spanish</option>
                                        </select> */}
                                        <Select
                                            defaultValue={options[0]}
                                            onChange={setSelectedLanguages}
                                            options={options}
                                            isSearchable={true}
                                            isMulti={true}
                                        />

                                    </div>
                                </div>
                                {error && <p className="text-red-500">{error}</p>}
                                <div className="flex items-center justify-center p-2 md:p-6 border-t border-solid gap-4 border-blue Gray-200 rounded-b">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 w-full text-white active:bg-blue-700 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
