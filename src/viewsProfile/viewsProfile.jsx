// import profile_Aus from '../svgs/reviews/Profile-aus.svg';
// import profile_amer from '../svgs/reviews/Profile-amer.svg';
// import profile_china from '../svgs/reviews/Profile-china.svg';
// import flag_Aus from '../svgs/reviews/Rectangle 6596.svg';
// import reviews_img from '../svgs/reviews/Rectangle 6596 (1).svg';
// import reviews_img2 from '../svgs/reviews/Rectangle 6596 (2).svg';
// import reviews_img3 from '../svgs/reviews/Rectangle 6596 (3).svg';
// import reviews_img4 from '../svgs/reviews/Rectangle 6596 (4).svg';
// import EditeUser from "./others/user";
// import IntoDescription from "./others/description";


import { useEffect, useState } from 'react';
import Loading from '../loading/loading'
import { useNavigate, useParams } from 'react-router-dom'

import { ProductAdventiser } from "../Layout/context/adventiser/productAdventiser";
import { otherUserProfile } from "../service/orherUser";
import EditeUser from "../Layout/context/user";
import IntoDescription from "../Layout/context/intoDescription";
import { Specification } from "../Layout/context/specification";
import SpaceHostViewPermission from "../components/Permissions/SpaceHostViewPermission";
import Portfolio from "../Layout/context/portfolio/portfolio";
import AdvertiserViewPermission from "../components/Permissions/AdvertiserViewPermission";
import AboutHim from "../Layout/context/aboutHim/aboutHim";
import SocialMedia from "../Layout/context/socialMedia/socialMedia";
import { MainAdSpace } from "../Layout/adSpace/main";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useQuery } from "@tanstack/react-query";
import { CustomSpinner } from "../components/Spinner";
import EditBackground from '../Layout/context/editeBackground';
import { Button } from '@material-tailwind/react';
import { UserProfileSkeleton } from '../components/Skeleton/userProfile/userProfileSkeleton';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useForm } from 'react-hook-form'; // Import useForm
import { useWebSocket } from '../Layout/context/socketContex'; 

