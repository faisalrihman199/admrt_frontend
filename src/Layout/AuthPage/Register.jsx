import React, { useState } from "react";
import svg2 from './images/Group.svg';
import svg3 from './images/ic_google logo (1).svg';
import svg4 from './images/ic_fb logo.svg';
import '../style.css'
import SlideShow from '../SlideShow'
import { auth, facebookProvider, signInWithGooglePopup, usersCollection } from '../../firebase/firebase'
import { signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import modal1 from './images/megaphone 1.svg';
import modal2 from './images/megaphone 1 (1).svg';
import { VscChromeClose } from "react-icons/vsc";
import { doc, setDoc } from "firebase/firestore";

function Register() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isAdSpaceHost, setIsAdSpaceHost] = useState(false);
  const [isAdvertiser, setIsAdvertiser] = useState(false);

  const sendUserDataToFirebase = async (userId, email, fullName, userType) => {
    const userRef = doc(usersCollection, userId);
    
    await setDoc(userRef, {
      email: email,
      fullName: fullName,
      userId: userId,
      split: userType,
      registrationDate: new Date(),
    });
  };

  const signInWithGoogle = async (userType) => {
    try {
      const result = await signInWithGooglePopup();
      const user = result.user;

      sendUserDataToFirebase(user.uid, user.email, user.displayName, userType);

      navigate("/");
    } catch (error) {
      console.error(error)
    }
  };

  const signInWithFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleProviderSelection = (provider) => {
    setSelectedProvider(provider);
    setModal(true);
  };

  const handleCreateAccount = () => {
    if ((isAdSpaceHost || isAdvertiser) && selectedProvider) {
      if (selectedProvider === 'google') {
        signInWithGoogle(isAdSpaceHost ? 'adSpaceHost' : 'advertiser');
      } else if (selectedProvider === 'facebook') {
        signInWithFacebook();
      }
    }
  };

  return (
    <div className="login-container min-h-screen md:flex">
      {modal && (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none bg-black bg-opacity-25 focus:outline-none">
            <div className="relative w-[80%]  md:w-2/4 mx-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className='px-3 pt-3 rounded-full flex justify-end' onClick={() => setModal(false)}>
                  <VscChromeClose className='w-6 h-6 p-1 rounded-full text-white bg-gray-400 hover:bg-gray-500' />
                </div>
                <div className="relative p-2 md:p-6 justify-center items-start">
                  <div>
                    <h1 className='text-center mb-6 text-2xl md:text-3xl font-semibold'>Choose whether you are advertiser or space host</h1>
                  </div>
                  <div className="flex gap-4 px-10">
                    <div className="relative mt-2 w-full md:w-1/2 py-3 md:py-12 rounded-xl font-medium text-gray-700">
                      <input className="j2x7_17hqRVmwte_tWFa peer hidden" type="radio" name="framework" id="googlePay" value="googlePay" onChange={() => setIsAdSpaceHost(true)} />
                      <label className="absolute top-0 h-full w-full cursor-pointer rounded-xl border peer-checked:border-blue-700 peer-checked:text-blue-700  peer-checked:shadow-2xl peer-checked:duration-500 peer-checked:opacity-100" htmlFor="googlePay"></label>
                      <div className="text-center">
                        <div className="flex justify-center items-center">
                          <img className="w-14 md:w-20" src={modal1} alt="icon" />
                        </div>
                        <p className="font-light">Join as an ad space host</p>
                      </div>
                    </div>
                    <div className="relative w-full md:w-1/2 mt-2 py-3 px-3 md:py-12 rounded-xl font-medium text-gray-700">
                      <div className="flex justify-center items-center">
                        <input className="j2x7_17hqRVmwte_tWFa peer hidden" type="radio" name="framework" id="applePay" value="applePay" onChange={() => setIsAdvertiser(true)} />
                        <label className="absolute top-0 h-full w-full cursor-pointer rounded-xl border peer-checked:border-blue-700 peer-checked:text-blue-700 peer-checked:shadow-2xl peer-checked:duration-500 peer-checked:opacity-100" htmlFor="applePay"></label>
                        <div className="text-center">
                          <div className="flex justify-center items-center">
                            <img className="w-14 md:w-20" src={modal2} alt="icon2" />
                          </div>
                          <p className="font-light hover:font-normal">Join as an advertiser</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className={`items-center justify-center p-2 md:p-6 border-solid gap-4 border-blue Gray-200 rounded-b ${!(isAdSpaceHost || isAdvertiser) || !selectedProvider ? 'cursor-not-allowed opacity-50' : ''}`}
                  type="button"
                  onClick={handleCreateAccount}
                  disabled={!(isAdSpaceHost || isAdvertiser) || !selectedProvider}
                >
                  <div className="bg-blue-600 text-white active:bg-blue-500 font-bold text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                    Create
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
      <div className="md:w-1/2">
        <SlideShow />
      </div>
      <section className="max-w-screen-2xl mx-auto px-4 h-full justify-center items-center">
        <div className="flex w-full h-full flex-col items-center justify-center mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white max-w-2xl rounded-lg md:mt-0 sm:max-w-md xl:p-0">
            <div>
              <h1 className="mb-2 font-normal text-3xl lg:text-5xl sm:text-3xl">
                Create An Account
              </h1>
              <p className="mt-2 text-base font-light md:mt-16">Already have an account? <span className="text-purple-700 font-normal cursor-pointer"><a href="/login">Login</a></span></p><hr />
              <p className="text-base font-light">Back <span className="text-purple-700 font-normal cursor-pointer"><Link to="/">Home</Link></span></p>
              <div>
                <div>
                  <Link className="" to={"/continue"}>
                    <div className="mt-3 flex justify-center items-center text-center w-full social-card text-gray-800 md:font-normal google border font-light rounded-xl py-4 px-4 text-center hover:border-blue-600  hover:shadow-md md:px-16">
                      <img src={svg2} alt="" />
                      <span className="ml-1 md:ml-2">
                        Create Account
                      </span>
                    </div>
                  </Link>
                  <div onClick={() => handleProviderSelection('google')} className="mt-3 flex justify-center items-center text-center w-full social-card text-gray-800 md:font-normal google border font-light rounded-xl py-4 px-4 text-center hover:border-blue-600  hover:shadow-md md:px-16">
                    <img src={svg3} alt="" />
                    <span className="ml-1 md:ml-2">Continue with Google</span>
                  </div>
                  <div onClick={() => handleProviderSelection('facebook')} className="mt-3 flex justify-center items-center text-center w-full social-card text-gray-800 md:font-normal google border font-light rounded-xl py-4 px-4 text-center hover:border-blue-600  hover:shadow-md md:px-16">
                    <img src={svg4} alt="" />
                    <span className="ml-1 md:ml-2">Continue with Facebook</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;
