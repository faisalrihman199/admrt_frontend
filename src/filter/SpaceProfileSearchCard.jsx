import { useState } from "react";
import { SocialIcon } from "react-social-icons";
import { avatar } from "../modul/main";
import { Link, useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();



  return (
    // <div key={profile?.id} className='border rounded-lg px-7  shadow-md max-w-sm max-h-65  '>
    <div key={profile?.id} className='border rounded-lg px-7 shadow-md max-w-sm max-h-65 px-10 flex flex-col flex-wrap hover:shadow-xl hover:cursor-pointer'
      onClick={() => navigate(`/profile/user/${profile.id}`)}>

      {/* NAME AND IMAGE */}
      <div className='flex gap-3 mt-5'>
        <div className='w-20 h-20 flex-shrink-0'>
          <img className='h-full w-full rounded-full object-cover' src={profile?.profile_image || avatar} alt="iconYoutuber" />
        </div>
        <div className=' '>
          <h1 className='font-semibold'>{profile?.full_name}</h1>
          <h1 className='text-gray-500 text-sm'>{profile.topics && profile.topics.map(topic => topic.title).join(', ').slice(0, 110)}</h1>
        </div>
      </div>
      {/* DESCRIPTION */}
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
                {/* <button onClick={toggleDescription} className="ml-2 text-gray-400 left-0">
                    Show More
                  </button> */}
              </div>
            )}
          </div>
        )}

      </div>
      {/* SOCIAL MEDIA */}
      <div className='flex gap-3   p-3  justify-between margin-top: auto mt-5 '>
        {profile?.socials && profile.socials.length > 0 && (<p className="text-sm text-gray-500">Platforms:</p>)}
        <div className='flex gap-1 justify-end'>
          {profile?.socials && profile.socials.slice(0, 7).map(({ social_media, url }) => (
            <div onClick={(event) => event.stopPropagation()} className="z-1 transform hover:scale-110 transition-transform duration-200 rounded-full hover:shadow-sm">
              <SocialIcon url={url} key={social_media} network={socialMediaNetworks[social_media]} target="_blank" rel="noopener noreferrer" style={{ height: 30, width: 30 }} />
            </div>
          ))}
        </div>
      </div>
      {/* BUTTONS */}
      {/* <div className='flex   rounded-x justify-end button-container mt-auto border-t'>
        <Link to={`/profile/user/${profile.id}`} className='hover:bg-opacity-75 p-2 rounded-lg'>
          <button className="border-2 border-gray-300 px-2 py-1 rounded text-blue-500 hover:bg-blue-500 hover:text-white">
            View Profile
          </button>
        </Link>
      </div> */}
    </div >
  );
};

export default SpaceProfileSearchCard;