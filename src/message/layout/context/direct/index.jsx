import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { avatar } from '../../../../modul/main';
import { SlArrowRight } from "react-icons/sl";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDone } from "react-icons/io5";
import { getConversationWithUser } from '../../../../service/conversation';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
// import { useSocket } from '../../../../Layout/context/socketContex';
import EmojiPicker from 'emoji-picker-react';
import { useWebSocket } from '../../../../Layout/context/socketContex';

const DirectIndexPage = ({ isMobile, conversationId, receiverId }) => {
    const { userId } = useParams();

    const username = "Dummy User"; // Hardcoded username
    const userAvatar = ""; // Add dummy avatar URL if needed
    const sender = "You"; // Hardcoded sender
    const meUsername = "Your Name"; // Your hardcoded name
    const meAvatar = ""; // Add your dummy avatar URL if needed+
    const [emojiModal, setEmojiModal] = useState(false);
    const [message, setMessage] = useState('');




    const authHeader = useAuthHeader()
    const { socket, sendMessage, conversation } = useWebSocket();
    let userConversation = conversation[userId] || [];

    useEffect(() => {
        if (!userConversation || userConversation.length === 0) {
            console.log('Fetching conversation with user:', userId);
            sendMessage('FETCH-CONVERSATION', {});
        }
    }, [userId]);

    useEffect(() => {
        userConversation = conversation[userId];
    }, [conversation]);


    const handleMessageSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = {
                userId: '5', // Replace with the actual receiver ID
                text: message,
            };

            sendMessage('SEND-MESSAGE', body);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    function isYesterday(date) {
        return true
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear();
    }
    const renderMessages = () => {
        const today = new Date().toDateString();
        let lastDate = null;
        let renderedMessages = [];

        userConversation.forEach((msg) => {
            const messageDate = msg.timestamp;
            const messageDateString = 'Today'
            const formattedTime = 'Today'
            const sender = msg.sender
            const formattedMessage = `${msg.text}`;
            const verifySeen = msg.seen;
            const timeMessage = formattedTime;
            let dateComponent = null;

            if (messageDateString !== lastDate) {
                if (messageDateString === today) {
                    dateComponent = <p key={messageDateString} className="font-bold text-gray-500">Today</p>;
                } else if (isYesterday(messageDateString)) {
                    dateComponent = <p key={messageDateString} className="font-bold text-gray-500">Yesterday</p>;
                } else {
                    dateComponent = <p key={messageDateString} className="font-bold text-gray-500">{messageDateString}</p>;
                }
                lastDate = messageDateString;
            }

            const messageContainerStyle = {
                // display: 'flex',
                // flexDirection: 'row',
                justifyContent: sender === 'You' ? 'flex-end' : 'flex-start'
            };

            let messageWrapperStyle = {
                alignSelf: 'flex-start' // Assuming default is flex-start
            };

            if (msg.sender === sender) {
                messageWrapperStyle.alignSelf = 'flex-end';
            } else {
                messageWrapperStyle.alignSelf = 'flex-start';
            }


            renderedMessages.push(
                <div key={msg.id} style={messageWrapperStyle}>
                    <div className="text-center">

                    </div>
                    <div className={`col-start-1 col-end-8 p-3 rounded-lg ${msg.sender === 'You' ? 'justify-start' : 'justify-end'}`}  >
                        <div>
                            <div className={`flex flex-row items-center ${msg.sender === 'You' ? 'flex-row-reverse' : ''}`}>
                                <div
                                    className={`flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 ${msg.sender === 'You' ? 'mr-3' : 'ml-3'}`}
                                >
                                    {sender === "You" ? (
                                        <img src={meAvatar || avatar} className='rounded-full' alt="" />
                                    ) : (
                                        <img src={userAvatar || avatar} className='rounded-full' alt="" />
                                    )}
                                </div>
                                <div className="relative flex text-sm bg-white gap-2 py-2 px-4 shadow border rounded-xl" style={{ backgroundColor: msg.sender === 'You' ? '#CAF4FF' : '#FFF9D0' }}>
                                    <div>{formattedMessage}</div>
                                    <div className={`text-[10px] text-gray-500 flex justify-end items-end`}>{timeMessage}</div>
                                    <div className={`${sender !== 'You' ? 'flex justify-end mt-1' : 'hidden'}`}>
                                        {verifySeen === true ? (
                                            <IoCheckmarkDone className='w-4 h-4' />
                                        ) : (
                                            <IoCheckmark className='flex w-3 h-3' />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });

        return renderedMessages;
    };




    // Render the chat component
    return (
        <div className='mb-5'>
            {isMobile ? (
                <div className="border-b relative px-5 mb-3">
                    <div className="flex py-3">
                        {/* Render the user's avatar and name */}
                        <div className="w-18 flex justify-content items-center">
                            <img className="w-16 rounded-full" src={userAvatar || avatar} alt="" />
                        </div>
                        <div className="w-full m-auto">
                            <div className='flex justify-between'>
                                <div className='my-auto ml-4'>
                                    <h1 className="font-semibold">{username}</h1>
                                </div>
                                {/* Render a button to navigate to the message page */}
                                <button className='p-4 my-auto  rounded-full'>
                                    <Link to={"/message"}>
                                        <SlArrowRight />
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
            <div className={`flex flex-col h-full w-full rounded-xl overflow-x-auto mb-3 p-4 ${isMobile ? 'border ' : ""}`}>
                {/* <div className="gap-y-2 "> */}
                {renderMessages()}
                {/* </div> */}
            </div>
            <div className='mt-10'>
                <form onSubmit={handleMessageSubmit} className="flex flex-row items-center h-16 border rounded-xl bg-white w-full px-2">
                    <div class="flex-grow">
                        <div class="relative w-full">
                            <input
                                class="flex w-full outline-none rounded-xl focus:outline-none pl-4 h-10"
                                placeholder='Type a message'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </div>
                    <div class="ml-4 flex gap-3 px-6">
                        <div
                            class="items-center justify-center rounded-xl text-white py-1 flex-shrink-0"
                        >
                            {emojiModal && (
                                <div onMouseLeave={() => setEmojiModal(false)}
                                    className="absolute top-64 right-5"
                                >
                                    <EmojiPicker onEmojiClick={(event) => setMessage(message + event.emoji)}
                                        className="shadow-lg"
                                    />
                                </div>
                            )}
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                                onClick={() => setEmojiModal(true)}
                                className="cursor-pointer m-auto"
                            >
                                <g opacity="0.5">
                                    <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" stroke="#171725" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M5.2002 9.40009C5.2002 9.40009 6.2502 10.8001 8.0002 10.8001C9.7502 10.8001 10.8002 9.40009 10.8002 9.40009" stroke="#171725" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M5.90039 5.90015H5.90739" stroke="#171725" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M10.0996 5.90015H10.1066" stroke="#171725" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                            </svg>
                        </div>
                        <button
                            class="flex items-center justify-center rounded-xl text-white flex-shrink-0"
                            type="submit"
                        // disabled={!message}
                        >
                            <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="m-auto">
                                <path d="M23 5.51055L12.1931 21.3588L10.8042 12.5518L3.87163 6.94548L23 5.51055Z" fill="#2B59FF" stroke="#2B59FF" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M22.9987 5.50982L10.8394 12.6755" stroke="#2B59FF" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
            {JSON.stringify(conversation)}

        </div>
    )
}

export default DirectIndexPage;
