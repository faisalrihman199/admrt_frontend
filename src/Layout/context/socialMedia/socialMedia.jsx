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

const SocialMedia = () => {
    const [selectedSocialMedia, setSelectedSocialMedia] = useState([]);
    const [userId, setUserId] = useState(null);
    const { split } = useParams();
    const maxSocialMediaCount = 6;

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUserId(user.uid);
                try {
                    const userRef = doc(usersCollection, user.uid);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        const media = data.socialMedia;
                        const matchedMedia = Object.keys(media).filter(mediaName => socialMediaPages.some(page => page.name.toLowerCase() === mediaName.toLowerCase()));
                        const selectedMedia = matchedMedia.map(mediaName => socialMediaPages.find(page => page.name.toLowerCase() === mediaName.toLowerCase()));
                        setSelectedSocialMedia(selectedMedia);
                    }
                } catch (err) {
                    console.error(err);
                }
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectSocialMedia = (socialMedia) => {
        const isAlreadySelected = selectedSocialMedia.some((item) => item.name === socialMedia);

        if (!isAlreadySelected && selectedSocialMedia.length < maxSocialMediaCount) {
            const selectedOption = socialMediaPages.find((page) => page.name === socialMedia);

            setSelectedSocialMedia((prevSelected) => [
                ...prevSelected,
                {
                    name: socialMedia,
                    icon: selectedOption ? selectedOption.icon : null,
                    page: selectedOption ? selectedOption : { name: '', url: '' },
                },
            ]);
        }
    };

    const handleRemoveSocialMedia = (socialMediaName) => {
        setSelectedSocialMedia((prevSelected) =>
            prevSelected.filter((item) => item.name !== socialMediaName)
        );
    };

    const socialMediaPages = [
        { name: 'Facebook', icon: svg_facebook, text: 'Facebook' },
        { name: 'Youtube', icon: svg_youtube, text: 'Youtube' },
        { name: 'Linkedin', icon: svg_linkedin, text: 'Linkedin' },
        { name: 'Instagram', icon: svg_instagram, text: 'Instagram' },
        { name: 'X', icon: svg_x, text: 'X' },
        { name: 'Tik Tok', icon: svg_tiktok, text: 'Tik Tok' },
        { name: 'WhatsApp', icon: svg_whatsapp, text: 'WhatsApp' },
        { name: 'Other', icon: copy, text: 'Other' }
    ];

    return (
        <div>
            <div>
                <div className='flex justify-between my-3 mt-20'>
                    <div>
                        <h1 className='font-semibold'>{split === 'advertiser' ? 'Platforms' : 'Social Media'}</h1>
                    </div>
                    <div className='flex gap-3'>
                        <button className='bg-blue-700 px-2 py-1 rounded-lg text-sm'>
                            <ModalAddSocialMedia onSelectSocialMedia={handleSelectSocialMedia} userId={userId} />
                        </button>
                    </div>
                </div>
                {split !== 'advertiser' &&
                    <div className='my-3 border-t-2'>
                        <h1>Please select or copy like to get in touch with him. Add them as a friend on social media</h1>
                    </div>
                }
                <div className='border'></div>
                {selectedSocialMedia.map((socialMedia, index) => (
                    <div key={index} className='flex gap-4 my-4'>
                        <div className='w-1/6'>{socialMedia.icon && <img src={socialMedia.icon} alt={socialMedia.name} />}</div>
                        <div className='w-5/6 flex justify-between'>
                            <div>{socialMedia.name && <h1>{socialMedia.name}</h1>}</div>
                            {socialMedia.name && (
                                <div className='flex gap-5'>
                                    <CheckMedia selectedSocialMedia={selectedSocialMedia} userId={userId} />
                                    <div className='h-6 w-6 cursor-pointer'>
                                        <ModalDelete onDeleteMedia={handleRemoveSocialMedia} name={socialMedia.name} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SocialMedia;
