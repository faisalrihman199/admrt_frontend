import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import search from '../../Layout/AuthPage/images/search-normal.svg';
import { Link } from 'react-router-dom';

const Search = () => {
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [userId, setUserId] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [usersData, setUsersData] = useState([]);
  const avatar = 'https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId('');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRef = collection(db, 'search');
        const snapshot = await getDocs(usersRef);
        const userData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsersData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = usersData.filter(user =>
    user.id.toLowerCase().includes(searchValue.toLowerCase()) && user.userId !== userId && user.split === 'adSpaceHost'
  );

  const handleMouseDown = (event) => {
    if (inputRef.current && dropdownRef.current) {
      if (!inputRef.current.contains(event.target) && !dropdownRef.current.contains(event.target)) {
        setSearchValue('');
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

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
      {searchValue && filteredUsers.length === 0 && (
        <div ref={dropdownRef} className="absolute mt-2 w-full bg-white border rounded-md shadow-lg">
          <p className="py-2 px-4 text-black">User not found</p>
        </div>
      )}
      {searchValue && filteredUsers.length > 0 && (
        <div ref={dropdownRef} className="absolute mt-2 w-full bg-white border rounded-md shadow-lg">
          <ul className='m-1 border border-gray-300 rounded-sm'>
            {filteredUsers.map((user, index) => (
              <Link to={`/profile/${user.split}/${user.userId}`} key={index} onClick={() => setSearchValue('')}>
                <div className='flex px-3 py-2 hover:bg-gray-100 border-b'>
                  <li key={index} className=''>
                    <img src={user.imageUrl || avatar} alt="" className='w-10 rounded-full border border-blue-700 p-0.5' />
                  </li>
                  <li
                    key={index}
                    className="py-2 px-4 cursor-pointer hover:bg-gray-100 text-black"
                  >
                    {user.id}
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
