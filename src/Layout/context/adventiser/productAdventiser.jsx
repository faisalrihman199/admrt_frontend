import React, { useCallback, useEffect, useState } from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import { useParams } from 'react-router-dom';
import { auth, productCollection, saveProductDataToFirebase, storage, uploadFilesToStorage } from '../../../firebase/firebase';
import { MdDelete } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import generatedId from '../../../modul/main';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { IoCloseCircleOutline } from "react-icons/io5";
import { deleteObject, listAll, ref } from 'firebase/storage';

export const ProductAdventiser = () => {
  const { userUID } = useParams();
  const [userId, setUserId] = useState('');
  const [modal, setModal] = useState(false);
  const [btn, setBtn] = useState('Next');
  const [nextSection, setnextSection] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [icon, setIcon] = useState(null);
  const [name, setName] = useState(null);
  const [descriptions, setDescriptions] = useState(null);
  const [data, setData] = useState(null);
  const [seenModal, setSeenModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const productId = generatedId();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId('');
      }
    })
    return () => unsubscribe();
  }, [userId])

  const fetchAllProducts = useCallback(async () => {
    if (userUID) {
      try {
        const docRef = collection(productCollection, userUID, "all");
        const snapshot = await getDocs(docRef);
        const products = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const { icon, name, descriptions, images } = data;
          products.push({ id: doc.id, icon, name, descriptions, images });
        });
        setData(products);
      } catch (err) {
        console.error(err);
      }
    }
  }, [userUID]);


  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 4) {
      setError("You can upload up to 4 files only.");
      return;
    }
    const newFiles = [];
    let validTypes = true;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        validTypes = false;
        setError("Please upload valid PNG or JPG images only.");
        break;
      }
      if (file.size > 1048576) {
        setError("File size should be less than or equal to 1MB.");
        validTypes = false;
        break;
      }
      newFiles.push(file);
    }
    if (validTypes) {
      setSelectedFiles([...selectedFiles, ...newFiles]);
      setError(null);
    }
  };

  const handleDelete = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleCancel = () => {
    setModal(false);
    setName('')
    setDescriptions('')
    setSelectedFiles([]);
    setnextSection(false);
    setBtn('Next');
  }

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
    setnextSection(true);
    setBtn('Save');
  }


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
      fetchAllProducts();
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
      fetchAllProducts();
    } catch (err) {
      console.error(error);
    }
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
                {userUID === userId &&
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
        <div className='flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-25'>
          <div className='relative w-1/3 mx-auto'>
            <div className='bg-white p-4 rounded-xl'>
              <div className='border-b'>
                <h1 className='font-semibold text-center text-2xl p-2'>Add Product</h1>
              </div>
              {nextSection === true && (
                <div className='flex justify-start my-1'>
                  <IoIosArrowBack className='w-6 h-6 cursor-pointer' onClick={() => { setnextSection(false); setBtn('Next') }} />
                </div>
              )}
              <div>
                {nextSection ? (
                  <div>
                    {error && <div className="text-red-600 text-center">{error}</div>}
                    <div className='flex items-center justify-center gap-3 py-3'>
                      <label htmlFor="dropzone-file" className="flex flex-col items-center w-full p-5 text-center bg-white border-2 border-blue-600 border-dashed cursor-pointer rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-blue-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                        <h2 className="mt-1 font-medium tracking-wide text-blue-600">Upload</h2>
                        <p className="mt-2 text-xs tracking-wide text-gray-600">Upload 1MB your file PNG, JPG. </p>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".png,.jpg" multiple />
                      </label>
                    </div>
                    <div className=''>
                      {selectedFiles.map((file, index) => (
                        <div className='py-3 border-t'>
                          <div key={index} className='flex justify-between'>
                            <div>
                              {file.name}
                            </div>
                            <div>
                              <MdDelete className='text-red-600 my-auto w-6 h-6 cursor-pointer' onClick={() => handleDelete(index)} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>
                      {error && <p className='text-red-600 text-center'>{error}</p>}
                    </div>
                    <div className='flex items-center justify-center gap-3 border-b py-3'>
                      <label for="dropzone-file" className="flex flex-col items-center w-1/2 p-5 text-center bg-white border-2 border-blue-600 border-dashed cursor-pointer rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-blue-600">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                        <h2 className="mt-1 font-medium tracking-wide text-blue-600">Upload</h2>
                        <p className="mt-2 text-xs tracking-wide text-gray-600">Upload 1MB your file PNG, JPG. </p>
                        <input id="dropzone-file"
                          type="file"
                          className="hidden"
                          onChange={uploadIcon}
                        />
                      </label>
                      <div className='flex justify-center items-center'>
                        <p className='text-center'>Your product logo <br />upload here <span className='text-gray-700'>(option)</span></p>
                      </div>
                    </div>
                    <div>
                      <div className='my-2'>
                        <label className='pl-2'>Product name</label>
                        <input type="text"
                          className='border rounded-lg p-2 w-full'
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className='my-2'>
                        <label className='pl-2'>Product description</label>
                        <input type="text"
                          className='border rounded-lg p-2 w-full'
                          value={descriptions}
                          onChange={(e) => setDescriptions(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className='flex justify-center items-center gap-4 border-t py-2'>
                <button className='border-2 border-blue-600 text-blue-600 hover:border-blue-700 hover:text:blue-700 active:bg-blue-100 p-2 rounded-lg w-44' onClick={handleCancel}>
                  Cancel
                </button>
                <button className='bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-600 p-2.5 rounded-lg w-44' onClick={() => {
                  if (btn === "Next") {
                    navigateNextSection();
                  } else if (btn === "Save") {
                    saveProduct()
                  }
                }}>
                  {btn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {userUID === userId && (
        <div className='flex justify-between mb-3'>
          <div>
            <h1 className='font-bold text-xl text-gray-800'>Products</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
          <div className='flex items-center justify-center'>
            <button className='flex gap-2 bg-blue-600 hover:bg-blue-700 p-2 rounded-lg px-5 active:bg-blue-600 text-white'
              onClick={() => setModal(true)}
            >
              <IoIosAddCircleOutline className='w-6 h-6 m-auto' />
              <p>Add product</p>
            </button>
          </div>
        </div>
      )}
      <div className='flex gap-6'>
        {data && data.length > 0 ? (
          data.map((product) => (
            <div key={product.id} className='border p-4 rounded-lg w-1/2 cursor-pointer hover:shadow-lg' onClick={() => openModal(product)}>
              <div className="flex items-center justify-start gap-4">
                <div>
                  {product.icon && (
                    <img src={product.icon} alt="Product Icon" className="w-28 h-28 object-cover rounded-lg" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold">{product.name}</h2>
                  <p className="text-gray-600">
                    {truncateDescription(product.descriptions, 35)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 mt-4 gap-4">
                {product.images && product.images.map((image, index) => (
                  <img key={index} src={image} alt='images' className="rounded-lg w-44 h-44 object-cover" />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className='m-auto text-gray-300'>
              <h1 className='text-4xl font-bold'>Empty Product!</h1>
          </div>
        )}

      </div>
    </div>
  )
}
