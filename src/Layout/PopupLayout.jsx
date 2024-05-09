import React from 'react';
import { Modal } from '../components/Modal/Modal';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { UserProfileSetupForm } from '../components/Forms/UserProfileSetupForm';
const PopupLayout = () => {
    const auth = useAuthUser()
    const userProfileSetUpCondition = false
    return (
        <div>
            <Modal open={userProfileSetUpCondition} > <UserProfileSetupForm /></Modal>
            {/* {auth} */}

        </div>
    );
};

export default PopupLayout;