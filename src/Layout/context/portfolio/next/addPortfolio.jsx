import React, { useEffect, useState } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { IoVideocam } from 'react-icons/io5';
import { MdDelete } from "react-icons/md";
import { VscChromeClose } from 'react-icons/vsc';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { auth, savePortfolioFirebase, storage, usersCollection, } from '../../../../firebase/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';

const AddPortfolio = () => {
    const [steps] = useState({ stepsItems: ['Added portfolio', 'Add details'], currentStep: 2 });
    const [fileError, setFileError] = useState('');
    const [modal, setModal] = useState(false);
    const [link, setLink] = useState('');
    const [linkValid, setLinkValid] = useState(false);
    const [uploadFile, setUploadFile] = useState();
    const [description, setDescroption] = useState();
    const [addUploadFile, setAddUploadFile] = useState();
    const [addModal, setAddModal] = useState(false);
    const [addFileError, setAddFileError] = useState();
    const [userId, setUserId] = useState(null)
    const [saveLoading, setSaveLoading] = useState(false);
    const [userSplit, setUserSplit] = useState()

    const { Id } = useParams();
    const navigate = useNavigate()
    const allowedExtensions = ['.jpg', '.gif', '.png', '.pdf'];
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const maxSizeInBytes = 5 * 1024 * 1024;
        if (!file) return;

        const fileExtension = file.name.split('.').pop().toLowerCase();
        const isValidExtension = allowedExtensions.includes(`.${fileExtension}`);

        if (!isValidExtension || file.size > maxSizeInBytes) {
            event.target.value = '';
            setFileError('Invalid file format or size exceeds the maximum limit (5MB).');
        } else {
            setUploadFile(file);
            setFileError('');
        }
    };

    const uploadFileToStorage = async (file) => {
        const storageRef = ref(storage, `portfolio/${userId}/${Id}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    };

    const handleAddFile = (e) => {
        const file = e.target.files[0];
        const maxSizeInBytes = 5 * 1024 * 1024;
        const allowedExtensions = ['.jpg', '.gif', '.png', '.pdf'];

        const fileExtension = file.name.split(".").pop().toLowerCase();
        const isValid = allowedExtensions.includes(`.${fileExtension}`);
        if (!isValid || file.size > maxSizeInBytes) {
            e.target.value = ''
            setAddFileError('Invalid file format or size exceeds the maximum limit (5MB).')
        } else {
            setAddUploadFile(file);
            setAddFileError('');
            setAddModal(false);
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFileError('');
            setAddFileError('')
        }, 5000);

        return () => clearTimeout(timeout);
    }, [fileError]);

    useEffect(() => {
        setLinkValid(link.startsWith('https://you'));
    }, [link]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUserId(user.uid);

                try {
                    const userRef = doc(usersCollection, userId);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        const data = userDoc.data()
                        setUserSplit(data.split)
                    }
                } catch (err) {
                    console.error(err);
                }
            } else {
                setUserId(null)
            }
        })

        return () => unsubscribe()
    }, [userId])

    const handleCreate = async () => {
        setSaveLoading(true);

        try {
            const url = await uploadFileToStorage(uploadFile);
            let url1 = null;
            try {
                url1 = await uploadFileToStorage(addUploadFile);
            } catch (error) {
                console.warn(error);
            }
            await savePortfolioFirebase(userId, Id, {
                image: url,
                image1: url1,
                description: description,
                startDate: new Date(),
            });

            setSaveLoading(false);
            navigate(`/${userSplit}/${userId}`);
        } catch (error) {
            console.error(error);
            setSaveLoading(false);
        }
    };

    const handelRemoveAddUpload = (e) => {
        setAddUploadFile(null)
    }

    const handleRemoveuploadFile = (e) => {
        setUploadFile(null)
    }

    return (
        <div>
            {modal && (
                <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-25 fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-[80%] md:w-1/3 mx-auto">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className='px-3 pt-3 rounded-full flex justify-end' onClick={() => setModal(false)}>
                                <VscChromeClose className='w-6 h-6 p-1 rounded-full text-white bg-gray-600 hover:bg-gray-700' />
                            </div>
                            <div className="relative p-2 md:p-2 border-b flex-auto flex justify-center items-start">
                                <div>
                                    <h1 className='text-center text-2xl md:text-3xl font-semibold'>Add video link</h1>
                                </div>
                            </div>
                            <div className='md:p-6 p-2'>
                                <p className='text-gray-700 p-1'>Paste the link to your YouTube or Vimeo video here</p>
                                <input
                                    type="text"
                                    placeholder='https://youtube.com/...'
                                    className='p-2 w-full border rounded-lg'
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-center p-2 md:p-6 border-t border-solid gap-4 border-blue Gray-200 rounded-b">
                                <button
                                    className={`w-full bg-blue-700 text-white active:bg-blue-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${linkValid ? '' : 'opacity-50 cursor-not-allowed'}`}
                                    type="button"
                                    disabled={!linkValid}
                                >
                                    Added
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {addModal && (
                <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-25 fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-[80%] md:w-1/3 mx-auto">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className='px-3 pt-3 rounded-full flex justify-end' onClick={() => setAddModal(false)}>
                                <VscChromeClose className='w-6 h-6 p-1 rounded-full text-white bg-gray-600 hover:bg-gray-700' />
                            </div>
                            <div className="relative p-2 md:p-2 border-b flex-auto flex justify-center items-start">
                                <div>
                                    <h1 className='text-center text-2xl md:text-3xl font-semibold'>Add Image portfolio</h1>
                                </div>
                            </div>
                            <div className='md:p-6 p-2'>
                                <p className='text-gray-700 text-center mb-2'>.jpg, .gif, .png, .pdf, up to 5 MB, no more than 3000 px</p>
                                <div className={`max-w-md h-40 rounded-2xl border-2 border-dashed border-blue-600 flex items-center justify-center ${addFileError && 'border-red-600'}`}>
                                    <label htmlFor="file" className="cursor-pointer text-center p-4 md:p-8">
                                        <svg className={`w-10 h-10 mx-auto ${addFileError ? 'stroke-red-600' : 'stroke-blue-600'} `} viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.1667 26.6667C8.48477 26.6667 5.5 23.6819 5.5 20C5.5 16.8216 7.72428 14.1627 10.7012 13.4949C10.5695 12.9066 10.5 12.2947 10.5 11.6667C10.5 7.0643 14.231 3.33334 18.8333 3.33334C22.8655 3.33334 26.2288 6.19709 27.0003 10.0016C27.0556 10.0006 27.1111 10 27.1667 10C31.769 10 35.5 13.731 35.5 18.3333C35.5 22.3649 32.6371 25.7279 28.8333 26.5M25.5 21.6667L20.5 16.6667M20.5 16.6667L15.5 21.6667M20.5 16.6667L20.5 36.6667" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-3 text-gray-700 max-w-xs mx-auto">Click to <span className={`font-medium ${addFileError ? 'text-red-600' : 'text-blue-600'}`}>Upload your file</span> or drag and drop your file here</p>
                                    </label>
                                    <input id="file" type="file" className="hidden" onChange={handleAddFile} />
                                </div>
                                {addFileError && <div className='text-red-600 font-semibold text-center'>Invalid file format or size exceeds the maximum limit (5MB).</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div>
                {fileError && (
                    <div className="absolute max-w-5xl mx-auto px-4 md:px-8 ml-[33%] w-1/3">
                        <div className="flex justify-between p-2 rounded-md bg-red-50 border border-red-300">
                            <div className="flex gap-3">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="self-center">
                                    <span className="text-red-600 font-medium">
                                        {fileError}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className='border-t pt-3'>
                    <div className="max-w-2xl mx-auto px-4 md:px-0">
                        <ul aria-label="Steps" className="items-center text-gray-600 font-medium md:flex">
                            {steps.stepsItems.map((item, idx) => (
                                <li aria-current={steps.currentStep === idx + 1 ? 'step' : false} className="flex gap-x-3 md:flex-col md:flex-1 md:gap-x-0" key={idx}>
                                    <div className="flex flex-col items-center md:flex-row md:flex-1">
                                        <hr className={`w-full border hidden md:block ${idx === 0 ? 'border-none' : '' || steps.currentStep >= idx + 1 ? 'border-blue-600' : ''}`} />
                                        <div className={`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center ${steps.currentStep > idx + 1 ? 'bg-blue-600 border-blue-600' : '' || steps.currentStep === idx + 1 ? 'border-blue-600' : ''}`}>
                                            <span className={`w-2.5 h-2.5 rounded-full bg-blue-600 ${steps.currentStep !== idx + 1 ? 'hidden' : ''}`}></span>
                                            {
                                                steps.currentStep > idx + 1 ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                ) : ''
                                            }
                                        </div>
                                        <hr className={`h-12 border md:w-full md:h-auto ${idx + 1 === steps.stepsItems.length ? 'border-none' : '' || steps.currentStep > idx + 1 ? 'border-blue-600' : ''}`} />
                                    </div>
                                    <div className="h-8 flex justify-center items-center md:mt-3 md:h-auto">
                                        <h3 className={`text-sm ${steps.currentStep === idx + 1 ? 'text-gray-600' : ''}`}>
                                            {item}
                                        </h3>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='p-6'>
                    <div className='p-4 border rounded-xl'>
                        <div>
                            <h1 className='text-3xl font-bold border-b p-4 text-center'>Add details portfolio</h1>
                            <p className='text-gray-700 text-center'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore deserunt eum error maiores quibusdam reprehenderit nobis culpa animi, recusandae et iste, cum nemo.</p>
                        </div>
                        <div className='pt-6'>
                            <div>
                                {uploadFile ? (
                                    <div className='my-6 ml-20'>
                                        {uploadFile.type && uploadFile.type.startsWith('image/') ? (
                                            <div className='flex justify-start'>
                                                <div className='border p-2 bg-gray-100 flex rounded-lg'>
                                                    <div>
                                                        <img src={URL.createObjectURL(uploadFile)}
                                                            alt="Uploaded File"
                                                            className='w-44 h-44 object-cover rounded-sm'
                                                        />
                                                        <MdDelete onClick={handleRemoveuploadFile} className='cursor-pointer absolute ml-36 -mt-7 w-7 h-7 text-red-600' />
                                                    </div>
                                                    {addUploadFile ? (
                                                        <div>
                                                            <div className=''>
                                                                <img src={URL.createObjectURL(addUploadFile)}
                                                                    alt="Uploaded File"
                                                                    className='w-44 h-44 object-cover rounded-sm'
                                                                />
                                                                <MdDelete onClick={handelRemoveAddUpload} className='cursor-pointer absolute ml-36 -mt-7 w-7 h-7 text-red-600' />
                                                            </div>

                                                        </div>
                                                    ) : (
                                                        <div className='my-auto ml-5'>
                                                            <IoIosAddCircleOutline className='w-12 h-12 text-blue-600 hover:text-blue-700 active:text-blue-800 cursor-pointer' onClick={() => setAddModal(true)} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        ) : (
                                            <div className=''>
                                                <Link to={URL.createObjectURL(uploadFile)} download={uploadFile.name}>{uploadFile.name}</Link>
                                            </div>
                                        )}
                                        <div className='pt-5'>
                                            <h1 className='font-bold text-gray-700 p-1'>Description</h1>
                                            <textarea id="message" rows="4"
                                                class="block p-2.5 w-1/2 text-gray-900 bg-gray-50 rounded-lg border focus:border-blue-500"
                                                placeholder="Write your description here..."
                                                value={description}
                                                onChange={(e) => setDescroption(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className='text-gray-700 text-center pb-4'>
                                            <p>Images and document (.jpg, .gif, .png, .pdf, up to 5 MB, no more than 3000 px in any dimension)</p>
                                        </div>
                                        <div className='flex justify-evenly'>
                                            <div className={`max-w-md h-40 rounded-2xl border-2 border-dashed border-blue-600 flex items-center justify-center ${fileError && 'border-red-600'}`}>
                                                <label htmlFor="file" className="cursor-pointer text-center p-4 md:p-8">
                                                    <svg className={`w-10 h-10 mx-auto ${fileError ? 'stroke-red-600' : 'stroke-blue-600'} `} viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12.1667 26.6667C8.48477 26.6667 5.5 23.6819 5.5 20C5.5 16.8216 7.72428 14.1627 10.7012 13.4949C10.5695 12.9066 10.5 12.2947 10.5 11.6667C10.5 7.0643 14.231 3.33334 18.8333 3.33334C22.8655 3.33334 26.2288 6.19709 27.0003 10.0016C27.0556 10.0006 27.1111 10 27.1667 10C31.769 10 35.5 13.731 35.5 18.3333C35.5 22.3649 32.6371 25.7279 28.8333 26.5M25.5 21.6667L20.5 16.6667M20.5 16.6667L15.5 21.6667M20.5 16.6667L20.5 36.6667" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <p className="mt-3 text-gray-700 max-w-xs mx-auto">Click to <span className={`font-medium ${fileError ? 'text-red-600' : 'text-blue-600'}`}>Upload your file</span> or drag and drop your file here</p>
                                                </label>
                                                <input id="file" type="file" className="hidden" onChange={handleFileChange} />
                                            </div>
                                            <div className='my-auto'>
                                                <p className='text-gray-700 '>Or, embed a video from YouTube.</p>
                                                <button className='flex m-auto border-2 border-blue-600 rounded-lg p-4 w-44 mt-5' onClick={() => setModal(true)}>
                                                    <IoVideocam className='text-blue-600 m-auto mt-1.5' />
                                                    <p className='text-blue-600 m-auto'>add video link</p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='flex justify-end gap-4 mt-10'>
                                <butto className={"cursor-pointer border-blue-600 border-2 rounded-lg p-2 w-44 text-center text-blue-600 active:bg-blue-50"}>
                                    Cancel
                                </butto>
                                <button className={`cursor-pointer bg-blue-600 text-white p-2 w-44 text-center rounded-lg ${uploadFile ? "active:bg-blue-700" : "cursor-not-allowed opacity-50"}`}
                                    disabled={!uploadFile}
                                    onClick={handleCreate}
                                >
                                    {saveLoading ? "Loading..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPortfolio;
