import React, { useEffect, useState } from 'react';
import { FaBullhorn, FaDesktop, FaUsers } from 'react-icons/fa';
import RegularCard from '../../components/ChildAdmin/RegularCard';
import BasicLineChart from '../../components/ChildAdmin/Analytics/BasicLineChart';
import LoadingSkeleton from '../../components/ChildAdmin/LoadingSkeleton';
import { useAdmin } from '../../Context/AdminContext';

const Accounts = () => {
    const [accountData, setAccountData] = useState(null);
    const [selectedOption, setSelectedOption] = useState('all'); // State to track dropdown selection
    const { chartDashboardData } = useAdmin();
    useEffect(() => {
        chartDashboardData("accounts",selectedOption) // Fetch data based on the selected option
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
                <h1 className='text-2xl font-semibold my-2'>Accounts Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
                    <RegularCard
                        data={{
                            icon: FaUsers,
                            bgColor: '#2ca907a8',
                            heading: 'Total Accounts',
                            para: accountData.totalAccountNums
                        }}
                    />
                    <RegularCard
                        data={{
                            icon: FaBullhorn,
                            bgColor: '#c99d289e',
                            heading: 'Total Advertisers',
                            para: accountData.totalAdvertiserNums
                        }}
                    />
                    <RegularCard
                        data={{
                            icon: FaDesktop,
                            bgColor: '#0428f28f',
                            heading: 'Total AdHosts',
                            para: accountData.totalSpaceHostNums
                        }}
                    />
                </div>
                <div className="my-4">
                    <div className="flex justify-between items-center">
                        <h3 className='text-xl font-semibold'>Statistic Reports</h3>
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
                        <div className="p-4">
                            <h2 className='text-lg ms-3 font-semibold'>
                                All Accounts
                            </h2>
                            <BasicLineChart data={accountData.totalAccounts} />
                        </div>
                        <div className="p-4">
                            <h2 className='text-lg ms-3 font-semibold'>
                                Advertiser Accounts
                            </h2>
                            <BasicLineChart data={accountData.advertisersAccounts} />
                        </div>
                        <div className="p-4">
                            <h2 className='text-lg ms-3 font-semibold'>
                                AddHosts Accounts
                            </h2>
                            <BasicLineChart data={accountData.adHostsAccounts} />
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <LoadingSkeleton />
        )
    );
};

export default Accounts;
