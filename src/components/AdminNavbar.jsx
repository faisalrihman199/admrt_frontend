import React from 'react';
import AddictiveAdLogo from '../images/Group 1000005596 (2)_.svg';
import { Link } from 'react-router-dom';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useQueryClient } from '@tanstack/react-query';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminNavbar = () => {
    const signOut = useSignOut()
  const queryClient = useQueryClient()
    const handleLogout = () => {
        signOut()
        queryClient.invalidateQueries({ queryKey: ['searchSpace', 'loggedInUser'] })
    
        window.location.href="/";
      }
  return (
    <>
      <nav className="bg-white" style={{
        background: 'linear-gradient(to right, #0a1e68, #153795)'
      }} >
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <Link to="/admin/accounts" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={AddictiveAdLogo} className="h-8" alt="Flowbite Logo" />
          </Link>
          <button
              className="flex items-center text-sm text-gray-200 rounded-lg  dark:text-gray-100 "
              onClick={handleLogout}
            >
              <FaSignOutAlt size={24} />
              <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
            </button>
        </div>
      </nav>

    </>
  );
};

export default AdminNavbar;
