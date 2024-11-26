import React, { useEffect, useState } from 'react';
import { auth, db, usersCollection } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import img from '../../image/image.png'

const EditBg = ({ backgroundImageUrl }) => {
    const { userUID, split } = useParams();
    const [bgImage, setBgImage] = useState('');
    const [userId, setUserId] = useState(null);
    const [viewrRequest, setViewRequest] = useState(false);
    const [request, setRequest] = useState(null);
    const [userSplit, setUserSplit] = useState(null);
    const [userUsername, setUserUsername] = useState(null);
    const [profileUsername, setProfileUsername] = useState(null);
    const [requestLoading, setRequestLoading] = useState('Sent request');
    // const [dontVerificationRequest, setDontVerificationRequest] = useState(false);
    const [, setRemoveRequest] = useState()
    const [removeRequestLoading, setRemoveRequestLoading] = useState(false)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUserId(user.uid);
                try {
                    const callData = await getDoc(doc(usersCollection, user.uid));
                    if (callData.exists()) {
                        const userData = callData.data();
                        const splitCall = userData.split;
                        const usernameCall = userData.fullName;
                        setUserSplit(splitCall);
                        setUserUsername(usernameCall);
                    }

                    const userProfileData = await getDoc(doc(usersCollection, userUID));
                    if (userProfileData.exists()) {
                        const profileData = userProfileData.data();
                        const profileUsernameCall = profileData.fullName;
                        const requestCall = profileData.requests[userUsername];
                        setProfileUsername(profileUsernameCall);
                        setRequest(requestCall);
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, [userUID, userUsername]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', userUID));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const imageUrl = userData.backgroundURL || img;
                    setBgImage(imageUrl);
                } else {
                    console.log('User not found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userUID]);

    console.log(split);

    useEffect(() => {
        const handleSplitCleaning = () => {
            if (split !== userSplit) {
                setViewRequest(true);
            } else {
                setViewRequest(false);
            }
        };

        handleSplitCleaning();
    }, [split, userSplit]);

    const handleRequest = async () => {
        try {
            setRequestLoading("Loading...");

            const userRef = doc(db, 'users', userUID);
            await updateDoc(userRef, {
                [`requests.${userUsername}`]: false,
            });
            setRequestLoading("The request was not approved");
        } catch (error) {
            console.error('Error sending request:', error);
            setRequestLoading("error");
        }
    };

    useEffect(() => {
        const handleApprovedView = async () => {
            try {
                const userRef = doc(db, 'users', userUID);

                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const userRequestStatus = userData.requests[userUsername];
                    if (userRequestStatus === false) {
                        setRequestLoading("The request was not approved");
                    } else if (userRequestStatus === true) {
                        setRemoveRequestLoading(false);
                    }
                }
            } catch (error) {
                console.error('Error handling approved view:', error);
            }
        };

        handleApprovedView();
    }, [userUID, userId, profileUsername, userUsername]);

    const handleRequestRemove = async () => {
        try {
            setRemoveRequestLoading(true);

            const userRef = doc(db, 'users', userUID);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const updatedRequests = { ...userData.requests };
                delete updatedRequests[userUsername];
                await updateDoc(userRef, {
                    requests: updatedRequests
                });
            }
            setRemoveRequestLoading(false);
            setRemoveRequest(true);
            window.location.reload();
        } catch (error) {
            console.error('Error removing request:', error);
            setRemoveRequestLoading(false);
        }
    };

    return (
        <div className="relative h-72 bg-cover bg-center border rounded-lg bg-gray-100" style={{ backgroundImage: bgImage && `url(${bgImage})` }}>
            {viewrRequest &&
                <>
                    <div className="flex justify-between items-center p-6">
                        <div className="flex items-center">
                            {request ? (
                                <button onClick={handleRequestRemove} className="text-white font-semibold bg-gray-700 bg-opacity-75 p-2 rounded-lg hover:bg-opacity-100">
                                    {removeRequestLoading ? "Loading..." : "Remove request"}
                                </button>
                            ) : (
                                <button onClick={handleRequest}
                                    className={`text-white font-semibold bg-blue-700 bg-opacity-75 p-2 rounded-lg ${requestLoading === "The request was not approved" ? "cursor-not-allowed" : "hover:bg-opacity-100"}`}
                                    disabled={requestLoading === "The request was not approved"}
                                >
                                    {requestLoading}
                                </button>
                            )}
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default EditBg;
