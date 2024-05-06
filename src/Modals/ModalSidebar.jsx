import React, { useState } from 'react'
import shape from '../svgs/about/Shape.svg'
import shape1 from '../svgs/about/ic_Place.svg'
import shape2 from '../svgs/about/ic_website.svg'
import shape3 from '../svgs/about/ic_date.svg'
import shape4 from '../svgs/about/ic_Working.svg'
import shape5 from '../svgs/about/ic_relationship.svg'
import svg_facebook from '../svgs/social-media/Rectangle 6590.svg'
import svg_instagram from '../svgs/social-media/Rectangle 6591.svg'
import svg_twitter from '../svgs/social-media/Rectangle 6592.svg'
import svg_youtube from '../svgs/social-media/Rectangle 6593.svg'
import svg_linkedin from '../svgs/social-media/Rectangle 6594.svg'
import copy from '../svgs/social-media/Group 1000005712.svg'
import icon_youtube from '../svgs/social-media/download (5) 1.svg'
import icon_facebook from '../svgs/social-media/download (6) 1.svg'
import icon_instagram from '../svgs/social-media/download.svg'
import edit_svg from '../image/edit-3 (1) 1.svg'
import edit_svg_blue from '../image/edit_svg_blue.svg'
import delete_svg from '../image/Delete.svg'
import view_eye from '../image/eye 1.svg'
import view_search from '../image/search 1.svg'
import profile_Aus from '../svgs/reviews/Profile-aus.svg'
import profile_amer from '../svgs/reviews/Profile-amer.svg'
import profile_china from '../svgs/reviews/Profile-china.svg'
import { VscChromeClose } from "react-icons/vsc";
import { RxHamburgerMenu } from "react-icons/rx";
import "../App.css"
import ModalAddSocialMedia from './ModalAddSocialMedia'
import ModalAddPlatforms from './ModalAddPlatforms'

