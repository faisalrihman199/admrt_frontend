import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "react-auth-kit";
import { authStore } from "./store/authStore";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Modal } from "./components/Modal/Modal";
import PopupLayout from "./Layout/PopupLayout";
import { WebSocketProvider } from "./Layout/context/socketContex";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

root.render(
  <>
    <AuthProvider store={authStore}>
      <QueryClientProvider client={queryClient}>
        <WebSocketProvider>
          <PopupLayout />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </WebSocketProvider>
      </QueryClientProvider>
    </AuthProvider>
  </>
);
