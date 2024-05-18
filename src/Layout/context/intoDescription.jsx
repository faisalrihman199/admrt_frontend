import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import ShowMoreText from 'react-show-more-text';
import { BsDot } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import { db, saveUserDataToFirebase } from '../../firebase/firebase';
import editeicon from '../../image/edit_svg_blue.svg';
import { updateProfile, updateProfileSocials } from '../../service/profile';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import AuthenticatedUserViewPermission from '../../components/Permissions/AuthenticatedUserViewPermission';

const IntoDescription = ({ description }) => {
    const [showModal, setShowModal] = useState(false);
    const [isDialogOpened, setIsDialogOpened] = useState(false);
    const [dialogInput, setDialogInput] = useState('');
    const [userData, setUserData] = useState({});
    const [userId, setUserId] = useState(null);
    const { userId: userIdParam } = useParams();
    // const [description2, setDescription2] = useState(description);

    const authHeader = useAuthHeader()
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries('loggedInUser');

        },
    })
    const addNew = async () => {
        try {
            if (!!dialogInput.trim()) {
                mutation.mutate({
                    authHeader,
                    data: { description: dialogInput }
                })


                // setDescription2(dialogInput);
                // QueryClient.invalidateQueries({ queryKey: ['loggedInUser'] })
            } else {
                alert('Please try again');
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };
    useEffect(() => {
    }, [description]);

    return (
        <div>
            {showModal && (
                <form>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-2/5 mx-auto">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">Overview</h3>
                                </div>
                                <div className="relative p-6 flex-auto flex justify-center items-start">
                                    <div>
                                        <h1>
                                            Use this space to show clients you have the skills and experience they're looking for.
                                            <br />
                                            <ul className="my-3">
                                                <li className="flex">
                                                    <BsDot className="mt-1" /> Describe your strengths and skills
                                                </li>
                                                <li className="flex">
                                                    <BsDot className="mt-1" /> Highlight projects, accomplishments, and education
                                                </li>
                                                <li className="flex">
                                                    <BsDot className="mt-1" /> Keep it short and make sure it's error-free
                                                </li>
                                            </ul>
                                        </h1>
                                        <div
                                            className="break-words overflow-hidden h-48 w-full"
                                            open={isDialogOpened}
                                            onClose={() => setIsDialogOpened(false)}
                                        >
                                            <form className="h-36">
                                                <textarea
                                                    // value={description2}
                                                    defaultValue={description}
                                                    onChange={(e) => setDialogInput(e.target.value)}
                                                    className="h-36 overfull border-2 focus:outline-none border-blue-600 focus w-full peer rounded-lg resize-none px-3 py-2.5 font-sans text-sm font-normal"
                                                    placeholder="Tell brands and advertisers about your reach, adspace and anything else they should know"
                                                ></textarea>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="text-blue-700 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-blue-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={addNew}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </form>
            )}
            {(
                <div className="mt-5 ">
                    <div className="flex justify-between">
                        <div className="flex items-start justify-between">
                            <AuthenticatedUserViewPermission>

                                <h1 className="text-2xl font-semibold">{userData.split === 'advertiser' ? 'Brand Description' : 'Intro Description'}</h1>
                                <div className="flex justify-center items-center cursor-pointer mx-5">
                                    <div className="item">
                                        <Button
                                            onClick={() => {
                                                setDialogInput(userData.introDescription);
                                                setIsDialogOpened(true);
                                                setShowModal(true);
                                            }}
                                        >
                                            <img src={editeicon} alt="icon" />
                                        </Button>
                                    </div>
                                </div>
                            </AuthenticatedUserViewPermission>

                        </div>
                    </div>
                    <div className="border my-5"></div>
                    <div className="items overflow-hidden w-full break-words">
                        <ShowMoreText lines={3} more="more" less="less" className="content-css">
                            {description && description.trim().length > 0 ? (
                                <div dangerouslySetInnerHTML={{ __html: description }} />
                            ) : (
                                <p>No description available</p>
                            )}
                        </ShowMoreText>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntoDescription;