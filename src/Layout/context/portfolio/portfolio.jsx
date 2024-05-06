import React, { useCallback, useEffect, useState } from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import { VscChromeClose, VscEmptyWindow } from "react-icons/vsc";
import { auth, db, deletePortfolioFirebase, savePortfolioFirebase } from '../../../firebase/firebase'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore';
import { MdDelete } from "react-icons/md";

const Portfolio = () => {
  const [modal, setModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('')
  const [errorMessageTitle, setErrorMessageTitle] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [viewModal, setViewModal] = useState();
  const [selectPortfolio, setSeletPortfolio] = useState();
  const [Id, setId] = useState()
  const [IsHoverdelete, setIhoverdelete] = useState(false);
  const [deleteSelect, setDeleteSelect] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [checkId, setCheckId] = useState([])

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null)
      }
    })

    return () => unsubscribe()
  }, [userId])

  const fetchPortfolios = useCallback(async () => {
    try {
      const portfoliosRef = collection(db, 'portfolio', userId, "portfolios");
      const snapshot = await getDocs(portfoliosRef);
      const portfolioData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPortfolios(portfolioData);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    }
  }, [userId])

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);


  const handleNextButton = async () => {
    if (title.length === 0) {
      setErrorMessageTitle(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    const datas = {
      portfolioTitle: title,
      portfolioId: Id,
      userId: userId,
      startDate: new Date(),
    };
    try {
      await savePortfolioFirebase(userId, Id, datas);
      setLoading(false);
      navigate(`/${title}/portfolio/${userId}/${Id}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const generateID = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%#!)_=+-';
      let id = '';
      for (let i = 0; i < 12; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      setId(id)
    };

    generateID()
  }, [])

  const handleViewModalOpen = (selectId) => {
    const selectedPortfolio = portfolios.find(portfolio => portfolio.id === selectId);
    if (selectedPortfolio) {
      setSeletPortfolio([selectedPortfolio]);
      setViewModal(true);
    }
  }

  const handleDeletePortfolio = async (portfolioId) => {
    try {
      await deletePortfolioFirebase(userId, portfolioId);
      const updatedPortfolios = portfolios.filter(portfolio => portfolio.id !== portfolioId);
      setPortfolios(updatedPortfolios);
      setViewModal(false);

      const updatedCheckIds = checkId.filter(id => id !== portfolioId);
      setCheckId(updatedCheckIds);
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    }
  }

  const handleDeletePortfolioOutside = async () => {
    try {
      for (const portfolioId of checkId) {
        await deletePortfolioFirebase(userId, portfolioId);
      }
      setCheckId([]);
      setDeleteModal(false);
      setDeleteSelect(false);
      fetchPortfolios()
    } catch (error) {
      console.error('Error deleting portfolios:', error);
    }
  }

  return (
    <div>
      {deleteModal && (
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-20">
          <div className="relative w-[80%]  md:w-1/3 mx-auto">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className='px-3 pt-3 rounded-full flex justify-end' onClick={() => setDeleteModal(false)}>
                <VscChromeClose className=' w-6 h-6 p-1 rounded-full text-white bg-gray-400 cursor-pointer' />
              </div>
              <div className="relative p-2 md:p-6  flex-auto flex justify-center items-start">
                <div>
                  <h1 className='text-center mb-6 text-2xl md:text-3xl font-semibold'>Are you sure to Delete?</h1>
                  <h1 className='text-center my-3'>This action will not be reverse-able to make sure to do this delete action.</h1>
                </div>
              </div>
              <div>
              </div>
              <div className="flex items-center justify-center p-2 md:p-6 border-t border-solid gap-4 border-blue Gray-200 rounded-b">
                <button
                  className="bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => {
                    setDeleteModal(false);
                    setDeleteSelect(false);
                  }}
                >
                  <h1 className='text-xs md:text-sm'>
                    Cansel
                  </h1>
                </button>
                <button
                  className="bg-red-700 text-white active:bg-red-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleDeletePortfolioOutside}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {modal && (
        <div>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none bg-black bg-opacity-25 focus:outline-none">
            <div className="relative w-[80%]  md:w-1/3 mx-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className='px-3 pt-3 rounded-full flex justify-end'
                  onClick={() => setModal(false)}>
                  <VscChromeClose className=' w-6 h-6 p-1 rounded-full text-white bg-gray-700 hover:bg-opacity-75 cursor-pointer' />
                </div>
                <div className="relative p-2 md:p-6 justify-center items-start">
                  <div className='border-b'>
                    <h1 className='text-center mb-6 text-2xl md:text-3xl font-semibold'>Add new portfolio</h1>
                  </div>
                  <div className='pt-2'>
                    <div className="">
                      <p className='pl-1'>Name</p>
                      <p className='px-1 pb-1 text-sm text-gray-500'>This is will be the title of your portfolio</p>
                      <input type="text"
                        placeholder='Writing portfolio name'
                        className={`w-full p-2 border rounded-lg ${errorMessageTitle ? "border-red-600" : ""}`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      {errorMessageTitle && <p className='text-red-600'>Please enter title</p>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-2 md:p-6 border-t border-solid gap-4 border-blue Gray-200 rounded-b">
                  <button
                    className="bg-gray-700 text-white active:bg-gray-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setModal(false)}
                  >
                    <h1 className='text-xs md:text-sm'>
                      Cansel
                    </h1>
                  </button>
                  <button
                    className="bg-blue-700 text-white active:bg-red-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleNextButton}
                  >
                    {loading ? "Loading..." : "Next"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {viewModal && (
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none bg-black bg-opacity-25 focus:outline-none">
          <div className="relative w-[80%]  md:w-1/3 mx-auto">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className='flex justify-between flex-row-reverse p-3'>
                <div onClick={() => setViewModal(false)}>
                  <VscChromeClose className='w-6 h-6 bg-gray-500 cursor-pointer hover:opacity-75 text-white rounded-full p-1' />
                </div>
                <div>
                  <MdDelete className='w-6 h-6 hover:opacity-75 text-red-600 cursor-pointer'
                    onClick={() => handleDeletePortfolio(selectPortfolio[0].id)}
                  />
                </div>
              </div>
              <div className="relative p-2 md:p-6 justify-center items-start">
                {selectPortfolio.map((portfolio) => (
                  <div key={portfolio.id}>
                    <div className='border-b'>
                      <h1 className='text-center mb-6 text-2xl md:text-3xl font-semibold'>{portfolio.portfolioTitle}</h1>
                    </div>
                    <div className='pt-2'>
                      <div>
                        <img src={portfolio.image} alt="" className='h-96 w-full object-cover' />
                      </div>
                      {portfolio.image1 && <img src={portfolio.image1} alt="" className='h-96 w-full object-cover' />}
                      <div>
                        <p className='text-center p-1'>{portfolio.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='border rounded-xl my-4 p-4'>
        <div className='flex justify-between border-b pb-4'>
          <div className='text-2xl font-semibold px-3'>
            {deleteSelect ?
              <div className='flex'>
                <h1>Delete Portfolio</h1>
              </div>
              :
              <h1>Portfolio</h1>
            }
          </div>
          {deleteSelect ?
            <div className=''>
              <button className='mr-2 w-40 border-gray-800 text-gray-800 p-2 border-2 rounded-lg hover:border-black hover:text-black'
                onClick={() => setDeleteSelect(false)}
              >
                Cancel
              </button>
              <button className='w-40 bg-red-500 p-2 border-red-600 border-2 rounded-lg text-white hover:border-red-700 hover:bg-red-600'
                onClick={() => setDeleteModal(true)}
              >
                Delete
              </button>
            </div>
            :
            <div className='flex flex-coll gap-3'>
              <div className='m-auto cursor-pointer'>
                {portfolios.length === 0 ? null : (
                  <MdDelete className='w-6 h-6'
                    onMouseLeave={() => setIhoverdelete(false)}
                    onMouseEnter={() => setIhoverdelete(true)}
                    onClick={() => setDeleteSelect(true)}
                  />
                )}
              </div>
              <div>
                <p className={`absolute text-sm bg-gray-50 border rounded-ls shadow p-2 -mt-11 -ml-9 ${isHovered ? '' : 'hidden'}`}>Add Portfolio</p>
                {portfolios.length === 6 ? null : (
                  <IoIosAddCircleOutline className='w-8 h-8 mr-1.5 cursor-pointer'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => setModal(true)}
                  />
                )}
              </div>
            </div>
          }
        </div>
        <div>
          {deleteSelect &&
            <div className='flex justify-center'>
              <p className=' font-normal mt-2.5'>Select the portfolio you want to delete</p>
            </div>
          }
          <div className='flex'>
            {portfolios.length > 0 ? (
              portfolios.map(portfolio => (
                <div>
                  {deleteSelect &&
                    <div className='flex justify-center mt-2'>
                      <input type="checkbox"
                        className='w-4 h-4 cursor-pointer'
                        onChange={(e) => {
                          const checkedId = e.target.value;
                          if (e.target.checked) {
                            setCheckId(prevState => [...prevState, checkedId]);
                          } else {
                            const updatedCheckIds = checkId.filter(id => id !== checkedId);
                            setCheckId(updatedCheckIds);
                          }
                        }}
                        value={portfolio.id}
                        checked={checkId.includes(portfolio.id)}
                      />
                    </div>
                  }
                  <div className='p-1 border rounded-lg bg-blue-50 border-blue-400 m-2 cursor-pointer'
                    onClick={() => deleteSelect ? null : handleViewModalOpen(portfolio.id)}
                  >
                    <div key={portfolio.id}>
                      <h1 className='font-semibold text-sm text-center'>{portfolio.portfolioTitle}</h1>
                      <img src={portfolio.image} alt={portfolio.portfolioTitle} className='w-44 h-56 object-cover rounded-lg' />
                      <p className={`text-gray-500 text-sm text-center ${portfolio.description?.length > 24 ? "cursor-pointer" : ""}`}>
                        {portfolio.description?.slice(0, 24)}{portfolio.description?.length > 24 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='m-auto text-center py-3'>
                <h1 className='text-gray-500 font-semibold text-sm'>Empty portfolio</h1>
                <p className='text-gray-500 text-sm'>You haven't added a portfolio yet! Please <span onClick={() => setModal(true)} className='text-blue-700 font-semibold text-sm hover:text-blue-800 hover:border-b border-gray-400 cursor-pointer'>add portfolio</span></p>
                <VscEmptyWindow className='w-32 h-32 text-gray-300 m-auto' />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio;
