import { doc, getDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { usersCollection } from '../../firebase/firebase';
import { Link } from 'react-router-dom';
import copy from '../../svgs/social-media/Group 1000005712.svg';
import { useParams } from 'react-router-dom'

export const MainAdSpace = () => {
    const { userUID } = useParams()
    const [data, setData] = useState({ addSpace: { link: '', type: '' } });

    const printIcon = 'https://img.icons8.com/fluency/48/magazine.png';
    const transIcon = 'https://img.icons8.com/fluency/48/motorbike-helmet.png';
    const eventIcon = 'https://img.icons8.com/fluency/48/today.png';
    const otherIcon = 'https://img.icons8.com/cute-clipart/64/connection-status-off.png';

    const fetchData = useCallback(async () => {
        try {
            if (userUID) {
                const dataRef = doc(usersCollection, userUID);
                const dataDoc = await getDoc(dataRef);
                if (dataDoc.exists()) {
                    setData(dataDoc.data());
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, [userUID]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className='mt-6'>
            <div className='flex justify-start border-b-2 py-3'>
                <p className='font-bold'>Ad Space</p>
            </div>
            <div className='py-3 border-b-2'>
                {data && data.addSpace && Object.entries(data.addSpace).length > 0 ? (
                    <div className='px-3'>
                        <Link to={data.addSpace.link} className='w-full flex justify-between'>
                            <div className='flex'>
                                <img src={
                                    data.addSpace.type === 'Event' ? eventIcon :
                                        data.addSpace.type === 'Transportation' ? transIcon :
                                            data.addSpace.type === 'Print' ? printIcon :
                                                data.addSpace.type === 'Other' ? otherIcon : null
                                } alt={data.addSpace.type} className='w-6 mr-2' />
                                <h1>{data.addSpace.type}</h1>
                            </div>
                            <img src={copy} alt='copy icon' className='w-6' />
                        </Link>
                    </div>
                ) : (
                    <p className='text-center font-semibold text-gray-400'>Empty Ad Space</p>
                )}
            </div>
        </div>
    );
};
