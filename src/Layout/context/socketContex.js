import React, {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useState,
  useRef,
} from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { getChatConversationList } from "../../service/chat";

const WebSocketContext = createContext();

const initialState = {
  socket: null,
  messages: [],
  conversation: {},
  unreadConversations: [],
  conversationList: [],
};

const socketReducer = (state, action) => {
  switch (action.type) {
    case "SET_SOCKET":
      return { ...state, socket: action.payload };

    case "ADD_MESSAGE_TO_CONVERSATION":
      let updatedConversationList = [...state.conversationList];
      const existingConversationIndex = updatedConversationList.findIndex(
        (conversation) => conversation.userId == action.payload.userId
      );

      if (existingConversationIndex > 0) {
        const existingConversation = updatedConversationList.splice(
          existingConversationIndex,
          1
        )[0];
        updatedConversationList.unshift(existingConversation);
      }

      return {
        ...state,
        conversation: {
          ...state.conversation,
          [action.payload.userId]: [
            ...(state.conversation[action.payload.userId] || []),
            action.payload.body,
          ],
        },
        conversationList: updatedConversationList,
      };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_CONVERSATION":
      // console.log("SET_CONVERSATION", action.payload);
      return {
        ...state,
        conversation: {
          ...state.conversation,
          [action.payload.partner_id]: action.payload.conversation,
        },
      };
    case "PUSH_CONVERSATION_LIST":
      const doesExist = state.conversationList.some(
        (conversation) => conversation.userId === action.payload.userId
      );

      if (!doesExist) {
        return {
          ...state,
          conversationList: [action.payload, ...state.conversationList],
        };
      }

      return state;
    case "SET_UNREAD_CONVERSATIONS":
      return { ...state, unreadConversations: action.payload };
    case "SET_CONVERSATION_LIST":
      // const conversationList = Object.entries(action.payload).map(
      //   ([userId, conversation]) => ({
      //     ...conversation,
      //     userId,
      //   })
      // );
      // console.log("conversationList", conversationList);
      // return { ...state, conversationList };
    case "MAKE_CONVERSATION_READ":
      // const updatedConversationListForAlreadyRead = state.conversationList.map(
      //   (conversation) => {
      //     if (conversation.userId === action.payload) {
      //       return { ...conversation, unread_messages: 0 };
      //     }
      //     return conversation;
      //   }
      // );
      // return {
      //   ...state,
      //   conversationList: updatedConversationListForAlreadyRead,
      // };
    default:
      return state;
  }
};

