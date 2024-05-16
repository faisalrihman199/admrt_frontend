import React, {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useState,
} from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

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
      const updatedConversationList = state.conversationList.find(
        (conversation) => conversation.id === action.payload.userId
      )
        ? state.conversationList
        : [
            {
              id: action.payload.userId,
              full_name: action.payload.body.full_name,
              profile_image: action.payload.body.profile_image,
            },
            ...state.conversationList,
          ];
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
      return {
        ...state,
        conversation: {
          ...state.conversation,
          [action.payload.partner_id]: action.payload.conversation,
        },
      };
    case "SET_UNREAD_CONVERSATIONS":
      return { ...state, unreadConversations: action.payload };
    case "SET_CONVERSATION_LIST":
      const conversationList = Object.values(action.payload).flat();
      console.log("conversationList", conversationList);
      return { ...state, conversationList };
    default:
      return state;
  }
};

export const WebSocketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(socketReducer, initialState);
  const isAuthenticated = useIsAuthenticated();
  const authHeader = useAuthHeader();
  const cleanedToken = authHeader?.replace(/^JWT\s/, "");

  const sendMessage = (action, body) => {
    if (state.socket && state.socket.readyState === WebSocket.OPEN) {
      const message = { action, body };
      console.log("Message sent for action:", action);
      if (action === "SEND-MESSAGE") {
        console.log("SEND-MESSAGE body:", body);
        dispatch({
          type: "ADD_MESSAGE_TO_CONVERSATION",
          payload: {
            userId: body.receiver_id,
            body: body,
          },
        });
      }

      state.socket.send(JSON.stringify(message));
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      const socket = new WebSocket(
        `ws://173.230.135.194:8080/ws?token=${cleanedToken}`
      );

      socket.onopen = () => {
        console.log("WebSocket connection established");
        dispatch({ type: "SET_SOCKET", payload: socket });
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Message received:", message);
        switch (message.action) {
          case "NEW-MESSAGE":
            console.log("NEW-MESSAGE RECEIVED from socket", message);
            dispatch({
              type: "ADD_MESSAGE_TO_CONVERSATION",
              payload: {
                userId: message.body.sender_id,
                body: message.body,
              },
            });
            break;
          case "CONVERSATION":
            console.log("CONVERSATION RECEIVED from socket", message);
            dispatch({
              type: "SET_CONVERSATION",
              payload: message.body,
            });
            break;

          case "CONVERSATION-LIST":
            dispatch({
              type: "SET_CONVERSATION_LIST",
              payload: message.body.summary,
            });
            break;
          default:
            console.log("Unhandled message action:", message.action);
        }
      };

      socket.onclose = (event) => {
        console.log(`WebSocket disconnected: ${event.reason}`);
      };

      socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      return () => {
        socket.close();
      };
    }
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
    <WebSocketContext.Provider value={{ ...state, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
