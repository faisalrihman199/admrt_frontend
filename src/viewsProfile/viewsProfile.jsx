// import profile_Aus from '../svgs/reviews/Profile-aus.svg';
// import profile_amer from '../svgs/reviews/Profile-amer.svg';
// import profile_china from '../svgs/reviews/Profile-china.svg';
// import flag_Aus from '../svgs/reviews/Rectangle 6596.svg';
// import reviews_img from '../svgs/reviews/Rectangle 6596 (1).svg';
// import reviews_img2 from '../svgs/reviews/Rectangle 6596 (2).svg';
// import reviews_img3 from '../svgs/reviews/Rectangle 6596 (3).svg';
// import reviews_img4 from '../svgs/reviews/Rectangle 6596 (4).svg';
import EditBackground from "./others/editeBg";
import EditeUser from "./others/user";
import IntoDescription from "./others/description";
import AboutHim from './others/abouthim';
import SocialMedia from './others/socialMedia';
import { useEffect, useState } from 'react';
import Loading from '../loading/loading'
import Portfolio from './others/portfolio'
import { useParams } from 'react-router-dom'
import { Specification } from "../Layout/context/specification";
import { MainAdSpace } from "./others/adspace";
import { ProductAdventiser } from "../Layout/context/adventiser/productAdventiser";

function ViewsProfile() {
  const [loading, setLoading] = useState(true);
  const { split } = useParams();

  useEffect(() => {
    const loadingTime = setTimeout(() => {
      setLoading(false)
    }, 1200);

    return () => clearTimeout(loadingTime)
  })

  return (
    <div className="App">
      {loading && <Loading />}
      <div className="max-w-screen-2xl mx-auto">
        <div className="md:flex">
          <div className="w-full order-2 md:w-2/3">
            <div className={"border p-2 md:p-5 rounded-xl"}>
              <EditBackground />
              <EditeUser />
              <IntoDescription />
              <div>
                <Specification />
              </div>
            </div>
            {split === 'adSpaceHost' && <Portfolio />}
            {split !== 'adSpaceHost' && <ProductAdventiser />}
          </div>
          <div class="w-full py-0 max-[1200px]:px-4 px-10 order-1 md:order-2 md:w-1/3">
            <AboutHim />
            <SocialMedia />
            <MainAdSpace />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewsProfile;