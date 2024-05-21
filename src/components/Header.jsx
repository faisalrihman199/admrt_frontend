import React from 'react';
import check from '../Layout/AuthPage/images/check.svg';
import arrow from '../Layout/AuthPage/images/arrow.svg';
import bg from '../Layout/AuthPage/images/marketing-pillar-page-marketing-overview_0.png';
import bg1 from '../Layout/AuthPage/images/marketing-pillar-page-marketing-job-outlook-salary.png';
import bg2 from '../Layout/AuthPage/images/marketing-pillar-page-types-of-marketing.png';
import fff from '../images/addmert_structure.png';

const Header = () => {
  return (
    <div className=''>
      <div class=" my-20 px-5 bg-white p-20 mb-0">
        <div class="text-center items-center my-5 ">
          <h1 class=" font-bold text-4xl">How it <span class="text-blue-600">Works</span> </h1>
          <p class="font-normal text-lg mt-2.5 text-gray-400">Promote Smarter – here is how! </p>
        </div>
        <div class=" mt-32 mb-4 max-w-full mx-auto max-w-screen-2xl max-auto place-content-center justify-center justify-items-center grid md:grid-cols-2 lg:grid-cols-4 gap-x-1 gap-y-20">
          <div class="  number ease-in duration-700 cursor-pointer rounded-xl hover:shadow-2xl overflow-hidden max-w-xs order-first lg:order-none">
            <div class="py-5 px-6 sm:px-8">
              <h1 class="font-bold text-lg border rounded-full text-center py-2.5 w-12 mb-2.5">1</h1>
              <h2 class="text-xl sm:text-2xl text-gray-800 font-semibold mb-3">Search for ad spaces</h2>
              <p class="text-gray-500 -relaxed">Use our website to find the proper ad space. Filter ad spaces based on type, price, views, demographic and geographic areas.</p>
            </div>
          </div>
          <div class="number ease-in duration-700 cursor-pointer hover:shadow-2xl rounded-xl overflow-hidden max-w-xs order-3 md:row-start-1 md:col-start-2 lg:order-none">
            <div class=" py-5 px-6 sm:px-6">
              <h1 class=" font-bold text-lg border  rounded-full text-center py-2.5 w-12 mb-2.5 ">2</h1>
              <h2 class="text-xl sm:text-2xl text-gray-800 font-semibold mb-3">Connect</h2>
              <p class="text-gray-500 -relaxed">Message ad space and describe what type of promotion you are looking for.</p>
            </div>
          </div>
          <div class="number ease-in duration-700 cursor-pointer hover:shadow-2xl rounded-xl overflow-hidden max-w-xs order-5 lg:order-none">
            <div class=" py-5 px-6 sm:px-8">
              <h1 class=" font-bold text-lg border  rounded-full text-center py-2.5 w-12 mb-2.5 ">3</h1>
              <h2 class="text-xl sm:text-2xl text-gray-800 font-semibold mb-3">Reach an Agreement</h2>
              <p class="text-gray-500 -relaxed">Discuss and agree on promotion specifications, availability, pricing and posting date.</p>
            </div>
          </div>
          <div class="number ease-in duration-700 cursor-pointer hover:shadow-2xl rounded-xl overflow-hidden max-w-xs order-5 lg:order-none ">
            <div class=" py-5 px-6 sm:px-8">
              <h1 class=" font-bold text-lg border  rounded-full text-center py-2.5 w-12 mb-2.5 ">4</h1>
              <h2 class="text-xl sm:text-2xl text-gray-800 font-semibold mb-3">Results</h2>
              <p class="text-gray-500 -relaxed">See your content on the ad space. Share your experience and leave a review.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="py-10" style={{ background: '#f4f7ff' }}>
        <div class="md:flex max-w-6xl mx-auto p-6 px-8 md:p-24   md:mb-10 md:px-8  xl:px-5">
          <div class="w-full md:w-1/2 md:ml-8 items-center ">
            <div class="">
              <h1 class="font-bold text-4xl -10">Sell your <span class="text-blue-600">ad space</span></h1>
              <p class="font-normal text-sm -6 mt-4">Here’s how in three simple steps.</p>
            </div>
            <div class="flex font-normal mt-4 text-lg -8">
              <img src={check} alt="" />
              <p class="ml-2.5">Sign up as an space host.</p>
            </div>
            <div class="flex font-normal mt-4 text-lg -8">
              <img src={check} alt="" />
              <p class="ml-2.5">Setup your account and get verified.</p>
            </div>
            <div class="flex font-normal mt-4 text-lg -8">
              <img src={check} alt="" />
              <p class="ml-2.5">Have advertisers contact you.</p>
            </div>
            <div class="flex mt-4 font-bold text-base -7">
              <span class="cursor-pointer text-blue-600">Get Started</span>
              <img src={arrow} alt="" />
            </div>
          </div>
          <div class="w-full md:w-1/2 px-8 xl:px-5">
            <div>
              <section class="duration-700 container rounded-lg">
                <div class="card rounded-lg bg-white hover:bg-blue-600 hover:text-white p-4 px-8 mt-6 shadow-lg">
                  <div class="content hover:bg-blue-600">
                    <h1 class="font-semibold text-sm -7">Sign up as an space host.</h1>
                    <div class="hover_content hover:bg-blue-600 flex">
                      <div class=" items-center relative">
                        <img class="logo img-fluid my-4 w-96" src={bg} alt="mparticle" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section class="container rounded-lg">
                <div class="card rounded-lg bg-white hover:bg-blue-600 hover:text-white p-4 px-8 mt-6 shadow-lg">
                  <div class="content hover:bg-blue-600">
                    <h1 class="font-semibold text-sm -7">Setup your account and get verified.</h1>
                    <div class="hover_content hover:bg-blue-600 flex">
                      <div class=" items-center relative">
                        <img class="logo img-fluid my-4 w-96" src={bg1} alt="mparticle" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section class="container rounded-lg">
                <div class="card rounded-lg bg-white hover:bg-blue-600 hover:text-white p-4 px-8 mt-6 shadow-lg">
                  <div class="content hover:bg-blue-600">
                    <h1 class="font-semibold text-sm -7">Discuss ad campaigns with potential clients</h1>
                    <div class="hover_content hover:bg-blue-600 flex">
                      <div class=" items-center relative">
                        <img class="logo img-fluid my-4 w-96" src={bg2} alt="mparticle" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full" style={{ paddingTop: '100px', paddingBottom: '200px', backgroundColor: '#FAFAFA' }}>
        <div className='md:flex items-center max-w-screen-2xl justify-end w-full px-8 py-20 md:py-0   mx-auto xl:px-5'>
          <div class="md:w-1/2 w-full mb-6 md:mb-0">
            <img class="" src={fff} alt="" />
          </div>
          <div class="p-10 md:w-1/2 md:ml-4 items-center ">
            <div class="">
              <h1 class="font-bold text-4xl -10">Why use AdMrt?</h1>
            </div>
            <div class="flex font-normal mt-4 text-lg -8">
              <img src={check} alt="" />
              <p class="ml-2.5">AdMrt will eliminate the middleman and enable you to directly connect and communicate with ad hosts.</p>
            </div>
            <div class="flex font-normal mt-4 text-lg -8">
              <img src={check} alt="" />
              <p class="ml-2.5">Currently agencies take 30-50% of revenue from publishers. Admrt takes less fees than current agencies.</p>
            </div>
            <div class="flex font-normal mt-4 text-lg -8">
              <img src={check} alt="" />
              <p class="ml-2.5">Streamlined ad placement: discuss pricing and details with ad hosts and place orders conveniently.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
