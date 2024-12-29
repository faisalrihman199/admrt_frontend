import React, { useCallback, useEffect, useState } from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import { VscChromeClose, VscEmptyWindow } from "react-icons/vsc";
import { auth, db, deletePortfolioFirebase, savePortfolioFirebase } from '../../../firebase/firebase'
import { useLocation, useNavigate } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore';
import { MdDelete, MdOutlineDeleteForever } from "react-icons/md";
import ReactPlayer from 'react-player';
import { CarouselWithContent } from '../../../components/Carousel/CarouselWithContent';
import { Modal } from '../../../components/Modal/Modal';
import { FaTrash } from 'react-icons/fa';
import { Button, IconButton } from '@material-tailwind/react';
import { deletePortfolio, updateProfileWithFile } from '../../../service/profile';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import AuthenticatedUserViewPermission from '../../../components/Permissions/AuthenticatedUserViewPermission';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';


const Portfolio = ({ userPortfolios }) => {
  const [modal, setModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('')
  const [errorMessageTitle, setErrorMessageTitle] = useState(false);
  const [errorMessageDescription, setErrorMessageDescription] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [viewModal, setViewModal] = useState();
  const [selectPortfolio, setSeletPortfolio] = useState();
  const [Id, setId] = useState()
  const [IsHoverdelete, setIhoverdelete] = useState(false);
  const [deleteSelect, setDeleteSelect] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [checkId, setCheckId] = useState([])
  const [description, setDescription] = useState('')
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openItemImage, setOpenItemImage] = useState(false);
  const [portfolioType, setPortfolioType] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [errorYoutubeLink, setErrorYoutubeLink] = useState('');
  const [userPortfoliosImages, setUserPortfoliosImages] = useState([]);

  const authHeader = useAuthHeader()
  const handleExpandItemImages = (product) => {
    setSelectedProduct(product);
    setOpenItemImage(true);
  };

  const ExpandItemImagesClose = () => {
    setOpenItemImage(false);
  };

  // const handleNextButton = async () => {
  //   if (title.length === 0) {
  //     setErrorMessageTitle(true);
  //     setLoading(false);
  //     return;
  //   }

  //   setLoading(true);
  //   const datas = {
  //     portfolioTitle: title,
  //     portfolioId: Id,
  //     userId: userId,
  //     startDate: new Date(),
  //   };
  //   try {
  //     setLoading(false);
  //     // navigate(`/portfolio/add/${title}`);
  //     navigate(`/mediaUpload/portfolio`, { state: { title: title, description: description, module: 'portfolio' } });
  //   } catch (error) {
  //     console.error(error);
  //     setLoading(false);
  //   }
  // };

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
  const productData = [
    {
      id: 1,
      name: 'Portfolio 1',
      description: 'Introducing our latest model, the Turbo X7. This car is the epitome of luxury and performance. It features a sleek, aerodynamic design with a glossy black finish that exudes elegance and sophistication. The Turbo X7 is powered by a 3.0L V6 engine that delivers an impressive 400 horsepower, ensuring a smooth and powerful drive. The interior is just as impressive, with leather seats, a state-of-the-art infotainment system, and a panoramic sunroof that offers stunning views. Safety features include adaptive cruise control, lane keep assist, and a rearview camera. Experience the perfect blend of luxury, comfort, and performance with the Turbo X7.',
      price: 100,
      images: ['https://picsum.photos/200/300', 'https://picsum.photos/id/237/200/300']
    },
    {
      id: 2,
      name: 'Portfolio 2',
      description: 'This is product 2',
      price: 200,
      youtube_url: 'https://www.youtube.com/watch?v=dyXScuEoGrE',
      images: ['https://picsum.photos/id/237/200/300', 'https://picsum.photos/id/237/200/300']

    },
  ];
  const handleViewModalOpen = (selectId) => {
    const selectedPortfolio = portfolios.find(portfolio => portfolio.id === selectId);
    if (selectedPortfolio) {
      setSeletPortfolio([selectedPortfolio]);
      setViewModal(true);
    }
  }

  const queryClient = useQueryClient();
  const handleDelete = async (portfolioId) => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      try {
        await deletePortfolio({ authHeader, portfolioId });
        queryClient.invalidateQueries('loggedInUser');
      } catch (error) {
        console.error('Error deleting portfolio:', error);
      }
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
    } catch (error) {
      console.error('Error deleting portfolios:', error);
    }
  }
  const [step, setStep] = useState(1);

  const handleNextButton = () => {
    // if (portfolioType === 'image') {
    // CANT TO TO NEXT STEP IF TITLE IS EMPTY
    if (title.length === 0) {
      setErrorMessageTitle(true);
      return;
    }
    console.log('step', step)
    setStep(2);

    // };
  }

  const handlePreviousButton = () => {
    setStep(1);
  }
  
  const authe=useAuthUser();
    const location = useLocation();

    // Split the path by '/' and get the last element
    const pathSegments = location.pathname.split('/');
    const profile = pathSegments[pathSegments.length - 1];
  const validateSubmit = () => {
    console.log('validateSubmit')

    //if (portfolioType === 'youtube')  make sure youtube link is not empty
    if (portfolioType === 'youtube' && youtubeLink.length === 0) {
      console.log('youtube link is empty')
      setErrorYoutubeLink('Please enter a youtube link');
      return false;
    }

    //also make sure proper youtube link is entered
    if (portfolioType === 'youtube' && !(youtubeLink.startsWith('https://www.youtube.com/watch?v='))) {
      console.log('youtube link is invalid')
      setErrorYoutubeLink('Please enter a valid youtube link');
      return false;
    }
    //validate description and images
    if (portfolioType === 'image' && images.length === 0) {
      console.log('no images uploaded')
      setError('Please upload at least one image');
      return false;
    }

    if (portfolioType === 'image' && description.length === 0) {
      console.log('description is empty')
      setErrorMessageDescription(true);
      return false;
    }

    return true;

  }
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]); // New state for files
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  //   if (validFiles.length !== files.length) {
  //     setError('Some files were rejected. Ensure they are valid formats and within size limit.');
  //   } else {
  //     setError('');
  //   }

  //   const imageFiles = validFiles.map(file => URL.createObjectURL(file));
  //   setImages([...images, ...imageFiles]);
  // };
  const processFiles = (files) => {
    const validFiles = files.filter(file =>
      file.size <= 5 * 1024 * 1024 &&
      ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      console.log('some files were rejected')
      setError('Some files were rejected. Ensure they are valid formats and within size limit.');
    } else {
      setError('');
    }
    console.log('processFiles files', files)

    const imageFiles = validFiles.map(file => URL.createObjectURL(file));
    setImages([...images, ...imageFiles]);
    setFiles(prevFiles => [...prevFiles, ...validFiles]);// Update files state
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setFiles(files.filter((_, i) => i !== index)); // Update files state
  };
  const handleSubmit = async () => {
    // setSaveLoading(true);

    try {

      if (!validateSubmit()) {
        // setSaveLoading(false);
        console.log('validation failed')
        return;
      }
      const formData = new FormData();
      formData.append('title', title);
      formData.append('name', title);
      formData.append('description', description);
      if(authe?.user_role==='admin'){
        formData.append("userId",profile)
    }


      if (files.length > 0) { // Use files state here
        console.log('files', files)
        files.forEach((file, index) => {
          formData.append(`image${index + 1}`, file);
        });
      } else if (portfolioType === 'youtube') {
        formData.append('youtube_url', youtubeLink);
      }
      console.log("Data to be submit is :", Object.fromEntries(formData));
      
      let response;
      // response = await updateProfileWithFile({ authHeader, formData });

      // setSaveLoading(false);

      //clear all states
      setModal(false);
      setStep(1);
      setTitle('');
      setDescription('');
      setImages([]);
      setPortfolioType('');
      setYoutubeLink('');
      setErrorYoutubeLink('');
      setErrorMessageTitle(false);
      setErrorMessageDescription(false);
      setError('');
      setFiles([]);

      queryClient.invalidateQueries({ queryKey: ['loggedInUser'] })
      // navigate(`/profile/${authUser?.id}`)
    } catch (error) {
      console.error(error);
      // setSaveLoading(false);

    }
  }

  const handleCancel = () => {
    setModal(false);
    setStep(1);
    setTitle('');
    setDescription('');
    setImages([]);
    setPortfolioType('');
    setYoutubeLink('');
    setErrorYoutubeLink('');
    setErrorMessageTitle(false);
    setErrorMessageDescription(false);
    setError('');
    setFiles([]);
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
                    Cancel
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
        <div className=''>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none bg-black bg-opacity-25 focus:outline-none">
            <div className="relative w-full mx-10 mx-auto justify-center items-center">
              <div className="border-0 rounded-lg shadow-lg relative   w-full bg-white outline-none focus:outline-none">
                <div className='px-3 pt-3 rounded-full flex justify-end'
                  onClick={() => setModal(false)}>
                  <VscChromeClose className=' w-6 h-6 p-1 rounded-full text-white bg-gray-700 hover:bg-opacity-75 cursor-pointer' />
                </div>
                {/* {step == 1 && ( */}

                <div className="relative md:p-6 justify-center items-start">
                  <div className='border-b'>
                    <h1 className='text-center mb-6 text-2xl md:text-3xl font-semibold'>Add new portfolio</h1>
                  </div>
                  <div className='pt-2 px-10 '>
                    <div className="space-y-5">
                      <p className='pl-1'>Name</p>
                      <input type="text"
                        placeholder='Writing portfolio name'
                        className={`w-full p-2 border rounded-lg ${errorMessageTitle ? "border-red-600" : ""}`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      {errorMessageTitle && <p className='text-red-600'>Please enter portfolio title</p>}

                      {/* <p className='pl-1'>Portfolio Type</p> */}
                      {/* <div className="w-full p-2 border rounded-lg">
                        <label className="mr-4">
                          <input
                            type="radio"
                            value="youtube"
                            checked={portfolioType === 'youtube'}
                            onChange={(e) => setPortfolioType(e.target.value)}
                          />
                          YouTube
                        </label>
                        <label>
                          <input
                            type="radio"
                            value="image"
                            checked={portfolioType === 'image'}
                            onChange={(e) => setPortfolioType(e.target.value)}
                          />
                          Image
                        </label>
                      </div> */}
                      {/* {portfolioType === 'youtube' && ( */}
                      
                      {/* )} */}
                      <div className="  items-center">
                        <p className=''>Portfolio Images</p>
                      </div>
                      <div className="relative  mx-auto justify-center items-center">
                        <div className="border-0 rounded-lg   relative flex flex-col w-full bg-white outline-none focus:outline-none">
                          <div className="relative p-2 md:p-2 border-b flex-auto flex justify-center items-start">
                            {/* <div>
                          <h1 className='text-center text-2xl md:text-3xl font-semibold'>Add Image</h1>
                        </div> */}
                          </div>
                          <div className=''>
                            <div
                              className={` h-40 rounded-2xl border-2 border-dashed border-blue-600 flex items-center justify-center ${error && 'border-red-600'}`}
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                            >
                              <label htmlFor="file" className="cursor-pointer text-center p-4 md:p-8">
                                <svg className={`w-10 h-10 mx-auto ${error ? 'stroke-red-600' : 'stroke-blue-600'}`} viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12.1667 26.6667C8.48477 26.6667 5.5 23.6819 5.5 20C5.5 16.8216 7.72428 14.1627 10.7012 13.4949C10.5695 12.9066 10.5 12.2947 10.5 11.6667C10.5 7.0643 14.231 3.33334 18.8333 3.33334C22.8655 3.33334 26.2288 6.19709 27.0003 10.0016C27.0556 10.0006 27.1111 10 27.1667 10C31.769 10 35.5 13.731 35.5 18.3333C35.5 22.3649 32.6371 25.7279 28.8333 26.5M25.5 21.6667L20.5 16.6667M20.5 16.6667L15.5 21.6667M20.5 16.6667L20.5 36.6667" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="mt-3 text-gray-700 max-w-xs mx-auto">Click to <span className={`font-medium ${error ? 'text-red-600' : 'text-blue-600'}`}>Upload your Image</span></p>
                              </label>
                              <input id="file" type="file" className="hidden" onChange={handleFileChange} multiple />
                            </div>
                            <p className='text-gray-700 text-center mb-2'>.jpg, .gif, .png, .pdf, up to 5 MB, no more than 3000 px</p>

                            {error && <div className='text-red-600 rounded font-semibold text-center'>{error}</div>}
                          </div>
                          <div className="p-4 mt-10 grid grid-cols-8 md:grid-cols-8  gap-2">
                            {images.map((src, index) => (
                              <div key={index} className="relative border rounded p-2 ">
                                <img src={src} alt={`uploaded ${index}`} className="w-20 h-20 h-auto rounded-lg" />
                                <button
                                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                                  onClick={() => removeImage(index)}
                                >
                                  <MdOutlineDeleteForever />
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 p-5">
                            <label htmlFor="description" className="block text-gray-700">Description</label>
                            <textarea
                              id="description"
                              className="mt-1 p-2 w-full border rounded-lg"
                              rows="3"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Enter a description for the uploaded images"
                            ></textarea>
                            {errorMessageDescription && <p className='text-red-600'>Please enter a description</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* )} */}
                  {/* {step == 2 && ( */}
                  {/* {portfolioType === 'image' && ( */}


                </div>
                {/* )} */}
                {/* )} */}
                <div className="flex items-center justify-center p-2 md:p-6 border-t border-solid gap-4 border-blue Gray-200 rounded-b">
                  <button
                    className="bg-gray-700 text-white active:bg-gray-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => handleCancel()}
                  >
                    <h1 className='text-xs md:text-sm'>
                      Cancel
                    </h1>
                  </button>
                  {/* {step === 2 && (
                    <button
                      className="bg-gray-700 text-white active:bg-gray-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setStep(1)}
                    >
                      <h1 className='text-xs md:text-sm'>
                        Previous
                      </h1>
                    </button>
                  )} */}
                  <button
                    className="bg-blue-700 text-white active:bg-red-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    // onClick={portfolioType == 'image' && step != 2 ? handleNextButton : handleSubmit}
                    onClick={handleSubmit}

                  >
                    {/* {loading ? "Loading..." : (portfolioType == 'image' && step != 2 ? "Next" : "Submit")} */}
                    {loading ? "Loading..." : "Submit"}

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
                  // onClick={() => handleDeletePortfolio(selectPortfolio[0].id)}
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
      <div className='border rounded-xl my-4 p-4 '>
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
            <div className='flex flex-coll gap-3 '>
              <div className='m-auto cursor-pointer'>
                {portfolios.length === 0 ? null : (
                  <MdDelete className='w-6 h-6'
                    onMouseLeave={() => setIhoverdelete(false)}
                    onMouseEnter={() => setIhoverdelete(true)}
                    onClick={() => setDeleteSelect(true)}
                  />
                )}
              </div>
              <AuthenticatedUserViewPermission>
                <div>
                  {/* <p className={`absolute text-sm bg-gray-50 border rounded-ls shadow p-2 -mt-11 -ml-9 ${isHovered ? '' : 'hidden'}`}>Add Portfolio</p> */}
                  <Button className='bg-blue-500 text-white hover:bg-blue-600'
                    // onMouseEnter={() => setIsHovered(true)}
                    // onMouseLeave={() => setIsHovered(false)}
                    onClick={() => setModal(true)}
                  >
                    Add Portfolio
                  </Button>

                </div>
              </AuthenticatedUserViewPermission>
            </div>
          }
        </div>
        <div>
          {deleteSelect &&
            <div className='flex justify-center'>
              <p className=' font-normal mt-2.5'>Select the portfolio you want to delete</p>
            </div>
          }
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-2'>
            {userPortfolios ? (
              userPortfolios.map((product) => {
                const images = [product.image1, product.image2, product.image3].filter(Boolean);
                product.images = images;
                return (
                  <div key={product.id} className='border p-2 rounded-lg  bg-gray-50 cursor-pointer hover:shadow-lg backdrop-blur-sm '
                    style={{ height: '300px' }}
                  >
                    <AuthenticatedUserViewPermission>
                      <div className='  rounded-lg cursor-pointer relative'>
                        <FaTrash className="absolute top-2 right-2 cursor-pointer z-10" onClick={() => handleDelete(product.id)} />
                      </div>
                    </AuthenticatedUserViewPermission>

                    <div className="flex items-center justify-start gap-4">
                      <p className="text-gray-600">
                        {/* {truncateDescription(product.description, 35)} */}
                      </p>
                    </div>
                    <div className="md:h-128   lg:h-128 h-128 max-h-70 mt-3" style={{}}>
                      {product.youtube_url ? (
                        <div className='flex justify-center items-center'>
                          <ReactPlayer url={product.youtube_url} width='350px' height="230px" />
                        </div>
                      ) : (
                        <div onClick={() => handleExpandItemImages(product)}>
                          <CarouselWithContent description={product.description} imageUrls={images} />
                        </div>
                      )}
                    </div>
                    <h2 className="p-3 font-semibold text-center">
                      <span className="text-gray-600 m-2 pb-3 text-sm">{product.title}</span>
                    </h2>
                    {/* <p className="text-gray-600">
                  {truncateDescription(product.description, 35)}
                </p> */}

                  </div>
                );
              })
            ) : (
              <div className='m-auto text-gray-300'>
                <h1 className='text-4xl font-bold'>Empty Product!</h1>
              </div>
            )}
          </div>
        </div>
        <div>
          <Modal open={openItemImage} handleOpen={ExpandItemImagesClose}
            size="md"
            children={
              <CarouselWithContent
                description={selectedProduct?.description}
                imageUrls={selectedProduct?.images} fullScreenMode={true}
              />
            }
          />
        </div>
      </div>
    </div>
  )
}

export default Portfolio;
