import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import youtube from './Primary/youtube.svg';
import twitter from '../svgs/social-media/Twitter X.svg';
import facebook from './Primary/facebook.svg';
import instagram from './Primary/instagram.svg';
import tiktok from '../svgs/social-media/tiktok-svgrepo-com.svg'
import whatsapp from '../svgs/social-media/whatsapp-icon-logo-svgrepo-com.svg';
import Linkedin from '../svgs/social-media/Rectangle 6594.svg';
import { avatar } from '../modul/main';
import { SocialIcon } from 'react-social-icons';
import { PopoverCustomAnimation } from '../components/PopOver'
import { PopoverContent } from '@material-tailwind/react';

const platformIcons = (platform) => {
  switch (platform) {
    case 'yt':
      return youtube;
    case 'tt':
      return twitter;
    case 'fb':
      return facebook;
    case 'in':
      return instagram;
    case 'tk':
      return tiktok;
    case 'wa':
      return whatsapp;
    case 'ln':
      return Linkedin;
    default:
      return null; // return a default icon for 'x' and 'ot' or any other unknown social media
  }
};

const SpaceProfileSearchCard = ({ user }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  return (
    <div key={user?.uid} className='border rounded-lg p-5 shadow-md max-w-sm max-h-60 bg-slate-50'>
      <div className='flex justify-between mt-5'>
        <div className='flex gap-4'>
          <div className='w-1/5'>
            <img className='  rounded-full' src={user?.profile_image || avatar} alt="iconYoutuber" />
          </div>
          <div className=''>
            <h1 className='font-semibold'>{user?.fullName}</h1>
            <h1 className='text-gray-500 text-sm'>{user.topics && user.topics.map(topic => topic.title).join(', ')}</h1>
          </div>
        </div>
        <div className='flex gap-3'>
          {user?.socialMedia ? user.socialMedia.map(({ social_media, url }) => (
            <div className="transform hover:scale-110 transition-transform duration-200 rounded-full hover:shadow-sm">
              <SocialIcon url={url} key={social_media} target="_blank" rel="noopener noreferrer" style={{ height: 30, width: 30 }} />
            </div>
          )) : (
            <div className='flex cursor-not-allowed opacity-50 gap-3'>
              <div className="transform hover:scale-110 transition-transform duration-200 rounded-full hover:shadow-sm">
                <SocialIcon url="https://www.youtube.com" network="youtube" style={{ height: 25, width: 25 }} />
              </div>
              <div className="transform hover:scale-110 transition-transform duration-200 rounded-full hover:shadow-sm">
                <SocialIcon url="https://www.facebook.com" network="facebook" style={{ height: 25, width: 25 }} />
              </div>
              <div className="transform hover:scale-110 transition-transform duration-200 rounded-full hover:shadow-sm">
                <SocialIcon url="https://www.instagram.com" network="instagram" style={{ height: 25, width: 25 }} />
              </div>
              <div className="transform hover:scale-110 transition-transform duration-200 rounded-full hover:shadow-sm">
                <SocialIcon url="https://www.twitter.com" network="twitter" style={{ height: 25, width: 25 }} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className='text-left p-3 mt-2 text-sm'>
          {showFullDescription ? (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
              <div className="bg-white p-5 rounded shadow-lg max-w-md m-auto">
                {user?.introDescription}
                <button onClick={() => setShowFullDescription(false)} className="mt-4 block bg-blue-500 text-white p-2 rounded">
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className='text-gray-400'>
              {user?.introDescription && user?.introDescription.split(' ').slice(0, 15).join(' ')}
              {user?.introDescription && user?.introDescription.split(' ').length > 15 && ' ...'}
            </div>
          )}
          <button onClick={toggleDescription} className="ml-2 text-gray-400 left-0">

            {showFullDescription ? 'Show Less' : 'Show More'}
          </button>
        </div>

      </div>

      <div className='m-3     rounded-xl'>
        <div className='p-1 flex justify-end'>
          <Link to={`/profile/user/${user.userId}`} className='  hover:bg-opacity-75 p-2 rounded-lg'>
            <button className='w-44 text-gray-700 bg-gray-200 rounded'>
              View profile
            </button>
          </Link>
        </div>
      </div>
    </div >
  );
};

export default SpaceProfileSearchCard;