// NotificationSetting.jsx
import React, { useState } from 'react';
import CheckBoxes from '../../CheckBoxes';
import { MdEmail, MdPhone } from 'react-icons/md';
const NotificationSetting = () => {
    const [selectedOptions, setSelectedOptions] = useState({
        email: true,
        phone: true,
    });

    const options = [
        { label: 'Email Notifications', value: 'email', icon: MdEmail },
        { label: 'Phone Notifications', value: 'phone', icon: MdPhone }
    ];

    return (
        <div className="w-full md:w-2/3 md:ml-8 py-8 px-3 md:px-10 border border-gray-100 bg-white p-4 rounded-2xl h-[500px]">
            <div className="mb-6">
                <h3 className="font-bold text-xl mb-20">Notification Settings</h3>
            </div>
            <CheckBoxes options={options} selected={selectedOptions} setState={setSelectedOptions} flexType="flex-col" />
            <button className="w-auto py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 self-start mt-10">Save Changes</button>
        </div>
    );
};

export default NotificationSetting;