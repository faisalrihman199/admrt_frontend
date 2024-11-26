import React, { useEffect, useState, useRef } from 'react';
import Avatar from "../../assets/ChatImages/Avatar.jpg";
import { getChatConversation } from "../../service/chat";
import OneMessage from './OneMessage';
import { useForm } from 'react-hook-form'; 
import { useWebSocket } from '../../Layout/context/socketContex'; 
import { FaCircle } from 'react-icons/fa';
import { differenceInMinutes, differenceInHours, differenceInDays, differenceInYears, parseISO } from 'date-fns';

import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
const OneConversation = ({ authHeader, activeChat, secondUser, updateLastMessage }) => {
    const { sendMessage,newMessage,userStatus,conversationStatus } = useWebSocket(); 
    const [conversation, setConversation] = useState({});
    const [messages, setMessages] = useState([]);
    const [nextPersonImage, setImage] = useState(Avatar);
    const [nextPersonName, setName] = useState("Google Next");
    const [otherPerson, setOtherPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const chatContainerRef = useRef(null); 

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        setLoading(true);
        getChatConversation(authHeader, activeChat).then((data) => {
            setConversation(data.data);
            setMessages(data.data.messages);
            setOtherPerson(data.data.second_user);
            if (data.data.second_user.profile_image) {
                setImage(data.data.second_user.profile_image);
            }
            setName(data.data.second_user.full_name);
        })
        .catch((err) => {
            console.log("Error while getting Messages :", err);
        })
        .finally(() => {
            setLoading(false);
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        });
    }, [activeChat]);
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, update]);
    useEffect(()=>{
        // console.log("Handle New Message :", newMessage);
        handleNewMessage(newMessage);
    },[newMessage])
    
    const handleNewMessage = (newMessage) => {
        if(newMessage?.id){
            // console.log("New Message to be changed Conversation status:", newMessage);
            const payload = {
                conversation_id:newMessage.conversation
            };
            sendMessage("SEND-MESSAGE", payload);
            setMessages([...messages, newMessage]);
        }
    };
    const authe=useAuthUser();

    const addMessage = (content, senderId, receiverId) => {
        const maxId = messages.length > 0 ? Math.max(...messages.map(msg => msg.id)) : 0;
        const newMessage = {
            id: maxId + 1, 
            message: content,
            sender: senderId,
            receiver: receiverId,
            created_at: new Date().toISOString(),
            status: "sent",
        };
        setMessages([...messages, newMessage]);
    };
    useEffect(()=>{
        // console.log("Conversation Status Received in Component :", conversationStatus);
        if(conversationStatus?.conversation && conversationStatus.conversation===activeChat){
            if (conversationStatus?.status === "delivered") {
                setMessages((prevMessages) =>
                  prevMessages.map((msg) =>
                    msg.status === "sent" ? { ...msg, status: "delivered" } : msg
                  )
                );
              }
              
              if (conversationStatus?.status === "read") {
                setMessages((prevMessages) =>
                  prevMessages.map((msg) =>
                    msg.status === "delivered" ? { ...msg, status: "read" } : msg
                  )
                );
              }
            
        }
        
    },[conversationStatus])
      
    const sendMessageHandler = (data) => {
        const { message } = data; 
        if (message.trim()) {
            addMessage(message,authe.id,otherPerson.id);
            updateLastMessage(activeChat, message);
            const payload = {
                message,
                recipient_id: otherPerson.id
            };
            sendMessage("SEND-MESSAGE", payload);
            setUpdate(!update);
            reset(); 
        }
    };
    function getLastSeen(lastSeen) {
        // console.log("Last scene is :", lastSeen);
        
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
    }
    
    
    useEffect(()=>{
        if(userStatus?.status){

            // console.log("User Status Changed for :",userStatus, "Other Person :", secondUser);
            secondUser.lastSeen=userStatus?.status==="Online" ? "Online" : getLastSeen(userStatus?.status);
        
            // console.log("User Status Changed for :",userStatus, "Other Person :", secondUser);
        }
    },[userStatus])


    return (
        <div className="Conversation flex flex-col h-full">
            <div className="header flex items-center" style={{ height: '50px', backgroundColor: '#EEF3F7' }}>
                <img src={secondUser.image} className="h-10 w-10 mx-2 rounded-full" alt="Avatar" />
                {secondUser.lastSeen === "Online" && 
                    <FaCircle size={10} className='mt-5' color='green' style={{ marginLeft: '-12px', border: '1px solid white', borderRadius: '50%' }} />
                }
                <div className="mx-2">
                    <p className='mb-0 text-black-600'>{secondUser.name}</p>
                    {secondUser.lastSeen === "Online" ? (
                        <p className='text-gray-400'>{secondUser.lastSeen}</p>
                    ) : (
                        <p className='text-gray-400'>last seen {secondUser.lastSeen} ago</p>
                    )}
                </div>
            </div>

            <div 
                className="mainChat scrollbar-hide flex-grow overflow-auto" 
                ref={chatContainerRef} 
                style={{ flex: '1 1 auto' }}
            >
                {messages.length > 0 && messages.map((message, index) => (
                    <OneMessage key={index} message={message} otherPerson={conversation.second_user} />
                ))}
            </div>

            <form className="sendMessage mb-4 px-2" style={{ height: '50px', border: '1px solid #E6EDFF', borderRadius: '10px', display: 'flex', alignItems: 'center' }} onSubmit={handleSubmit(sendMessageHandler)}>
                <input
                    type="text"
                    className="form-control flex-grow p-2"
                    placeholder="Type a message..."
                    {...register('message')} 
                    style={{ border: 'none', outline: 'none' }}
                    autoComplete="off" 
                />
                <button
                    type="submit"
                    className="flex items-center justify-center p-2"
                    style={{ background: 'none', border: 'none' }}
                    disabled={loading}
                >
                    {loading ? (
                        <span><svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg></span>
                    ) : (
                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_689_3278)">
                                <path d="M16.8625 5.23784C17.2225 4.24201 16.2575 3.27701 15.2617 3.63784L3.09083 8.03951C2.09166 8.40117 1.97083 9.76451 2.88999 10.297L6.77499 12.5462L10.2442 9.07701C10.4013 8.92521 10.6118 8.84121 10.8303 8.84311C11.0488 8.84501 11.2578 8.93265 11.4123 9.08716C11.5668 9.24166 11.6545 9.45067 11.6564 9.66917C11.6583 9.88767 11.5743 10.0982 11.4225 10.2553L7.95333 13.7245L10.2033 17.6095C10.735 18.5287 12.0983 18.407 12.46 17.4087L16.8625 5.23784Z" fill="black" />
                            </g>
                            <defs>
                                <clipPath id="clip0_689_3278">
                                    <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
                                </clipPath>
                            </defs>
                        </svg>
                    )}
                </button>
            </form>
        </div>
    );
}

export default OneConversation;
