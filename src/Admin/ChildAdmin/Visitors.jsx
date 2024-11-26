import React, { useEffect, useState } from 'react'

import { FaGlobe, FaLink, FaUsers } from 'react-icons/fa';
import RegularCard from '../../components/ChildAdmin/RegularCard';
import RoundedBarChart from '../../components/ChildAdmin/Analytics/RoundedBarChart';
import SecondPieChart from '../../components/ChildAdmin/Analytics/SecondPieChart';
import { useAdmin } from '../../Context/AdminContext';
import LoadingSkeleton from '../../components/ChildAdmin/LoadingSkeleton';

const Visitors = () => {
    const [accountData, setAccountData] = useState(null);
    const [selectedOption, setSelectedOption] = useState('all'); // State to track dropdown selection
    const { visitorDashboard } = useAdmin();
    useEffect(() => {
        visitorDashboard(selectedOption) 
            .then((res) => {
                console.log("Data from Response is :", res.data);
                setAccountData(res.data);
            })
            .catch((err) => {
                console.log("Error :", err);
            });
    }, [selectedOption]); // Refetch data whenever the selected option changes

    const totalMessagesData = [
        { name: '2015', value: 4000 },
        { name: '2016', value: 4500 },
        { name: '2017', value: 5000 },
        { name: '2018', value: 5500 },
        { name: '2019', value: 6000 },
        { name: '2020', value: 6500 },
        { name: '2021', value: 7000 },
        { name: '2022', value: 7500 },
        { name: '2023', value: 8000 },
        { name: '2024', value: 8500 },
      ];
      
      // Dummy data for advertisers' messages (10 years)
      const advertisersMessagesData = [
        { name: '2015', value: 2000 },
        { name: '2016', value: 2300 },
        { name: '2017', value: 2700 },
        { name: '2018', value: 50 },
        { name: '2019', value: 3200 },
        { name: '2020', value: 3500 },
        { name: '2021', value: 3800 },
        { name: '2022', value: 4000 },
        { name: '2023', value: 4300 },
        { name: '2024', value: 4500 },
      ];
      
      // Dummy data for ad hosts' messages (10 years)
      const adHostsMessagesData = [
        { name: '2015', value: 1000 },
        { name: '2016', value: 1200 },
        { name: '2017', value: 1500 },
        { name: '2018', value: 1800 },
        { name: '2019', value: 2000 },
        { name: '2020', value: 2200 },
        { name: '2021', value: 2400 },
        { name: '2022', value: 2600 },
        { name: '2023', value: 2800 },
        { name: '2024', value: 3000 },
      ];
      
  return (
        accountData ?
        <div>
            <h1 className='text-2xl font-semibold my-2'>Visitors Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
                <RegularCard
                    data={{
                        icon: FaGlobe,
                        bgColor: '#2ca907a8',
                        heading: 'Total Visitors',
                        para: accountData.totalVisitors
                    }}
                />
                <RegularCard
                    data={{
                        icon: FaLink,
                        
                        bgColor: '#0428f28f',
                        heading: 'Affiliated Visitos',
                        para: accountData.totalAffiliateVisitors
                    }}
                />
                <RegularCard
                    data={{
                        icon: FaUsers,
                        bgColor: '#c99d289e',
                        heading: 'Other Users',
                        para: accountData.totalSiteVisitors
                    }}
                />
            </div>
            <div className="my-5">
                <div className="flex justify-between items-center">
                    <h3 className='text-xl font-semibold'>Visitors Report</h3>
                    <select
                            className="border border-gray-100 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={selectedOption} // Bind the state to the dropdown
                            onChange={(e) => setSelectedOption(e.target.value)}
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
                            All Visitors
                        </h2>
                        <RoundedBarChart data={accountData.combinedVisitors} />
                    </div>
                    <div className="p-4 ">
                        <h2 className='text-lg ms-3 font-semibold'>
                            All Stats
                        </h2>
                        <SecondPieChart data={accountData.chartData} />
                    </div>
                    
                </div>
            </div>
        </div>
        :
        <LoadingSkeleton />
  )
}

export default Visitors