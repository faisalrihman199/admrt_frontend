import React from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const AdvertiserViewPermission = ({ children }) => {
    const auth = useAuthUser()


    if (auth?.user_role !== 'advertiser') {
        return null;
    }

    return <>{children}</>;
};

export default AdvertiserViewPermission;
