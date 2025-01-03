import React, { useState, useEffect, useCallback } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import PasswordReest from "./Layout/AuthPage/passwordReset";
import Product from "./profile/Product";
import Admin from "./Admin/Admin";
import { AdminProvider } from "./Context/AdminContext";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [userId, setUserId] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const authe=useAuthUser();
  
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
    // console.log(selectedUserUID);
  };
  useEffect(async()=>{
    const server=process.env.REACT_APP_API_BASE_URL;
    console.log("Server is :", server);
    
      const url=`${server}/settings/track-visitor/`
      console.log("Requesting for :", url);
      
      try {
        const res=await axios.get(url)  
      } catch (error) {
        console.log("Error :", error);
        
      }
  },[])
  const location = useLocation();

  useEffect(async() => {
    const params = new URLSearchParams(location.search);
    
    const referral = params.get('referal');

    if (referral) {
      const server=process.env.REACT_APP_API_BASE_URL;
      try {
        const res=await axios.get(`${server}/settings/addVisit/?link=${referral}`)  
      } catch (error) {
        console.log("Error :", error);
        
      }
    }
  }, []);
  const isAuthenticated = useIsAuthenticated();

  // useEffect(() => {}, [isAuthenticated]);

  const AuthUserRoutes = [
    { id: 1, path: `/profile/:userId`, element: <Profile /> },
    { id: 2, path: `/settings`, element: <Settings /> },
    {
      id: 3,
      path: `/profile/user/:userId`,
      element: <ViewsProfile onUserUID={handleUserSelect} />,
    },
    { id: 4, path: `/mediaUpload/:portfolio`, element: <AddPortfolio /> },
    { id: 6, path: `/mediaUpload/:product`, element: <AddPortfolio /> },
    { id: 7, path: `/filter`, element: <MainFilter /> },
    // { id: 9, path: "/message", element: <MessageIndex /> },
    // { id: 10, path: "/message/direct/:userId", element: <DirectIndexPage /> },
    { id: 8, path: "*", element: <NotFound /> },
    { id: 9, path: "/about", element: <About /> },
    { id: 10, path: "/contact", element: <Contact /> },
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
    { id: 12, path: "/resetPassword", element: <PasswordReest /> },
  ];

  return (
    <div>
      <Routes>
      <Route
          path="/admin/*"
          element={
            authe?.user_role==="admin"?
            <AdminProvider>
              <Admin />
            </AdminProvider>
            :
            <Navigate to='/' />
          }
        />
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
          <Route path="/about" element={<About />} />
         

          <Route path="/contact" element={<Contact />} />
          <Route path="/allproducts" element={<Product />} />
          <Route element={<AuthOutlet fallbackPath="/" />}>
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

      <ToastContainer />
    </div>
  );
}

export default App;
