import React, { useEffect, useState } from 'react'
import { FaBullhorn, FaDesktop, FaUsers, FaEnvelope } from 'react-icons/fa';
import RegularCard from '../../components/ChildAdmin/RegularCard';
import RoundedBarChart from '../../components/ChildAdmin/Analytics/RoundedBarChart';
import { useAdmin } from '../../Context/AdminContext';
import LoadingSkeleton from '../../components/ChildAdmin/LoadingSkeleton';

const Messages = () => {
    const [accountData, setAccountData] = useState(null);
    const [selectedOption, setSelectedOption] = useState('monthly'); // State to track dropdown selection
    const { chartDashboardData } = useAdmin();

    useEffect(() => {
        chartDashboardData("messages",selectedOption) // Fetch data based on the selected option
            .then((res) => {
                console.log("Data from Response is :", res.data);
                setAccountData(res.data);
            })
            .catch((err) => {
                console.log("Error :", err);
            });
    }, [selectedOption]); // Refetch data whenever the selected option changes

    

      
  return (

    accountData ? (
         <div>
            <h1 className='text-2xl font-semibold my-2'>Messages Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
                <RegularCard
                    data={{
                        icon: FaEnvelope,
                        bgColor: '#2ca907a8',
                        heading: 'Total Messages',
                        para: accountData.totalMessageNums
                    }}
                />
                <RegularCard
                    data={{
                        icon: FaBullhorn,
                        bgColor: '#c99d289e',
                        heading: 'Advertisers Messages',
                        para: accountData.totalAdvertiserMessages
                    }}
                />
                <RegularCard
                    data={{
                        icon: FaDesktop,
                        bgColor: '#0428f28f',
                        heading: 'AdHosts Messages',
                        para: accountData.totalSpaceHostMessages
                    }}
                />
            </div>
            <div className="my-4">
                <div className="flex justify-between items-center">
                    <h3 className='text-xl font-semibold'>Messages Reports</h3>
                    <select
                            className="border border-gray-100 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={selectedOption} // Bind the state to the dropdown
                            onChange={(e) => setSelectedOption(e.target.value)} // Update state on change
                        >
                            <option value="all">All</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                </div>
            </div>
            <div className="my-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 my-4">
                    <div className="p-4 ">
                        <h2 className='text-lg ms-3 font-semibold'>
                            All Messages
                        </h2>
                        <RoundedBarChart data={accountData.totalMessages} />
                    </div>
                    <div className="p-4 ">
                        <h2 className='text-lg ms-3 font-semibold'>
                            Advertisers Messages
                        </h2>
                        <RoundedBarChart data={accountData.advertiserMessages} />
                    </div>
                    <div className="p-4 ">
                        <h2 className='text-lg ms-3 font-semibold'>
                            AddHosts Messages
                        </h2>
                        <RoundedBarChart data={accountData.spaceHostMessages} />
                    </div>
                </div>
            </div>
        </div>
    ):
    (
    <LoadingSkeleton />
    )

  )
}

export default Messages