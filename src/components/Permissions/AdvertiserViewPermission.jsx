import React from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const AdvertiserViewPermission = ({ userRole, children }) => {

    if (userRole !== 'advertiser') {
        return null;
    }

    return <>{children}</>;
};

export default AdvertiserViewPermission;
