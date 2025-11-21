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
import {   setUser } from "../state/slices/userSlice";

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
        navigate(res.user?.isSuperAdmin ?  "/admin" : "/home");
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
        <div className="row g-5">
          <div className="col-lg-6 text-center d-none d-md-block align-self-center">
            <div className="d-flex align-items-center justify-content-center flex-column h-100">
              {/* <div className="login-img">
                <img
                  src="../assets/images/login-img.png"
                  className="w-100"
                  alt="Login Graphic"
                />
              </div> */}
              <div className="landing-carousel-container login-img">
                <div ref={sliderRef} className="keen-slider landing-carousel">
                  <div className="keen-slider__slide carousel-card">
                    <img src="https://ads.alendei.com/images/slider-img-4.webp" alt="SliderImg4" />
                  </div>
                  <div className="keen-slider__slide carousel-card post-card">
                    <img src="https://ads.alendei.com/images/slider-img-5.webp" alt="SliderImg5" />
                  </div>
                  <div className="keen-slider__slide carousel-card">
                    <img src="https://ads.alendei.com/images/slider-img-6.webp" alt="SliderImg6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
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
                    <div className="mb-3">
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
                      className="btn btn-primary btn-login w-100 mb-3"
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
