import React, { useEffect } from "react";
// import { Link } from "react-router-dom";

import Navbar from "../components/landing-page/Navbar";
import TestimonialSlider from "../components/TestimonialSlider";
import { Link } from "react-router-dom";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const LandingPage: React.FC = () => {
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

  return (
    <>
      <main className="main landing-bg">
        <Navbar />
        <div className="hero-section">
          <div className="container">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6 text-center text-md-start">
                <div className="hero-content">
                  <h2 className="text-capitalize mb-3">
                    Where Advertising Turns
                  </h2>
                  <h1 className="ff-bold mb-3 mb-md-40">Smarter & Sharper</h1>
                  <p className="text-capitalize">
                    Let intelligent automation push your ads to the audience
                    that actually matters.
                  </p>
                  <div className="button-group d-inline-flex gap-3">
                    <Link to="#" className="btn btn-light">
                      Book a demo
                    </Link>
                    <Link to="#" className="btn btn-gradient">
                      Try Automate with Ai{" "}
                      <img
                        src="https://ads.alendei.com/images/stars.svg"
                        alt="Stars"
                        className="ms-2"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 text-center hero-carousel position-relative">
                <div className="effective-ad">
                  Do you run ad fast and effectively?
                  <div className="mt-12">
                    <img src="/assets/images/hero-arrow-blue.svg" />
                  </div>
                </div>

                <div className="hero-carousel-robot">
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
                </div>

                <div className="landing-carousel-container position-relative">
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
                    <img
                      src="/assets/images/icon-facebook.svg"
                      alt="Facebook"
                    />
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="whyChoose-section">
          <div className="container">
            <div className="row gy-4 align-items-center">
              <div className="col-lg-6 order-2 order-lg-1">
                <div className="whyChoose-quality">
                  <div className="qualityTitle mb-4">
                    <img
                      src="https://ads.alendei.com/images/creative.svg"
                      alt="Creative AI"
                      className="me-20"
                    />
                    Creative AI
                  </div>
                  <p className="mb-2 mb-md-0">
                    AI empowers your brand with meaningful creatives that reach
                    the right audience, boosting visibility, engagement, and
                    long-term success, while optimizing performance across every
                    campaign
                  </p>
                  <Link to="" className="gradient-title">
                    Read More
                  </Link>
                </div>

                <div className="whyChoose-quality">
                  <div className="qualityTitle mb-4">
                    <img
                      src="https://ads.alendei.com/images/target.svg"
                      alt="Targeting AI"
                      className="me-20"
                    />
                    Targeting AI
                  </div>
                  <p className="mb-2 mb-md-0">
                    AI ensures optimal budget allocation across the right
                    channels with precise targeting, maximizing conversions and
                    delivering the best results htmlFor your campaigns.
                  </p>
                  <Link to="" className="gradient-title">
                    Read More
                  </Link>
                </div>

                <div className="whyChoose-quality">
                  <div className="qualityTitle mb-4">
                    <img
                      src="https://ads.alendei.com/images/optimize.svg"
                      alt="Optimizing & Reporting AI"
                      className="me-20"
                    />
                    Optimizing & Reporting AI
                  </div>
                  <p className="mb-2 mb-md-0">
                    AI optimizes your ad campaigns using data-driven insights,
                    with powerful reporting and CRM tools to track every lead,
                    enhance targeting, and maximize conversions.
                  </p>
                  <Link to="" className="gradient-title">
                    Read More
                  </Link>
                </div>
              </div>
              <div className="col-lg-6 order-1 order-lg-2 text-center">
                <h1 className="section-title gradient-title mb-12">
                  Why Choose Us?
                </h1>
                <p className="subheading-text content-box-sm text-capitalize mx-auto">
                  Smart AI solutions streamline your ad campaigns, optimizing
                  design, targeting, and performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="scaleAd-section">
          <div className="container">
            <div className="scaleAd-box d-flex align-items-center justify-content-between">
              <div>
                Scale your ads with{" "}
                <span className="ff-bold text-white">Alendei’s Ai now.</span>
              </div>
              <Link to="" className="btn btn-light">
                Book a demo
              </Link>
            </div>
          </div>
        </div>

        <div className="step-section">
          <div className="container">
            <div className="content-box-sm text-center mb-60">
              <h1 className="section-title gradient-title">3 Simple Steps</h1>
              <h3 className="subtitle mb-4 ">
                to Launch Your Ads{" "}
                <img
                  src="https://ads.alendei.com/images/launch.svg"
                  className="ms-3"
                />
              </h3>
              <p className="subheading-text text-capitalize">
                Accelerate your business growth with AI-driven campaigns,
                delivering results in just few clicks.
              </p>
            </div>
            <div className="row g-20">
              <div className="col-lg-4 col-12">
                <div className="card step-card h-100 shadow-sm">
                  <span className="step-badge">Step 1</span>
                  <h3 className="text-primary mb-20 ff-semibold">
                    Select Your Goal
                  </h3>
                  <p className="mb-40">
                    Experience tailored advertising solutions designed to meet
                    your specific business needs, including branding, lead
                    generation, calls, app installs, and much more.
                  </p>
                  <Link
                    to="#"
                    className="text-decoration-underline text-black ff-bold"
                  >
                    Read More
                  </Link>
                </div>
              </div>
              <div className="col-lg-4 col-12">
                <div className="card step-card h-100 shadow-sm">
                  <span className="step-badge">Step 2</span>
                  <h3 className="text-primary mb-20 ff-semibold">
                    Pick the Platform & Budget
                  </h3>
                  <p className="mb-40">
                    Effortlessly choose your platform and budget with options
                    tailored to your unique business category, preferences, or
                    goals, ensuring a customized advertising strategy that
                    aligns with your needs..
                  </p>
                  <Link
                    to="#"
                    className="text-decoration-underline text-black ff-bold"
                  >
                    Read More
                  </Link>
                </div>
              </div>
              <div className="col-lg-4 col-12">
                <div className="card step-card h-100 shadow-sm">
                  <span className="step-badge">Step 3</span>
                  <h3 className="text-primary mb-20 ff-semibold">
                    Launch Ads on Multiple Platforms
                  </h3>
                  <p className="mb-40">
                    With a single click, launch your ad campaigns across
                    multiple platforms And seamlessly track performance,
                    insights, And results from one centralized dashboard htmlFor
                    complete convenience and efficiency.
                  </p>
                  <Link
                    to="#"
                    className="text-decoration-underline text-black ff-bold"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="benefit-section">
          <div className="container">
            <div className="content-box-sm text-center mb-60">
              <h1 className="section-title gradient-title">Benefits of Us?</h1>
              <p className="subheading-text text-capitalize">
                Unlock unprecedented ad performance with our smart, adaptive AI
                marketing technology.
              </p>
            </div>
           
            <div className="row g-4 g-md-5 align-items-center">
              <div className="col-lg-6 col-12 order-1 order-lg-0">
                <div className="benefit-sectionImg text-center">
                  <img
                    src="/assets/images/benifit-img1.webp"
                    alt="AI campaign"
                    className="w-100"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-12 ">
                <div className="content-box-sm benifit-content">
                  <h3 className="subtitle gradient-title mb-lg-3 mb-1">
                    AI Makes Setting Up Campaigns Smarter & Faster
                  </h3>
                  <p className="text-body-secondary">
                    Leverage the power of AI to design impactful, engaging, and
                    customized ads effortlessly. Streamline your ad creation
                    process and captivate your audience with precision and
                    creativity in minutes.
                  </p>
                </div>
              </div>
            </div>

            <div className="row g-4 g-md-5 align-items-center">
              <div className="col-lg-6 col-12 order-1 mt-0 mt-lg-4">
                <div className="benefit-sectionImg text-center">
                  <img
                    src="https://ads.alendei.com/images/benifit-img2.webp"
                    alt="Multiple platforms Ads"
                    className="w-100"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-12">
                <div className="content-box-sm benifit-content">
                  <h3 className="subtitle gradient-title mb-lg-3 mb-1">
                    Multiple platforms Ads Publishing
                  </h3>
                  <p className="text-body-secondary">
                    Manage ads across multiple platforms And monitor all
                    performance in one place
                  </p>
                </div>
              </div>
            </div>

            <div className="row g-4 g-md-5 align-items-center">
              <div className="col-lg-6 col-12 order-1 order-lg-0 mt-3 mt-lg-0">
                <div className="benefit-sectionImg text-center">
                  <img
                    src="/assets/images/benifit-img3.webp"
                    alt="Performance with Alendei AI"
                    className="w-100"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-12">
                <div className="content-box-sm benifit-content">
                  <h3 className="subtitle gradient-title mb-lg-3 mb-1">
                    Better Performance with Alendei ai
                  </h3>
                  <p className="text-body-secondary">
                    Achieve enhanced results with AI-powered tools that optimize
                    efficiency, accuracy, and creativity, delivering superior
                    performance and smarter solutions tailored to your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="testimonial-section">
          <div className="container">
            <div className="text-center mb-60">
              <h1 className="section-title gradient-title gradient-primary d-flex align-items-center justify-content-center">
                Beloved by Customers,
                <img
                  src="https://ads.alendei.com/images/smiley.gif"
                  className="smiley-gif"
                />
              </h1>
              <h3 className="subtitle mb-4 ">Trusted by All !</h3>
              <p className="subheading-text text-capitalize content-box-sm">
                Don’t just take our word htmlFor it. hear directly from our
                users about their experiences with our service.
              </p>
            </div>
            <TestimonialSlider />
          </div>
        </div>

        <footer className="">
          <div className="container">
            <div className="row g-3 gy-5 gy-lg-3 justify-content-between">
              <div className="col-lg-4 text-center text-lg-start">
                <img
                  src="https://ads.alendei.com/images/logo-white.svg"
                  alt="Alendei"
                  className="mb-25 footer-logo"
                />
                <p className="mx-auto mx-lg-0">
                  We are a digital marketing company focused on driving growth
                  through SEO, social media, PPC, and content strategies.
                </p>
              </div>
              <div className="col-auto">
                <h5>Quick Links</h5>
                <ul className="list-unstyled footer-list">
                  <li>
                    <Link to="#">Products</Link>
                  </li>
                  <li>
                    <Link to="#">About</Link>
                  </li>
                  <li>
                    <Link to="#">Partnership</Link>
                  </li>
                  <li>
                    <Link to="#">Careers</Link>
                  </li>
                  <li>
                    <Link to="#">Contact</Link>
                  </li>
                </ul>
              </div>

              <div className="col-auto">
                <h5>Useful Links</h5>
                <ul className="list-unstyled footer-list">
                  <li>
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" target="_blank" rel="noopener noreferrer">
                      Terms and Condition
                    </a>
                  </li>
                  <li>
                    <Link to="#">Careers</Link>
                  </li>
                </ul>
              </div>
              <div className="col-auto">
                <h5>Contribute</h5>
                <ul className="list-unstyled footer-list">
                  <li>
                    <Link to="#">Management</Link>
                  </li>
                  <li>
                    <Link to="#">Reporting</Link>
                  </li>
                  <li>
                    <Link to="#">Tracking</Link>
                  </li>
                  <li>
                    <Link to="#">Subscribe</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="copyright">
            <div className="container">
              <div className="row g-3 g-lg-2">
                <div className="col-md-6 text-center text-md-start">
                  Copyright © {new Date().getFullYear()} Alendei App
                </div>
                <div className="col-md-6 text-center text-md-end"></div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default LandingPage;
