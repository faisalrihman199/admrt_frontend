import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Accounts from './ChildAdmin/Accounts';
import AdHosts from './ChildAdmin/AdHosts';
import Adverstisors from './ChildAdmin/Adverstisors';
import AffiliateLinks from './ChildAdmin/AffiliateLinks';
import Messages from './ChildAdmin/Messages';
import Visitors from './ChildAdmin/Visitors';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Admin = () => {
  return (
    <div className="flex flex-col">
      <Sidebar />
      <div className="p-4 sm:ml-64 transition-all">
       

        <Routes>
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/adhosts" element={<AdHosts />} />
          <Route path="/advertisers" element={<Adverstisors />} />
          <Route path="/affiliates" element={<AffiliateLinks />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/visitors" element={<Visitors />} />
          
        </Routes>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Admin;
