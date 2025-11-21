import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const Home: React.FC = () => {
  const defaultWorkspace = useSelector(
    (state: RootState) => state.workspace.defaultWorkspace
  );

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (slider) {
      interval = setInterval(() => {
        slider.current?.next();
      }, 2000); // rotate every 3 seconds
    }

    return () => clearInterval(interval);
  }, [slider]);

  // const handleDisconnect = async (pageId: string) => {
  //   pageId
  //  // Logic to handle disconnection of a Facebook page
  // };

  const token = localStorage.getItem("token");
  return (
    <div className="content p-0 my-5">
      {/* <div className="home-content-box"> */}
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h2 className="section-title mb-20">
              <span className="ff-extrabold">High-Impact Ads,</span>
              <br /> Create in Just a Few Clicks.
            </h2>
            <p className="subheading-text mb-5">
              AI can automatically optimize filters and campaigns, or you can
              set them manually by entering your own data.
            </p>

            <div className="d-flex gap-4 mb-5">
              <Link
                to="/home/create-ad-with-AI"
                className={`btn btn-ad-ai ${
                  !(
                    defaultWorkspace.linkedPages &&
                    defaultWorkspace.linkedPages?.length > 0
                  )
                    ? "disabled"
                    : ""
                }`}
                onClick={(e) =>
                  !(
                    defaultWorkspace.linkedPages &&
                    defaultWorkspace.linkedPages?.length > 0
                  ) && e.preventDefault()
                }
              >
                Create ad with AI{" "}
                <img
                  src="https://ads.alendei.com/images/stars.svg"
                  alt="Stars"
                  className="ms-2"
                />
              </Link>

              <Link
                to="/home/create-ad-manually"
                className={`btn btn-ad-manually ${
                  !(
                    defaultWorkspace.linkedPages &&
                    defaultWorkspace.linkedPages?.length > 0
                  )
                    ? "disabled"
                    : ""
                }`}
                onClick={(e) =>
                  !(
                    defaultWorkspace.linkedPages &&
                    defaultWorkspace.linkedPages?.length > 0
                  ) && e.preventDefault()
                }
              >
                Create ad manually
              </Link>
            </div>
            <div className="mb-30">
              <p className="mb-4 fb-text">Already have a Facebook page?</p>
              <div className="fb-box">
                <a
                  className="btn btn-facebook"
                  href={`https://ads.alendei.com/facebook/fblogin?token=${token}`}
                >
                  <img
                    src="https://ads.alendei.com/images/fb-white.svg"
                    className="me-3"
                  />
                  Link your facebook page
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            {/* <div className="landing-img">
                <img
                  src="https://ads.alendei.com/images/hero-banner-img.webp"
                  alt="Ad"
                  className="img-fluid"
                />
              </div> */}

            <div className="landing-carousel-container">
              <div ref={sliderRef} className="keen-slider landing-carousel">
                <div className="keen-slider__slide carousel-card">
                  <img
                    src="https://ads.alendei.com/images/slider-img-1.webp"
                    alt="slider-img-1"
                  />
                </div>
                <div className="keen-slider__slide carousel-card post-card">
                  <img
                    src="https://ads.alendei.com/images/slider-img-2.webp"
                    alt="slider-img-2"
                  />
                </div>
                <div className="keen-slider__slide carousel-card">
                  <img
                    src="https://ads.alendei.com/images/slider-img-3.webp"
                    alt="slider-img-3"
                  />
                </div>
              </div>
            </div>
            <ul id="progress-bar" className="progressbar">
              <li className="gradient-title">Select Goal</li>
              <li className="gradient-title">Pick Platform</li>
              <li className="gradient-title">Launch Ads</li>
            </ul>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Home;
