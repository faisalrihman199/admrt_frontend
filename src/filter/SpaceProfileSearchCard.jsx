import { useState } from "react";
import { SocialIcon } from "react-social-icons";
import { avatar } from "../modul/main";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";

const SpaceProfileSearchCard = ({ profile }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const socialMediaNetworks = {
    fb: 'facebook',
    yt: 'youtube',
    ln: 'linkedin',
    in: 'instagram',
    x: 'xbox',
    tt: 'tiktok',
    wa: 'whatsapp'
  }



  return (
    // <div key={profile?.id} className='border rounded-lg px-7  shadow-md max-w-sm max-h-65  '>
    <div key={profile?.id} className='border rounded-lg px-7 shadow-md max-w-sm max-h-65 flex flex-col flex-wrap'>

      {/* NAME AND IMAGE */}
      <div className='flex gap-3 mt-5  '>
        <div className='w-1/5'>
          <img className='  rounded-full' src={profile?.profile_image || avatar} alt="iconYoutuber" />
        </div>
        <div className=''>
          <h1 className='font-semibold'>{profile?.full_name}</h1>
          <h1 className='text-gray-500 text-sm'>{profile.topics && profile.topics.map(topic => topic.title).join(', ')}</h1>
        </div>
      </div>
      {/* DESCRIPTION */}
      <div>
        <div className='text-left p-3 mt-2 text-sm'>
          {showFullDescription ? (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
              <div className="bg-white p-5 rounded shadow-lg max-w-md m-auto">
                {profile?.description}
                <button onClick={() => setShowFullDescription(false)} className="mt-4 block bg-blue-500 text-white p-2 rounded">
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className='text-gray-400'>
              <div>
                {profile?.description && profile?.description.split(' ').slice(0, 15).join(' ')}
              </div>
              {profile?.description && profile?.description.split(' ').length > 10 && (
                <div>
                  <button onClick={toggleDescription} className="ml-2 text-gray-400 left-0">
                    Show More
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      {/* SOCIAL MEDIA */}
      <div className='flex gap-3 mb-2  justify-end'>
        {profile?.socials && profile.socials.map(({ social_media, url }) => (
          <div className="transform hover:scale-110 transition-transform duration-200 rounded-full hover:shadow-sm">
            <SocialIcon url={url} key={social_media} network={socialMediaNetworks[social_media]} target="_blank" rel="noopener noreferrer" style={{ height: 30, width: 30 }} />
          </div>
        ))
        }
      </div>
      {/* BUTTONS */}
      <div className='flex m-3 rounded-x justify-end button-container mt-auto border-t'>
        <Link to={`/profile/user/${profile.id}`} className='hover:bg-opacity-75 p-2 rounded-lg'>
          <IoLogOutOutline className='w-6 h-6 text-gray-700   rounded' />
        </Link>
      </div>
    </div >
  );
};

export default SpaceProfileSearchCard;