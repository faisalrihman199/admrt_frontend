import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { auth, getMessagesFromFirebase, usersCollection } from '../../../../firebase/firebase';
import { collection, doc, getDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { avatar } from '../../../../modul/main';
import { SlArrowRight } from "react-icons/sl";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDone } from "react-icons/io5";

const DirectIndexPage = ({ isMobile }) => {
    const { userId } = useParams();
    const [username, setUsername] = useState(null);
    const [userAvatar, setUserAvatar] = useState(null);
    const [messages, setMessages] = useState([]);
    const [meId, setMeId] = useState(null);
    const [meUsername, setMeUsername] = useState(null);
    const [messagesSend, setMessagesSend] = useState([]);
    const [meAvatar, setMeAvatar] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setMeId(user.uid);
                try {
                    const userRef = await getDoc(doc(usersCollection, user.uid));
                    if (userRef.exists()) {
                        const data = userRef.data();
                        setMeUsername(data.fullName);
                        setMeAvatar(data.imageUrl);
                    }
                } catch (err) {
                    console.error(err);
                }
            } else {
                setMeId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchRef = doc(db, 'users', userId);
                const fetchDoc = await getDoc(fetchRef);
                if (fetchDoc.exists()) {
                    const data = fetchDoc.data();
                    setUsername(data.fullName);
                    setUserAvatar(data.imageUrl);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();

        const fetchMessages = async () => {
            try {
                if (meId) {
                    const messagesFromMe = await getMessagesFromFirebase(meId, userId);
                    setMessages(messagesFromMe);
                    const messagesToMe = await getMessagesFromFirebase(userId, meId);
                    setMessagesSend(messagesToMe);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchMessages();

        const messagesRef = collection(db, `messages/${meId}/${userId}`);
        const messagesQuery = query(messagesRef, orderBy('timestamp'));
        const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
            const data = [];
            snapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            setMessages(data);
        });

        const messagesSendRef = collection(db, `messages/${userId}/${meId}`);
        const messagesSendQuery = query(messagesSendRef, orderBy('timestamp'));
        const unsubscribeMessagesSend = onSnapshot(messagesSendQuery, (snapshot) => {
            const data = [];
            snapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            setMessagesSend(data);
        });

        return () => {
            unsubscribeMessages();
            unsubscribeMessagesSend();
        };
    }, [userId, meId]);

    const isYesterday = (dateString) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const formattedYesterday = yesterday.toISOString().split('T')[0];
        return dateString === formattedYesterday;
    };

    const renderMessages = () => {
        const today = new Date().toDateString();
        let lastDate = null;
        let renderedMessages = [];

        messages.concat(messagesSend)
            .filter(msg => msg !== null)
            .sort((a, b) => a.timestamp - b.timestamp)
            .forEach((msg) => {
                if (msg) {
                    const messageDate = msg.timestamp.toDate();
                    const messageDateString = messageDate.toDateString();
                    const formattedTime = messageDate.toLocaleTimeString();
                    const sender = msg.message.sender === meUsername ? 'You' : username;
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

                    renderedMessages.push(
                        <div key={msg.id} className={`${msg.position === 'top' ? 'top-message' : 'bottom-message'}`}>
                            <div className="text-center">
                                {dateComponent}
                            </div>
                            <div className={`col-start-1 col-end-8 p-3 rounded-lg ${sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                                <div>
                                    <div className={`flex flex-row items-center ${sender === 'You' ? 'flex-row-reverse' : ''}`}>
                                        <div
                                            className={`flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 ${sender === 'You' ? 'ml-3' : 'mr-3'}`}
                                        >
                                            {sender === "You" ? (
                                                <img src={meAvatar || avatar} className='rounded-full' alt="" />
                                            ) : (
                                                <img src={userAvatar || avatar} className='rounded-full' alt="" />
                                            )}
                                        </div>
                                        <div
                                            className={`relative flex text-sm bg-white gap-2 py-2 px-4 shadow border rounded-xl ${sender === 'You' ? 'bg-blue-100 flex-row-reverse' : ''}`}
                                        >
                                            <div>{formattedMessage}</div>
                                            <div className={`text-[10px] text-gray-500 flex justify-end items-end`}>{timeMessage}</div>
                                            <div className={`${sender === 'You' ? 'flex justify-end mt-1' : 'hidden'}`}>
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
                }
            });

        return renderedMessages;
    };

    return (
        <div className='mb-5'>
            {isMobile ? (
                <div className="border-b relative px-5 mb-3">
                    <div className="flex py-3">
                        <div className="w-18 flex justify-content items-center">
                            <img className="w-16 rounded-full" src={userAvatar || avatar} alt="" />
                        </div>
                        <div className="w-full m-auto">
                            <div className='flex justify-between'>
                                <div className='my-auto ml-4'>
                                    <h1 className="font-semibold">{username}</h1>
                                </div>
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
                <div className="gap-y-2 ">
                    {renderMessages()}
                </div>
            </div>
        </div>
    );
};

export default DirectIndexPage;