export const WebSocketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(socketReducer, initialState);
  const isAuthenticated = useIsAuthenticated();
  const authHeader = useAuthHeader();
  const cleanedToken = authHeader?.replace(/^JWT\s/, "");
  const [newMessage, setNewMessage] = useState({});
  const [userStatus, setUserStatus] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [read,setRead]=useState(null);
  const [conversationStatus,setConversationStatus]=useState({
    conversation: null,
    status: '',
  })

  const reconnectDelay = Math.min(10000, reconnectAttempts * 1000); // Delay increases with attempts, max 10 seconds

  const sendMessage = (action, body) => {
    if (state.socket && state.socket.readyState === WebSocket.OPEN) {
      let socketSendParam;
      const message = { action, body };
      // console.log("Message sent for action:", action);
      if (action === "SEND-MESSAGE") {
        // console.log("SEND-MESSAGE body:", body);
        dispatch({
          body,
        });
        dispatch({
          type: "PUSH_CONVERSATION_LIST",
          payload: {
            userId: body.receiver_id,
            last_message: body.text,
            full_name: body.full_name,
            profile_image: body.profile_image,
            unread_messages: 0,
          },
        });
        let { text, receiver_id } = body;
        socketSendParam = {
          action,
          body: {
            text,
            receiver_id,
          },
        };
      } else {
        socketSendParam = message;
      }

      state.socket.send(JSON.stringify(body));
    }
  };

  const makeConversationRead = (conversationId) => {
    dispatch({
      type: "MAKE_CONVERSATION_READ",
      payload: conversationId,
    });
  };

  const updateConversationList = (conversationList) => {
    // console.log("updating conversationList", conversationList);
    dispatch({
      type: "SET_CONVERSATION_LIST",
      payload: conversationList,
    });
  };

  const updateConversation = (userId, conversation) => {
    // console.log("updating conversation", conversation);
    dispatch({
      type: "SET_CONVERSATION",
      payload: {
        partner_id: userId,
        conversation,
      },
    });
  };

  const getConverSationList = async () => {
    try {
      // const conversationList = await getChatConversationList(authHeader);
      // console.log("conversationList", conversationList);
      getChatConversationList(authHeader).then((data) => {
        // console.log("conversationListData:", data);
        updateConversationList(data.conversations);
      });
      // dispatch({
      //   type: "SET_CONVERSATION_LIST",
      //   payload: conversationList,
      // });
    } catch (error) {
      console.error("Error fetching conversation list:", error);
    }
  };
  const doesConversationExist = (userId, state) => {
    // console.log("doesConversationExist", userId, state.conversationList);
    return state.conversationList.some(
      (conversation) => conversation.userId == userId
    );
  };

  const stateRef = useRef();

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const connectWebSocket = () => {
    if (isAuthenticated && !state.socket) {
      const socket = new WebSocket(
        `${process.env.REACT_APP_WEBSOCKET_URL}?token=${cleanedToken}`
      );

      socket.onopen = () => {
        console.log("WebSocket connection established");
        dispatch({ type: "SET_SOCKET", payload: socket });
        setReconnectAttempts(0); // Reset reconnect attempts on successful connection
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("New Event Received:", event.data);
        switch (message.type) {
          case "NEW-MESSAGE":
            // console.log("NEW-MESSAGE RECEIVED from socket", message);
            break;
          case "CONVERSATION":
            // console.log("CONVERSATION RECEIVED from socket", message);
            dispatch({
              type: "SET_CONVERSATION",
              payload: message.body,
            });
            break;
          case "User_status":
            // console.log("User Status Chnaged :", message);
            setUserStatus(message);
            break;
          case "chat":
            // console.log("NEW-MESSAGE RECEIVED from socket", message);
            if(message?.message){
              setNewMessage(message.message);
            }
            break;
          case "unread_messages_count":
            // console.log("Unread Message Count", message?.unread_count.length);
            setRead(message?.unread_count.length);
            break;
          case "read_conversation":
            // console.log("Read Conversation :",message);
            break;
          case "chat_message":
            // console.log("Delivered Message Conversation :",message);
            if(message?.message){
              setConversationStatus((prevStatus) => ({
                ...prevStatus,  
                conversation: message.message.conversation,
                status: message.message.status,
              }));
            }
            break;
          case "read_receipt":
            // console.log("Read Message Conversation :",message);
            if(message?.conversation_id){
              setConversationStatus((prevStatus) => ({
                ...prevStatus,  
                conversation: message.conversation_id,
                status: message.status,
              }));
            }
            break;
          default:
            console.log("Unhandled message action:", message.action);
        }
      };

      socket.onclose = (event) => {
        console.log(`WebSocket disconnected: ${event.reason}`);
        attemptReconnect();
      };

      

      return () => {
        socket.close();
      };
    }
  };

  const attemptReconnect = () => {
    setTimeout(() => {
      if (reconnectAttempts < 10) {
        console.log("Attempting to reconnect WebSocket...");
        setReconnectAttempts((prev) => prev + 1);
        connectWebSocket(); // Try to reconnect
      } else {
        console.log("Max reconnection attempts reached.");
      }
    }, reconnectDelay);
  };

  useEffect(() => {
    if (isAuthenticated) {
      connectWebSocket();
    }
    return () => {
      if (state.socket) state.socket.close();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    window.onbeforeunload = () => {
      dispatch({ type: "CLEAR_STATE" });
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, [isAuthenticated]);

  return (
    <WebSocketContext.Provider
      value={{
        ...state,
        newMessage,
        sendMessage,
        makeConversationRead,
        updateConversationList,
        getConverSationList,
        updateConversation,
        userStatus,
        read,
        setRead,
        setNewMessage,
        conversationStatus,
        
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
