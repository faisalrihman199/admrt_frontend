import React, { useEffect, useState } from 'react';
import svg_facebook from '../../../svgs/social-media/Rectangle 6590.svg';
import svg_instagram from '../../../svgs/social-media/Rectangle 6591.svg';
import svg_x from '../../../svgs/social-media/x.svg';
import svg_tiktok from '../../../svgs/social-media/tiktok-svgrepo-com.svg';
import svg_whatsapp from '../../../svgs/social-media/whatsapp-icon-logo-svgrepo-com.svg';
import svg_youtube from '../../../svgs/social-media/Rectangle 6593.svg';
import svg_linkedin from '../../../svgs/social-media/Rectangle 6594.svg';
import ModalAddSocialMedia from '../../../Modals/ModalAddSocialMedia';
import ModalDelete from '../../../Modals/ModalDelete';
import CheckMedia from './checkMedia';
import copy from '../../../svgs/social-media/Group 1000005712.svg';
import { auth, usersCollection } from '../../../firebase/firebase'
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { addProfileSocials } from '../../../service/profile';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import AuthenticatedUserViewPermission from '../../../components/Permissions/AuthenticatedUserViewPermission';

const SocialMedia = ({ socials }) => {
    const [selectedSocialMedia, setSelectedSocialMedia] = useState([]);
    const [userId, setUserId] = useState(null);
    const [currentSocials, setCurrentSocials] = useState(socials)
    const { split } = useParams();
    const maxSocialMediaCount = 6;
    const authHeader = useAuthHeader()
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: addProfileSocials,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries('loggedInUser')

        },
    })
    console.log('socials', socials)


    const handleSelectSocialMedia = (addedSocial) => {

        try {
            mutation.mutate({
                authHeader,
                data: { social_media: addedSocial.social_media, url: addedSocial.url }
            })

            setCurrentSocials((prevSelected) => [...prevSelected, addedSocial]);


        } catch (error) {
            console.error('Error updating user data:', error);
            alert('Something Went wrong');
        }


    };

    const handleRemoveSocialMedia = (socialMediaName) => {
        setSelectedSocialMedia((prevSelected) =>
            prevSelected.filter((item) => item.name !== socialMediaName)
        );
    };

    const socialMediaPages =
    {
        "fb": { name: 'Facebook', icon: svg_facebook, text: 'Facebook' },
        "yt": { name: 'Youtube', icon: svg_youtube, text: 'Youtube' },
        "ln": { name: 'Linkedin', icon: svg_linkedin, text: 'Linkedin' },
        "in": { name: 'Instagram', icon: svg_instagram, text: 'Instagram' },
        "x": { name: 'X', icon: svg_x, text: 'X' },
        "tt": { name: 'Tik Tok', icon: svg_tiktok, text: 'Tik Tok' },
        "wa": { name: 'WhatsApp', icon: svg_whatsapp, text: 'WhatsApp' },
        "ot": { name: 'Other', icon: copy, text: 'Other' }
    }


    return (
        <div>
            <div>
                <div className='flex justify-between my-3 mt-20'>
                    <div>
                        <h1 className='font-semibold'>{split === 'advertiser' ? 'Platforms' : 'Social Media'}</h1>
                    </div>
                    <AuthenticatedUserViewPermission>
                        <div className='flex gap-3'>
                            <button className='bg-blue-700 px-2 py-1 rounded-lg text-sm'>
                                <ModalAddSocialMedia onSelectSocialMedia={handleSelectSocialMedia} />
                            </button>
                        </div>
                    </AuthenticatedUserViewPermission>

                </div>
                {/* {split !== 'advertiser' &&
                    <div className='my-3 border-t-2'>
                        <h1>Please select or copy like to get in touch with him. Add them as a friend on social media</h1>
                    </div>
                } */}
                <div className='border'></div>
                {currentSocials && currentSocials.map((socialMedia, index) => (
                    <div key={index} className='flex gap-4 my-4'>
                        <div className='w-5/6 flex justify-between'>
                            <a href={socialMedia.url ? socialMedia.url : '#'} target={socialMedia.url ? "_blank" : ''} rel="noopener noreferrer">
                                <div className='flex items-center gap-2'>
                                    {socialMediaPages.hasOwnProperty(socialMedia.social_media) && <img src={socialMediaPages[socialMedia.social_media].icon} alt={socialMedia.social_media} />}
                                    {socialMedia.url && <h1>{
                                        (() => {
                                            const parts = socialMedia.url.split('/');
                                            let username = parts.pop();
                                            if (!username) {
                                                username = parts.pop();
                                            }
                                            return username;
                                        })()
                                    }</h1>}
                                </div>
                            </a>
                            <AuthenticatedUserViewPermission>
                                {socialMedia.social_media && (
                                    <div className='flex gap-5'>
                                        {/* <CheckMedia selectedSocialMedia={selectedSocialMedia} userId={userId} /> */}
                                        <div className='h-6 w-6 cursor-pointer'>
                                            <ModalDelete onDeleteMedia={handleRemoveSocialMedia} name={socialMedia.social_media} />
                                        </div>
                                    </div>
                                )}
                            </AuthenticatedUserViewPermission>



                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SocialMedia;
