import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { VscChromeClose } from 'react-icons/vsc';
import { auth, usersCollection } from '../../firebase/firebase';
import { Link } from 'react-router-dom';
import { MdModeEditOutline } from "react-icons/md";
import deleteIcon from '../../image/Delete.svg'
import AuthenticatedUserViewPermission from '../../components/Permissions/AuthenticatedUserViewPermission';
import { addAddSpace, deleteAdSpace } from '../../service/addSpace';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { FaFileDownload, FaLink } from 'react-icons/fa';

export const MainAdSpace = ({ adSpaces }) => {
  const [modal, setModal] = useState(false);
  const [link, setLink] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [btnText, setBtnText] = useState('Submit');
  const [data, setData] = useState({ addSpace: { link: '', type: '' } });
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [editLink, setEditLink] = useState('');
  const [selectedForDelete, setSelectedForDelete] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const printIcon = 'https://img.icons8.com/fluency/48/magazine.png';
  const transIcon = 'https://img.icons8.com/fluency/48/motorbike-helmet.png';
  const eventIcon = 'https://img.icons8.com/fluency/48/today.png';
  const otherIcon = 'https://img.icons8.com/cute-clipart/64/connection-status-off.png';




  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addAddSpace,
    onSuccess: () => {
      queryClient.invalidateQueries('loggedInUser');

    },
  })

  console.log('adSpaces', adSpaces)
  const authHeader = useAuthHeader()

  const handleSend = async () => {
    try {
      setBtnText('Loading...');
      if (!link.startsWith('https://')) {
        setBtnText('Please enter a valid link');
        setModal(false);

        return;
      }

      let data = { space_type: selectedType, url: link }
      let formData = new FormData();
      formData.append('space_type', selectedType);
      formData.append('url', link);
      if (file) {
        formData.append('file', file);
      }
      mutation.mutate({
        authHeader,
        data: formData
      })
      console.log('im ahere', link, selectedType)
      setBtnText("Save");
      setLink('');
      setModal(false);
    } catch (err) {
      console.error(err);
      setBtnText('Try again');
    }
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleModalClose = () => {
    setModal(false);
    setSelectedType('');
    setBtnText('Next');
    setLink('');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  }

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
    setFileName(e.dataTransfer.files[0].name);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  }

  const handleDeleteModalOpen = (id) => {

    setDeleteModal(true);
    setSelectedForDelete(id);


  }

  const handleDeleteType = async () => {
    try {

      await deleteAdSpace({ authHeader, id: selectedForDelete });
      queryClient.invalidateQueries('loggedInUser');

      setSelectedForDelete('');
      setDeleteModal(false);
    } catch (err) {
      console.error(err);
    }
  }

  const sentLinkEdite = async () => {
    try {
      const ref = doc(usersCollection, userId);
      await updateDoc(ref, { adSpace: { link: editLink } });
      setEditModal(false);
    } catch (er) {
      console.error(er);
    }
  }

  return (
    <div className='mt-6'>
      {editModal && (
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-25">
          <div className="relative w-[80%]  md:w-1/3 mx-auto">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className='px-3 pt-3 rounded-full flex justify-end'
                onClick={() => setEditModal(false)}>
                <VscChromeClose className=' w-6 h-6 p-1 rounded-full text-red-500 bg-pink-200 cursor-pointer' />
              </div>
              <div className="relative p-2 md:p-6  flex-auto flex justify-center items-start">
                {data.addSpace && (
                  <div>
                    <div>
                      <h1 className='text-center mb-6 text-2xl md:text-3xl font-semibold'>Edit {data.addSpace.type} link</h1>
                      <h1 className='text-center my-3'>Lorem ipsum dolor sit amet co minus asperiores voluptatem!</h1>
                    </div>
                    <div>
                      <label>New {data.addSpace.type} Link</label>
                      <input
                        type="text"
                        required
                        value={editLink !== null ? editLink : (data.addSpace.link || '')}
                        placeholder={`Edit Link ${data.addSpace.link}`}
                        onChange={(e) => setEditLink(e.target.value)}
                        className='w-full border p-2 rounded-lg'
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center p-2 md:p-6 border-t border-solid gap-4 border-blue Gray-200 rounded-b">
                <button
                  className="bg-gray-600 w-44 text-white active:bg-gray-500 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => { setEditModal(false); setEditLink(''); }}
                >
                  <h1 className='text-xs md:text-sm'>
                    Cancel
                  </h1>
                </button>
                <button
                  className="bg-blue-700 w-44 text-white active:bg-blue-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={sentLinkEdite}
                  disabled={!editLink.startsWith('https://')}
                >
                  Edit {data.addSpace.type}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {deleteModal && (
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-25">
          <div className="relative w-[80%]  md:w-1/3 mx-auto">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className='px-3 pt-3 rounded-full flex justify-end'
                onClick={() => setDeleteModal(false)}>
                <VscChromeClose className=' w-6 h-6 p-1 rounded-full text-red-500 bg-pink-200' />
              </div>
              <div className="relative p-2 md:p-6  flex-auto flex justify-center items-start">
                <div>
                  <h1 className='text-center mb-6 text-2xl md:text-3xl font-semibold'>Are you sure you want to delete?</h1>
                  <h1 className='text-center my-3'>This action cannot be undone.</h1>
                </div>
              </div>
              <div className="flex items-center justify-center p-2 md:p-6 border-t border-solid gap-4 border-blue Gray-200 rounded-b">
                <button
                  className="bg-blue-700 text-white active:bg-blue-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setDeleteModal(false)}
                >
                  <h1 className='text-xs md:text-sm'>
                    Cancel
                  </h1>
                </button>
                <button
                  className="bg-red-700 text-white active:bg-red-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleDeleteType}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-25">
          <div className="relative w-[80%] md:w-1/3 mx-auto">
            <div className="flex flex-col w-full bg-white rounded-lg shadow-lg outline-none">
              <button onClick={handleModalClose} className='absolute top-3 right-3'>
                <VscChromeClose className='w-6 h-6 p-1 rounded-full text-red-500 bg-pink-200' />
              </button>
              <div className="p-10 my-10">
                <h1 className='mb-6 text-2xl font-semibold text-center'>
                  {selectedType ? 'Ad Space' : 'Select Space Type'}
                </h1>
                {/* <p className='text-center text-gray-500'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto itaque labore, provident molestias!
                </p> */}
                {!selectedType ? (
                  <div className='mt-6 flex flex-col space-y-5 p-1'>
                    <div className="flex   items-center ps-4 border border-blue-700 rounded-lg cursor-pointer" onClick={() => handleTypeSelect('Print')}>
                      <input
                        id="bordered-radio-1"
                        type="radio"
                        name="bordered-radio"
                        className="w-4 h-4 text-blue-600 bg-gray-100 accent-blue-700"
                      />
                      <div className='flex '>
                        <img src={printIcon} alt="magazine" className='w-6 m-auto ml-2' />
                        <label htmlFor="bordered-radio-1" className="w-full py-4 ms-2 text-sm font-medium text-blue-700">Print</label>
                      </div>
                    </div>
                    <div className="flex   items-center ps-4 border border-blue-700 rounded-lg cursor-pointer" onClick={() => handleTypeSelect('Transportation')}>
                      <input
                        id="bordered-radio-2"
                        type="radio"
                        name="bordered-radio"
                        className="w-4 h-4 text-blue-600 bg-gray-100 accent-blue-700"
                      />
                      <div className='flex'>
                        <img src={transIcon} alt="motorbike-helmet" className='w-6 m-auto ml-2' />
                        <label htmlFor="bordered-radio-2" className="w-full py-4 ms-2 text-sm font-medium text-blue-700">Transportation</label>
                      </div>
                    </div>
                    <div className="flex   items-center ps-4 border border-blue-700 rounded-lg cursor-pointer" onClick={() => handleTypeSelect('Event')}>
                      <input
                        id="bordered-radio-3"
                        type="radio"
                        name="bordered-radio"
                        className="w-4 h-4 text-blue-600 bg-gray-100 accent-blue-700"
                      />
                      <div className='flex'>
                        <img src={eventIcon} alt="today" className='w-6 m-auto ml-2' />
                        <label htmlFor="bordered-radio-3" className="w-full py-4 ms-2 text-sm font-medium text-blue-700">Event</label>
                      </div>
                    </div>
                    <div className="flex   items-center ps-4 border border-blue-700 rounded-lg cursor-pointer" onClick={() => handleTypeSelect('Other')}>
                      <input
                        id="bordered-radio-4"
                        type="radio"
                        name="bordered-radio"
                        className="w-4 h-4 text-blue-600 bg-gray-100 accent-blue-700"
                      />
                      <div className='flex'>
                        <img src={otherIcon} alt="connection-status-off" className='w-6 m-auto ml-2' />
                        <label htmlFor="bordered-radio-4" className="w-full py-4 ms-2 text-sm font-medium text-blue-700">Other</label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className='mt-6'>
                      <label className='mb-3 text-center block'>Your {selectedType} link</label>
                      <input
                        type="text"
                        placeholder={`https://...`}
                        className='w-full p-2 border rounded-lg'
                        value={link}
                        required
                        onChange={(e) => setLink(e.target.value)}
                      />
                    </div>
                    <div className='mt-6'>
                      <label className='mb-3 text-center block'>Your {selectedType} File</label>
                      {/* <input
                        type="file"
                        className='w-full p-2 border rounded-lg'
                        required
                        onChange={(e) => setLink(e.target.files[0])}
                      /> */}
                      <div
                        className={` h-40 rounded-2xl border-2 border-dashed border-blue-600 flex items-center justify-center ${fileName && 'border-green-600'}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        <label htmlFor="file" className="cursor-pointer text-center p-4 md:p-8">
                          <svg className={`w-10 h-10 mx-auto ${fileName ? 'stroke-green-600' : 'stroke-blue-600'}`} viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.1667 26.6667C8.48477 26.6667 5.5 23.6819 5.5 20C5.5 16.8216 7.72428 14.1627 10.7012 13.4949C10.5695 12.9066 10.5 12.2947 10.5 11.6667C10.5 7.0643 14.231 3.33334 18.8333 3.33334C22.8655 3.33334 26.2288 6.19709 27.0003 10.0016C27.0556 10.0006 27.1111 10 27.1667 10C31.769 10 35.5 13.731 35.5 18.3333C35.5 22.3649 32.6371 25.7279 28.8333 26.5M25.5 21.6667L20.5 16.6667M20.5 16.6667L15.5 21.6667M20.5 16.6667L20.5 36.6667" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="mt-3 text-gray-700 max-w-xs mx-auto">
                            {fileName ? fileName : 'Click to '}
                            <span className={`font-medium ${fileName ? 'text-green-600' : 'text-blue-600'}`}>
                              {fileName ? '' : 'Upload your file'}
                            </span>
                          </p>
                        </label>
                        <input id="file" type="file" className="hidden"
                          onChange={handleFileChange} />
                      </div>
                    </div>
                    <div className="flex justify-center p-6 border-t border-solid border-blue-200 rounded-b">
                      <button
                        onClick={handleModalClose}
                        className="mr-3 px-8 py-3 text-xs font-bold text-white uppercase rounded bg-gray-400 hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSend}
                        className={`px-8 py-3 text-xs font-bold text-white uppercase rounded bg-blue-700 hover:bg-blue-600`}

                      >
                        {btnText}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='flex justify-between border-b-2 py-3'>
        <p className='font-bold'>Ad Space</p>
        {/* {data.addSpace && Object.keys(data.addSpace).length > 0 ? null : ( */}
        <AuthenticatedUserViewPermission>

          <button
            onClick={() => {
              setModal(true);
              setSelectedType('');
            }}
            className='px-2 py-0.5 text-blue-700 border-2 border-blue-700 rounded-lg active:border-blue-800 active:text-blue-800'
          >
            + Add Space
          </button>
        </AuthenticatedUserViewPermission>
        {/* )} */}
      </div>
      <div className='py-3 border-b-2 space-y-3'>
        {adSpaces && adSpaces.length > 0 ? adSpaces.map((adSpace) => (
          <div className='flex justify-between px-3' key={adSpace.id}>
            <div className='w-full flex space-x-5'>
              <img src={
                adSpace.space_type === 'Event' ? eventIcon :
                  adSpace.space_type === 'Transportation' ? transIcon :
                    adSpace.space_type === 'Print' ? printIcon :
                      adSpace.space_type === 'Other' ? otherIcon : null
              } alt={adSpace.space_type} className='w-6 mr-2' />
              <h1>{adSpace.space_type}</h1>
              {adSpace.url && <a href={adSpace.url} target='_blank' rel='noopener noreferrer'><FaLink /></a>}
              {adSpace.file && <a href={adSpace.file} target='_blank' rel='noopener noreferrer'><FaFileDownload /></a>}
            </div>
            <AuthenticatedUserViewPermission>
              <div className='flex gap-3'>
                {/* <MdModeEditOutline className='text-gray-600 w-6 h-6' onClick={() => setEditModal(true)} /> */}
                <button onClick={() => handleDeleteModalOpen(adSpace.id)}>
                  <img src={deleteIcon} alt='delete icon' className='text-red-600 hover:shadow-sm active:text-red-700 w-6 h-6 cursor-pointer' />
                </button>
              </div>
            </AuthenticatedUserViewPermission>
          </div>
        )) : (
          <p className='text-center font-semibold text-gray-400'>Empty Ad Space</p>
        )}

      </div>
    </div>
  );
};
