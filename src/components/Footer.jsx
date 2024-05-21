import React, { useState } from 'react'
import white from '../Layout/AuthPage/images/Group white.svg'
import { Link } from 'react-router-dom'
import { BsFillTelephoneInboundFill } from 'react-icons/bs';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const Footer = ({ authenticated }) => {
  const [isPhoneHovered, setIsPhoneHovered] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const authUser = useAuthUser();
  return (
    <div>
      <footer class="mt-0 footer bg-[#18181B]">
        <div
          class="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8"
        >
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
              <div class="text-teal-600">
                <img src={white} alt="" />
              </div>
              <p class="mt-4 max-w-xs text-neutral-500 text-base font-light">
                Your Brand. Strategic Ad Spaces. One platform
              </p>
            </div>
            <div
              class=" grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2"
            >
              <div>
                <p class="font-medium text-white text-base font-light text-base font-light">Services</p>
                <ul class="mt-6 space-y-4 text-sm">
                  {!isAuthenticated && (
                    <li>
                      <Link to="/register" class="text-neutral-500 text-base font-light  transition hover:text-[#2B59FF]">
                        Sign Up
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link to="/about" class="text-neutral-500 text-base font-light  transition hover:text-[#2B59FF]">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to={isAuthenticated && authUser?.user_role == 'advertiser' ? "/filter" : "/login"} class="text-neutral-500 text-base font-light transition hover:text-[#2B59FF]">
                      Find The Best Places To Advertise
                    </Link>
                  </li>
                  {!isAuthenticated && (
                    <li>
                      <Link to={isAuthenticated ? "/" : "/adSpaceHost/registasion"} class="text-neutral-500 text-base font-light transition hover:text-[#2B59FF]">
                        Become An Ad Host
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <p class="font-medium text-white">Contact us</p>
                <ul class="mt-6 space-y-4 text-sm">
                  <li>

                    <Link
                      to=""
                      class="text-neutral-500 text-base font-light transition hover:text-[#2B59FF]"
                      onMouseEnter={() => setIsPhoneHovered(true)}
                      onMouseLeave={() => setIsPhoneHovered(false)}
                    >
                      Phone Number: {isPhoneHovered && <>tel:</>} <span class="text-neutral-600">732-503-8255</span>

                    </Link>
                  </li>
                  <li>
                    <Link to={"mailto:jacob@admrt.com"} className="text-neutral-500 text-base font-light transition hover:text-[#2B59FF]">
                      Email: <span className="text-neutral-600">Contact@amdrt.com</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="flex flex-col justify-between pt-5 pb-10 border-t border-gray-800 sm:flex-row">
            <p className='text-white'>More services coming soon.</p>
            <p class="text-sm text-neutral-500 text-base font-light">
              ©2024 admrt. All rights reserved.
            </p>
            <div class="mb-6 flex items-center text-neutral-500 ">
              <Link
                to="/"
                rel="noreferrer"
                target="_blank"
                class="text-dark hover:bg-primary hover:border-primary mr-3 flex h-8 w-8 items-center justify-center rounded-full hover:text-[#2B59FF]  sm:mr-4 lg:mr-3 xl:mr-4"
              >
                <svg
                  class="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </Link>
              <Link to=""
                class="text-dark hover:bg-primary hover:border-primary mr-3 flex h-8 w-8 items-center justify-center rounded-full hover:text-[#2B59FF] sm:mr-4 lg:mr-3 xl:mr-4"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  class="fill-current"
                >
                  <path
                    d="M13.0214 0H1.02084C0.453707 0 0 0.451613 0 1.01613V12.9839C0 13.5258 0.453707 14 1.02084 14H12.976C13.5432 14 13.9969 13.5484 13.9969 12.9839V0.993548C14.0422 0.451613 13.5885 0 13.0214 0ZM4.15142 11.9H2.08705V5.23871H4.15142V11.9ZM3.10789 4.3129C2.42733 4.3129 1.90557 3.77097 1.90557 3.11613C1.90557 2.46129 2.45002 1.91935 3.10789 1.91935C3.76577 1.91935 4.31022 2.46129 4.31022 3.11613C4.31022 3.77097 3.81114 4.3129 3.10789 4.3129ZM11.9779 11.9H9.9135V8.67097C9.9135 7.90323 9.89082 6.8871 8.82461 6.8871C7.73571 6.8871 7.57691 7.74516 7.57691 8.60323V11.9H5.51254V5.23871H7.53154V6.16452H7.55423C7.84914 5.62258 8.50701 5.08065 9.52785 5.08065C11.6376 5.08065 12.0232 6.43548 12.0232 8.2871V11.9H11.9779Z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer