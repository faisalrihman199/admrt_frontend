import { useCallback, useContext, useEffect, useState } from "react";
import { auth, db, deleteMessageFromFirebase, saveMessageToFirebase, usersCollection } from '../../firebase/firebase'
import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { Link, Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import { avatar } from '../../modul/main'
import svg2 from '../../image/search 1.svg'
import { VscEmptyWindow } from "react-icons/vsc"
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import EmojiPicker from 'emoji-picker-react';
import { useWebSocket } from "../../Layout/context/socketContex";
import { getChatConversationList, getChatUsersForAdmin } from "../../service/chat";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useQuery } from "@tanstack/react-query";
import { IoClose, IoCreateOutline } from "react-icons/io5";
import { Modal } from "../../components/Modal/Modal";
import { IoMdSend } from "react-icons/io";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
// import { avatar } from '../../../../modul/main';


const NewMessageUserList = ({ closeSection }) => {
    const [userList, setUserList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const authHeader = useAuthHeader()


    const { isPending, isError, data, error, refetch, isRefetching } = useQuery({
        queryKey: ['adminNewChatUsers'],
        queryFn: () => getChatUsersForAdmin({ authHeader, search: searchQuery }),
        retry: false

    })

    const handleSearch = () => {
        refetch();
    };
    const navigate = useNavigate();

    const handleNavigate = ({ user }) => {
        console.log('im here')
        navigate(`/message/direct/${user.id}`, {
            state: {
                newConverSationUserName: user.full_name,
                newConverSationUserProfileImage: user.profile_image
            }
        });

        closeSection()
    }

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="p-5 border bg-white rounded shadow ">
            < IoClose
                className="absolute top-2 right-2 cursor-pointer mb-3"
                onClick={closeSection}
            />
            <div className="flex mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for users..."
                    className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                >
                    Search
                </button>
            </div>
            {isRefetching ? (
                <div>Loading...</div>
            ) : (
                <div className="max-h-80 overflow-y-scroll">
                    {data?.results && data?.results.map(user => (
                        <div key={user.id} className="flex items-center p-5 mb-2 border rounded shadow">
                            <img
                                src={user.profile_image}
                                alt={`${user.full_name}'s profile`}
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div className="flex-grow">
                                <div className="font-semibold">{user.full_name}</div>
                                <div className="text-gray-500">{user.user_role}</div>
                            </div>
                            {/* <Link to={{
                                pathname: `/message/direct/${user.id}`,
                                state: {
                                    newConverSationUserName: user.full_name,
                                    newConverSationUserProfileImage: user.profile_image
                                }
                            }} className="text-blue-500 hover:text-blue-600">
                                <IoMdSend />
                            </Link> */}
                            <button onClick={() => handleNavigate({ user })}>
                                <IoMdSend />
                            </button>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
};

const MessageIndex = ({ isMobile = false }) => {
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
    const authHeader = useAuthHeader();
    const authUser = useAuthUser();

    const isMessageListRoute = location.pathname === '/message';

    const { conversationList, makeConversationRead, updateConversationList, getConverSationList } = useWebSocket();
    useEffect(() => {
        getChatConversationList(authHeader).then((data) => {
            console.log('conversationListData:', data)
            updateConversationList(data.conversations)
        });
        // getConverSationList()
    }, []);

    useEffect(() => {

    }, [conversationList]);




    const openModal = (userId) => {
        setSelectedUserId(userId);
        setModalUser(true);
    };

    const [showNewMessageModal, setShowNewMessageModal] = useState(false);

    const handleNewMessageModal = () => {
        setShowNewMessageModal(!showNewMessageModal);
    };



    const handleUnreadMessages = async (conversationId) => {
        try {
            console.log('Marking conversation as read:', conversationId);

            makeConversationRead(conversationId);

            // Then, you might want to update this conversation data in your database
            // await updateConversation(conversation);
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="flex h-[88vh]  max-w-screen-2xl mx-auto antialiased text-gray-800">
            <div className="flex flex-row h-full w-full overflow-x-hidden  mx-3">

                <div className={`flex flex-col flex-auto h-full ${isMessageListRoute ? "w-full" : "hidden sm:block w-full lg:w-1/3"} md:w-1/3 lg:w-1/3 flex-shrink-0`}>
                    {/* <div className={`flex flex-col flex-auto h-full ${isMobile ? "w-full" : "w-1/3"}  flex-shrink-0`}> */}
                    <div className="flex flex-col flex-auto  rounded-2xl w-full h-full p-2">
                        <div className="border p-4 rounded-xl">
                            <div>
                                <div className="flex justify-between items-center">
                                    <Link to={'/message'} className="text-start mx-2 font-semibold text-lg md:text-2xl my-3">Messages</Link>
                                    {authUser.is_admin && (
                                        <div className="relative">
                                            <IoCreateOutline size="1.5em" onClick={handleNewMessageModal} className="transition-transform duration-500 ease-in-out transform hover:scale-125 cursor-pointer" />
                                            {showNewMessageModal && (
                                                <div className="absolute top-0 left-0 mt-8 z-50">
                                                    <NewMessageUserList closeSection={handleNewMessageModal} />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>
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
                                            {conversationList.length === 0 && (
                                                <div className="text-gray-400 flex justify-center">
                                                    <div>
                                                        <VscEmptyWindow className="w-44 h-44" />
                                                        <p className="text-center">Empty Message</p>
                                                    </div>
                                                </div>
                                            )}
                                            {/* <p>{JSON.stringify(conversationList)}</p> */}

                                            {conversationList.map((data) => (
                                                <div key={data.key} >
                                                    <Link
                                                        onClick={() => handleUnreadMessages(data?.userId)}
                                                        to={`/message/direct/${data?.userId}`} className="flex justify-between border-b hover:bg-gray-50">
                                                        <button className="py-4 flex w-full items-start justify-between cursor-pointer  hover:text-black">
                                                            <div className="flex gap-3">
                                                                <Link to={`/profile/user/${data?.userId}`}>
                                                                    <img src={data.profile_image || avatar} className="flex-none w-12 h-12 rounded-full" alt="" />
                                                                </Link>
                                                                {/* <img src={data.profile_image || avatar} className="flex-none w-12 h-12 rounded-full" alt="" /> */}
                                                                <div className="m-auto">
                                                                    <span className="block text-sm text-gray-700 font-semibold text-left">{data.full_name}</span>
                                                                    <div className="flex items-center">
                                                                        <span className="block text-sm text-gray-500">{data.lastMessage}</span>
                                                                        {data.unread_messages > 0 && (
                                                                            <p className="bg-red-600 px-2.5 py-0.5 rounded-full text-white ml-2">
                                                                                {data.unread_messages}
                                                                            </p>
                                                                        )}
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

                    </div>
                </div>
            </div>
        </div >

    );
}

export default MessageIndex;
