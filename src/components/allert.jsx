import React from 'react';

const Alert = ({ type, message }) => {
    let bgColor, borderColor, textColor, iconColor;

    switch (type) {
        case 'success':
            bgColor = 'bg-green-100';
            borderColor = 'border-green-500';
            textColor = 'text-green-900';
            iconColor = 'text-green-500';
            break;
        case 'error':
            bgColor = 'bg-red-100';
            borderColor = 'border-red-500';
            textColor = 'text-red-900';
            iconColor = 'text-red-500';
            break;
        default:
            bgColor = 'bg-teal-100';
            borderColor = 'border-teal-500';
            textColor = 'text-teal-900';
            iconColor = 'text-teal-500';
            break;
    }

    return (
        <div className={`${bgColor} ${borderColor} ${textColor} border-t-4 rounded-b px-4 py-3 shadow-md`} role="alert">
            <div className="flex">
                <div className="py-1">
                    <svg className={`fill-current h-6 w-6 ${iconColor} mr-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                </div>
                <div>
                    <p className="font-bold">{type}</p>
                    <p className="text-sm">{message}</p>
                </div>
            </div>
        </div>
    );
};

export default Alert;