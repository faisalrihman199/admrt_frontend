import { useCallback, useEffect, useState } from "react";
import { auth, db, deleteMessageFromFirebase, saveMessageToFirebase, usersCollection } from '../../firebase/firebase'
import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import { avatar } from '../../modul/main'
import svg2 from '../../image/search 1.svg'
import { VscEmptyWindow } from "react-icons/vsc"
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import EmojiPicker from 'emoji-picker-react';

const MessageIndex = ({ isMobile }) => {
    const [userUid, setUserId] = useState('');
    const [verifyRequest, setVerifyRequest] = useState({});
    const [avatars, setAvatars] = useState({});
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState(null)
    const [meId, setMeId] = useState(null);
    const [modalUser, setModalUser] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [emojiModal, setEmojiModal] = useState(false);
    const [findData, setFindData] = useState(null)
    const [lastMessages, setLastMessages] = useState({});
    const { userId } = useParams();
    const location = useLocation();
    const verifyPath = location.pathname === '/message';
    const dummyData = [
        {
            key: "User1",
            avatar: "https://via.placeholder.com/150",
            lastMessages: 5,
            lastMessage: "Hello, how are you?",
            lastChattedTime: "5 minutes ago",
        },
        {
            key: "User2",
            avatar: "https://via.placeholder.com/150",
            lastMessages: 2,
            lastMessage: "Goodbye!",
            lastChattedTime: "2 hours ago",
        },
        // Add more dummy data here
    ];
    // Add more dummy data here

    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged(async (user) => {
    //         if (user) {
    //             setMeId(user.uid)
    //             try {
    //                 const userRef = doc(usersCollection, user.uid);
    //                 const userDoc = await getDoc(userRef);
    //                 if (userDoc.exists()) {
    //                     const data = userDoc.data();
    //                     const requestCall = Object.fromEntries(Object.entries(data.requests)
    //                         .filter(([key, value]) => value === true)
    //                     );
    //                     setVerifyRequest(requestCall);
    //                     setUsername(data.fullName)
    //                 }
    //             } catch (error) {
    //                 console.error(error);
    //             }
    //         } else {
    //             setMeId(null)
    //         }
    //     });
    //     return () => unsubscribe();
    // }, []);

    const handleFetch = useCallback(async () => {
        try {
            const fetchedAvatars = {};
            const fetchedUserId = {}
            await Promise.all(Object.keys(verifyRequest).map(async (key) => {
                const userRef = doc(db, "search", key);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    fetchedAvatars[key] = data.imageUrl;
                    fetchedUserId[key] = data.userId
                }
            }));
            setAvatars(fetchedAvatars);
            setUserId(fetchedUserId);
        } catch (err) {
            console.error(err);
        }
    }, [verifyRequest]);

    // useEffect(() => {
    //     handleFetch();
    // }, [handleFetch]);

    const handleMessageSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveMessageToFirebase(meId, userId, { message, sender: username });
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    const handleDeleteMessage = async () => {
        try {
            await deleteMessageFromFirebase(meId, userId);
            setModalUser(false);
        } catch (error) {
            console.error("Error deleting message:", error);
            setModalUser(false);
        }
    };

    const openModal = (userId) => {
        setSelectedUserId(userId);
        setModalUser(true);
    };

    // useEffect(() => {
    //     const handleFindUsername = async () => {
    //         if (userId) {
    //             const findRef = await getDoc(doc(usersCollection, userId));
    //             if (findRef.exists()) {
    //                 const data = findRef.data();
    //                 setFindData(data);
    //             }
    //         }
    //     };
    //     handleFindUsername();
    // }, [userId]);

    const getFirebaseSendSeenTrue = useCallback(async (userId) => {
        try {
            const messagesRef = collection(db, `messages/${userId}/${meId}`);
            const messagesSnapshot = await getDocs(messagesRef);
            const batch = writeBatch(db);

            messagesSnapshot.forEach((doc) => {
                batch.update(doc.ref, { seen: true });
            });

            await batch.commit();
        } catch (error) {
            console.error('Error marking messages as seen:', error);
        }
    }, [meId]);

    // useEffect(() => {
    //     const realSeen = () => {
    //         if (location.pathname.startsWith(`/message/direct/${userId}`)) {
    //             getFirebaseSendSeenTrue(userId);
    //         }
    //     }

    //     realSeen();
    //     const interval = setInterval(realSeen, 1000);

    //     return () => clearInterval(interval);
    // }, [location.pathname, userId, getFirebaseSendSeenTrue]);

    const calculateLastMessage = useCallback(async (userId) => {
        try {
            const messagesRef = collection(db, `messages/${userId}/${meId}`);
            const messagesSnapshot = await getDocs(messagesRef);
            let lastMessageCount = 0;

            messagesSnapshot.forEach((doc) => {
                const messageData = doc.data();
                if (!messageData.seen) {
                    lastMessageCount++;
                }
            });

            return lastMessageCount;
        } catch (error) {
            console.error('Error calculating last message count:', error);
            return 0;
        }
    }, [meId]);

    // useEffect(() => {
    //     const calculateLastMessages = async () => {
    //         const lastMessagesObj = {};
    //         await Promise.all(Object.keys(verifyRequest).map(async (key) => {
    //             const count = await calculateLastMessage(userUid[key]);
    //             lastMessagesObj[key] = count;
    //         }));



    //         setLastMessages(lastMessagesObj);
    //     };

    //     const interval = setInterval(() => {
    //         calculateLastMessages();
    //     }, 2000);

    //     return () => clearInterval(interval);
    // }, [verifyRequest, userUid, calculateLastMessage, meId]);

    // useEffect(() => {
    //     const handleSeens = async () => {
    //         let sum = 0;
    //         Object.values(lastMessages).forEach((value) => {
    //             sum += value;
    //         });

    //         if (!usersCollection || !meId) {
    //             console.error("usersCollection or meId is not defined.");
    //             return;
    //         }

    //         const daf = doc(usersCollection, meId);
    //         await setDoc(daf, { seens: sum }, { merge: true });
    //     }

    //     return () => handleSeens();
    // }, [lastMessages, meId]);


    return (
        <div className="flex h-[88vh]  max-w-screen-2xl mx-auto antialiased text-gray-800">
            <div className="flex flex-row h-full w-full overflow-x-hidden  mx-3">
                <div className={`flex flex-col flex-auto h-full ${isMobile ? "w-full" : "w-1/3"}  flex-shrink-0`}>
                    <div className="flex flex-col flex-auto  rounded-2xl w-full h-full p-2">
                        <div className="border p-4 rounded-xl">
                            <div>
                                <Link to={'/message'} className="text-start mx-2 font-semibold text-lg md:text-2xl my-3">Messages</Link>
                                <div class="my-3">
                                    <form>
                                        <div class="relative w-full">
                                            <input class="md:p-3 p-2  w-full z-20 text-sm text-gray-900 bg-blue-50 rounded-full border outline-none focus:border-blue-500" placeholder="Search" required />
                                            <div class="absolute top-0 right-0 md:p-3 p-2 text-sm font-medium h-full text-white focus:ring-4 focus:outline-none focus:ring-blue-300">
                                                <img src={svg2} alt="" />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col space-y-1 mt-4  h-full border rounded-xl overflow-y-auto">
                            <div class="flex flex-col h-full w-full overflow-x-auto">
                                <div class="flex flex-col space-y-1 mt-3  h-full rounded-xl overflow-y-auto">
                                    <div class="flex flex-col h-full w-full px-5 overflow-x-auto mb-4">
                                        <div class="my-2 py-2">
                                            {dummyData.length === 0 && (
                                                <div className="text-gray-400 flex justify-center">
                                                    <div>
                                                        <VscEmptyWindow className="w-44 h-44" />
                                                        <p className="text-center">Empty Message</p>
                                                    </div>
                                                </div>
                                            )}
                                            {dummyData.map((data) => (
                                                <div key={data.key}>
                                                    <Link to={`/message/direct/${data.key}`} className="flex justify-between border-b hover:bg-gray-50">
                                                        <button className="py-4 flex w-full items-start justify-between cursor-pointer  hover:text-black">
                                                            <div className="flex gap-3">
                                                                <img src={data.avatar} className="flex-none w-12 h-12 rounded-full" alt="" />
                                                                <div className="m-auto">
                                                                    <span className="block text-sm text-gray-700 font-semibold text-left">{data.key}</span>
                                                                    <div className="flex items-center">
                                                                        <span className="block text-sm text-gray-500">{data.lastMessage}</span>
                                                                        <p className="bg-red-600 px-2.5 py-0.5 rounded-full text-white ml-2">{data.lastMessages}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                        <div className="m-auto flex flex-col items-end">
                                                            <p className="text-sm text-gray-500">{data.lastChattedTime}</p>
                                                            <button className="mt-2">
                                                                <PiDotsThreeOutlineFill className="text-gray-500 w-6 h-6 p-0.5 mr-2 hover:bg-gray-100 rounded-sm" />
                                                            </button>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
                <div className="flex flex-col flex-auto h-full w-2/3  flex-shrink-0">

                    <div className="flex flex-col flex-auto rounded-2xl w-full h-full p-2">
                        {isMobile ? null : (
                            <div>
                                {verifyPath ? null : (
                                    <div className="border rounded-xl fixed relative px-5 mb-3">
                                        {findData && (
                                            <div className="flex py-3">
                                                <div className="w-18 flex justify-content items-center">
                                                    <img className="w-16 rounded-full" src={findData.imageUrl || avatar} alt="" />
                                                </div>
                                                <div className="w-full m-auto">
                                                    <div className='flex justify-between'>
                                                        <div className='my-auto ml-4'>
                                                            <h1 className="font-semibold">{findData.fullName}</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        <div class="flex flex-col h-full w-full border rounded-xl overflow-x-auto mb-4">
                            <Outlet />
                        </div>
                        {!verifyPath && (
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
                                        disabled={!message}
                                    >
                                        <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="m-auto">
                                            <path d="M23 5.51055L12.1931 21.3588L10.8042 12.5518L3.87163 6.94548L23 5.51055Z" fill="#2B59FF" stroke="#2B59FF" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M22.9987 5.50982L10.8394 12.6755" stroke="#2B59FF" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageIndex;
