import React, { useState, useEffect, useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Layout/AuthPage/Login";
import Register from "./Layout/AuthPage/Register";
import Continue from "./Layout/AuthPage/Continue";
import CreateAnAcc from "./Layout/AuthPage/CreateAnAcc";
import ConfirmPassword from "./Layout/AuthPage/ConfirmPassword";
import CheckEmail from "./Layout/AuthPage/CheckEmail";
import ForgotPassword from "./Layout/AuthPage/ForgotPassword";
import Main from "./components/Main";
import "./App.css";
import About from "./components/About";
import Contact from "./components/Contact";
import Profile from "./profile/main";
import { auth } from "./firebase/firebase";
import { NotFound } from "./404/404";
import Settings from "./components/Settings/DateBirthday/Settings";
import Home from "./components/Home";
import ViewsProfile from "./viewsProfile/viewsProfile";
import MessageIndex from "./message/layout/index";
import EmptyMessage from "./message/layout/context/empty";
import AddPortfolio from "./Layout/context/portfolio/next/addPortfolio";
import MainFilter from "./filter/main";
import DirectIndexPage from "./message/layout/context/direct/index";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import Chat from "./components/Test";

function App() {
  const [userId, setUserId] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleRegister = useCallback(() => {
    setAuthenticated(true);
  }, []);

  const handleSuccess = useCallback(() => {
    handleRegister();
  }, [handleRegister]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        handleSuccess();
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, [handleSuccess, setUserId, userId]);

  const handleUserSelect = (selectedUserUID) => {
    console.log(selectedUserUID);
  };
  const isAuthenticated = useIsAuthenticated();

  const AuthUserRoutes = [
    { id: 1, path: `/profile`, element: <Profile /> },
    { id: 2, path: `/settings`, element: <Settings /> },
    {
      id: 3,
      path: `/profile/:split/:userUID`,
      element: <ViewsProfile onUserUID={handleUserSelect} />,
    },
    { id: 4, path: `/mediaUpload/:portfolio`, element: <AddPortfolio /> },
    { id: 6, path: `/mediaUpload/:product`, element: <AddPortfolio /> },
    { id: 7, path: `/filter`, element: <MainFilter /> },
    // { id: 9, path: "/message", element: <MessageIndex /> },
    // { id: 10, path: "/message/direct/:userId", element: <DirectIndexPage /> },
    { id: 8, path: "*", element: <NotFound /> },
  ];

  const GhostUser = [
    { id: 1, path: "/login", element: <Login /> },
    {
      id: 2,
      path: "/register",
      element: <Register authenticated={handleRegister} />,
    },
    { id: 3, path: "/about", element: <About /> },
    { id: 4, path: "/contact", element: <Contact /> },
    { id: 5, path: "/continue", element: <Continue /> },
    { id: 6, path: "/:split/registration", element: <CreateAnAcc /> },
    { id: 7, path: "/forgotPassword", element: <ForgotPassword /> },
    { id: 8, path: "/confirmPassword", element: <ConfirmPassword /> },
    { id: 9, path: "/checkEmail", element: <CheckEmail /> },
    { id: 10, path: "/congratulation", element: <CreateAnAcc /> },
    { id: 11, path: "*", element: <NotFound /> },
    // { id: 12, path: "/testChat", element: <Chat /> },
  ];
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <Main
              authenticated={isAuthenticated}
              onUserSelect={handleUserSelect}
            />
          }
        >
          <Route index element={<Home />} />
          <Route element={<AuthOutlet fallbackPath="/login" />}>
            {AuthUserRoutes.map((route) => (
              <Route key={route.id} path={route.path} element={route.element} />
            ))}
            <Route path="/message" element={<MessageIndex />}>
              <Route index element={<EmptyMessage />} />
              <Route
                path="/message/direct/:userId"
                element={<DirectIndexPage />}
              />
            </Route>
          </Route>
        </Route>
        {GhostUser.map((route) => (
          <Route key={route.id} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
