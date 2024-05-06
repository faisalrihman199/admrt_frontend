import React, { useEffect, useState } from 'react'
import { VscChromeClose, VscEmptyWindow } from "react-icons/vsc";
import { db } from '../../firebase/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom'

const Portfolio = () => {
    const {userUID} = useParams();
    const [portfolios, setPortfolios] = useState([]);
    const [viewModal, setViewModal] = useState();
    const [selectPortfolio, setSeletPortfolio] = useState();

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const portfoliosRef = collection(db, `portfolio/${userUID}/portfolios`);
                const snapshot = await getDocs(portfoliosRef);
                const portfolioData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPortfolios(portfolioData);
            } catch (error) {
                console.error('Error fetching portfolios:', error);
            }
        };
    
        fetchPortfolios();
    }, [userUID]);
    
    const handleViewModalOpen = (selectId) => {
        const selectedPortfolio = portfolios.find(portfolio => portfolio.id === selectId);
        if (selectedPortfolio) {
            setSeletPortfolio([selectedPortfolio]);
            setViewModal(true);
        }
    }

    return (
        <div>
            {viewModal && (
                <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none bg-black bg-opacity-25 focus:outline-none">
                    <div className="relative w-[80%]  md:w-1/3 mx-auto">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className='flex justify-between flex-row-reverse p-3'>
                                <div onClick={() => setViewModal(false)}>
                                    <VscChromeClose className='w-6 h-6 bg-gray-500 cursor-pointer hover:opacity-75 text-white rounded-full p-1' />
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
                        <h1>Portfolio</h1>
                    </div>
                </div>
                <div className='flex'>
                    {portfolios.length > 0 ? (
                        portfolios.map(portfolio => (
                            <div className='p-1 border rounded-lg bg-blue-50 border-blue-400 m-2 cursor-pointer'
                                onClick={() => handleViewModalOpen(portfolio.id)}
                            >
                                <div key={portfolio.id}>
                                    <h1 className='font-semibold text-sm text-center'>{portfolio.portfolioTitle}</h1>
                                    <img src={portfolio.image} alt="" className='w-44 h-56 object-cover rounded-lg' />
                                    <p className={`text-gray-500 text-sm text-center ${portfolio.description?.length > 24 ? "cursor-pointer" : ""}`}>
                                        {portfolio.description?.slice(0, 24)}{portfolio.description?.length > 24 ? '...' : ''}
                                    </p>

                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='m-auto text-center py-3'>
                            <h1 className='text-gray-500 font-semibold text-sm'>Empty portfolio</h1>
                            <p className='text-gray-500 text-sm'>User haven't added a portfolio!</p>
                            <VscEmptyWindow className='w-32 h-32 text-gray-300 m-auto' />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Portfolio;
