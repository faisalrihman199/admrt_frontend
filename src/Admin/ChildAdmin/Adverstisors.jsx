import React, { useEffect, useState } from 'react'
import { FaBullhorn, FaDesktop, FaStore, FaBoxes } from 'react-icons/fa';
import RegularCard from '../../components/ChildAdmin/RegularCard';
import TableView from '../../components/ChildAdmin/TableView';
import Pagination from '../../components/ChildAdmin/Pagination';
import LoadingSkeleton from '../../components/ChildAdmin/LoadingSkeleton';
import { useAdmin } from '../../Context/AdminContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const Adverstisors = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { tableDashboardData, deleteUser } = useAdmin();
    const [pageData, setPageData] = useState(null);
    const [change, setChange] = useState(false);

    const [searchValue, setSearchValue] = useState("");
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const navigate = useNavigate()
    const handleEdit = (id) => {
        console.log("Edit this Advertiser :", id);
        navigate(`/profile/user/${id}`)
    }
    const handleDelete = (id) => {
        deleteUser(id)
            .then((res) => {
                toast.success(res.message)
                setChange(!change)
            })
            .catch((err) => {
                toast.error("Error while deleting Advertiser")
                console.log("Error :", err);
            })
    }
    const headNames = ['Sr No', 'Full Name', 'Products ', 'Action'];
    useEffect(() => {
        tableDashboardData("admin/advertisers", currentPage,searchValue)
            .then((res) => {
                setPageData(res.data);
                setCurrentPage(res.data.current_page);
                setTotalPages(res.data.total_pages);

            })
            .catch((err) => {
                console.log("Error :", err);
            })
    }, [currentPage, change]);
    
    

    return (
        pageData ?
            (
                <div>
                    <div className="flex justify-between items-center">
                    <h1 className='text-2xl font-semibold my-2'>Advertisers Dashboard</h1>
                    <Link to="/admin/advertiser/registration" >Add Advertiser</Link>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
                        <RegularCard
                            data={{
                                icon: FaBullhorn,
                                bgColor: '#2ca907a8',
                                heading: 'Total Advertisers',
                                para: pageData.total_advertisers
                            }}
                        />
                        <RegularCard
                            data={{
                                icon: FaStore,

                                bgColor: '#0428f28f',
                                heading: 'Total Products',
                                para: pageData.total_products
                            }}
                        />
                        {
                            pageData.top_advertiser &&
                            <RegularCard
                                data={{
                                    icon: FaBoxes,
                                    bgColor: '#c99d289e',
                                    heading: 'Top Advertiser',
                                    para: `${pageData.top_advertiser.full_name} | ${pageData.top_advertiser.product_count}`
                                }}
                            />
                        }
                    </div>
                    <div className="my-1 mt-5">
                        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                            <h3 className="text-xl font-semibold">Advertisers List</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="rounded-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-5 pl-3 flex items-center " onClick={()=>{setChange(!change)}} style={{cursor:'pointer'}} >
                                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>


                    </div>
                    {
                        pageData?.advertisers.length > 0 ?
                            <div className="my-1">
                                <TableView rows={pageData.advertisers} headNames={headNames} handleDelete={handleDelete} handleEdit={handleEdit} />
                            </div>
                            :
                            <h1>NO Advertiser Record Found</h1>
                    }
                    <div className="my-4">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                </div>
            )
            :
            <LoadingSkeleton />
    )
}

export default Adverstisors