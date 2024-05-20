import React, { useRef, useState, useCallback, useEffect } from 'react';
import SpaceProfileSearchCard from './SpaceProfileSearchCard';
import { searchAdSpace } from '../service/addSpace';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { CustomSpinner } from '../components/Spinner';
import { useLocation } from 'react-router-dom';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { MdClearAll } from 'react-icons/md';
import { Spinner } from '@material-tailwind/react';
import { CardPlacehoderSkeleton } from '../components/Skeleton/AddSpace/AddSpaceSearchCardSkeleton';
import { AddSpaceSearchCardSkeletonWrapper } from '../components/Skeleton/AddSpace/AddSpaceSearchCardSkeletonWrapper';
import { UserProfileSkeleton } from '../components/Skeleton/userProfile/userProfileSkeleton';

const MainFilter = () => {
  const formRef = useRef();
  const location = useLocation();
  const query = location.state?.query || '';
  const [applyFilerLoader, setApplyFilterLoader] = useState(false);

  // const [applyFilter, setApplyFilter] = useState(false);
  let finalfilterOptions = {};

  const authHeader = useAuthHeader();
  const queryClient = useQueryClient();

  const finalfilterOptionsRef = useRef({});

  useEffect(() => {
    if (query) {
      finalfilterOptionsRef.current = { q: query };

      // handleApplyFilter();
    }
  }, [query]);

  const isAuthenticated = useIsAuthenticated();

  const { isLoading, isPending, isError, data, error, refetch, isRefetching } = useQuery({
    queryKey: ['searchSpace'],
    queryFn: () => searchAdSpace({ authHeader, filterOptions: finalfilterOptionsRef.current }),
    retry: false,
    // staleTime: 1000 * 60 * 5,

  })

  console.log('isPending', isPending);

  const handleApplyFilter = useCallback(() => {
    try {
      const filterOptions = getFilterOptions();
      const mediaShortForms = {
        'youtube': 'yt',
        'facebook': 'fb',
        'instagram': 'in',
        'tiktok': 'tt',
        'event': 'ev',
        'transportation': 'tr',
        'print': 'pr'
      };

      let newFilterOptions = {};

      if (filterOptions.nameOrExpertise) {
        newFilterOptions.q = filterOptions.nameOrExpertise;
      }

      if (filterOptions.country) {
        newFilterOptions.country = filterOptions.country;
      }

      Object.entries(filterOptions.mediaFilters)
        .filter(([key, value]) => value === true)
        .forEach(([key, value]) => {
          newFilterOptions[mediaShortForms[key]] = value;
        });

      finalfilterOptions = newFilterOptions;

      console.log('newFilterOptions', newFilterOptions);
      console.log('finalfilterOptions', finalfilterOptions);

      // refetch();
      finalfilterOptionsRef.current = newFilterOptions;
      queryClient.invalidateQueries({ queryKey: ['searchSpace'], filterOptions: finalfilterOptionsRef.current });
      refetch();
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('Something Went wrong');
    }
  }, []);

  const getFilterOptions = () => {
    const formElements = formRef.current.elements;
    return {
      nameOrExpertise: formElements.nameOrExpertise.value,
      mediaFilters: {
        youtube: formElements.youtube.checked,
        tiktok: formElements.tiktok.checked,
        instagram: formElements.instagram.checked,
        facebook: formElements.facebook.checked,
        transportation: formElements.transportation.checked,
        event: formElements.event.checked,
        print: formElements.print.checked,
      },
      country: formElements.country.value,
    };
  };

  const clearFilter = () => {
    formRef.current.reset();
    finalfilterOptionsRef.current = {};
    queryClient.invalidateQueries({ queryKey: ['searchSpace'], filterOptions: finalfilterOptionsRef.current });
    refetch();
  }


  // const { isPending, isError, data, error } = useQuery({
  //   queryKey: ['viewUserProfile', { authHeader }],
  //   queryFn: searchAdSpace,
  // })




  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl">
        Something went wrong ...
      </div>
    );
  }

  return (
    <div className=''>
      <div className=' mx-auto px-5'>
        <div className='border rounded-lg p-2 md:p-8'>
          <div className='flex justify-between'>
            <div className='text-xl md:text-3xl font-bold'><h1>Filter</h1></div>
            <button className='text-sm md:text-base text-red-500 flex items-center border p-2 rounded hover:shadow-md'
              onClick={clearFilter}
            >
              <MdClearAll className='mr-1' />
              <h1>Clear Filter</h1>
            </button>
          </div>
          <form ref={formRef}
            onSubmit={(event) => event.preventDefault()}
            className='p-2 mt-4'>
            <div>
              <h1 className='text-base font-semibold'>Name or Topic</h1>
              <input
                type="text"
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    handleApplyFilter();
                  }
                }}
                name="nameOrExpertise"
                placeholder='Enter Name or Expertise'
                className="block w-full py-3 mt-2 text-gray-900 input text-base"
              />
            </div>
            <div className="mt-5">
              <h1 className='font-medium'>Type of AdSpace</h1>
              <div className='flex justify-between'>
                <div className='flex gap-5 mt-4'>
                  {['youtube', 'tiktok', 'instagram', 'facebook', 'transportation', 'event', 'print'].map(mediaType => (
                    <label
                      className="flex hover:rounded font-medium text-gray-700 cursor-pointer peer-checked:border-blue-700 peer-checked:text-black hover:border hover:shadow-md border-transparent rounded p-2"
                      htmlFor={mediaType}
                      key={mediaType}
                    >
                      <input
                        id={mediaType}
                        className="accent-blue-600 peer mt-1.5"
                        type="checkbox"
                        name={mediaType}
                      />
                      <h1 className="text-sm md:text-base md:text-start pl-1 md:pl-3 mt-1 md:mt-0.5 text-gray-900">
                        {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
                      </h1>
                    </label>
                  ))}
                </div>
                <div className='flex -mt-7'>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-900 dark:text-white">Country</label>
                    <select
                      id="country"
                      name="country"
                      className="select border rounded-lg p-2 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block"
                    >
                      <option value="">Select Country</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className='text-center -translate-y-3 md:-translate-y-7'>
          <button
            type="button"
            onClick={handleApplyFilter}
            disabled={isRefetching}
            className={`px-3 py-1 md:px-9 md:py-4 shadow-2xl text-sm md:text-base font-medium text-white ${isRefetching ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'} rounded-lg text-center`}
          >
            <div className="flex items-center">
              {isRefetching && <Spinner type="ThreeDots" color="#00BFFF" height={20} width={20} />}
              <span>Apply Filter</span>
            </div>
            {/* {isRefetching ? (
              // <CustomSpinner />
              <CardPlacehoderSkeleton />
            ) : (
              'Apply Filter'
            )} */}
          </button>
        </div>
      </div>
      <div>

        <div className='max-w-screen-3xl mx-auto px-3 md:px-0 my-10'>
          {(isPending || isRefetching) && <AddSpaceSearchCardSkeletonWrapper />}
          {/* <AddSpaceSearchCardSkeletonWrapper /> */}
          <div className="flex justify-center">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-10 gap-y-5">

              {/* {/* {isPending || isRefetching ? (
                Array(4).fill().map((_, i) => <CardPlacehoderSkeleton key={i} />)
              ) : ( */}
              {data && data.map(space => (
                <SpaceProfileSearchCard key={space.id} profile={space} />
              ))
              }

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFilter;
