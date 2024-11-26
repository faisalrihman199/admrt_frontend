import React, { useEffect, useState } from 'react';
import { storage, db, auth } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import editIcon from '../../image/blackEditeIcon.svg';
import close from '../../image/closeBackground.svg';
import { onAuthStateChanged } from "firebase/auth";
import emptyBg from '../../image/image.png'
import { Link, useLocation,  } from 'react-router-dom'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { updateSingleImage } from '../../service/profile';
import { Modal } from '../../components/Modal/Modal';
import CoverImageCropper from './cropImg/CoverImageCroper';
import AuthenticatedUserViewPermission from '../../components/Permissions/AuthenticatedUserViewPermission';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const EditBackground = ({ split,userId, coverImageUrl }) => {
    const [bgImage, setBgImage] = useState('');
    const [newBgImage, setNewBgImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    
    const [currentCoverImageUrl, setCurrentCoverImageUrl] = useState(coverImageUrl);
    
    const handleEditBackground = () => {
        setIsEditing(!isEditing);
    };
    const authe=useAuthUser();
    const location = useLocation();

    // Split the path by '/' and get the last element
    const pathSegments = location.pathname.split('/');
    const profile = pathSegments[pathSegments.length - 1];

    const handleUploadBackground = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            setNewBgImage(file);
            setBgImage(URL.createObjectURL(file));
        }
    };

    const handleCancel = () => {
        setBgImage('');
        setNewBgImage(null);
        setIsEditing(false);
    };

    const handleClose = () => {
        setIsEditing(false);
    };
    const authHeader = useAuthHeader()

    // const handleSave = async () => {
    //     try {
    //         setIsLoading(true);

    //         let data;
    //         if (newBgImage instanceof Blob) {
    //             const formData = new FormData();
    //             formData.append('banner_image', newBgImage, 'banner_image.png');
    //             data = formData;
    //         } else {
    //             data = { banner_image: newBgImage };
    //         }

    //         const updateResponse = await updateSingleImage({ authHeader, data });

    //         if (updateResponse?.banner_image) {
    //             setCurrentCoverImageUrl(updateResponse?.banner_image);
    //             setIsEditing(false);
    //         }

    //     } catch (error) {
    //         console.error('Error updating user data:', error);
    //         setError(`Error updating user data: ${error.message}`);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    const queryClient = useQueryClient();

    const handleSave = async (file) => {
        try {
            setIsLoading(true);

            let data;
            
            if (file instanceof Blob) {
                const formData = new FormData();
              
                formData.append('banner_image', file, 'banner_image.png');
                if(authe?.user_role==='admin'){
                    formData.append("userId",profile)
                }
                data = formData;
                
                
            } else {
                data = { banner_image: file };
            }
            

            const updateResponse = await updateSingleImage({ authHeader, data });
            
            
            if (updateResponse?.banner_image) {
                // setCurrentCoverImageUrl(updateResponse?.banner_image);
                queryClient.invalidateQueries('loggedInUser')

                setIsEditing(false);
            }


        } catch (error) {
            console.error('Error updating user data:', error);
            setError(`Error updating user data: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="relative h-72 bg-cover bg-center border rounded-lg bg-gray-100" style={{ backgroundImage: coverImageUrl ? `url(${coverImageUrl})` : emptyBg }}>
            {isEditing ? (
                // <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                //     <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                //         <img src={close} alt="Close" onClick={handleClose} className="cursor-pointer absolute top-4 right-4 w-8" />
                //         <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue-600 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-600 hover:text-white">
                //             <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                //                 <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                //             </svg>
                //             {bgImage ? (
                //                 <img src={bgImage} alt="Selected" className="mt-2 w-full h-32 object-cover" />
                //             ) : (
                //                 <span className="mt-2 text-base leading-normal">Select a file</span>
                //             )}
                //             <input type="file" onChange={handleUploadBackground} className="hidden" accept="image/*" />
                //         </label>
                //         <div className="mt-4 flex space-x-2">
                //             <button
                //                 className={`px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:shadow-lg ${isLoading && 'opacity-50 cursor-not-allowed'}`}
                //                 disabled={isLoading}
                //                 onClick={handleSave}
                //             >
                //                 {isLoading ? 'Loading...' : 'Save'}
                //             </button>
                //             <button
                //                 onClick={handleCancel}
                //                 className="px-4 py-2 text-gray-700 border rounded-lg hover:border-indigo-600 active:shadow-lg"
                //             >
                //                 {error || "Cancel"}
                //             </button>
                //         </div>
                //     </div>
                // </div>
                <Modal
                    size="xl"
                    open={isEditing} handleOpen={setIsEditing}
                    children={<CoverImageCropper submitCoverUpload={handleSave} />} />

            ) : (
                <AuthenticatedUserViewPermission>
                    <div onClick={handleEditBackground} className="flex items-center p-5   cursor-pointer backdrop-blur-sm hover:backdrop-blur-lg shadow-sm ">
                        <img src={editIcon} alt="Edit" className="mr-1 w-5" />
                        <p className="text-white font-semibold  ">
                            Edit Banner
                        </p>
                    </div>
                </AuthenticatedUserViewPermission>

            )}
        </div>
    );
};

export default EditBackground;
