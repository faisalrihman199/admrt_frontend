import React from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useParams } from 'react-router-dom';

const AuthenticatedUserViewPermission = ({ children }) => {
    const { userId } = useParams();
    const auth = useAuthUser()
    const storedUser=localStorage.getItem("user")
        

    if (auth?.id != userId && auth?.user_role !== "admin" ) {
        return null;
    }

    return <>{children}</>;
};

export default AuthenticatedUserViewPermission;
