import React from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useParams } from 'react-router-dom';

const AuthenticatedUserViewPermission = ({ children }) => {
    const { userId } = useParams();
    const auth = useAuthUser()


    if (auth?.id != userId) {
        return null;
    }

    return <>{children}</>;
};

export default AuthenticatedUserViewPermission;
