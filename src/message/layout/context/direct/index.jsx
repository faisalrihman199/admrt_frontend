import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { avatar } from '../../../../modul/main';
import { SlArrowRight } from "react-icons/sl";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDone } from "react-icons/io5";

const DirectIndexPage = ({ isMobile }) => {
    const { userId } = useParams();

    const username = "Dummy User"; // Hardcoded username
    const userAvatar = ""; // Add dummy avatar URL if needed
    const sender = "You"; // Hardcoded sender
    const meUsername = "Your Name"; // Your hardcoded name
    const meAvatar = ""; // Add your dummy avatar URL if needed

    const messages = [
        {
            id: 1,
            message: {
                sender: "You",
                message: "Hello!",
            },
            timestamp: new Date(),
            position: "top",
            seen: true,
        },
        {
            id: 2,
            message: {
                sender: "Dummy User",
                message: "Hello! This is a much larger message. It contains more text than the previous message. You can replace this text with any content you want. This is just a placeholder text to show you how to add a larger message.",
            },
            timestamp: new Date(),
            position: "bottom",
            seen: false,
        },
    ];
    function isYesterday(date) {
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

        messages.forEach((msg) => {
            const messageDate = msg.timestamp;
            const messageDateString = messageDate.toDateString();
            const formattedTime = messageDate.toLocaleTimeString();
            // const sender = msg.message.sender === meUsername ? 'You' : username;
            const formattedMessage = `${msg.message.message}`;
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

            if (msg.message.sender === sender) {
                messageWrapperStyle.alignSelf = 'flex-end';
            } else {
                messageWrapperStyle.alignSelf = 'flex-start';
            }


            renderedMessages.push(
                <div key={msg.id} style={messageWrapperStyle}>
                    <div className="text-center">

                    </div>
                    <div className={`col-start-1 col-end-8 p-3 rounded-lg ${sender === 'You' ? 'justify-start' : 'justify-end'}`}  >
                        <div>
                            <div className={`flex flex-row items-center ${msg.message.sender === 'You' ? 'flex-row-reverse' : ''}`}>
                                <div
                                    className={`flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 ${sender === 'You' ? 'mr-3' : 'ml-3'}`}
                                >
                                    {sender === "You" ? (
                                        <img src={meAvatar || avatar} className='rounded-full' alt="" />
                                    ) : (
                                        <img src={userAvatar || avatar} className='rounded-full' alt="" />
                                    )}
                                </div>
                                <div className="relative flex text-sm bg-white gap-2 py-2 px-4 shadow border rounded-xl" style={{ backgroundColor: msg.message.sender === 'You' ? '#CAF4FF' : '#FFF9D0' }}>
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
        </div>
    )
}

export default DirectIndexPage;
