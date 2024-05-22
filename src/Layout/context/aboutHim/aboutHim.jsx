import React, { useEffect, useState } from 'react';
import { auth, usersCollection, db } from '../../../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import shape from '../../../svgs/about/Shape.svg';
import shape1 from '../../../svgs/about/ic_Place.svg';
import shape2 from '../../../svgs/about/ic_website.svg';
import shape3 from '../../../svgs/about/ic_date.svg';
// import shape4 from '../../../svgs/about/ic_Working.svg';
// import shape5 from '../../../svgs/about/ic_relationship.svg';
import edit_svg_blue from '../../../image/edit_svg_blue.svg';
import { useParams } from 'react-router-dom'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../../../service/profile';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import AuthenticatedUserViewPermission from '../../../components/Permissions/AuthenticatedUserViewPermission';

const AboutHim = ({ location, website, joinDate }) => {
    const [aboutHimShow, setaboutHimShow] = useState("");
    const [currentLocation, setCurrentLocation] = useState(location);
    const [currentWebsite, setCurrentWebsite] = useState(website);
    const authHeader = useAuthHeader()
    const [websiteInput, setWebsiteInput] = useState('')
    const [locationInput, setLocationInput] = useState('')
    const [error, setError] = useState(null)
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries('loggedInUser')

        }

    })

    const handleSaveChanges = async () => {
        try {

            let data = {};
            if (locationInput) data.location = locationInput;
            if (websiteInput) data.website = websiteInput;

            mutation.mutate({
                authHeader,
                data
            })

            if (mutation.isError) {
                console.error("Error saving changes");
                setError('something went wrong')
            }

            setCurrentLocation(locationInput);
            setCurrentWebsite(websiteInput);
            setaboutHimShow(false);
        } catch (error) {
            console.error("Error saving changes:", error);
            setError('something went wrong')
        }
    };


    return (
        <div>

            {aboutHimShow && (
                <form>
                    <div className="fixed inset-0 z-50 overflow-hidden flex bg-opacity-50 bg-gray-500 justify-center items-center">
                        <div className="relative w-96 mx-auto bg-white rounded-lg shadow-lg">
                            <div className="flex items-start justify-between p-5 border-b border-blueGray-200 rounded-t">
                                <h3 className="text-2xl font-semibold">Edit About</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <h1 className="text-xl font-medium">Enter your information correctly</h1>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-indigo-600"
                                        placeholder="Location"
                                        id="address"
                                        onChange={(e) => setLocationInput(e.target.value)}
                                    // value={currentLocation}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Website</label>
                                    <input
                                        type="text"
                                        className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-indigo-600"
                                        placeholder="Enter Website. Ex: admrt.com"
                                        id="site"
                                        onChange={(e) => setWebsiteInput(e.target.value)}
                                    // value={currentWebsite}
                                    />
                                </div>
                            </div>
                            {error && <p className="text-red-500 m-3 p-3">{error}</p>}
                            <div className="flex items-center justify-end p-4 border-t border-blueGray-200 rounded-b">
                                <button
                                    className="text-blue-700 hover:text-indigo-700 px-4 py-2 font-semibold focus:outline-none"
                                    onClick={() => setaboutHimShow(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 font-semibold rounded focus:outline-none"
                                    type="button"
                                    onClick={handleSaveChanges}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
                </form>
            )}

            <div className='mt-0'>
                <div className='flex justify-between my-3'>
                    <div>
                        <h1 className='font-semibold'>About</h1>
                    </div>
                    <div>
                        <img src={shape} alt='' />
                    </div>
                </div>
                <div className='border'></div>
                <AuthenticatedUserViewPermission>
                    <div className='my-3'>
                        <h1>Tell potential advertisers more about you.</h1>
                    </div>
                </AuthenticatedUserViewPermission>

                <div className='border'></div>
            </div>
            {(
                <div>
                    <div className='flex justify-between my-4'>
                        <div className='flex gap-5 '>
                            <div className=''>
                                <img src={shape1} alt='' />
                            </div>
                            <div>
                                <h1>{currentLocation ||
                                    <><span>--</span>
                                        <AuthenticatedUserViewPermission>
                                            <span> Please fill in your location!</span>
                                        </AuthenticatedUserViewPermission>
                                    </>
                                }

                                </h1>
                            </div>
                        </div>
                        <AuthenticatedUserViewPermission>
                            <div className='flex justify-center items-center cursor-pointer'>
                                <button onClick={() => {
                                    setaboutHimShow(true)
                                }}>
                                    <img src={edit_svg_blue} alt='' />
                                </button>
                            </div>
                        </AuthenticatedUserViewPermission>
                    </div>
                    <div className='flex justify-between my-4'>

                        <div className='flex gap-5 '>
                            <div className=''>
                                <img src={shape2} alt='' />
                            </div>
                            <div>
                                {currentWebsite
                                    ? <a href={currentWebsite} target="_blank" rel="noopener noreferrer" style={{ color: '#0000EE', textDecoration: 'underline' }}>{currentWebsite}</a>
                                    : <><span>--</span>
                                        <AuthenticatedUserViewPermission>
                                            <span> Please fill your website!</span>
                                        </AuthenticatedUserViewPermission>
                                    </>
                                }
                            </div>
                        </div>
                        <AuthenticatedUserViewPermission>
                            <div className='flex justify-center items-center cursor-pointer'>
                                <button onClick={() => {
                                    setaboutHimShow(true)
                                }}>
                                    <img src={edit_svg_blue} alt='' />
                                </button>
                            </div>
                        </AuthenticatedUserViewPermission>

                    </div>
                    <div className='flex justify-between my-4'>
                        <div className='flex gap-5'>
                            <div className=''>
                                <img src={shape3} alt='' />
                            </div>
                            <div>
                                <h1>Joined <span className="ml-2">{joinDate ? new Date(joinDate).toLocaleDateString('en-US') : 'Unknown'}</span></h1>
                            </div>
                        </div>
                        {/* <div className='flex justify-center items-center cursor-pointer'>
                            <button onClick={() => {
                                setaboutHimShow(true)
                            }}>
                                <img src={edit_svg_blue} alt='' />
                            </button>
                        </div> */}
                    </div>
                </div>
            )
            }


        </div >
    )
}

export default AboutHim;
