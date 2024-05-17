import React, { useEffect, useRef, useState } from "react";
import { Navbar, Typography, IconButton } from "@material-tailwind/react";
import Logo from '../images/Group 1000005596 (2).svg'
import userPhoto from '../Layout/AuthPage/images/Group 1000005937.svg'
import { Link, useNavigate } from "react-router-dom";
import Notification from '../images/notification.svg'
import down from '../svgs/down.svg'
import { ref, getDownloadURL } from 'firebase/storage'
import { auth, db, storage, usersCollection } from '../firebase/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import Search from "./search/search";
import Chek from '../svgs/chek.svg'
import Close from '../svgs/close.svg'
import RedNotification from '../images/redNotification.svg'
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { MdMessage } from 'react-icons/md';
import { FaAd } from 'react-icons/fa';
import SpaceHostViewPermission from "./Permissions/AuthenticatedUserViewPermission";
import AdvertiserViewPermission from "./Permissions/AdvertiserViewPermission";

function StickyNavbar({ authenticated }) {
  const [openNav, setOpenNav] = React.useState(false);
  const [userImage, setUserImage] = useState(null);
  const [state, setState] = useState(false);
  const [userId, setUserId] = useState(null);
  const profileRef = useRef(null);
  const [userFullName, setUserFullName] = useState(null);
  const [split, setSplit] = useState(null)
  const navigate = useNavigate();
  const defaultAvate = "https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg";
  const [modal, setModal] = useState(false)
  const [comeRequest, setComeRequest] = useState(null)
  const [hasFalseRequests, setHasFalseRequests] = useState(false);
  const [lookingUserId, setLookingUserId] = useState(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const signOut = useSignOut()
  const isAuthenticated = useIsAuthenticated()
  const auth = useAuthUser()



  useEffect(() => {
    const handleDropDown = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setState(true);
      }
    };

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setState(false);
      }
    };

    document.addEventListener('click', handleDropDown);
    document.addEventListener('scroll', handleClickOutside);
  }, [profileRef]);

  useEffect(() => {
    const getImageFromStorage = async () => {
      try {
        if (userId) {
          const storageRef = ref(storage, `users/${userId}/images/user_image.png`);
          const downloadURL = await getDownloadURL(storageRef);
          setUserImage(downloadURL);
        }
      } catch (error) {
        console.error('Error getting user image:', error);
      }
    };

    getImageFromStorage();
  }, [userId]);

  const navigation = [
    { title: "Profile", path: `/profile/${auth?.id}` },
    { title: "Settings", path: `/settings` },
  ];
  const handleLogout = () => {
    // auth.signOut();
    signOut()
    navigate("/")
    window.location.reload();
  }

  const handleLookForUserId = async (username) => {
    try {
      const lookForRef = await getDoc(doc(db, 'search', username));
      if (lookForRef.exists()) {
        const data = lookForRef.data();
        setLookingUserId(data.userId);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleChek = async (username) => {
    handleLookForUserId(username);
    try {
      const userDocRef = doc(usersCollection, userId);
      await updateDoc(userDocRef, {
        [`requests.${username}`]: true,
      });

      const userRef = doc(usersCollection, lookingUserId);
      await updateDoc(userRef, {
        [`requests.${userFullName}`]: true,
      });

      setComeRequest((prevComeRequest) => ({
        ...prevComeRequest,
        [username]: true,
      }));
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const handleRequestRemove = async (username) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedRequests = { ...userData.requests };
        delete updatedRequests[username];
        await updateDoc(userRef, {
          requests: updatedRequests
        });
      } else {
        console.error('User document does not exist');
      }
    } catch (error) {
      console.error('Error removing request:', error);
    } finally {
      window.location.reload()
    }
  };
  function renderProfileImage(auth) {
    function handleImageError(e) {
      e.target.onerror = null;
      e.target.src = defaultAvate;
    }

    if (auth?.profile_image) {
      return <img src={auth.profile_image} alt="" className="w-full h-full rounded-full" onError={handleImageError} />;
    } else if (auth?.full_name) {
      return (
        <div className="w-full h-full rounded-full flex items-center justify-center bg-orange-200 text-xl">
          {auth.full_name.charAt(0).toUpperCase()}
        </div>
      );
    } else {
      return <img src={defaultAvate} alt="" className="w-full h-full rounded-full" />;
    }
  }

  const clickCCloseSeen = async () => {
    const daf = doc(usersCollection, userId);
    await updateDoc(daf, { seens: 0 });
  }

  const ghostUser = (
    <div className="flex">
      <ul className="mt-2 mb-2 mr-6 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
        <Search className={"mr-8"} />
        <Typography
          as="li"
          variant="small"
          className="p-1 text-black text-lg font-normal"
        >
          <Link to="/" className="flex items-center hover:text-blue-700  hover:duration-700">
            <h1>Home</h1>
          </Link>
        </Typography>
        <Typography
          as="li"
          variant="small"
          className="p-1 text-black text-lg font-normal"
        >
          <Link to="/about" className="flex items-center hover:text-blue-700 hover:box-shadow: -1px 1px 10px 0px rgba(0,122,255,0.75);">
            <h1>About</h1>
          </Link>
        </Typography>
        <Typography
          as="li"
          variant="small"
          className="p-1 text-black text-lg font-normal"
        >
          <a href="/contact" className="flex items-center hover:text-blue-700 ">
            <h1>Contact</h1>
          </a>
        </Typography>
      </ul>
      <div className='cursor-pointer hidden lg:flex buttonSign'>
        <Link to="/login">
          <div className='hover:bg-blue-100 signIndiv h-10 p-2 px-8'>
            <img src={userPhoto} alt="User" className="h-5 mr-2" />
            <h1 className='text-center buttonSignIn'>Sign In</h1>
          </div>
        </Link>
        <Link to="/register">
          <div>
            <button className='buttonSignUp hover:bg-blue-100 h-10 p-2 px-8'>Sign Up</button>
          </div>
        </Link>
      </div>
      <IconButton
        variant="text"
        className={`ml-auto h-6 w-6 text-inherit text-black hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden ${hasFalseRequests ? 'bg-red-600' : ''}`}
        ripple={false}
        onClick={() => setOpenNav(!openNav)}
      >
        {openNav ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </IconButton>
    </div>
  );
  const getUser = (
    <div className="flex items-center gap-2">
      <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center ml-8">
        {/* <Typography
          as="li"
          variant="small"
          className="p-1 text-black text-lg font-normal mr-3"
        >
          <Link to="/" className="flex items-center max-[1280px]:text-base hover:text-blue-700 hover:duration-500 ">
            <h1>Home</h1>
          </Link>
        </Typography> */}

        <Search />

        <Typography
          as="li"
          variant="small"
          className="p-1 text-black max-[1280px]:text-base text-lg font-normal mr-3"
        >
          <AdvertiserViewPermission userRole={auth?.user_role}>
            <Link to="/filter" className="flex items-center hover:text-blue-700 hover:duration-500 ">
              <FaAd className="mr-1 self-start" />
              <h1>Find Ad spaces</h1>
            </Link>
          </AdvertiserViewPermission>
        </Typography>
        {/* <Typography
          as="li"
          variant="small"
          className="p-1 text-black max-[1280px]:text-base text-lg font-normal mr-3"
        >
          <Link to="/about" className="flex items-center hover:text-blue-700 hover:duration-500 ">
            <h1>About</h1>
          </Link>
        </Typography> */}
        <Typography
          as="li"
          variant="small"
          className="p-1 text-black max-[1280px]:text-base text-lg font-normal"
        >
          <Link to={`/message`} className="flex items-center hover:text-blue-700 ">
            <MdMessage className="mr-1 self-start" />
            <h1>Messages</h1>
          </Link>
        </Typography>
        <Typography
          as="li"
          variant="small"
          className="p-1 text-black text-lg font-normal"
        >
          <button
            className="pt-3 px-4"
            onClick={() => setModal(!modal)}
            onMouseLeave={() => setModal(false)}
          >
            {comeRequest && unreadMessageCount > 0 && Object.keys(comeRequest).some(username => !comeRequest[username]) ? (
              <img src={RedNotification} alt="" className="w-7 " />
            ) : (
              <img src={Notification} alt="" className="w-7 " />
            )}
            {modal && (
              <div className='absolute shadow-lg bg-gray-100 py-0 z-[1000] border rounded-lg w-[300px]'>
                <div className="flex justify-center items-center my-2 px-4 border-b">
                  <p className="text-xs text-blue-500 cursor-pointer p-1 rounded-sm">Notification</p>
                </div>
                <div>
                  <div className="flex justify-between mx-3">
                    <h1 className="text-sm">You have received {unreadMessageCount} message</h1>
                    <button onClick={clickCCloseSeen}>
                      <img src={Close} alt="" className="hover:bg-gray-100 " />
                    </button>
                  </div>
                  {comeRequest && Object.keys(comeRequest).length > 0 && (
                    <div className="py-3">

                      {Object.entries(comeRequest).map(([username, requestStatus]) => {
                        if (!requestStatus) {
                          return (
                            <ul className="flex" key={username}>
                              <li className="flex py-1 hover:bg-gray-200 border-b text-sm text-start px-2 w-full justify-between">
                                {username}
                                <span className="text-sm text-gray-500"> sent you a request</span>
                                <div className="flex">
                                  <li className="hover:bg-gray-300 rounded-sm p-1 m-auto" onClick={() => handleChek(username)}>
                                    <img src={Chek} alt="" />
                                  </li>
                                  <li className="hover:bg-gray-300 rounded-sm p-1 m-auto" onClick={() => handleRequestRemove(username)}>
                                    <img src={Close} alt="" />
                                  </li>
                                </div>
                              </li>
                            </ul>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  )}
                  {(!comeRequest || Object.keys(comeRequest).length === 0) && (
                    <div className="py-3">
                      <p className="text-gray-500 text-center">No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </button>

        </Typography>
      </ul>
      <div className='cursor-pointer hidden lg:flex border-2 border-blue-500 p-1 rounded-full'
        onMouseEnter={() => setState(true)}
        onMouseLeave={() => setState(false)}
      >
        <div className="flex"
        >
          {split !== 'advertiser' && (
            <button
              className="hidden w-10 flex h-10 outline-none rounded-full  ring-offset-2 ring-blue-600 lg:focus:ring-2 lg:block"
              onClick={() => setState(!state)}
            >
              {renderProfileImage(auth)}
            </button>
          )}
          {auth?.full_name ? (
            <>
              <h1 className="max-[1280px]:hidden text-black text-center p-2">{auth?.full_name}</h1>
              <img src={down} alt="" className="w-9 max-[1280px]:hidden" />
            </>
          ) : (
            <h1 className="text-black text-center p-2">Please enter name</h1>
          )}

        </div>
        <ul className={`bg-white top-16 mr-4 right-0 mt-6 space-y-6 lg:absolute lg:border lg:rounded-md lg:w-52 lg:shadow-md lg:space-y-0 lg:mt-0 ${state ? '' : 'lg:hidden'}`}>
          {/* {userFullName ? (
            <>
              <h1 className="min-[1280px]:hidden text-black text-lg text-center p-2">{userFullName}</h1>
              <div className="border"></div>
            </>
          ) : (
            <h1 className="text-black text-center p-2">Please enter name</h1>
          )} */}
          {navigation.map((item, idx) => (
            <li key={idx}>
              <Link className="block text-gray-600 hover:text-gray-900 lg:hover:bg-gray-50 lg:p-3" to={item.path}>
                {item.title}
              </Link>
            </li>
          ))}
          <button onClick={handleLogout} className="block w-full text-justify text-red-600 hover:text-red-500 border-t py-3 lg:hover:bg-red-50 lg:p-3">
            Logout
          </button>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="" >
      <div className="max-w-screen-2xl mx-auto ">
        <Navbar className="sticky bg-transpernt border-none backdrop-none backdrop-blur-none shadow-none top-0 z-10 h-max max-w-full rounded-none px-6 py-6 lg:px-6 lg:py-4">
          <div className="flex items-center justify-between text-blue-gray-900">
            <Typography
              as="a"
              href="/"
              className="mr-4 text-black cursor-pointer py-1.5 font-medium"
            >
              <img className="w-36 md:w-44" src={Logo} alt="Logo" />
            </Typography>
            <div className="flex items-center gap-4">
              <div className="mr-4 hidden lg:block">{isAuthenticated ? getUser : ghostUser}</div>
            </div>
          </div>
        </Navbar>
      </div>
    </div>
  );
}

export default StickyNavbar;