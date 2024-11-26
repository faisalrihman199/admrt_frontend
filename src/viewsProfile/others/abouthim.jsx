import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import shape1 from '../../svgs/about/ic_Place.svg';
import shape2 from '../../svgs/about/ic_website.svg';
import shape3 from '../../svgs/about/ic_date.svg';
import { useParams } from 'react-router-dom'

const AboutHim = () => {
    const [userData, setUserDate] = useState(null)
    const { userUID } = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', userUID));
                const userData = userDoc.data();
                setUserDate(userData || {});
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userUID]);

    return (
        <div>
            <div className='mt-8'>
                <div className='flex justify-between my-3'>
                    <div>
                        <h1 className='font-semibold'>About</h1>
                    </div>
                    <div>
                    </div>
                </div>
                <div className='border'></div>
                <div className='my-3'>
                    <h1>Learn more about them</h1>
                </div>
                <div className='border'></div>
            </div>
            {userData && (
                <div>
                    <div className='flex justify-between my-4'>
                        <div className='flex gap-5 '>
                            <div className=''>
                                <img src={shape1} alt='' />
                            </div>
                            <div>
                                <h1>{userData.address || <><span>none.</span>
                                    <AuthenticatedUserViewPermission>
                                        <span> Please fill in your information!</span>
                                    </AuthenticatedUserViewPermission>
                                </>}</h1>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between my-4'>
                        <div className='flex gap-5 '>
                            <div className=''>
                                <img src={shape2} alt='' />
                            </div>
                            <div>
                                <h1>{userData.site || <><span>none.</span>
                                    <AuthenticatedUserViewPermission>
                                        <span> Please fill in your information!</span>
                                    </AuthenticatedUserViewPermission>
                                </>}</h1>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between my-4'>
                        <div className='flex gap-5'>
                            <div className=''>
                                <img src={shape3} alt='' />
                            </div>
                            <div>
                                <h1>Joined {userData.registrationDate ? new Date(userData.registrationDate.seconds * 1000).toLocaleDateString('en-GB') : 'Unknown'}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default AboutHim;
