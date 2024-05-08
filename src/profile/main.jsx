import React, { useCallback, useEffect, useState } from 'react';
import 'flowbite';
import EditBackground from "../Layout/context/editeBackground";
import EditeUser from "../Layout/context/user";
import IntoDescription from "../Layout/context/intoDescription";
import { auth, usersCollection } from "../firebase/firebase";
import AboutHim from '../Layout/context/aboutHim/aboutHim';
import SocialMedia from '../Layout/context/socialMedia/socialMedia';
import { doc, getDoc } from 'firebase/firestore';
import shape from '../svgs/about/Shape.svg';
import Portfolio from '../Layout/context/portfolio/portfolio';
import { VscEmptyWindow } from "react-icons/vsc";
import { Specification } from '../Layout/context/specification';
import { MainAdSpace } from '../Layout/adSpace/main';
import { ProductAdventiser } from '../Layout/context/adventiser/productAdventiser';
import userProfile from '../service/user';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { useQuery } from '@tanstack/react-query';

function SiplePages() {

    const authHeader = useAuthHeader()

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['loggedInUser', { authHeader }],
        queryFn: userProfile,
        staleTime: 5 * 60 * 1000,
    })

    const [userId, setUserId] = useState(null);
    const [split, setSplit] = useState(null);
    const [advertiserProfile, setAdvertiserProfile] = useState(false);
    const [requests, setRequests] = useState('')
    const profile_amer = 'https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'


    console.log('profile data', data)

    if (isPending) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    const userInfo = {
        name: data?.full_name,

    };
    console.log('userInfo', userInfo)

    return (
        <div className="App">
            <div className="max-w-screen-2xl mx-auto">
                <div className="md:flex">
                    <div className="w-full order-2 md:w-2/3 ">
                        <div className={"border p-2 md:p-5 rounded-xl"}>
                            <EditBackground userId={userId} split={split} />
                            <EditeUser userInfo={userInfo} />
                            <IntoDescription />
                        </div>
                        <Specification />
                        {split === 'adSpaceHost' && <Portfolio />}
                        {advertiserProfile && <ProductAdventiser />}
                    </div>
                    <div class="w-full py-5 max-[1200px]:px-4 px-10 order-1 md:order-2 md:w-1/3">
                        {advertiserProfile ? null :
                            <div className='mb-20'>
                                <div className='flex justify-between my-3'>
                                    <div>
                                        <h1 className='font-semibold'>New Connections</h1>
                                    </div>
                                    <img src={shape} alt="" />
                                </div>
                                <div className='border'></div>
                                <div className='my-3'>
                                    <h1>These are the connection which you have got from other users.</h1>
                                </div>
                                <div className='border'></div>
                                {requests && Object.keys(requests).length > 0 ? (
                                    <div>
                                        {Object.entries(requests).map(([username, value]) => {
                                            if (value === true) {
                                                return (
                                                    <div key={username} className='flex justify-between my-5'>
                                                        <div className='flex gap-3'>
                                                            <div className=''>
                                                                <img className='w-8 h-8 cursor-pointer rounded-full' src={profile_amer} alt='userImg' />
                                                            </div>
                                                            <div className='flex justify-center items-center'>
                                                                <h1>{username}</h1>
                                                            </div>
                                                        </div>
                                                        <div className='flex gap-2 h-[32px]'>
                                                            <button className='bg-gray-300 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-400'>
                                                                <h1>Decline</h1>
                                                            </button>
                                                            <button className='bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700'>
                                                                <h1>Accept</h1>
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                        {!Object.values(requests).includes(true) &&
                                            <div>
                                                <VscEmptyWindow className='m-auto w-16 h-16 text-gray-300' />
                                                <p className='text-center font-semibold text-gray-400'>Empty</p>
                                            </div>
                                        }
                                    </div>
                                ) : (
                                    <div>
                                        <VscEmptyWindow className='m-auto w-16 h-16 text-gray-300' />
                                        <p className='text-center font-semibold text-gray-400'>Empty</p>
                                    </div>
                                )}
                            </div>
                        }
                        <AboutHim />
                        <SocialMedia />
                        {advertiserProfile ? null :
                            <>
                                <MainAdSpace />
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>);
}

export default SiplePages