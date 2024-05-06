import React, { useEffect, useState } from 'react';
import svg_facebook from '../../svgs/social-media/Rectangle 6590.svg';
import svg_instagram from '../../svgs/social-media/Rectangle 6591.svg';
import svg_x from '../../svgs/social-media/x.svg';
import svg_tiktok from '../../svgs/social-media/tiktok-svgrepo-com.svg';
import svg_whatsapp from '../../svgs/social-media/whatsapp-icon-logo-svgrepo-com.svg';
import svg_youtube from '../../svgs/social-media/Rectangle 6593.svg';
import svg_linkedin from '../../svgs/social-media/Rectangle 6594.svg';
import eye from '../../svgs/social-media/Group 1000005712.svg'
import AboutHim from './Aboutothers';
import { auth, usersCollection } from '../../firebase/firebase'
import { doc, getDoc } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom'
import copy from '../../svgs/social-media/Group 1000005712.svg';

const SocialMedia = () => {
      const [selectedSocialMedia, setSelectedSocialMedia] = useState([]);
      const [medieData, setMediaData] = useState();
      const { userUID } = useParams()

      useEffect(() => {
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                  if (user) {
                        try {
                              const userRef = doc(usersCollection, userUID);
                              const userDoc = await getDoc(userRef);
                              if (userDoc.exists()) {
                                    const data = userDoc.data();
                                    const media = data.socialMedia;
                                    const matchedMedia = Object.keys(media).filter(mediaName => socialMediaPages.some(page => page.name.toLowerCase() === mediaName.toLowerCase()));
                                    const selectedMedia = matchedMedia.map(mediaName => socialMediaPages.find(page => page.name.toLowerCase() === mediaName.toLowerCase()));
                                    setSelectedSocialMedia(selectedMedia);
                                    setMediaData(media);
                              }
                        } catch (err) {
                              console.error(err);
                        }
                  } else {
                  }
            });

            return () => unsubscribe();
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const socialMediaPages = [
            { name: 'Facebook', icon: svg_facebook, text: 'Facebook' },
            { name: 'Youtube', icon: svg_youtube, text: 'Youtube' },
            { name: 'Linkedin', icon: svg_linkedin, text: 'Linkedin' },
            { name: 'Instagram', icon: svg_instagram, text: 'Instagram' },
            { name: 'X', icon: svg_x, text: 'X' },
            { name: 'Tik Tok', icon: svg_tiktok, text: 'Tik Tok' },
            { name: 'WhatsApp', icon: svg_whatsapp, text: 'WhatsApp' },
            { name: 'Other', icon: copy, text: 'Other' },
      ];

      return (
            <div>
                  <div>
                        <div className='flex justify-between my-3 mt-20'>
                              <div>
                                    <h1 className='font-semibold'>Social Media</h1>
                              </div>
                        </div>
                        <div className='border'></div>
                        <div className='my-3'>
                              <h1> select or copy like to get in touch with them. Add them as a friend on social media</h1>
                        </div>
                        <div className='border'></div>
                        <div>
                              {selectedSocialMedia.map((socialMedia, index) => (
                                    <div key={index} className='flex gap-4 my-4'>
                                          <div className='w-1/6'>{socialMedia.icon && <img src={socialMedia.icon} alt={socialMedia.name} />}</div>
                                          <div className='w-5/6 flex justify-between'>
                                                <div>{socialMedia.name && <h1>{socialMedia.name}</h1>}</div>
                                                {socialMedia.name && (
                                                      <Link to={medieData && medieData[socialMedia.name]} className='flex gap-5'>
                                                            <img src={eye} alt="eye" className='w-6 cursor-pointer' />
                                                      </Link>
                                                )}
                                          </div>
                                    </div>
                              ))}
                        </div>
                        <AboutHim />
                  </div>
            </div>
      );
};

export default SocialMedia;