const ModalSidebar = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      {showModal ? (
        <>

          <div
            className="flex justify-end items-center overflow-x-hidden h-full overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-[80%] h-full md:w-1/3">
              <div className="border-0 rounded-lg shadow-lg h-full relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="relative p-2 md:p-6  flex-auto bg-white">
                  <div class="w-full py-5 px-1">
                    <button
                      className="bg-blue-700 text-white active:bg-blue-600 font-bold uppercase text-xs md:text-sm p-2 md:px-8 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      <VscChromeClose />
                    </button>
                    <div className='flex justify-between my-3'>
                      <div>
                        <h1 className='font-semibold'>New Connections</h1>
                      </div>
                      <div className='p-3'>
                        <img src={shape} />
                      </div>
                    </div>

                    <div className='border'></div>
                    <div className='my-3'>
                      <h1>These are the connection which you have got from other users.</h1>
                    </div>
                    <div className='border'></div>
                    <div className='flex justify-between my-5'>
                      <div className='flex gap-2'>
                        <div className=''>
                          <img className='w-8 h-8 cursor-pointer' src={profile_amer} alt='userImg' />
                        </div>
                        <div className='flex justify-center items-center text-sm'>
                          <h1>Jaydon Lubin</h1>
                        </div>
                      </div>
                      <div className='flex gap-2 text-sm'>
                        <button className='bg-gray-300 text-gray-700 px-1 py-1 rounded-lg hover:bg-gray-400'><h1>Decline</h1></button>
                        <button className='bg-blue-600 text-white px-1 py-1 rounded-lg hover:bg-blue-700'><h1>Accept</h1></button>
                      </div>
                    </div>
                    <div className='flex justify-between my-5'>
                      <div className='flex gap-2'>
                        <div className=''>
                          <img className='w-8 h-8 cursor-pointer' src={profile_Aus} alt='userImg' />
                        </div>
                        <div className='flex justify-center items-center text-sm'>
                          <h1>Zain Lipshutz</h1>
                        </div>
                      </div>
                      <div className='flex gap-2 text-sm '>
                        <button className='bg-gray-300 text-gray-700 px-1 py-1 rounded-lg hover:bg-gray-400'><h1>Decline</h1></button>
                        <button className='bg-blue-600 text-white px-1 py-1 rounded-lg hover:bg-blue-700'><h1>Accept</h1></button>
                      </div>
                    </div>
                    <div className='flex justify-between my-5'>
                      <div className='flex gap-2'>
                        <div className=''>
                          <img className='w-8 h-8 cursor-pointer' src={profile_china} alt='userImg' />
                        </div>
                        <div className='flex justify-center items-center text-sm'>
                          <h1>Emerson Stanton</h1>
                        </div>
                      </div>
                      <div className='flex gap-2 text-sm '>
                        <button className='bg-gray-300 text-gray-700 px-1 py-1 rounded-lg hover:bg-gray-400'><h1>Decline</h1></button>
                        <button className='bg-blue-600 text-white px-1 py-1 rounded-lg hover:bg-blue-700'><h1>Accept</h1></button>
                      </div>
                    </div>
                    <div className='flex justify-between my-5'>
                      <div className='flex gap-2'>
                        <div className=''>
                          <img className='w-8 h-8 cursor-pointer' src={profile_amer} alt='userImg' />
                        </div>
                        <div className='flex justify-center items-center text-sm'>
                          <h1>Cooper Korsgaard</h1>
                        </div>
                      </div>
                      <div className='flex gap-2 text-sm '>
                        <button className='bg-gray-300 text-gray-700 px-1 py-1 rounded-lg hover:bg-gray-400'><h1>Decline</h1></button>
                        <button className='bg-blue-600 text-white px-1 py-1 rounded-lg hover:bg-blue-700'><h1>Accept</h1></button>
                      </div>
                    </div>
                    <div className='flex justify-between my-5'>
                      <div className='flex gap-2'>
                        <div className=''>
                          <img className='w-8 h-8 cursor-pointer' src={profile_Aus} alt='userImg' />
                        </div>
                        <div className='flex justify-center items-center text-sm'>
                          <h1>Emerson Franci</h1>
                        </div>
                      </div>
                      <div className='flex gap-2 text-sm '>
                        <button className='bg-gray-300 text-gray-700 px-1 py-1 rounded-lg hover:bg-gray-400'><h1>Decline</h1></button>
                        <button className='bg-blue-600 text-white px-1 py-1 rounded-lg hover:bg-blue-700'><h1>Accept</h1></button>
                      </div>
                    </div>
                    <div className='flex justify-between my-5'>
                      <div className='flex gap-2'>
                        <div className=''>
                          <img className='w-8 h-8 cursor-pointer' src={profile_china} alt='userImg' />
                        </div>
                        <div className='flex justify-center items-center text-sm'>
                          <h1>Lincoln Rosser</h1>
                        </div>
                      </div>
                      <div className='flex gap-2 text-sm '>
                        <button className='bg-gray-300 text-gray-700 px-1 py-1 rounded-lg hover:bg-gray-400'><h1>Decline</h1></button>
                        <button className='bg-blue-600 text-white px-1 py-1 rounded-lg hover:bg-blue-700'><h1>Accept</h1></button>
                      </div>
                    </div>
                    <div className='flex justify-between my-5'>
                      <div className='flex gap-2'>
                        <div className=''>
                          <img className='w-8 h-8 cursor-pointer' src={profile_amer} alt='userImg' />
                        </div>
                        <div className='flex justify-center items-center text-sm'>
                          <h1>Ruben Torff</h1>
                        </div>
                      </div>
                      <div className='flex gap-2 text-sm '>
                        <button className='bg-gray-300 text-gray-700 px-1 py-1 rounded-lg hover:bg-gray-400'><h1>Decline</h1></button>
                        <button className='bg-blue-600 text-white px-1 py-1 rounded-lg hover:bg-blue-700'><h1>Accept</h1></button>
                      </div>
                    </div>
                    <div className='flex justify-between my-5'>
                      <div className='flex gap-2'>
                        <div className=''>
                          <img className='w-8 h-8 cursor-pointer' src={profile_Aus} alt='userImg' />
                        </div>
                        <div className='flex justify-center items-center text-sm'>
                          <h1>Jaydon Stanton</h1>
                        </div>
                      </div>
                      <div className='flex gap-2 text-sm '>
                        <button className='bg-gray-300 text-gray-700 px-1 py-1 rounded-lg hover:bg-gray-400'><h1>Decline</h1></button>
                        <button className='bg-blue-600 text-white px-1 py-1 rounded-lg hover:bg-blue-700'><h1>Accept</h1></button>
                      </div>
                    </div>


                    <div className='mt-20'>
                      <div className='flex justify-between my-3'>
                        <div>
                          <h1 className='font-semibold'>About Him</h1>
                        </div>
                        <div>
                          <img src={shape} />
                        </div>
                      </div>
                      <div className='border'></div>
                      <div className='my-3'>
                        <h1>Some other Information to make it Trusted these information's are verified.</h1>
                      </div>
                      <div className='border'></div>
                    </div>
                    <div>
                      <div className='flex justify-between my-4'>
                        <div className='flex gap-5 '>
                          <div className=''>
                            <img src={shape1} />
                          </div>
                          <div>
                            <h1>New York, United Kingdom</h1>
                          </div>
                        </div>
                        <div className='flex justify-center items-center text-sm cursor-pointer'>
                          <img src={edit_svg_blue} />
                        </div>
                      </div>
                      <div className='flex justify-between my-4'>
                        <div className='flex gap-5 '>
                          <div className=''>
                            <img src={shape2} />
                          </div>
                          <div>
                            <h1>designershub.io</h1>
                          </div>
                        </div>
                        <div className='flex justify-center items-center text-sm cursor-pointer'>
                          <img src={edit_svg_blue} />
                        </div>
                      </div>
                      <div className='flex justify-between my-4'>
                        <div className='flex gap-5'>
                          <div className=''>
                            <img src={shape3} />
                          </div>
                          <div>
                            <h1>Joined June 2012</h1>
                          </div>
                        </div>
                        <div className='flex justify-center items-center text-sm cursor-pointer'>
                          <img src={edit_svg_blue} />
                        </div>
                      </div>
                      <div className='flex justify-between my-4'>
                        <div className='flex gap-5'>
                          <div className=''>
                            <img src={shape4} />
                          </div>
                          <div>
                            <h1>Working at Youtube (Full time)</h1>
                          </div>
                        </div>
                        <div className='flex justify-center items-center text-sm cursor-pointer'>
                          <img src={edit_svg_blue} />
                        </div>
                      </div>
                      <div className='flex justify-between my-4'>
                        <div className='flex gap-5'>
                          <div className=''>
                            <img src={shape5} />
                          </div>
                          <div>
                            <h1>Have Channel with Nova Bee</h1>
                          </div>
                        </div>
                        <div className='flex justify-center items-center text-sm cursor-pointer'>
                          <img src={edit_svg_blue} />
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-between my-3 mt-20'>
                      <div>
                        <h1 className='font-semibold'>Analytics</h1>
                      </div>
                      <div>
                        <img src={shape} />
                      </div>
                    </div>
                    <div className='border'></div>

                    <div className='flex justify-between my-4'>
                      <div className='flex gap-5'>
                        <img src={view_eye} />
                        <h1>Viewed Hosting Space</h1>
                      </div>
                      <div>4,521</div>
                    </div>
                    <div className='flex justify-between my-4'>
                      <div className='flex gap-5'>
                        <img src={view_search} />
                        <h1>Search appearances</h1>
                      </div>
                      <div>761</div>
                    </div>


                    <div className='flex justify-between my-3 mt-20'>
                      <div>
                        <h1 className='font-semibold'>Social Media</h1>
                      </div>
                      <div className='flex gap-5'>
                        <button className='bg-blue-700  px-1 py-1 rounded-lg text-sm'>   
                          <ModalAddSocialMedia/>
                        </button>
                        <img src={shape} />
                      </div>
                    </div>
                    <div className='border'></div>
                    <div className='my-3'>
                      <h1>Please select or copy like to get in touch with him. Add them as friend on social media</h1>
                    </div>
                    <div className='border'></div>
                    <div>
                      <div className="flex gap-4 my-4">
                        <div class="w-1/6">
                          <img src={svg_facebook} />
                        </div>
                        <div class="w-5/6 flex justify-between">
                          <div className="">
                            <h1>Facebook Id here</h1>
                          </div>
                          <div className="flex gap-5">
                            <img src={copy} />
                            <img className="h-6 w-6 cursor-pointer" src={delete_svg} />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 my-4">
                        <div class="w-1/6">
                          <img src={svg_instagram} />
                        </div>
                        <div className="w-5/6 flex justify-between">
                          <div className="">
                            <h1>Instagram ID here</h1>
                          </div>
                          <div className="flex gap-5">
                            <img src={copy} />
                            <img className="h-6 w-6 cursor-pointer" src={delete_svg} />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 my-4">
                        <div class="w-1/6">
                          <img src={svg_twitter} />
                        </div>
                        <div className='w-5/6 flex justify-between'>
                          <div className="">
                            <h1>Twitter ID here</h1>
                          </div>
                          <div className="flex gap-5">
                            <img src={copy} />
                            <img className="h-6 w-6 cursor-pointer" src={delete_svg} />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 my-4">
                        <div class="w-1/6">
                          <img src={svg_youtube} />
                        </div>
                        <div className='w-5/6 flex justify-between'>
                          <div className="">
                            <h1>Youtube Link here</h1>
                          </div>
                          <div className="flex gap-5">
                            <img src={copy} />
                            <img className="h-6 w-6 cursor-pointer" src={delete_svg} />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 my-4">
                        <div class="w-1/6">
                          <img src={svg_linkedin} />
                        </div>
                        <div className='w-5/6 flex justify-between'>
                          <div className="">
                            <h1>Linkedin Id here</h1>
                          </div>
                          <div className="flex gap-5">
                            <img src={copy} />
                            <img className="h-6 w-6 cursor-pointer" src={delete_svg} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-between my-3 mt-20'>
                      <div>
                        <h1 className='font-semibold'>About Him</h1>
                      </div>
                      <div className="flex gap-5">
                        <button className='bg-blue-700 px-1 py-1 rounded-lg text-sm'>
                          <ModalAddPlatforms/>
                        </button>
                        <img src={shape} />
                      </div>
                    </div>
                    <div className='border my-4'></div>
                    <div className='flex justify-between'>
                      <div>
                        <img src={icon_youtube} />
                      </div>
                      <div className=' my-2 rounded-lg '>
                        <img className="h-6 w-6 cursor-pointer" src={delete_svg} />
                        <button className='hidden py-1 px-1 text-white text-sm'><h1>Get started</h1></button>
                      </div>
                    </div>
                    <div className='flex justify-between'>
                      <div>
                        <img src={icon_facebook} />
                      </div>
                      <div className=' my-2 rounded-lg '>
                        <img className="h-6 w-6 cursor-pointer" src={delete_svg} />
                        <button className='hidden py-1 px-1 text-white text-sm'><h1>Get started</h1></button>
                      </div>
                    </div>
                    <div className='flex justify-between'>
                      <div>
                        <img src={icon_instagram} />
                      </div>
                      <div className=' my-2 rounded-lg '>
                        <img className="h-6 w-6 cursor-pointer" src={delete_svg} />
                        <button className='hidden py-1 px-1 text-white text-sm'><h1>Get started</h1></button>
                      </div>
                    </div>
                  </div>

                </div>


              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      <button className='bg-blue-500 text-xl p-1 text-white rounded'
        onClick={() => {
          setShowModal(true)
        }}
      >
         <RxHamburgerMenu/>
      </button>

    </div>
  )
}

export default ModalSidebar
