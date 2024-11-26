import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, usersCollection } from '../../../firebase/firebase';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { VscChromeClose } from 'react-icons/vsc';
import { deleteUser } from 'firebase/auth';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import AccountSettings from '../Account/AccountSetting';
import NotificationSetting from '../Notification/NotificationSetting';
import { useQuery } from '@tanstack/react-query';
import { userProfile } from '../../../service/profile';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

const Settings = () => {
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateBirthday, setDateBirthday] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [modal, setModal] = useState(false);
  const [, setIsFormValid] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false)
  // const [imageUrl, setImageUrl] = useState(null);
  const [selectedSettingsType, setSelectedSettingsType] = useState('Account');
  const navigate = useNavigate();
  const auth = useAuthUser()

  // useEffect(() => {
  //   const fetchUser = auth.onAuthStateChanged(async (user) => {
  //     if (user) {
  //       setUserId(user.uid);
  //       try {
  //         const userDoc = await getDoc(doc(usersCollection, user.uid));
  //         if (userDoc.exists()) {
  //           const data = userDoc.data();
  //           console.log(data);
  //           setFullName(data.fullName || '');
  //           setEmail(data.email || '');
  //           setDateBirthday(data.dateBirthday || '');
  //           setPhoneNumber(data.phoneNumber || '');
  //           setImageUrl(data.imageUrl || null);
  //         }
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     } else {
  //       setUserId(null);
  //     }
  //   });

  //   return () => fetchUser();
  // }, []);
  const authHeader = useAuthHeader();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['loggedInUser', { authHeader }],
    queryFn: userProfile,
    staleTime: 5 * 60 * 1000,
  })


  const handleSaveChanges = async () => {
    try {
      const userRef = doc(usersCollection, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = {
          fullName,
          email,
          dateBirthday,
          phoneNumber,
        };

        await setDoc(userRef, userData, { merge: true });
        setModal(false);
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    try {
      const dbref = doc(usersCollection, userId);
      await deleteDoc(dbref);

      await deleteUser(auth.currentUser);
      navigate('/')
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      {modal && (
        <div
          className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed bg-black bg-opacity-25 inset-0 z-50 outline-none focus:outline-none"
        >
          <div className="relative w-[80%]  md:w-1/3 mx-auto">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className='px-3 pt-3 rounded-full flex justify-end'
                onClick={() => setModal(false)}>
                <VscChromeClose className=' w-6 h-6 p-1 rounded-full text-red-500 bg-pink-200' />
              </div>
              <div className="relative p-2 md:p-6 justify-center items-start">
                <div>
                  <h1 className='text-center mb-6 text-2xl md:text-3xl font-semibold'>Are you sure to change Information?</h1>
                </div>
                <div className=''>
                  <div>
                    <h1><b className=''>Full Name </b>- {fullName || setIsFormValid(!fullName) || "please enter Full Name!"}</h1>
                    <h1><b className=''>Email </b>- {email || setIsFormValid(!email) || "please enter Email!"}</h1>
                    <h1><b className=''>Data birthday </b>- {dateBirthday || setIsFormValid(!dateBirthday) || "please enter Date birthday!"}</h1>
                    <h1><b className=''>Phone number </b>- {phoneNumber || setIsFormValid(!phoneNumber) || "please enter Phone number!"}</h1>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center p-2 md:p-6 border-t border-solid gap-4 border-blue Gray-200 rounded-b">
                <button
                  className="bg-gray-600 w-full text-white active:bg-blue-700 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 w-full text-white active:bg-blue-700 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleSaveChanges}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div
          className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-25">
          <div className="relative w-[80%]  md:w-1/3 mx-auto">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className='px-3 pt-3 rounded-full flex justify-end cursor-pointer'
                onClick={() => setDeleteModal(false)}>
                <VscChromeClose className=' w-6 h-6 p-1 rounded-full text-red-500 bg-pink-200' />
              </div>
              <div className="relative p-2 md:p-6  flex-auto flex justify-center items-start">
                <div>
                  <h1 className='text-center mb-6 text-2xl md:text-3xl font-semibold'>Are you sure to Delete Account?</h1>
                  <h1 className='text-center my-3'>This action will not be reverse-able to make sure to do this delete action.</h1>
                </div>
              </div>
              <div className="flex items-center justify-center p-2 md:p-6 border-t border-solid gap-4 border-blue Gray-200 rounded-b">
                <button
                  className="bg-blue-700 text-white active:bg-blue-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setDeleteModal(false)}
                >
                  <h1 className='text-xs md:text-sm'>
                    Cancel
                  </h1>
                </button>
                <button
                  className="bg-red-700 text-white active:bg-red-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleDeleteAccount}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="md:flex my-12 bg-white m-auto max-w-screen-2xl justify-center items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className=" border-gray-100 w-full  border border-gray-100 bg-white py-8 px-3 md:px-10 mb-5 rounded-2xl md:0 md:w-1/3">
          <div className=''>
            <div className="mb-6">
              <h3 className="font-bold text-2xl text-start">Settings</h3>
            </div>
            <div className="mx-auto">
              <div className="">
                <button
                  onClick={() => setSelectedSettingsType('Account')}
                  className={`flex items-center justify-center mt-8 w-full text-lg font-medium p-4 rounded-2xl mb-2.5 border ${selectedSettingsType === 'Account' ? 'border-blue-500 text-blue-500' : ''}`}
                >
                  {data?.profile_image ? (
                    <img className="mr-4 w-10 h-10 rounded-full" src={data.profile_image} alt="" />
                  ) : auth?.profile_image ? (
                    <img className="mr-4 w-10 h-10 rounded-full" src={auth.profile_image} alt="" />
                  ) : auth?.full_name ? (
                    <div className="mr-4 w-10 h-10 rounded-full flex items-center justify-center bg-orange-200 text-xl">
                      {auth.full_name.charAt(0).toUpperCase()}
                    </div>
                  ) : null}
                  Account
                </button>
                <button
                  onClick={() => setSelectedSettingsType('Notification')}
                  className={`border mt-8 w-full text-lg bg-white rounded-2xl font-medium p-4 hover:text-blue-500 ${selectedSettingsType === 'Notification' ? 'border-blue-500 text-blue-500' : ''}`}
                >
                  Notification
                </button>
                <button onClick={handleLogout} className="border mt-8 w-full text-lg bg-white rounded-2xl font-medium p-4 hover:text-blue-500"
                >
                  Logout
                </button>
                <button onClick={() => setDeleteModal(true)} className="border mt-8 w-full text-lg bg-white rounded-2xl font-medium p-4 hover:text-blue-500"
                >
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='md:w-2/3'>
          {selectedSettingsType === 'Account' ? <AccountSettings /> : <NotificationSetting />}

        </div>
      </div>
    </div>
  );
};

export default Settings;