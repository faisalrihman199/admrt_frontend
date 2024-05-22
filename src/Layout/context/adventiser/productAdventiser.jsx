import React, { useCallback, useEffect, useState } from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import { auth, productCollection, saveProductDataToFirebase, storage, uploadFilesToStorage } from '../../../firebase/firebase';
import { MdDelete, MdOutlineDeleteForever } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import generatedId from '../../../modul/main';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { IoCloseCircleOutline } from "react-icons/io5";
import { deleteObject, listAll, ref } from 'firebase/storage';
import ReactPlayer from 'react-player';
import { CarouselWithContent } from '../../../components/Carousel/CarouselWithContent';
import { FaTrash } from 'react-icons/fa';
import { addProduct, deleteProduct } from '../../../service/profile';
import { useQueryClient } from '@tanstack/react-query';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { Modal } from '../../../components/Modal/Modal';
import AuthenticatedUserViewPermission from '../../../components/Permissions/AuthenticatedUserViewPermission';
import { VscChromeClose } from 'react-icons/vsc';

export const ProductAdventiser = ({ userProducts }) => {
  const { userUID } = useParams();
  const [userId, setUserId] = useState('');
  const [modal, setModal] = useState(false);
  const [btn, setBtn] = useState('Next');
  const [nextSection, setnextSection] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [icon, setIcon] = useState(null);
  const [name, setName] = useState(null);
  const [descriptions, setDescriptions] = useState(null);
  const [data, setData] = useState(null);
  const [seenModal, setSeenModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [errorMessageTitle, setErrorMessageTitle] = useState(false);
  const [errorMessageDescription, setErrorMessageDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorYoutubeLink, setErrorYoutubeLink] = useState('');
  const [portfolioType, setPortfolioType] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);


  const productId = generatedId();

  const navigate = useNavigate();
  console.log('userProducts', userProducts)



  // const handleFileChange = (e) => {
  //   const files = e.target.files;
  //   if (files.length > 4) {
  //     setError("You can upload up to 4 files only.");
  //     return;
  //   }
  //   const newFiles = [];
  //   let validTypes = true;
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     if (!['image/jpeg', 'image/png'].includes(file.type)) {
  //       validTypes = false;
  //       setError("Please upload valid PNG or JPG images only.");
  //       break;
  //     }
  //     if (file.size > 1048576) {
  //       setError("File size should be less than or equal to 1MB.");
  //       validTypes = false;
  //       break;
  //     }
  //     newFiles.push(file);
  //   }
  //   if (validTypes) {
  //     setSelectedFiles([...selectedFiles, ...newFiles]);
  //     setError(null);
  //   }
  // };
  const queryClient = useQueryClient();
  const authHeader = useAuthHeader()

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      try {
        await deleteProduct({ authHeader, productId });
        queryClient.invalidateQueries('loggedInUser');
      } catch (error) {
        console.error('Error deleting portfolio:', error);
      }
    }
  };

  // const handleCancel = () => {
  //   setModal(false);
  //   setName('')
  //   setDescriptions('')
  //   setSelectedFiles([]);
  //   setnextSection(false);
  //   setBtn('Next');
  // }

  const isImageValid = (file) => {
    return file.type === 'image/jpeg' || file.type === 'image/png';
  };

  const uploadIcon = async (e) => {
    const file = e.target.files[0];

    if (!isImageValid(file)) {
      setError("Please upload valid PNG or JPG images only.");
      return;
    }

    if (file.size > 1048576) {
      setError("File size should be less than or equal to 1MB.");
      return;
    }

    setIcon(file);
  };


  useEffect(() => {
    const timeout = setTimeout(() => {
      setError('');
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  const navigateNextSection = () => {
    if (!name || name.length === 0) {
      setError('Please enter Product Name!');
      return;
    }

    if (!descriptions || descriptions.length === 0) {
      setError('Please enter Product description!');
      return;
    }

    setError();
    // setnextSection(true);
    navigate(`/mediaUpload/product`, { state: { title: name, description: descriptions, module: 'product' } });
    setBtn('Save');

  }
  const [openItemImage, setOpenItemImage] = useState(false);

  const handleExpandItemImages = (product) => {
    setSelectedProduct(product);
    setOpenItemImage(true);
  };

  const ExpandItemImagesClose = () => {
    setOpenItemImage(false);
  };

  const saveProduct = async () => {
    setBtn('Loading...')
    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Please upload product image!');
      setBtn('Save')
      return;
    };

    try {
      setBtn('Loading...')

      const fileRefs = await uploadFilesToStorage(userId, productId, icon, selectedFiles);
      await saveProductDataToFirebase(userId, productId, { name: name, descriptions: descriptions }, fileRefs);

      setBtn("Next");
      setName('');
      setDescriptions('');
      setSelectedFiles([]);
      setIcon(null);
      setError(null);
      setnextSection(false);
      setModal(false);

    } catch (error) {
      console.error(error);
      setError("Failed to save product. Please try again!");
    }
  };

  const openModal = (selectedProduct) => {
    setSelectedProduct(selectedProduct);
    setSeenModal(true);
  };

  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(productCollection, userUID, "all", productId));

      const productRef = ref(storage, `users/${userUID}/products/${productId}`);
      const productImages = await listAll(productRef);
      productImages.items.forEach(async (item) => {
        await deleteObject(item);
      });
      setSeenModal(false);

    } catch (err) {
      console.error(error);
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

  const validateSubmit = () => {
    console.log('validateSubmit')

    //if (portfolioType === 'youtube')  make sure youtube link is not empty


    //also make sure proper youtube link is entered

    //validate description and images
    if (images.length === 0) {
      console.log('no images uploaded')
      setError('Please upload at least one image');
      return false;
    }

    if (description.length === 0) {
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
    setLoading(true);

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



      if (files.length > 0) { // Use files state here
        console.log('files', files)
        files.forEach((file, index) => {
          formData.append(`image${index + 1}`, file);
        });
      }

      let response;
      response = await addProduct({ authHeader, formData });

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
      setLoading(files);


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
    <div className='border p-6 rounded-lg my-3'>
      {seenModal && (
        <div className='flex justify-center items-center overflow-x-hidden overflew-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-25'>
          <div className='relative w-1/3 mx-auto'>
            <div className='bg-white p-4 rounded-xl'>
              <div className='flex justify-between items-center'>
                <button onClick={() => setSeenModal(false)}>
                  <IoCloseCircleOutline className='w-8 h-8' />
                </button>
                {
                  <button className='' onClick={() => handleDeleteProduct(selectedProduct.id)}>
                    <MdDelete className='text-red-700 w-8 h-8' />
                  </button>
                }
              </div>
              <div className='border-b'>
                <h1 className='font-semibold text-center text-2xl p-2'>{selectedProduct.name}</h1>
              </div>
              <div className="grid grid-cols-2 mt-4 gap-4">
                {selectedProduct.images && selectedProduct.images.map((image, index) => (
                  <img key={index} src={image} alt='img' className="rounded-lg w-44 h-44 object-cover" />
                ))}
              </div>
              <div>
                <p>{selectedProduct.descriptions}</p>
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

                <div className="relative p-2 md:p-6 justify-center items-start">
                  <div className='border-b'>
                    <h1 className='text-center mb-6 text-2xl md:text-3xl font-semibold'>Add new Product</h1>
                  </div>
                  <div className='pt-2 px-10'>
                    <div className="space-y-5">
                      <p className='pl-1'>Name</p>
                      <input type="text"
                        placeholder='Writing portfolio name'
                        className={`w-full p-2 border rounded-lg ${errorMessageTitle ? "border-red-600" : ""}`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      {errorMessageTitle && <p className='text-red-600'>Please enter portfolio title</p>}

                      {/* <p className='pl-1'>Portfolio Type</p>
                        <div className="w-full p-2 border rounded-lg">
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
                        </div>
                        {portfolioType === 'youtube' && (
                          <>
                            <p className='pl-1'>YouTube Link</p>
                            <input type="text"
                              placeholder='Enter YouTube link'
                              className={`w-full p-2 border rounded-lg`}
                              value={youtubeLink}
                              onChange={(e) => setYoutubeLink(e.target.value)}
                            />
                            {errorYoutubeLink && <p className='text-red-600'>{errorYoutubeLink}</p>}

                          </>
                        )} */}
                    </div>
                  </div>
                </div>
                {/* )} */}
                {/* {step == 2 && ( */}

                <div className="relative px-20 mx-auto justify-center items-center">
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
                          <p className="mt-3 text-gray-700 max-w-xs mx-auto">Click to <span className={`font-medium ${error ? 'text-red-600' : 'text-blue-600'}`}>Upload your file</span></p>
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

                    <div className="mt-2 p-5">
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
                  {step === 2 && (
                    <button
                      className="bg-gray-700 text-white active:bg-gray-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setStep(1)}
                    >
                      <h1 className='text-xs md:text-sm'>
                        Previous
                      </h1>
                    </button>
                  )}
                  {/* <button
                    className="bg-blue-700 text-white active:bg-red-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={portfolioType == 'image' && step != 2 ? handleNextButton : handleSubmit}
                  >
                    {loading ? "Loading..." : (portfolioType == 'image' && step != 2 ? "Next" : "Submit")}
                  </button> */}
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


      {(
        <div className='flex justify-between mb-3 '>
          <div>
            <h1 className='font-bold text-xl text-gray-800'>Products</h1>
            {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p> */}
          </div>
          <AuthenticatedUserViewPermission>
            <div className='flex items-center justify-center'>
              <button className='flex gap-2 bg-blue-600 hover:bg-blue-700 p-2 rounded-lg px-5 active:bg-blue-600 text-white'
                onClick={() => setModal(true)}
              >
                <IoIosAddCircleOutline className='w-6 h-6 m-auto' />
                <p>Add product</p>
              </button>
            </div>
          </AuthenticatedUserViewPermission>

        </div>
      )}
      <div className='grid grid-cols-2 gap-4 p-2 '>
        {userProducts ? (
          userProducts.map((product) => {
            const images = [product.image1, product.image2, product.image3].filter(Boolean);
            product.images = images;
            return (
              <div key={product.id} className='border p-2 bg-gray-50  rounded-lg cursor-pointer hover:shadow-lg backdrop-blur-sm '
                style={{ height: '300px' }}
              >
                <AuthenticatedUserViewPermission>
                  <div className='rounded-lg cursor-pointer relative hover:shadow-lg'>
                    <FaTrash className="absolute top-2 right-2 cursor-pointer border  z-10" onClick={(e) => {
                      handleDelete(product.id)
                    }} />
                  </div>
                </AuthenticatedUserViewPermission>

                <div className="flex items-center justify-start gap-4">
                  <p className="text-gray-600">
                    {/* {truncateDescription(product.description, 35)} */}
                  </p>
                </div>
                <div className="md:h-128   lg:h-128 h-128 max-h-70 mt-3" style={{}}>
                  {product.youtube_url ? (
                    <ReactPlayer url={product.youtube_url} width='450px' height="260px" />
                  ) : (
                    <div onClick={() => handleExpandItemImages(product)}>
                      <CarouselWithContent description={product.description} imageUrls={images} />
                    </div>
                  )}
                </div>
                <h2 className="p-3 font-semibold text-center">
                  <span className="text-gray-600 m-2 pb-3 text-sm">{product.name}</span>
                </h2>
                {/* <p className="text-gray-600">
                  {truncateDescription(product.description, 35)}
                </p> */}

              </div>
            );
          })
        ) : (
          <div className='m-auto text-gray-300'>
            <h1 className='text-4xl font-bold'>No products found</h1>
          </div>
        )}
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

    </div >
  )
}
