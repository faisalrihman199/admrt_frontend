import React from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const SpaceHostViewPermission = ({ children }) => {

    const auth = useAuthUser()

    if (auth?.user_role !== 'space_host') {
        return null;
    }

    return <>{children}</>;
};

export default SpaceHostViewPermission;
