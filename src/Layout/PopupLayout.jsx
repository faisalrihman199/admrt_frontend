import React, { useEffect } from 'react';
import { Modal } from '../components/Modal/Modal';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { UserProfileSetupForm } from '../components/Forms/UserProfileSetupForm';
import Cookies from 'js-cookie';

const PopupLayout = () => {
    const auth = useAuthUser()
    const userProfileSetUpCondition = false

    // useEffect(() => {
    //     const checkAuthCookie = setInterval(() => {
    //         if (!Cookies.get('_auth')) {
    //             window.location.href = '/login';
    //         }
    //     }, 1000); // Check every second

    //     // Cleanup on unmount
    //     return () => clearInterval(checkAuthCookie);
    // }, []);

    return (
        <div>
            <Modal open={userProfileSetUpCondition} > <UserProfileSetupForm /></Modal>
            {/* {auth} */}

        </div>
    );
};

export default PopupLayout;