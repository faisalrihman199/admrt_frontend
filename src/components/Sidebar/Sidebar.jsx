import React, { useEffect, useState } from 'react';
import { 
  FaBullhorn, 
  FaDesktop, 
  FaEnvelope, 
  FaGlobe, 
  FaLink, 
  FaTimesCircle, 
  FaUsers, 
  FaSignOutAlt 
} from 'react-icons/fa';
import AddictiveAdLogo from '../../images/Group 1000005596 (2)_.svg';
import { Link, useLocation } from 'react-router-dom';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useQueryClient } from '@tanstack/react-query';
import { useAdmin } from '../../Context/AdminContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Get the current location
  const signOut = useSignOut()
  const queryClient = useQueryClient()
  const {navData}=useAdmin();
  const [sidebardata, setSideBarData]=useState(null);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    signOut()
    queryClient.invalidateQueries({ queryKey: ['searchSpace', 'loggedInUser'] })

    window.location.href="/";
  }
  useEffect(()=>{
    navData()
    .then((res)=>{
      console.log("NavData is :",res.data);
      setSideBarData(res.data)
    })
    .catch((err)=>{
      console.log("Errror :", err);
      
    })
  },[])
  

  // Function to determine if the link is active
  const isActiveLink = (path) => location.pathname === path;

  return (
    <div>
      <style>
        {`
          .active-link {
            background-color: rgba(200, 200, 200, 0.3); 
            border-radius: 13px; 
          }
        `}
      </style>

      <div className="flex justify-between items-center sm:hidden" style={{
        background: 'linear-gradient(to right, #0a1e68, #153795)'
      }}>
        <button
          onClick={toggleSidebar}
          type="button"
          className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            />
          </svg>
        </button>
        <Link to="/" className="flex items-center ">
          <img src={AddictiveAdLogo} alt="" height={50} width={150} />
        </Link>
        <button
          className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          onClick={handleLogout}
        
        >
          <FaSignOutAlt size={24} />
          <span className="sr-only">Logout</span>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto" style={{
          background: 'linear-gradient(to right, #0a1e68, #153795)'
        }}>
          {isOpen && 
            <div className="flex justify-end">
              <FaTimesCircle color='white' onClick={toggleSidebar} />
            </div>
          }
          <Link to="/" className="flex items-center mb-5">
            <img src={AddictiveAdLogo} alt="" />
          </Link>
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/admin/accounts"
                className={`flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group ${isActiveLink('/admin/accounts') ? 'active-link' : ''}`}
              >
                <FaUsers size={25} />
                <span className="flex-1 ms-3 whitespace-nowrap">Accounts</span>
                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  {sidebardata?.total_users}
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/messages"
                className={`flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group ${isActiveLink('/admin/messages') ? 'active-link' : ''}`}
              >
                <FaEnvelope size={25} />
                <span className="flex-1 ms-3 whitespace-nowrap">Messages</span>
                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  {sidebardata?.total_messages}
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/visitors"
                className={`flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group ${isActiveLink('/admin/visitors') ? 'active-link' : ''}`}
              >
                <FaGlobe size={25} />
                <span className="flex-1 ms-3 whitespace-nowrap">Visitors</span>
                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  {sidebardata?.total_visitors}
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/advertisers"
                className={`flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group ${isActiveLink('/admin/advertisers') ? 'active-link' : ''}`}
              >
                <FaBullhorn size={25} />
                <span className="flex-1 ms-3 whitespace-nowrap">Advertisers</span>
                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  {sidebardata?.advertiser_count}
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/adhosts"
                className={`flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group ${isActiveLink('/admin/adhosts') ? 'active-link' : ''}`}
              >
                <FaDesktop size={25} />
                <span className="flex-1 ms-3 whitespace-nowrap">Ad Hosts</span>
                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                {sidebardata?.space_host_count}
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/affiliates"
                className={`flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group ${isActiveLink('/admin/affiliates') ? 'active-link' : ''}`}
              >
                <FaLink size={25} />
                <span className="flex-1 ms-3 whitespace-nowrap">Affiliate Links</span>
                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                {sidebardata?.total_affiliate_links}
                </span>
              </Link>
            </li>
          </ul>

          {/* Logout button at the bottom */}
          <div className="absolute bottom-0 w-full">
            <button
              className="flex items-center p-2 mt-4 mb-4 text-sm text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              onClick={handleLogout}
            >
              <FaSignOutAlt size={24} />
              <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
