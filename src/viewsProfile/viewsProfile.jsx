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

function ViewsProfile() {
  const authHeader = useAuthHeader()
  // const authUser = useAuthUser()
  const { userId } = useParams();
  const navigate = useNavigate();


  const { isPending, isError, data, error } = useQuery({
    queryKey: ['viewUserProfile', { authHeader, userId }],
    queryFn: otherUserProfile,
  })



  const [advertiserProfile, setAdvertiserProfile] = useState(false);
  const [requests, setRequests] = useState('')
  const profile_amer = 'https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'



  if (isPending) {
    // return <CustomSpinner />
    return <UserProfileSkeleton />
  }

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
    adSpaces: data?.ad_spaces

  };
  // const [loading, setLoading] = useState(true);
  // const { split } = useParams();


  return (
    <div className="App">

      <div className="max-w-screen-2xl mx-auto">
        {isPending && (
          <UserProfileSkeleton />
        )}
        <div className="md:flex">
          <div className="w-full order-2 md:w-2/3">
            <div className={"border p-2 md:p-5 rounded-xl"}>
              <div className='m-2' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  color="blue"
                  ripple="light"
                  onClick={() => navigate(`/message/direct/${userId}`, { state: { newConverSationUserName: userInfo.name, newConverSationUserProfileImage: userInfo.profileImage } })}
                >
                  Send Message
                </Button>
              </div>
              <EditBackground coverImageUrl={userInfo.coverImageUrl} />
              <EditeUser userInfo={userInfo} />
              <IntoDescription description={userInfo.description} />
              <SpaceHostViewPermission userRole={userInfo.user_role}>

                <div>
                  <Specification long_term_service_availability={userInfo.long_term_service_availability} />
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
    </div>
  );
}

export default ViewsProfile;