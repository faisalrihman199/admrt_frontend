import React from 'react';
import Avatar from "../../assets/ChatImages/Avatar.jpg"; // Assuming the same avatar is used for all conversations
import { FaCircle } from 'react-icons/fa';
import { differenceInMinutes, differenceInHours, differenceInDays, differenceInYears, parseISO } from 'date-fns';

const OneChat = ({ conversation, setActiveChat, setSecondUser }) => {
    const lastMessageTime = conversation.last_message?.created_at 
        ? new Date(conversation.last_message.created_at).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        : '';

    const image = conversation.other_user?.profile_image || Avatar;

    function getLastSeen(lastSeen) {
        if (!lastSeen) return "NA"; // Return "Unknown" if last_seen is missing or null

        try {
            const lastSeenDate = parseISO(lastSeen);
            const now = new Date();

            const minutesDiff = differenceInMinutes(now, lastSeenDate);
            const hoursDiff = differenceInHours(now, lastSeenDate);
            const daysDiff = differenceInDays(now, lastSeenDate);
            const yearsDiff = differenceInYears(now, lastSeenDate);

            if (minutesDiff < 60) {
                return `${minutesDiff}m`; // Minutes
            } else if (hoursDiff < 24) {
                return `${hoursDiff}h`; // Hours
            } else if (daysDiff < 365) {
                return `${daysDiff}d`; // Days
            } else {
                return `${yearsDiff}Y`; // Years
            }
        } catch (error) {
            return "Invalid date"; // Fallback for invalid date strings
        }
    }

    const lastSeenStatus = conversation.other_user?.last_seen === "Online" 
        ? "Online" 
        : getLastSeen(conversation.other_user?.last_seen);

    const messageText = conversation.last_message?.message || "No message available";
    const messageParts = messageText.split(" ");
    const previewMessage = messageParts.length > 2 
        ? `${messageParts[0]} ${messageParts[1]} ${messageParts[2]}...` 
        : messageText;

    const handleConversation = () => {
        setActiveChat(null);
        setActiveChat(conversation.id);
        conversation.unread_messages_count = 0;
        setSecondUser({
            id: conversation.other_user?.id,
            name: conversation.other_user?.full_name,
            lastSeen: lastSeenStatus,
            image: image
        });
    }

    return (
        <div className="flex items-center p-4 border-b" onClick={handleConversation}>
            <div className="flex items-center w-1/5">
                <img src={image} className="h-8 rounded-full w-8" alt="Avatar" />
                {lastSeenStatus === "Online" ? (
                    <FaCircle size={10} className='mt-4' color='green' style={{ marginLeft: '-8px', border: '1px solid white', borderRadius: '50%' }} />
                ) : (
                    <div className="flex items-center justify-center mt-3 h-4 p-1 w-6 border-2 border-yellow-500 rounded-full bg-white" style={{ marginLeft: '-12px' }}>
                        <span className="text-[8px] text-yellow-500">{lastSeenStatus}</span>
                    </div>
                )}
            </div>
            <div className="flex-grow flex justify-between">
                <div>
                    <p className="text-sm text-gray-900 font-bold">{conversation.other_user?.full_name || "Unknown User"}</p>
                    <p className="text-xs text-gray-600">{previewMessage}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">{lastMessageTime}</p>
                    {conversation.unread_messages_count > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <span className='rounded-full px-1.5' style={{ backgroundColor: '#0B66C2', color: 'white', fontSize: '12px' }}>{conversation.unread_messages_count}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OneChat;
