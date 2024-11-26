import { Swiper, SwiperSlide } from 'swiper/react';
import svg1 from './AuthPage/images/logo.svg'

import 'swiper/css';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';

export default function App() {
  return (
    <>
    <div className='onboarding'>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
        <div className='card-slide'>  
          <div>
            <img className="w-56 mt-32 fill-white" src={svg1} alt='' />
            <h1 className="mt-6 text-3xl text-white md:text-3xl lg:text-4xl xl:text-5xl">Improve your business with AdMrt!</h1>
           </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className='card-slide'>  
          <div>
            <img className="w-56 mt-32" src={svg1} alt='' />
            <h1 className="mt-6 text-3xl text-white md:text-3xl lg:text-4xl xl:text-5xl">Improve your business with AdMrt!</h1>
          </div>
        </div>
        </SwiperSlide>
        <SwiperSlide>
         <div className='card-slide'>
          <div> 
            <img className="w-56 mt-32" src={svg1} alt='' />
            <h1 className="mt-6 text-3xl text-white md:text-3xl lg:text-4xl xl:text-5xl">Improve your business with AdMrt!</h1>
          </div> 
         </div>
        </SwiperSlide>
      </Swiper>
      </div>
    </>
  );
}
