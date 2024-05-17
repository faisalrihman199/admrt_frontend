import React, { useEffect, useState } from 'react';
import svg1 from '../Layout/AuthPage/images/icon.svg';
import image from '../Layout/AuthPage/images/image 27.png';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import { auth } from '../firebase/firebase';

const Home = () => {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId('');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleButtonClick = () => {
    if (userId) {
      navigate('/filter');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-con h-full ">
      <div className="items-center max-w-screen-2xl px-4 md:px-8 py-4 mx-auto xl:px-5">
        <div className="flex flex-wrap items-center my-10 md:my-20 sm:-mx-3">
          <div className="w-full md:w-3/5 md:px-3">
            <div className="w-full pb-6 sm:pr-5 lg:pr-0 md:pb-0">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl md:max-w-3xl font-bold">Your Brand. <span className="text-blue-700 italic">Strategic</span> Spaces. One Platform </h1>
              <p className="my-2 w-full text-xs md:text-base font-light md:font-normal md:w-3/4">
                AdMrt streamlines advertising by directly connecting advertisers and publishers, reducing complexities and agency fees. List your ad space with ease and start earning today.
              </p>
              <form className="my-6 md:mt-12 sm:max-w-md md:max-w-lg ">
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </div>
                  <input type="text" className="block w-full p-5 px-4 text-sm text-gray-900 border-gray-300 rounded-lg border-blue-500 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    placeholder="Search for ads ..."
                    required
                  />
                  <button type="button"
                    className="text-black absolute right-2.5 py-3 px-8 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-white text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleButtonClick}
                  >
                    Find places to advertise
                  </button>
                </div>
              </form>
              <div>
                <h1 className="mt-3 font-light">Get Started now?<Link to="/register" className="text-blue-500 font-medium underline py-1 mx-2 cursor-pointer">Sign up now</Link></h1>
              </div>
              <div className="mt-12 text-base md:text-xl">
                <div className="flex mb-5">
                  <img src={svg1} alt="icon" />
                  <h1 className="ml-3">Streamline the ad buying and selling process</h1>
                </div>
                <div className="flex">
                  <img src={svg1} alt="icon" />
                  <h1 className="ml-3">See all ad spaces suitable to your brand</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full bg-2  shadow-2xl rounded-xl py-8 px-10 md:w-2/5 backdrop-blur-md">
            <div className="text-center h-auto overflow-hidden rounded-md  sm:rounded-xl">
              <h1 className="text-3xl font-semibold">Sell your ad space</h1>
              <Link to="/register">
                <button className="my-5 py-2 px-12 text-white rounded-full bg-blue-600"><h1>Host ads now</h1></button>
              </Link>
              <div className="flex justify-center items-center">
                <img className="img-fluid text-center" src={image} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Header />
    </div>
  );
};

export default Home;
