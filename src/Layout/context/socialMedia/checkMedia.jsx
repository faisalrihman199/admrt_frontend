import React, { useEffect, useState } from 'react';
import copy from '../../../svgs/social-media/Group 1000005712.svg';
import { VscChromeClose } from 'react-icons/vsc';
import { auth, saveUserDataToFirebase, usersCollection } from '../../../firebase/firebase';
import { doc, getDoc, serverTimestamp } from 'firebase/firestore';

const CheckMedia = ({ selectedSocialMedia, userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [isValid, setIsValid] = useState(true);
  const [userLinks, setUserLinks] = useState({});

  useEffect(() => {
    const handleVerify = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userId = user.uid;
        try {
          const userRef = doc(usersCollection, userId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            const socialMediaData = data.socialMedia || {};
            setUserLinks(socialMediaData);
          }
        } catch (err) {
          console.error(err);
        }
      }
    });

    return () => handleVerify();
  }, []);

  useEffect(() => {
    const areAllLinksPresent = selectedSocialMedia.every(media => userLinks.hasOwnProperty(media.name));
    setIsValid(areAllLinksPresent);
  }, [selectedSocialMedia, userLinks]);

  const handleInputChange = (socialMediaName, value) => {
    const isValidLink = validateLink(value);
    setIsValid(isValidLink);
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [socialMediaName]: value,
    }));
  };

  const validateLink = (link) => {
    return link.startsWith('https://');
  };

  const handleSave = () => {
    const socialMediaData = {
      timestamp: serverTimestamp(),
      ...inputValues,
    };

    saveUserDataToFirebase(userId, { socialMedia: socialMediaData })
      .then(() => {
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  };

  return (
    <div>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-[80%] md:w-1/3 mx-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div
                  className="px-3 pt-3 rounded-full flex justify-end"
                  onClick={() => setShowModal(false)}
                >
                  <VscChromeClose className="w-6 h-6 p-1 rounded-full text-red-500 bg-pink-200" />
                </div>
                <div className="relative p-2 md:p-6 flex-auto flex justify-center items-start">
                  <div>
                    <h1 className="text-center mb-6 text-2xl md:text-3xl font-semibold">
                      Connected Your accounts{' '}
                    </h1>
                    <h1 className="text-center my-3">
                      You must add an account link to social media!
                    </h1>
                    <hr />
                    {selectedSocialMedia.map((socialMedia) => (
                      <div key={socialMedia.name} className="mb-2">
                        <h1 className="text-center my-3">
                          Enter {socialMedia.name} link
                        </h1>
                        <input
                          type="text"
                          className="py-3 mb-2 px-4 block w-full border border-blue-400 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-50 dark:border-blue-700 dark:text-gray-600 dark:focus:ring-gray-600"
                          placeholder={`${socialMedia.name} link`}
                          value={inputValues[socialMedia.name] || userLinks[socialMedia.name] || ''}
                          onChange={(e) =>
                            handleInputChange(socialMedia.name, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center p-2 md:p-6 border-t border-solid gap-4 border-blue Gray-200 rounded-b">
                  <button
                    className="bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    <h1 className="text-xs md:text-sm">Cancel</h1>
                  </button>
                  <button
                    className={`${isValid
                      ? 'bg-blue-700 text-white active:bg-blue-600'
                      : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                      } font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                    type="button"
                    onClick={handleSave}
                    disabled={!isValid}
                  >
                    <h1 className="text-xs md:text-sm">Save</h1>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <button
        onClick={() => setShowModal(true)}
        className="hover:bg-gray-100 p-1 rounded-sm"
      >
        <img src={copy} alt="" className="h-6 w-6" />
      </button>
    </div>
  );
};

export default CheckMedia;
