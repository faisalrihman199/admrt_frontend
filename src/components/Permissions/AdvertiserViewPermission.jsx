import React from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const AdvertiserViewPermission = ({ userRole, children }) => {

    console.log('fsdfdsfsdfdsfds', userRole)
    if (userRole !== 'advertiser') {
        return null;
    }

    return <>{children}</>;
};

export default AdvertiserViewPermission;
