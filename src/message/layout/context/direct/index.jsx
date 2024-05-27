import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { avatar } from '../../../../modul/main';
import { SlArrowRight } from "react-icons/sl";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDone } from "react-icons/io5";
import { getConversationWithUser } from '../../../../service/conversation';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
// import { useSocket } from '../../../../Layout/context/socketContex';
import EmojiPicker from 'emoji-picker-react';
import { useWebSocket } from '../../../../Layout/context/socketContex';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import ScrollToBottom from 'react-scroll-to-bottom';
import { getChatConversation } from '../../../../service/chat';
import useDeepCompareEffect from '../../../../hooks/useDeepCompareEffect';

const DirectIndexPage = ({ isMobile, conversationId, receiverId }) => {
    const { userId } = useParams();

    const username = "Dummy User"; // Hardcoded username
    const userAvatar = ""; // Add dummy avatar URL if needed
    const meUsername = "Your Name"; // Your hardcoded name
    const meAvatar = ""; // Add your dummy avatar URL if needed+
    const [emojiModal, setEmojiModal] = useState(false);
    const [message, setMessage] = useState('');
    const messageRef = useRef('');
    const location = useLocation();

    const newConversationUserName = location.state?.newConverSationUserName || '';
    const newConversationUserProfileImage = location.state?.newConverSationUserProfileImage || '';


    const authHeader = useAuthHeader()
    const { socket, sendMessage, conversation, conversationList, makeConversationRead, updateConversation } = useWebSocket();
    // let userConversation = conversation[userId] || [];
    const [userConversation, setUserConversation] = useState(conversation[userId] || []);

    userConversation.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const conversationData = conversationList.find(conversation => conversation.userId == userId);
    const conversationWithUser = conversation[userId];
    const { profile_image = '', full_name = '' } = conversationWithUser || {};
    console.log('conversationWithUser', conversationWithUser)

    const authUser = useAuthUser()

    useDeepCompareEffect(() => {
        setUserConversation(conversation[userId] || []);
    }, [conversation[userId]]);

    useEffect(() => {
        // if (!conversationWithUser) {
        getChatConversation(authHeader, userId).then((data) => {
            console.log('llllll:', data)
            updateConversation(userId, data)
        });
        // }
    }, [userId]);

    // useEffect(() => {
    //     userConversation = conversation[userId];
    // }, [conversation]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    };
    useEffect(scrollToBottom, [userConversation]);

    const handleUnreadMessages = async (conversationId) => {
        try {
            console.log('Marking conversation as read:', conversationId);
            makeConversationRead(conversationId);

        } catch (error) {
            console.error(error);
        }
    }

    const handleMessageSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Sending message:', messageRef.current.value);
            if (messageRef.current.value === '') return;
            const now = new Date();
            const timestampInMicroseconds = now.getTime() * 1000;
            const timestampInISOFormat = now.toISOString();
            const body = {
                receiver_id: userId,
                text: messageRef.current.value,
                sender_id: authUser?.id,
                created_at: timestampInISOFormat,
                full_name: newConversationUserName,
                profile_image: newConversationUserProfileImage
            };

            // console.log('i m here Sending message:', body);

            sendMessage('SEND-MESSAGE', body);
            // messageRef.current = '';
            if (messageRef.current) {
                messageRef.current.value = "";

            }


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
            const date = new Date(msg?.created_at);
            const today = new Date();

            const isToday = (date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate());


            const messageDateString = 'Today'
            // const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            const formattedDate = date.toLocaleDateString('en-US');
            const formattedMessage = `${msg?.text}`;
            const timeMessage = isToday ? formattedTime : `${formattedDate}, ${formattedTime}`;
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


            let messageWrapperStyle = {
                alignSelf: 'flex-start' // Assuming default is flex-start
            };

            if (msg?.sender_id == authUser?.id) {
                messageWrapperStyle.alignSelf = 'flex-end';
            } else {
                messageWrapperStyle.alignSelf = 'flex-start';
            }


            renderedMessages.unshift(
                <div key={msg?.id} style={{ ...messageWrapperStyle, maxWidth: '500px' }}>
                    <div className="text-center">

                    </div>
                    <div className={`col-start-1 col-end-8 p-3 rounded-lg ${msg?.sender_id == authUser?.id} ? 'justify-start' : 'justify-end'}`}  >
                        <div>
                            <div className={`flex flex-row items-center ${msg?.sender_id == authUser?.id ? 'flex-row-reverse' : ''}`}>
                                <div
                                    className={`flex items-center justify-center h-12 w-12 rounded-full border  flex-shrink-0 ${msg?.sender_id == authUser?.id ? 'ml-3' : 'mr-3'}`}
                                >
                                    {msg?.sender_id == authUser?.id ? (
                                        // <Link to={`/profile/user/${msg?.sender_id}`}>
                                        <img src={authUser?.profile_image || avatar} className='rounded-full' alt="" />
                                        // </Link>
                                    ) : (
                                        <Link to={`/profile/user/${msg?.sender_id}`}>
                                            <img src={profile_image || conversationData?.profile_image || avatar} className='rounded-full' alt="" />
                                        </Link>
                                    )}
                                </div>
                                <div className="relative flex   flex-col text-sm bg-white gap-2 py-3 px-4 shadow border rounded-md" style={{ backgroundColor: msg?.sender_id == authUser?.id ? '#CAF4FF' : '#FFF9D0' }}>
                                    <div className="text-left mr-auto pr-20">{formattedMessage}</div>
                                    <div className={`text-[10px] text-gray-500 flex  ml-auto  `}><span>{timeMessage}</span><span className='ml-1'>{msg?.sender_id == authUser?.id && (
                                        <>
                                            {msg?.delivered === true ? (
                                                <IoCheckmarkDone className='w-4 h-4' />
                                            ) : (
                                                <IoCheckmark className='flex w-3 h-3' />
                                            )}
                                        </>
                                    )}</span></div>

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
        <div className='w-full sm:w-auto overflow-hidden'>
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
            <div className={`flex flex-col w-full rounded-xl flex-col-reverse overflow-y-auto      p-4 ${isMobile ? 'border ' : ""}`} style={{ height: 'calc(100vh - 220px)' }}>

                {userConversation.length === 0 && newConversationUserName ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <img src={newConversationUserProfileImage || avatar} className="w-12 h-12 rounded-full" alt="User" />
                        <p className="mt-2">Send message to <strong>{newConversationUserName}</strong></p>
                    </div>
                ) : renderMessages()}
            </div>
            <div ref={messagesEndRef} />

            <div className=' '>
                <form onSubmit={handleMessageSubmit} className="flex flex-row items-center h-16 border rounded-xl bg-white w-full px-2">
                    <div class="flex-grow">
                        <div class="relative w-full">
                            <input
                                ref={messageRef}
                                className="flex w-full outline-none rounded-xl focus:outline-none pl-4 h-10"
                                placeholder='Type a message'
                                onFocus={() => handleUnreadMessages(userId)}
                            />
                        </div>
                    </div>
                    <div class="ml-4 flex gap-3 px-6">
                        {/* <div
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
                        </div> */}
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
            {/* {JSON.stringify(conversation)} */}
            {/* {JSON.stringify(conversationList)} */}


        </div>
    )
}

export default DirectIndexPage;
