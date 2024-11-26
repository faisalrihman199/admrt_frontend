import React, { useEffect, useState } from 'react'
import card from './Card.svg'
import './style.css'
import { Link, useNavigate } from 'react-router-dom'
import { auth, usersCollection } from '../../../firebase/firebase'
import { doc, getDoc } from 'firebase/firestore'

const Billings = () => {
  const [user, setUser] = useState(null);
  const [split, setSplit] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = auth.onAuthStateChanged(async (user) => {
      setUser(user)
      try{
        const dbCall = await getDoc(doc(usersCollection, user.uid));
        if(dbCall.exists()){
          const data = dbCall.data();
          const splitdata = data.split;
          setSplit(splitdata)
        }
      }catch(error){
        console.log(error);
      }
    })

    return () => fetchUser
  })

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    console.log(`logout user`);
    auth.signOut();
    navigate("/")
  }

  return (
    <div>
      <div class="md:flex  my-12 bg-white m-auto max-w-screen-2xl justify-center items-center px-2 py-6  lg:px-8">
        <div class="w-full h-96 border  border-gray-100 bg-white py-8 px-2 md:px-10 mb-5 rounded-2xl md:0  md:w-1/4">
          <div className=''>
            <div class="mb-6">
              <h3 class="font-bold text-2xl text-start">Settings</h3>
            </div>
            <div class="mx-auto">
              <div class="">
                <Link to={`/t=split${split}/${user.uid}/settings`}>
                  <button class="flex mt-8 w-full text-lg font-medium p-4 rounded-2xl  mb-2.5 hover:bg-gray-100">

                    Account
                  </button>
                </Link>
                <button class="flex w-full mt-8 text-lg font-medium p-4 mb-2.5 rounded-2xl bg-gray-100">

                  Billings
                </button>
                <button onClick={handleLogout} class="border mt-8 w-full  text-lg bg-white rounded-2xl font-medium p-4 hover:text-red-500">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full  md:w-3/4 md:ml-4 py-8 px-3 md:px-4 border border-gray-100 bg-white p-4 rounded-2xl">
          <div class="">

            <div className='md:flex justify-between'>
              <div className='text-start md:flex justify-center items-center'>
                <h1 className='font-bold  text-xl'>Billings</h1>
              </div>
              <div className='add-new font-normal text-sm flex justify-between md:justify-center'>
                <div className='md:flex justify-center items-center mr-2'>
                  <h1 className='md:flex'><span className='text-gray-300'>Next Billing Date: </span> </h1>
                  <h1>24 Jan, 2023</h1>
                </div>
                <button className='p-1 py-3  bg-blue-700 text-white rounded-md  md:text-sm'><h1>+ Add New Payment Method</h1></button>
              </div>
            </div>

            <div class="md:flex text-start mt-12 ">
              <div className='w-full md:w-1/3 flex justify-center items-center'>
                <img className='img-fluid' src={card} alt="cardImage" />
              </div>

              <div class="w-full md:w-2/3  md:ml-4">
                <div>
                  <label for="first_name" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">Billing Address</label>
                  <input type="text" id="first_name" class=" border px-4 py-3 text-base border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Billing Address card" required />
                </div>
                <div>
                  <div className='subs_plan'>
                    <h1 className='text-base font-medium mt-10'>Subscription Plan</h1>
                    <div className='flex justify-between border rounded-xl py-2 px-1 mt-2'>
                      <h2 className='font-normal flex justify-center items-center text-sm'>1 Ad space</h2>
                      <div className='flex'>
                        <h2 className='font-medium flex justify-center items-center text-sm'>39.99 <span className='font-light text-sm text-gray-500'>/month</span></h2>
                        <div className='flex'>
                          <button className='py-1 px-2 mx-2 text-sm bg-red-600 text-white rounded-md'><h1>Delete</h1></button>
                          <button className='py-1 px-2 text-sm bg-blue-700 text-white rounded-md'><h1>Upgrade</h1></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>

          <div>
            <div class="mb-6 mt-10 py-6 text-center md:text-end">
              <button class="w-full md:w-64 rounded-lg  py-3  bg-blue-500 text-white hover:shadow-lg font-medium font-medium text-sm md:text-base shadow-indigo-700/40 text-center">Save Change</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Billings
