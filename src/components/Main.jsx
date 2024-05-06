import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const Main = ({ authenticated, onUserSelect }) => {
  const location = useLocation(); 

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
      <Navbar authenticated={authenticated} onUserSelect={onUserSelect} />
      <Outlet />
      <Footer authenticated={authenticated} />
    </>
  );
};

export default Main;
