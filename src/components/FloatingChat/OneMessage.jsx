import React, { useEffect, useState } from 'react';
import Avatar from "../../assets/ChatImages/Avatar.jpg"; 
import { format } from 'date-fns';
import { FaCheck, FaRegCheckCircle } from 'react-icons/fa'; // Importing icons
import { useWebSocket } from '../../Layout/context/socketContex';

const OneMessage = ({ message, otherPerson }) => {
    const [sender, setSender] = useState(null);
    
    useEffect(() => {
        if (otherPerson && message) {
            setSender(otherPerson.id === message.sender);
        }
    }, [otherPerson, message]);


    


    // Ensuring message and otherPerson are available before rendering
    if (!message || !otherPerson) {
        return null; // Or display a fallback, like a loading spinner
    }

    const justify = sender ? 'justify-start' : 'justify-end';
    const bg = sender ? '#FAFAFA' : '#E6EDFF';
    
    const formatDate = (dateString) => {
        return format(new Date(dateString), "M/d/yyyy hh:mm a");
    };

    let ProfileImage = localStorage.getItem("profileImage");
    if (ProfileImage === "null") {
        ProfileImage = Avatar;
    }
    
    const renderMessageStatus = (status) => {
        switch (status) {
            case 'sent':
                return <FaCheck style={{ color: 'gray', fontSize: '10px' }} />; // Single gray tick
            case 'delivered':
                return <FaRegCheckCircle style={{ color: 'gray', fontSize: '12px' }} />; // Double gray ticks
            case 'read':
                return <FaRegCheckCircle style={{ color: '#1DA1F2', fontSize: '12px' }} />; // Double blue ticks
            default:
                return ''; // No status
        }
    };

    return (
        <div className={`flex ${justify}`}>
            {sender && 
            <div className='mx-1'>
                <img 
                    className='rounded-full h-8 w-8' 
                    src={otherPerson.profile_image ? otherPerson.profile_image : Avatar} 
                    alt="" 
                />
            </div>
            }
            <div className='p-2 m-1 mt-5' style={{ backgroundColor: `${bg}`, border: '1px solid transparent', borderRadius: '20px', borderTopLeftRadius:'0px', width: 'fit-content', maxWidth: '70%' }}>
                {message.message}
                <br />
                <div className='flex justify-between'>
                    <span className='text-gray-300 my-2' style={{ fontSize: '10px' }}>
                        {formatDate(message.created_at)}
                    </span>
                    {!sender && 
                    <span className='text-gray-400 m-2' style={{ fontSize: '10px' }}>
                        {renderMessageStatus(message.status)}
                    </span>
                    }
                </div>
            </div>
            {!sender && 
            <div>
                <img 
                    className='rounded-full h-8 w-8 mx-1' 
                    src={ProfileImage} 
                    alt="" 
                />
            </div>
            }
        </div>
    );
}

export default OneMessage;
