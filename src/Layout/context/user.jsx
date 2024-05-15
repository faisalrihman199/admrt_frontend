import React, { useEffect, useRef, useState } from "react";
import PencilIcon from "./cropImg/icons/PencilIcon";
import ImageCropper from "./cropImg/modal";
import { getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { usersCollection, storage, db } from "../../firebase/firebase";
import edit_svg_blue from "../../image/edit_svg_blue.svg";
import { VscChromeClose } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { addProfileTopic, updateProfile, updateSingleImage, userProfile } from "../../service/profile";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Modal } from "../../components/Modal/Modal";
import ProfileImageUploadForm from "../../components/Forms/ProfileImageUploadForm";

const EditeUser = ({ userInfo }) => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const avatarUrl = useRef(userInfo.ProfileImage ? userInfo.ProfileImage : "https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg");
  const [modalOpen, setModalOpen] = useState(false);
  // const [fullName, setFullName] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [todoModal, setTodoModal] = useState(false);
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState([]);
  const [experitise, setExperitise] = useState([]);
  const [priceModal, setPriceModal] = useState(false);
  const [hourlyRate, setHourlyRate] = useState("5.00");
  const [tenPrisent, setTenPrisent] = useState("");
  const [ninePrisent, setNinePrisent] = useState("");
  const [priceLoading, setPriceLoading] = useState(false);
  const [price, setPrice] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [split, setSplit] = useState('');
  const [currentProfileImageUrl, setCurrentProfileImageUrl] = useState(userInfo.profileImage);
  // const allTopics = [...userInfo.topics, ...todos];
  console.log('userInfo.ProfileImage', userInfo.profileImage)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserData(user.uid);
        fetchUserImage(user.uid);
        fetchExperitise(user.uid);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const fetchUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(usersCollection, userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // setFullName(userData.fullName);
        setPrice(userData.hourlyRate);
        setSplit(userData.split);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUserImage = async (userId) => {
    try {
      const imageRef = ref(storage, `users/${userId}/images/user_image.png`);
      const imageUrl = await getDownloadURL(imageRef);
      setCroppedImage(imageUrl + `?key=${Date.now()}`);

      const userDocRef = doc(usersCollection, userId);
      await updateDoc(userDocRef, { imageUrl });

      // const usernameRef = doc(db, 'search', fullName);
      // await updateDoc(usernameRef, { imageUrl });
    } catch (error) {
      console.error("Error fetching user image:", error);
    }
  };
  const updateAvatar = (imgSrc) => {

  };

  const mutation = useMutation({
    mutationFn: addProfileTopic,
    onSuccess: () => {
      // Invalidate and refetch
      QueryClient.invalidateQueries({ queryKey: ['loggedInUser'] })
    },
  })
  const authHeader = useAuthHeader()
  const handleAddTodo = () => {
    const newTodo = {
      id: todos.length + 1,
      title: todoText
    };
    // setTodos([...todos, newTodo]);
    console.log('newTodo', newTodo)
    setExperitise([...experitise, newTodo.text]);
    mutation.mutate({
      authHeader,
      data: { title: todoText }
    })
    userInfo.topics.push(newTodo)

    setTodoText("");
  };

  const handleDeleteTodo = async (id) => {
    try {
      // to be implemented
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };






  const handleCloseTodoModal = () => {
    setTodoModal(false);
    // fetchExperitise(currentUser.uid);
  };

  useEffect(() => {
    const handleTenPrisent = () => {
      let priceTen = hourlyRate / 10 || price / 10;
      let priceNine = price - priceTen || hourlyRate - priceTen;
      setTenPrisent(`$${priceTen.toFixed(2)}`);
      setNinePrisent(`$${priceNine.toFixed(2)}`);
    }

    handleTenPrisent();
  }, [hourlyRate, price]);

  const handlePriceSent = async () => {
    try {
      const priceRef = doc(usersCollection, currentUser.uid);
      await updateDoc(priceRef, { hourlyRate });
      setPriceLoading(true);
      setPriceModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleProfilePicUpload = async (file) => {
  //   try {
  //     const imageUploadResponse = await updateSingleImage({ authHeader, data: { profile_image: file } });

  //     if (imageUploadResponse?.profile_image) {
  //       setCurrentProfileImageUrl(imageUploadResponse?.profile_image);
  //       setModalOpen(false);
  //     }

  //   } catch (error) {
  //     console.error('Error updating user data:', error);
  //   }
  // }
  const handleProfilePicUpload = async (file) => {
    try {
      let data;
      if (file instanceof Blob) {
        const formData = new FormData();
        formData.append('profile_image', file, 'profile_pic.png');
        data = formData;
      } else {
        data = { profile_image: file };
      }

      const imageUploadResponse = await updateSingleImage({ authHeader, data });

      if (imageUploadResponse?.profile_image) {
        setCurrentProfileImageUrl(imageUploadResponse?.profile_image);
        setModalOpen(false);
      }

    } catch (error) {
      console.error('Error updating user data:', error);
    }
  }

  const handleInputChange = (e) => {
    const input = e.target.value;
    const filteredInput = input.replace(/[^0-9.]/g, "");
    const decimalCount = filteredInput.split(".").length - 1;

    if (decimalCount > 1) return;

    if (price) {
      setPrice(filteredInput);
    } else {
      setHourlyRate(filteredInput);
    }

    if (parseFloat(filteredInput) < 5) {
      setErrorMessage("Value must be at least $5.00");
    } else {
      setErrorMessage("");
    }
  };

  return (
    <div className="flex  ml-4">
      {todoModal && (
        <div className="flex justify-center items-center overflow-x-hidden bg-black bg-opacity-25 overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-[80%]  md:w-1/3 mx-auto">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className='px-3 pt-3 rounded-full flex justify-end' onClick={() => handleCloseTodoModal()}>
                <VscChromeClose className=' w-6 h-6 p-1 rounded-full text-red-500 bg-pink-200' />
              </div>
              <div className="relative p-2 md:p-6 justify-center items-start">
                <div>
                  <p className='text-center mb-6 text-xl md:text-xl font-semibold'>Add topics you speak about or have advertises in the past</p>
                </div>
                <div className="">
                  <div className="mb-4">
                    <div className="flex mt-5">
                      <input className="border rounded-lg w-full py-2 px-3 mr-1 text-grey-darker" placeholder="Add topic" value={todoText} onChange={(e) => setTodoText(e.target.value)} />
                      <button type="submit" className={`p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 w-20 ${todos.length >= 10 ? 'cursor-not-allowed opacity-50' : ''}`} onClick={handleAddTodo}  >Add</button>
                    </div>
                  </div>
                  <div>
                    <div className="border-t">
                      <h2 className="text-md font-bold mb-4 pt-5">Your Topics</h2>
                      {userInfo.topics.map((topic, index) => (
                        <div className="flex items-center" key={topic.id}>
                          <p className="w-full text-grey-50">
                            <span className="mr-2">{index + 1}.</span>
                            {topic.title}
                          </p>
                          <button onClick={() => handleDeleteTopic(topic.id)}>
                            <MdDelete />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* <div id="expertiseContainer" className="mt-4">
                  <h1 className='text-sm w-full font-medium text-blue-800'><span className='text-sm text-gray-500'>Topics: </span>{experitise.join(', ') || "none"}</h1>
                </div> */}
              </div>
              {/* <p className="text-center">Maximum ten topics may be added</p> */}
              <div className="flex items-center justify-center p-2 md:p-6   border-solid gap-4 border-blue Gray-200 rounded-b">
                {/* <button className="bg-gray-700 text-white active:bg-gray-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setTodoModal(false)}>
                  <h1 className='text-xs md:text-sm'>
                    Cancel
                  </h1>
                </button>
                <button className="bg-blue-600 text-white active:bg-blue-700 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={updateExperitise}
                >
                  Save
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {priceModal && (
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none bg-black bg-opacity-50 focus:outline-none">
          <div className="relative w-[80%]  md:w-2/5 mx-auto">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className='px-3 pt-3 rounded-full flex justify-end'
                onClick={() => setPriceModal(false)}>
                <button>
                  <VscChromeClose className=' w-6 h-6 p-1 rounded-full text-white bg-gray-500 hover:bg-opacity-50' />
                </button>
              </div>
              <div className="relative p-2 md:p-6 justify-center items-start">
                <div>
                  <h1 className='text-center mb-6 text-2xl md:text-3xl font-semibold'>Change advertising price?</h1>
                  <h1 className='text-center my-3'>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</h1>
                </div>
                <div className="border-b">
                  <span className="text-gray-600 text-sm font-semibold">Your profile rate: {hourlyRate}</span>
                </div>
                <div>
                  <div className="border-b p-2 my-2 flex justify-between">
                    <div>
                      <h1>Hourly Rate</h1>
                      <p className="text-gray-500 text-sm">Total amount the client will see</p>
                    </div>
                    <div className="">
                      <input
                        type="text"
                        className="m-auto p-2 w-28 border rounded-lg text-end"
                        value={price ? ('$' + price) : ('$' + hourlyRate)}
                        onChange={handleInputChange}
                      />
                      <span className="font-semibold text-xl ml-2 text-gray-800">/hr</span>
                    </div>
                  </div>
                  <div className="border-b p-2 my-2 flex justify-between">
                    <div>
                      <h1>10% Admrt Service take</h1>
                      <p className="text-gray-500 text-sm">Total amount the client will see</p>
                    </div>
                    <div className="text-gray-500 cursor-not-allowed">
                      <input
                        type="text"
                        pattern="[0-9]*"
                        inputmode="numeric"
                        value={tenPrisent}
                        onChange={(e) => setTenPrisent(e.target.value)}
                        readOnly
                        className="m-auto p-2 w-28 border rounded-lg cursor-not-allowed bg-gray-100 text-end"
                      />
                      <span className="font-semibold text-xl ml-2 text-gray-500">/hr</span>
                    </div>
                  </div>
                  <div className="border-b p-2 mt-2 flex justify-between">
                    <div>
                      <h1>You'll Receive</h1>
                      <p className="text-gray-500 text-sm">The estimated amount you'll receive after service fees</p>
                    </div>
                    <div className="">
                      <input
                        type="text"
                        pattern="[0-9]*"
                        inputmode="numeric"
                        value={ninePrisent}
                        onChange={(e) => setNinePrisent(e.target.value)}
                        readOnly
                        className="m-auto p-2 w-28 border rounded-lg cursor-not-allowed text-end"
                      />
                      <span className="font-semibold text-xl ml-2 text-gray-500 cursor-not-allowed">/hr</span>
                    </div>
                  </div>
                  {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </div>
              </div>
              <div className="flex items-center justify-center p-2 md:px-6 md:mb-4 border-solid border-blue Gray-200 rounded-b">
                <button
                  className="bg-blue-600 w-full text-white active:bg-blue-700 font-bold uppercase text-xs md:text-sm p-2 m-auto md:px-8 md:pb-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handlePriceSent}
                >
                  {priceLoading ? "Loading..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {(
        <div className="relative -mt-10">
          <img
            key={croppedImage}
            // src={croppedImage || avatarUrl.current}
            src={currentProfileImageUrl || 'https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'}
            alt="...leading. please make refresh"
            className="w-[150px] h-[150px] rounded-full border-8 border-white"
          />
          <button
            className="absolute -bottom-1 left-20 right-0 w-fit p-[.35rem] rounded-full bg-white hover:bg-gray-200 border border-gray-600"
            title="Change photo"
            onClick={() => setModalOpen(true)}
          >
            <PencilIcon />
          </button>
        </div>
      )}
      <div className="flex justify-between ml-4 w-3/4 items-center">
        <div className=''>
          <h1 className='font-medium text-lg md:text-2xl'>{userInfo.name}</h1>
          <div className="flex">
            <h1 className='text-sm w-full font-medium text-blue-800'>
              <span className='text-sm text-gray-500'>Topics: </span>
              {userInfo?.topics && userInfo.topics.length > 0 ? userInfo.topics.map(topic => topic.title).join(', ') : "none"}
            </h1>
            <div className='flex justify-center items-center cursor-pointer ml-2' onClick={() => setTodoModal(true)}>
              <img src={edit_svg_blue} alt="" />
            </div>
          </div>
        </div>
        {/* <div className="flex gap-3">
          <h1 className="font-bold text-xl">$<span>{price || hourlyRate}</span>/hr</h1>
          <div onClick={() => setPriceModal(true)} className="m-auto">
            <img src={edit_svg_blue} alt="" />
          </div>
        </div> */}
      </div>
      {modalOpen && (
        // < ImageCropper
        //   updateAvatar={updateAvatar}
        //   closeModal={() => setModalOpen(false)}
        //   currentAvatar={croppedImage}
        // />
        <Modal open={modalOpen} handleOpen={setModalOpen} children={<ProfileImageUploadForm submitFileUpload={handleProfilePicUpload} />} />
      )
      }
    </div >
  );
};

export default EditeUser;