function ViewsProfile() {
  const { sendMessage } = useWebSocket(); 
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false); // Loading state

  const authe=useAuthUser()
  const authHeader = useAuthHeader()
  // const authUser = useAuthUser()
  const { userId } = useParams();
  const navigate = useNavigate();
  const [openNewMessage, setOpenNewMessage] = useState(false);


  const { isPending, isError, data, error } = useQuery({
    queryKey: ['viewUserProfile', { authHeader, userId }],
    queryFn: otherUserProfile,
  })

  const authUser = useAuthUser()


  const [advertiserProfile, setAdvertiserProfile] = useState(false);
  const [requests, setRequests] = useState('')
  const profile_amer = 'https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'



  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl">
        Something went wrong ...
      </div>
    )
  }

  const userInfo = {
    name: data?.full_name,
    topics: data?.topics,
    description: data?.description,
    socialMedias: data?.socials,
    location: data?.location,
    website: data?.website,
    joinDate: data?.joined,
    long_term_service_availability: data?.long_term_service_availability,
    profileImage: data?.profile_image,
    coverImageUrl: data?.banner_image,
    products: data?.products,
    portfolios: data?.portfolios,
    user_role: data?.user_role,
    adSpaces: data?.ad_spaces,
    isVerified: data?.is_admin,

  };
  // const [loading, setLoading] = useState(true);
  // const { split } = useParams();

  const handleMessageOpen = () => {
    setOpenNewMessage(true);
  }
  const sendMessageHandler = (data) => {
    const { message } = data; // Get the message from form data
    if (message.trim()) {
        const payload = {
            message,
            recipient_id: userId
        };
        sendMessage("SEND-MESSAGE", payload); 
        setOpenNewMessage(false);
        reset(); 
    }
};
  return (
    <div className="App">
      <div>
        {isPending ? (
          <div className='mx-20'>
            <UserProfileSkeleton />
          </div>
        ) : (

          <div className="max-w-screen-2xl mx-auto">

            <div className="md:flex">
              <div className="w-full order-2 md:w-2/3">
                <div className={" p-2 md:p-5 rounded-xl"}>
                  <div className=' border bg-gray-50 rounded-xl'>
                    {authUser && authe.user_role!=="admin" &&  (
                      <>
                        {
                          !openNewMessage &&
                        <div className='m-2 flex justify-end'>
                          <Button
                            color="blue"
                            ripple="light"
                            onClick={handleMessageOpen}
                          >
                            Send Message
                          </Button>
                        </div>
                        }

                        {
                          openNewMessage &&

                          <form className="sendMessage m-1" style={{ height: '50px', border: '1px solid #E6EDFF', borderRadius: '10px' }} onSubmit={handleSubmit(sendMessageHandler)}>
                            <div className="rounded flex items-center justify-between">
                              {/* Input field */}
                              <input
                                type="text"
                                className="form-control flex-grow p-2"
                                placeholder="Type a message..."
                                {...register('message')} // Registering the input field
                                style={{ border: 'none', outline: 'none' }}
                                autoComplete="off"
                              />

                              {/* Send icon or loading indicator */}
                              <button
                                type="submit" // Make it a submit button
                                className="flex items-center justify-center p-2"
                                style={{ background: 'none', border: 'none' }}
                                disabled={loading} // Disable button while loading
                              >
                                {loading ? (
                                  <span><svg aria-hidden="true" class="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                  </svg></span> // Replace with a spinner if needed
                                ) : (
                                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_689_3278)">
                                      <path d="M16.8625 5.23784C17.2225 4.24201 16.2575 3.27701 15.2617 3.63784L3.09083 8.03951C2.09166 8.40117 1.97083 9.76451 2.88999 10.297L6.77499 12.5462L10.2442 9.07701C10.4013 8.92521 10.6118 8.84121 10.8303 8.84311C11.0488 8.84501 11.2578 8.93265 11.4123 9.08716C11.5668 9.24166 11.6545 9.45067 11.6564 9.66917C11.6583 9.88767 11.5743 10.0982 11.4225 10.2553L7.95333 13.7245L10.2033 17.6095C10.735 18.5287 12.0983 18.407 12.46 17.4087L16.8625 5.23784Z" fill="black" />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_689_3278">
                                        <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                )}
                              </button>
                            </div>
                          </form>

                        }

                      </>


                    )}
                    <div className={" p-2 md:p-5 "}>

                      <EditBackground coverImageUrl={userInfo.coverImageUrl} />
                      <EditeUser userInfo={userInfo} />
                      <IntoDescription description={userInfo.description} />
                    </div>
                  </div>

                  <SpaceHostViewPermission userRole={userInfo.user_role}>
                    <div>
                      <Specification long_term_service_availability={userInfo.long_term_service_availability} languages={userInfo.languages} />
                    </div>
                  </SpaceHostViewPermission>

                </div>
                <SpaceHostViewPermission userRole={userInfo.user_role}>
                  <Portfolio userPortfolios={userInfo.portfolios} />
                </SpaceHostViewPermission>

                <AdvertiserViewPermission userRole={userInfo.user_role}>
                  <ProductAdventiser userProducts={userInfo.products} />
                </AdvertiserViewPermission>
              </div>
              <div class="w-full py-0 max-[1200px]:px-4 px-10 order-1 md:order-2 md:w-1/3">
                <AboutHim
                  location={userInfo.location}
                  website={userInfo.website}
                  joinDate={userInfo.joinDate}
                />
                <SocialMedia socials={userInfo.socialMedias} />
                <SpaceHostViewPermission userRole={userInfo.user_role}>
                  <MainAdSpace adSpaces={userInfo.adSpaces} />
                </SpaceHostViewPermission>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default ViewsProfile;