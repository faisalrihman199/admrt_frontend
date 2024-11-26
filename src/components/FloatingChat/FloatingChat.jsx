import React, { useEffect, useState } from 'react';
import Avatar from "../../assets/ChatImages/Avatar.jpg";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { getChatConversationList } from "../../service/chat";
import { FaCircle, FaWindowMinimize } from 'react-icons/fa';
import { useWebSocket } from '../../Layout/context/socketContex';

import OneChat from './OneChat';
import ThreeDots from './Icons/ThreeDots';
import Search from './Icons/Search';
import Options from './Icons/Options';
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import OneConversation from './OneConversation';
import { FaArrowLeft } from "react-icons/fa";

const FloatingChat = ({ setOpenChat }) => {
    const [position, setPosition] = useState({ x: window.innerWidth - 300, y: window.innerHeight - 60 });
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [activeChat, setActiveChat] = useState(null);
    const [resize, setResize] = useState(false);
    const { newMessage, userStatus, setRead } = useWebSocket();
    const [reload, setReload] = useState(false);
    const [secondUser, setSecondUser] = useState({
        name: "Google Next",
        lastSeen: 'online',
        image: null
    });
    const handleArrowClick = () => {
        setIsExpanded((prev) => !prev);

        if (!isExpanded) {
            setRead(0)
            setPosition((prev) => ({ ...prev, y: window.innerHeight - 600 }));
            setResize(false);

        } else {
            setPosition((prev) => ({ x: window.innerWidth - 300, y: window.innerHeight - 60 }));
        }
    };

    const floatingStyle = {
        maxWidth: isMobile ? '100%' : '100vw',
        width: isExpanded ? (isMobile ? '100%' : '800px') : '100%',
        height: isExpanded ? isMobile ? '100vh' : '76vh' : '50px',
        position: 'fixed',
        top: isMobile ? '0px' : `${position.y - 20}px`,
        left: isMobile ? '0px' : `${position.x}px`,
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: isMobile && activeChat ? 'column' : 'row',
        overflow: 'hidden',
        transition: 'width 0.4s ease-in-out, height 0.4s ease-in-out, top 0.4s ease-in-out, left 0.4s ease-in-out',  // Smooth animation
    };
    const authHeader = useAuthHeader();
    const [conversation, setCoversations] = useState([]);
    let ProfileImage = localStorage.getItem("profileImage");
    if (ProfileImage === "null") {
        ProfileImage = Avatar;
    }
    useEffect(() => {
        getChatConversationList(authHeader).then((data) => {
            setCoversations(data);

        });
        const handleResize = () => {
            setPosition((prev) => ({
                x: Math.min(prev.x, window.innerWidth - 300),
                y: Math.min(prev.y, window.innerHeight - (isExpanded ? 600 : 80))
            }));
            setIsMobile(window.innerWidth <= 768);

        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [authHeader, isExpanded, reload]);

    useEffect(() => {
        if (isExpanded && activeChat && !resize && !isMobile) {
            setPosition((prev) => ({
                ...prev,
                x: Math.max(0, prev.x - 500) // Shift 500px to the left on larger screens
            }));
            setResize(true);
        } else if (isExpanded && !activeChat && !resize && !isMobile) {
            setPosition((prev) => ({
                ...prev,
                x: Math.min(prev.x + 500, window.innerWidth - 300) // Re-adjust if no activeChat
            }));
        }

    }, [activeChat, isExpanded, isMobile]);
    useEffect(() => {
        console.log("User Status Chnaged for Component :", userStatus);
    }, [userStatus])
    useEffect(() => {
        console.log("New Message Received in Chat Component :", newMessage);

        if (!isExpanded && newMessage?.id) {
            setRead(1);
        }
        updateRecievedLastMessage(newMessage, activeChat);
    }, [newMessage])
    useEffect(() => {
        console.log("User Status Changed for :", userStatus, "Conversation :", conversation);
        updateLastSeen(userStatus);

    }, [userStatus])
    const updateLastSeen = (userStatus) => {
        setCoversations(prevConversations =>
            prevConversations.map(conv => {
                if (conv.other_user.id === userStatus.user_id) {
                    return {
                        ...conv,
                        other_user: {
                            ...conv.other_user,
                            last_seen: userStatus.status
                        }
                    };
                }
                return conv;
            })
        );
    };

    const updateRecievedLastMessage = (newMessage, activeChat) => {
        const conversationMatched = conversation.some(conv => conv.id === newMessage.conversation);
        setCoversations(prevConversations => {
            return prevConversations.map(conv => {
                if (conv.id === newMessage.conversation) {
                    console.log("MATCHED");
                    return {
                        ...conv,
                        last_message: {
                            id: newMessage.id,
                            message: newMessage.message,
                            sender: newMessage.sender,
                            receiver: newMessage.receiver,
                            created_at: newMessage.created_at,
                            status: newMessage.status
                        },
                        unread_messages_count: conv.id !== activeChat ? conv.unread_messages_count + 1 : conv.unread_messages_count
                    };
                }
                return conv;
            });
        });
        if (!conversationMatched) {
            console.log("Previous TReload :");
            setReload(prevReload => !prevReload);
        }
    };




    const handleMinimize = () => {
        setOpenChat(false);
        setResize(false);
    };

    const filteredConversations = conversation.filter((conversation) =>
        conversation.other_user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const oneConvStyle = {
        width: isMobile ? '100%' : '500px',
        maxWidth: '100vw',
        height: isMobile ? '90vh' : '74vh',
        backgroundColor: 'white',
        borderLeft: '1px solid #ccc'
    };

    const updateLastMessage = (conversationId, newMessage) => {
        setCoversations(prevConversations =>
            prevConversations.map(conv =>
                conv.id === conversationId ?
                    { ...conv, last_message: { ...conv.last_message, message: newMessage } }
                    : conv
            )
        );
    };

    return (
        <>
            <div style={floatingStyle}>
                {(!isMobile || !activeChat) && (
                    <div style={{ width: isMobile ? '100%' : '300px' }}>
                        <div
                            style={{ backgroundColor: '#2D64BC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 10px' }}
                        >
                            <div className="left_head" style={{ display: 'flex' }}>
                                <img className='rounded-full' src={ProfileImage} height={30} width={30} alt="" />
                                <span>
                                    <FaCircle size={10} color='green' style={{ marginLeft: '-10px', marginTop: '20px', border: '1px solid white', borderRadius: '50%' }} />
                                </span>
                                <span className='mx-2 mt-1 fw-bold' style={{ color: 'white' }}>Messaging</span>
                            </div>
                            <div className="right_head flex item-center" style={{}}>
                                <span className='mx-3 ' onClick={handleMinimize}>
                                    <FaWindowMinimize color='white' />
                                </span>
                                <span className='mt-1'>
                                    {isExpanded ?
                                        (isMobile
                                            ? <SlArrowUp color='white' size={16} style={{ cursor: 'pointer' }} onClick={handleArrowClick} />
                                            : <SlArrowDown color='white' size={16} style={{ cursor: 'pointer' }} onClick={handleArrowClick} />
                                        )
                                        : (isMobile
                                            ? <SlArrowDown color='white' size={16} style={{ cursor: 'pointer' }} onClick={handleArrowClick} />
                                            : <SlArrowUp color='white' size={16} style={{ cursor: 'pointer' }} onClick={handleArrowClick} />
                                        )
                                    }
                                </span>
                            </div>
                        </div>

                        {isExpanded && (
                            <div style={{ height: '100%' }}>
                                <div className="searchbar m-2 rounded" style={{ backgroundColor: '#EEF3F7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Search />
                                        <span className='mx-2'>
                                            <input
                                                type="text"
                                                placeholder='Search Messages'
                                                style={{ backgroundColor: 'transparent', border: '1px solid transparent', outline: 'none' }}
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </span>
                                    </div>
                                    <div>
                                        <Options />
                                    </div>
                                </div>

                                <div className='scrollbar-hide' style={{ overflowY: 'auto', flexGrow: 1 }}>
                                    {filteredConversations.length > 0 ? (
                                        filteredConversations.map((conversation, index) => (
                                            <OneChat
                                                key={index}
                                                conversation={conversation}
                                                setActiveChat={setActiveChat}
                                                setSecondUser={setSecondUser}
                                            />
                                        ))
                                    ) : (
                                        <div style={{ padding: '10px', textAlign: 'center' }}>No conversations found</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {isExpanded && activeChat && (
                    <div className="oneConversation" style={oneConvStyle}>
                        {isMobile && (
                            <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                                <FaArrowLeft
                                    size={24}
                                    style={{ cursor: 'pointer', marginRight: '10px' }}
                                    onClick={() => setActiveChat(null)}
                                />
                                <span style={{ fontWeight: 'bold' }}>Back</span>
                            </div>
                        )}
                        <OneConversation authHeader={authHeader} activeChat={activeChat} secondUser={secondUser}
                            updateLastMessage={updateLastMessage} />
                    </div>
                )}
            </div>
        </>
    );
};

export default FloatingChat;
