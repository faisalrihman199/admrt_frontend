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
      console.log("SET_CONVERSATION", action.payload);
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
      const conversationList = Object.entries(action.payload).map(
        ([userId, conversation]) => ({
          ...conversation,
          userId,
        })
      );
      console.log("conversationList", conversationList);
      return { ...state, conversationList };
    case "MAKE_CONVERSATION_READ":
      const updatedConversationListForAlreadyRead = state.conversationList.map(
        (conversation) => {
          if (conversation.userId === action.payload) {
            return { ...conversation, unread_messages: 0 };
          }
          return conversation;
        }
      );
      return {
        ...state,
        conversationList: updatedConversationListForAlreadyRead,
      };
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
      let socketSendParam;
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

      state.socket.send(JSON.stringify(socketSendParam));
    }
  };

  const makeConversationRead = (conversationId) => {
    dispatch({
      type: "MAKE_CONVERSATION_READ",
      payload: conversationId,
    });
  };

  const updateConversationList = (conversationList) => {
    console.log("updating conversationList", conversationList);
    dispatch({
      type: "SET_CONVERSATION_LIST",
      payload: conversationList,
    });
  };

  const updateConversation = (userId, conversation) => {
    console.log("updating conversation", conversation);
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
        console.log("conversationListData:", data);
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
    console.log("doesConversationExist", userId, state.conversationList);
    return state.conversationList.some(
      (conversation) => conversation.userId == userId
    );
  };
  const stateRef = useRef();

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (isAuthenticated) {
      const socket = new WebSocket(
        `wss://kuttabilai.com/ws?token=${cleanedToken}`
      );

      socket.onopen = () => {
        console.log("WebSocket connection established");
        dispatch({ type: "SET_SOCKET", payload: socket });
      };
      stateRef.current = state;

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Message received:", message);
        switch (message.action) {
          case "NEW-MESSAGE":
            console.log("NEW-MESSAGE RECEIVED from socket", message);

            if (
              doesConversationExist(message.body.sender_id, stateRef.current) ==
              false
            ) {
              console.log(
                "conversation does not exist, calling getConverSationList"
              );
              getConverSationList();
            }
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
    <WebSocketContext.Provider
      value={{
        ...state,
        sendMessage,
        makeConversationRead,
        updateConversationList,
        getConverSationList,
        updateConversation,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
