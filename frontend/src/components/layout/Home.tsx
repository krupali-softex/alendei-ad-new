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
    loop: false,
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
      <div className="container pt-lg-5 pt-0">
        <div className="home-page-sections">
          <div className="row">
            <div className="col-lg-5 col-12">
              <h2 className="section-title mb-20">
                <span className="ff-extrabold">High-Impact Ads,</span>
                <br /> Create in Just a Few Clicks.
              </h2>
              <p className="subheading-text mb-5">
                AI can automatically optimize filters and campaigns, or you can
                set them manually by entering your own data.
              </p>

              <div className="d-flex flex-wrap gap-4 mb-5 justify-content-center align-items-center justify-content-lg-start">
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
              <div className="fb-sections">
                <p className="mb-4 fb-text">Already have a Facebook page?</p>
                <div className="fb-box">
                  <div className="">
                    <img src="/assets/images/fb-text.svg" className="mb-2" />
                    <p className="connect-text">Connect with Your Account</p>
                  </div>
                  <a
                    className="btn btn-facebook"
                    href={`https://ads.alendei.com/facebook/fblogin?token=${token}`}
                  >
                    <img src="/assets/images/link.svg" className="me-3" />
                    Link your page
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-7 col-12 position-relative ">
              <div className="landing-carousel-container position-relative">
                <div className="robot-img">
                  <img src="/assets/images/robot.webp" />
                </div>
                <div className="chatbot-wrapper">
                  <div className="chatbot-bubble">
                    <div className="bubble-tail"></div>

                    <span className="typing-wrapper">
                      <span className="typing-text">
                        I can make your ad...!
                      </span>
                    </span>

                    <span className="typing-cursor"></span>
                  </div>
                </div>
                <div ref={sliderRef} className="keen-slider landing-carousel">
                  <div className="keen-slider__slide carousel-card">
                    <img
                      src="/assets/images/slider-img-1.webp"
                      alt="slider-img-1"
                    />
                  </div>
                  <div className="keen-slider__slide carousel-card post-card">
                    <img
                      src="/assets/images/slider-img-2.webp"
                      alt="slider-img-2"
                    />
                  </div>
                  <div className="keen-slider__slide carousel-card">
                    <img
                      src="/assets/images/slider-img-3.webp"
                      alt="slider-img-3"
                    />
                  </div>
                  <div className="keen-slider__slide carousel-card">
                    <img
                      src="/assets/images/slider-img-4.webp"
                      alt="slider-img-4"
                    />
                  </div>
                </div>
              </div>
              <div className="ring-wrapper">
                <div className="outer-ring">
                  <img src="/assets/images/outer-ring.svg" alt="" />
                </div>
                <div className="inner-ring">
                  <img src="/assets/images/inner-ring.svg" alt="" />
                </div>
              </div>
              <div className="social-wrapper">
                <div className="hero-social-icon social-facebook">
                  <img src="/assets/images/icon-facebook.svg" alt="Facebook" />
                </div>

                <div className="hero-social-icon social-meta">
                  <img src="/assets/images/icon-meta.svg" alt="Meta" />
                </div>

                <div className="hero-social-icon social-create-ad">
                  <img
                    src="/assets/images/icon-create-ad.svg"
                    alt="Create Ad"
                  />
                </div>

                <div className="hero-social-icon social-instagram">
                  <img
                    src="/assets/images/icon-instagram.svg"
                    alt="Instagram"
                  />
                </div>

                <div className="hero-social-icon social-location">
                  <img
                    src="/assets/images/icon-location.svg"
                    alt="Location"
                    style={{ width: "88%" }}
                  />
                </div>
              </div>

              {/* <ul id="progress-bar" className="progressbar">
              <li className="gradient-title">Select Goal</li>
              <li className="gradient-title">Pick Platform</li>
              <li className="gradient-title">Launch Ads</li>
            </ul> */}
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Home;
