import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/apiService";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoading } from "../state/slices/loadingSlice";
import { login } from "../state/slices/authSlice";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { setUser } from "../state/slices/userSlice";

const Login: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    dispatch(setLoading(true)); // Start loading
    try {
      const res = await loginUser(values);
      if (res.success) {
        dispatch(setUser(res.user));
        dispatch(login(res));
        navigate(res.user?.isSuperAdmin ? "/admin" : "/home");
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(
        error.message ? `${error.message}` : "Oops! Something went wrong."
      );
      console.error(error);
    } finally {
      dispatch(setLoading(false)); // Stop loading
    }
  };

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
    <main className="main d-flex align-items-center flex-column justify-content-center min-vh-100 py-5 login-bg">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-5 col-xl-6 d-none d-lg-block position-relative">
            <div className="login-carousel-robot">
              <div className="robot-img">
                <img src="/assets/images/robot.webp" />
              </div>
              <div className="chatbot-wrapper">
                <div className="chatbot-bubble">
                  <div className="bubble-tail"></div>

                  <span className="typing-wrapper">
                    <span className="typing-text">I can make your ad...!</span>
                  </span>

                  <span className="typing-cursor"></span>
                </div>
              </div>
            </div>
            <div className="landing-carousel-container login-carousel position-relative">
              <img
                src="/assets/images/landing-carousel-container-bg.png"
                className="login-carousel-bg"
              />
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

            <div className="social-wrapper">
              <div className="hero-social-icon icon-msg">
                <img src="/assets/images/icon-msg.svg" alt="Send Message" />
              </div>

              <div className="hero-social-icon icon-ratio">
                <img src="/assets/images/icon-ratio.svg" alt="Ratio" />
              </div>

              <div className="hero-social-icon icon-profile">
                <img src="/assets/images/icon-profile.svg" alt="Profile" />
              </div>

              <div className="hero-social-icon icon-video">
                <img src="/assets/images/icon-video.svg" alt="Video" />
              </div>
              <div className="hero-social-icon dotted-line">
                <img src="/assets/images/dotted-line.svg" alt="Dotted Line" />
              </div>
            </div>
          </div>
          <div className="col-xl-1 d-none d-xl-block"></div>
          <div className="col-lg-7 col-xl-5">
            <div className="login-form">
              <h3 className="mb-2">Welcome to</h3>
              <h1 className="form-title text-primary mb-5 bold-text">
                Alendei Ads Platform
              </h1>
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className="mb-4">
                      <label htmlFor="loginEmail" className="form-label">
                        E-mail
                      </label>
                      <div
                        className={` input-group ${
                          errors.email && touched.email ? "is-invalid" : ""
                        }`}
                      >
                        <span className="input-group-text">
                          <i className="bi bi-envelope-fill"></i>
                        </span>
                        <Field
                          type="email"
                          className={`form-control ${
                            errors.email && touched.email ? "is-invalid" : ""
                          }`}
                          id="loginEmail"
                          name="email"
                          placeholder="Enter your email address"
                        />
                      </div>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="currentPassword" className="form-label">
                        Password
                      </label>
                      <div
                        className={`input-group password-field ${
                          errors.password && touched.password
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <span className="input-group-text">
                          <i className="bi bi-lock-fill"></i>
                        </span>
                        <Field
                          className={`form-control ${
                            errors.password && touched.password
                              ? "is-invalid"
                              : ""
                          }`}
                          id="currentPassword"
                          name="password"
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="**********"
                        />
                        <span
                          className="input-group-text field-icon toggle-password"
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          {isPasswordVisible ? (
                            <i className="bi bi-eye-fill"></i>
                          ) : (
                            <i className="bi bi-eye-slash-fill"></i>
                          )}
                        </span>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <a
                        href="#"
                        className="btn btn-link justify-content-md-end mt-2 ff-semibold"
                      >
                        Forgot password?
                      </a>
                    </div>

                    <button
                      className="btn btn-primary btn-login w-100 mb-4"
                      type="submit"
                    >
                      Log In
                    </button>
                    <p className="ff-semibold text-center mb-2">
                      Don't have an account?
                    </p>
                    <Link
                      to="/signup"
                      className="btn btn-outline-primary btn-login w-100"
                    >
                      Create a new account
                    </Link>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
