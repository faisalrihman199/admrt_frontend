import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import AdminNavbar from './AdminNavbar';

const Main = ({ authenticated, onUserSelect }) => {
  const location = useLocation(); 
  const auth=useAuthUser();
  if (location.pathname.includes("message")) {
    return (
      <>
        <Navbar authenticated={authenticated} onUserSelect={onUserSelect} />
        <Outlet />
      </>
    );
  }

  return (
    <>
    {
      auth?.user_role!=="admin" ?
      <Navbar authenticated={authenticated} onUserSelect={onUserSelect} />
      :
      <AdminNavbar />
    }
      <Outlet />
      {
      auth?.user_role!=="admin" && 
      <Footer authenticated={authenticated}/>
    }
    </>
  );
};

export default Main;
