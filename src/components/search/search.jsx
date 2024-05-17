import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import search from '../../Layout/AuthPage/images/search-normal.svg';
import { Link } from 'react-router-dom';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { useQuery } from '@tanstack/react-query';
import { searchAdSpace } from '../../service/addSpace';

const Search = () => {
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [userId, setUserId] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [usersData, setUsersData] = useState([]);
  const avatar = 'https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg';
  const authHeader = useAuthHeader();

  // const { isPending, isError, data, error, refetch } = useQuery({
  //   queryKey: ['searchSpace'],
  //   queryFn: () => searchAdSpace({ authHeader, filterOptions: { q: inputRef.current.value } }),
  //   retry: false

  // })
  let data = []

  const handleMouseDown = (event) => {
    if (inputRef.current && dropdownRef.current) {
      if (!inputRef.current.contains(event.target) && !dropdownRef.current.contains(event.target)) {
        setSearchValue('');
      }
    }
  };

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleMouseDown);

  //   return () => {
  //     document.removeEventListener('mousedown', handleMouseDown);
  //   };
  // }, []);

  return (
    <div className="relative mr-3">
      <div className="relative w-full  lg:w-72">
        <input
          ref={inputRef}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="p-3 w-full h-10 z-20 text-sm text-gray-900 bg-blue-50 rounded-full border outline-none focus:border-blue-500"
          placeholder="Search"
          required
        />
        <div className="absolute top-0 right-0 p-2 pr-3 text-sm font-medium h-full text-white focus:ring-4 focus:outline-none focus:ring-blue-300">
          <img src={search} alt="" />
        </div>
      </div>
      {searchValue && (
        <div ref={dropdownRef} className="absolute mt-2 w-full bg-white border rounded-md shadow-lg">
          <p className="py-2 px-4 text-black">User not found</p>
        </div>
      )}
      {searchValue && (
        <div ref={dropdownRef} className="absolute mt-2 w-full bg-white border rounded-md shadow-lg">
          <ul className='m-1 border border-gray-300 rounded-sm'>
            {data.filter(user => user.full_name.toLowerCase().includes(searchValue.toLowerCase())).map((user, index) => (
              <Link to={`/profile/user/${user.id}`} key={index} onClick={() => setSearchValue('')}>
                <div className='flex px-3 py-2 hover:bg-gray-100 border-b'>
                  <li key={index} className=''>
                    <img src={user.profile_image || avatar} alt="" className='w-10 rounded-full border border-blue-700 p-0.5' />
                  </li>
                  <li
                    key={index}
                    className="py-2 px-4 cursor-pointer hover:bg-gray-100 text-black"
                  >
                    {user.full_name}
                  </li>
                </div>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
