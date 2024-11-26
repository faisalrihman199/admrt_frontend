import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaLink, FaEyeSlash } from 'react-icons/fa';
import RegularCard from '../../components/ChildAdmin/RegularCard';
import TableView from '../../components/ChildAdmin/TableView';
import Pagination from '../../components/ChildAdmin/Pagination';
import { useAdmin } from '../../Context/AdminContext';
import LoadingSkeleton from '../../components/ChildAdmin/LoadingSkeleton';
import { toast } from 'react-toastify';

const AffiliateLinks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const headNames = ['Sr No', 'Link', 'Visits', 'Action'];
  const appUrl=process.env.REACT_APP_API_URL

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [newLink, setNewLink] = React.useState('');
  const { addAffiliateLink, tableDashboardData,deleteAffiliateLink } = useAdmin();
  const [pageData, setPageData] = useState(null);
  const [linked, setLinked] = useState(false);
  const [edit,setEdit]=useState(null);
  const handleAddLink = () => {
    if (newLink) {
      let data = {
        url: newLink
      }
      if(edit){
        data.id=edit;
      }
      addAffiliateLink(data)
        .then((res) => {
          setNewLink('');
          setModalOpen(false);
          setEdit(null);
          setLinked(!linked);
          toast.success(res.message)
        })
        .catch((err) => {
          toast.error(err.message)
          console.log("Error :", err);
        })
    }
    
  };
  const getPathById = (id) => {
    const baseUrl = "https://admrt.com/";
    const link = pageData.links.find(link => link.id === id);
    
    if (link) {
        // Extracting the path after the base URL
        const path = link.url.replace(baseUrl, "");
        return path;
    } else {
        return null; // or handle the case where the ID is not found
    }
};
  const handleEdit = (id) => {
    console.log("Edit this Link :", id);
    setEdit(id);
    setNewLink(getPathById(id));
    setModalOpen(true);
  }
  const handleDelete = (id) => {
    deleteAffiliateLink(id)
    .then((res)=>{
      console.log("Response to delete Link :", res);
      setLinked(!linked)
      toast.success(res.message)
      
    })
    .catch((err)=>{
      toast.error(err.message)

      console.log("Error :", err);
      
    })
    console.log("Delete this Link :", id);
  }
  useEffect(() => {
    tableDashboardData("affliate", currentPage)
      .then((res) => {
        setPageData(res.data);
        setCurrentPage(res.data.current_page);
        setTotalPages(res.data.total_pages);

      })
      .catch((err) => {
        console.log("Error :", err);
      })
  }, [currentPage, linked])

  return (
    pageData ?
      (
        <div>
          <h1 className='text-2xl font-semibold my-2'>Advertiser Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
            <RegularCard
              data={{
                icon: FaLink,
                bgColor: '#0428f28f',
                heading: 'Total Affiliated Links',
                para: pageData.total_links
              }}
            />
            <RegularCard
              data={{
                icon: FaCheckCircle,
                bgColor: '#2ca907a8',
                heading: 'Visited Links',
                para: pageData.visited_links_count
              }}
            />
            <RegularCard
              data={{
                icon: FaEyeSlash,
                bgColor: '#b80000db',
                heading: 'Non Visited',
                para: pageData.unvisited_links_count
              }}
            />
          </div>
          <div className="my-4 mt-5">
            <div className="flex justify-between items-center">
              <h3 className='text-xl font-semibold'>Advertisers List</h3>
              <button
                className='btn rounded font-semibold p-2'
                style={{ background: 'linear-gradient(to right, #0a1e68, #153795)', color: 'white' }}
                onClick={() => setModalOpen(true)}
              >
                Add New Link
              </button>
            </div>
          </div>
          {
            pageData.links?.length>0 ?
          <div className="my-4">
            <TableView rows={pageData.links} headNames={headNames} handleEdit={handleEdit} handleDelete={handleDelete} />
          </div>
          :
          <h1>No adHost Record Found</h1>
          }
          <div className="my-4">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>

          {/* Modal for Adding New Link */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-5 rounded shadow-lg w-80">
                <h2 className="text-lg font-semibold mb-4">Add New Link</h2>
                <div className="mb-4">
                  <label className="block mb-2">Link</label>
                  <input
                    type="text"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    className="border rounded p-2 w-full"
                    placeholder="Enter your link"
                  />
                  <span className="text-gray-500">{`Prefix will be added: ${appUrl?appUrl:'https://www.admrt.com'}?referal=`}</span>
                </div>
                <button
                  className="btn rounded font-semibold p-2 w-full"
                  style={{ background: 'linear-gradient(to right, #0a1e68, #153795)', color: 'white' }}
                  onClick={handleAddLink}
                >
                  Add Link
                </button>
                <button
                  className="mt-2 text-gray-500 hover:text-red-500"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )
      :
      <LoadingSkeleton />
  );
};

export default AffiliateLinks;
