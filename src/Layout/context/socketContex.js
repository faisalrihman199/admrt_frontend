import React, {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useState,
} from "react";
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
      return {
        ...state,
        conversation: {
          ...state.conversation,
          [action.payload.userId]: [
            ...(state.conversation[action.payload.userId] || []),
            action.payload.message,
          ],
        },
      };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_CONVERSATION":
      return {
        ...state,
        conversation: {
          ...state.conversation,
          [action.payload.userId]: action.payload.messages,
        },
      };
    case "SET_UNREAD_CONVERSATIONS":
      return { ...state, unreadConversations: action.payload };
    case "SET_CONVERSATION_LIST":
      return { ...state, conversationList: action.payload };
    default:
      return state;
  }
};

export const WebSocketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(socketReducer, initialState);
  const isAuthenticated = useIsAuthenticated();

  const sendMessage = (action, body) => {
    if (state.socket && state.socket.readyState === WebSocket.OPEN) {
      const message = { action, body };
      console.log("Message sent for action:", action);
      if (action === "SEND-MESSAGE") {
        console.log("imhere");
        dispatch({
          type: "ADD_MESSAGE_TO_CONVERSATION",
          payload: {
            userId: body.userId,
            message: body,
          },
        });
      }

      state.socket.send(JSON.stringify(message));
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      const socket = new WebSocket("ws://localhost:8080");

      socket.onopen = () => {
        console.log("WebSocket connection established");
        dispatch({ type: "SET_SOCKET", payload: socket });
      };

      socket.onmessage = (event) => {
        console.log("Message received:", event);
        const message = JSON.parse(event.data);
        console.log("Message received:", message);
        switch (message.action) {
          case "NEW-MESSAGE":
            console.log("NEW-MESSAGE RECEIVED from socket", message);
            dispatch({
              type: "ADD_MESSAGE_TO_CONVERSATION",
              payload: {
                userId: message.data.userId,
                message: message.data,
              },
            });
            break;
          case "CONVERSATION":
            dispatch({
              type: "SET_CONVERSATION",
              payload: message.data,
            });
            break;
          case "UNREAD-CONVERSATION":
            dispatch({
              type: "SET_UNREAD_CONVERSATIONS",
              payload: message.body.conversations,
            });
            break;
          case "CONVERSATION_LIST":
            dispatch({ type: "SET_CONVERSATION_LIST", payload: message.data });
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
