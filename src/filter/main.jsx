import React, { useState, useEffect, useCallback } from 'react';
import Cards from './Cards';
import { getDocs } from 'firebase/firestore';
import { usersCollection } from '../firebase/firebase';

const MainFilter = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    nameOrExpertise: '',
    mediaFilters: {
      youtube: false,
      tiktok: false,
      instagram: false,
      facebook: false,
      transportation: false,
      event: false,
      print: false,
    },
    country: ''
  });

  const applyFilter = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(usersCollection);
      const data = querySnapshot.docs.map(doc => doc.data());
      let filteredResult = data;

      if (filterOptions.nameOrExpertise.trim() !== '') {
        filteredResult = filteredResult.filter(user =>
          user.fullName.toLowerCase().includes(filterOptions.nameOrExpertise.toLowerCase()) ||
          (user.experitise && user.experitise.map(e => e.toLowerCase()).includes(filterOptions.nameOrExpertise.toLowerCase()))
        );
      }

      const selectedMediaFilters = Object.entries(filterOptions.mediaFilters)
        .filter(([_, value]) => value)
        .map(([key]) => key);
      if (selectedMediaFilters.length > 0) {
        filteredResult = filteredResult.filter(user =>
          selectedMediaFilters.some(filter => user.socialMedia && user.socialMedia[filter.toLowerCase()])
        );
      }
      console.log(selectedMediaFilters);

      if (filterOptions.country.trim() !== '') {
        filteredResult = filteredResult.filter(user =>
          user.country && user.country.toLowerCase() === filterOptions.country.toLowerCase()
        );
      }

      setFilteredData(filteredResult);
    } catch (err) {
      console.error(err);
    }
  }, [filterOptions]);

  useEffect(() => {
    applyFilter();
  }, [filterOptions, applyFilter]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFilterOptions(prevState => ({
        ...prevState,
        mediaFilters: {
          ...prevState.mediaFilters,
          [name]: checked
        }
      }));
    } else {
      setFilterOptions(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  return (
    <div className=''>
      <div className=' mx-auto px-5'>
        <div className='border rounded-lg p-2 md:p-8'>
          <div className='flex justify-between'>
            <div className='text-xl md:text-3xl font-bold'><h1>Filter</h1></div>
            <div className='text-base md:text-xl text-red-500'><h1>Clear Filter</h1></div>
          </div>
          <div className='p-2 mt-4'>
            <h1 className='text-base font-semibold'>Name or Expertise</h1>
            <form>
              <div>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                </div>
                <input
                  type="text"
                  name="nameOrExpertise"
                  value={filterOptions.nameOrExpertise}
                  onChange={handleInputChange}
                  placeholder='Enter Name or Expertise'
                  className="block w-full py-3 mt-2 text-gray-900 input text-base"
                />
              </div>
            </form>
          </div>
          <div className="mt-5">
            <div>
              <h1 className='font-medium'>Type of AdSpace</h1>
              <div className='flex justify-between'>
                <div className='flex gap-5 mt-4'>
                  <div class="flex font-medium text-gray-700 ">
                    <input class="accent-blue-600 peer mt-1.5" type="checkbox" name="youtube" id="youtube" checked={filterOptions.mediaFilters.youtube} onChange={handleInputChange} />
                    <label class="text-gray-900 cursor-pointer peer-checked:border-blue-700 peer-checked:text-black" for="youtube">
                      <h1 class="text-sm md:text-base md:text-start pl-1 md:pl-3 mt-1 md:mt-0.5">YouTube</h1>
                    </label>
                  </div>
                  <div class="flex font-medium text-gray-700 ">
                    <input class="accent-blue-600 peer mt-1.5" type="checkbox" name="tiktok" id="tiktok" checked={filterOptions.mediaFilters.tiktok} onChange={handleInputChange} />
                    <label class="text-gray-900 cursor-pointer peer-checked:border-blue-700 peer-checked:text-black" for="tiktok">
                      <h1 class="text-sm md:text-base md:text-start pl-1 md:pl-3 mt-1 md:mt-0.5">TikTok</h1>
                    </label>
                  </div>
                  <div class="flex font-medium text-gray-700 ">
                    <input class="accent-blue-600 peer mt-1.5" type="checkbox" name="instagram" id="instagram" checked={filterOptions.mediaFilters.instagram} onChange={handleInputChange} />
                    <label class="text-gray-900 cursor-pointer peer-checked:border-blue-700 peer-checked:text-black" for="instagram">
                      <h1 class="text-sm md:text-base md:text-start pl-1 md:pl-3 mt-1 md:mt-0.5">Instagram</h1>
                    </label>
                  </div>
                  <div class="flex font-medium text-gray-700 ">
                    <input class="accent-blue-600 peer mt-1.5" type="checkbox" name="facebook" id="facebook" checked={filterOptions.mediaFilters.facebook} onChange={handleInputChange} />
                    <label class="text-gray-900 cursor-pointer peer-checked:border-blue-700 peer-checked:text-black" for="facebook">
                      <h1 class="text-sm md:text-base md:text-start pl-1 md:pl-3 mt-1 md:mt-0.5">Facebook</h1>
                    </label>
                  </div>
                  <div class="flex font-medium text-gray-700 ">
                    <input class="accent-blue-600 peer mt-1.5" type="checkbox" name="transportation" id="transportation" checked={filterOptions.mediaFilters.transportation} onChange={handleInputChange} />
                    <label class="text-gray-900 cursor-pointer peer-checked:border-blue-700 peer-checked:text-black" for="transportation">
                      <h1 class="text-sm md text-base md:text-start pl-1 md:pl-3 mt-1 md:mt-0.5">Transportation</h1>
                    </label>
                  </div>
                  <div class="flex font-medium text-gray-700 ">
                    <input class="accent-blue-600 peer mt-1.5" type="checkbox" name="event" id="event" checked={filterOptions.mediaFilters.event} onChange={handleInputChange} />
                    <label class="text-gray-900 cursor-pointer peer-checked:border-blue-700 peer-checked:text-black" for="event">
                      <h1 class="text-sm md text-base md:text-start pl-1 md:pl-3 mt-1 md:mt-0.5">Event</h1>
                    </label>
                  </div>
                  <div class="flex font-medium text-gray-700 ">
                    <input class="accent-blue-600 peer mt-1.5" type="checkbox" name="print" id="print" checked={filterOptions.mediaFilters.print} onChange={handleInputChange} />
                    <label class="text-gray-900 cursor-pointer peer-checked:border-blue-700 peer-checked:text-black" for="print">
                      <h1 class="text-sm md text-base md:text-start pl-1 md:pl-3 mt-1 md:mt-0.5">Print</h1>
                    </label>
                  </div>
                </div>
                <div>
                  <div className='flex -mt-7'>
                    <div className=''>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-900 dark:text-white">Country</label>
                      <select
                        id="country"
                        name="country"
                        value={filterOptions.country}
                        onChange={handleInputChange}
                        className="select border rounded-lg p-2 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block"
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="FR">France</option>
                        <option value="DE">Germany</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='text-center -translate-y-3 md:-translate-y-7'>
          <button type="button" onClick={applyFilter} className="px-3 py-1 md:px-9 md:py-4  shadow-2xl text-sm md:text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center">Apply Filter</button>
        </div>
      </div>
      <div>
        <Cards userData={filteredData} />
      </div>
    </div>
  )
}

export default MainFilter;
