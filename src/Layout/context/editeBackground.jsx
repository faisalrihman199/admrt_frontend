import React, { useEffect, useState } from 'react';
import { storage, db, auth } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import editIcon from '../../image/blackEditeIcon.svg';
import close from '../../image/closeBackground.svg';
import { onAuthStateChanged } from "firebase/auth";
import emptyBg from '../../image/image.png'
import { Link } from 'react-router-dom'

const EditBackground = ({ split, userId }) => {
    const [bgImage, setBgImage] = useState('');
    const [newBgImage, setNewBgImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserImage(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleEditBackground = () => {
        setIsEditing(!isEditing);
    };

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

    const handleSave = async () => {
        setIsLoading(true);

        try {
            const storageRef = ref(storage, `users/${userId}/images/background.png`);
            await uploadBytes(storageRef, newBgImage);

            const downloadURL = await getDownloadURL(storageRef);

            const userDocRef = doc(db, "users", userId);
            await updateDoc(userDocRef, {
                backgroundURL: downloadURL,
            });

            setBgImage('');
            setNewBgImage(null);
            setIsEditing(false);
        } catch (error) {
            console.error("Error uploading image:", error.message);
            setError("Error uploading image. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserImage = async (userId) => {
        try {
            const imageRef = ref(storage, `users/${userId}/images/background.png`);
            const imageUrl = await getDownloadURL(imageRef);
            setBgImage(imageUrl + `?key=${Date.now()}`);
        } catch (error) {
            console.error("Error fetching user image:", error);
        }
    };

    return (
        <div className="relative h-72 bg-cover bg-center border rounded-lg bg-gray-100" style={{ backgroundImage: bgImage ? `url(${bgImage})` : emptyBg }}>
            {isEditing ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
                        <img src={close} alt="Close" onClick={handleClose} className="cursor-pointer absolute top-4 right-4 w-8" />
                        <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue-600 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-600 hover:text-white">
                            <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                            </svg>
                            <span className="mt-2 text-base leading-normal">Select a file</span>
                            <input type="file" onChange={handleUploadBackground} className="hidden" accept="image/*" />
                        </label>
                        <div className="mt-4 flex space-x-2">
                            <button
                                className={`px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:shadow-lg ${isLoading && 'opacity-50 cursor-not-allowed'}`}
                                disabled={isLoading}
                                onClick={handleSave}
                            >
                                {isLoading ? 'Loading...' : 'Save'}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-gray-700 border rounded-lg hover:border-indigo-600 active:shadow-lg"
                            >
                                {error || "Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-between items-center p-6">
                    <div className="flex items-center">
                        <img src={editIcon} alt="Edit" className="mr-1 w-5" />
                        <button onClick={handleEditBackground} className="text-black font-semibold">
                            Edit Banner
                        </button>
                    </div>
                    {split === 'adSpaceHost' &&
                        <Link to={`/profile/${split}/${userId}`}>
                            <button className="bg-blue-700 text-white font-semibold py-2 px-4 rounded">
                                View profile
                            </button>
                        </Link>
                    }
                </div>
            )}
        </div>
    );
};

export default EditBackground;
