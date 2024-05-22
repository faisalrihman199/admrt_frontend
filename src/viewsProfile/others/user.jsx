import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const User = () => {

    const { userUID } = useParams();
    const [fullName, setFullName] = useState('');
    const [userImg, setUserImg] = useState('');
    const avatarUrl = 'https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg';
    const [price, setPrice] = useState('');
    const [experitise, setExperitise] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', userUID));

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const userFullName = userData.fullName;
                    const imageUrl = userData.imageUrl || '';
                    setFullName(userFullName);
                    setUserImg(imageUrl);
                    setPrice(userData.hourlyRate)
                    setExperitise(userData.experitise || []);
                } else {
                    console.log('User not found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userUID]);

    return (
        <div className="flex -translate-y-10 ml-4">
            <div className="relative">
                <img
                    src={userImg || avatarUrl}
                    alt="...leading. please make refresh"
                    className="w-[150px] h-[150px] rounded-full border-8 border-white"
                />
            </div>
            <div className="flex justify-between ml-4 w-3/4 items-center">
                <div className=''>
                    <h1 className='font-medium text-lg md:text-2xl'>{fullName}</h1>
                    <div className="flex">
                        <h1 className='text-sm w-full font-medium text-blue-800'><span
                            className='text-sm text-gray-500'>Experitise: <span className='text-blue-700'>{experitise.length > 0 ? experitise.join(', ') : "none"}</span></span></h1>
                        <div className='flex justify-center items-center cursor-pointer ml-2'>
                        </div>
                    </div>

                </div>
                {/* <div className="flex gap-3">
                    <h1 className="font-bold text-xl">$<span>{price || "0.00"}</span>/hr</h1>
                </div> */}
            </div>
        </div>
    );
};

export default User;
