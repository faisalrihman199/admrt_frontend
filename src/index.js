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
const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();
root.render(
  <>
    {/* <QueryClientProvider client={queryClient}> */}
    <AuthProvider store={authStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
    {/* </QueryClientProvider> */}
  </>
);
