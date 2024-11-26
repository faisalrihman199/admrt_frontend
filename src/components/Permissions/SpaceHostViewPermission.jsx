import React from 'react';

const SpaceHostViewPermission = ({ userRole, children }) => {


    if (userRole !== 'space_host') {
        return null;
    }

    return <>{children}</>;
};

export default SpaceHostViewPermission;
