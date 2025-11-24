import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/apiService";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useDispatch } from "react-redux";
import { setLoading } from "../state/slices/loadingSlice";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    workspaceName: Yup.string()
      .trim()
      .required("Workspace name is required"),
    name: Yup.string().trim().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string()
      .min(10, "Phone number must be at least 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords do not match")
      .required("Confirm password is required"),
    acceptTerms: Yup.bool().oneOf([true], "You must accept the terms"),
  });

  const handleSignup = async (values: any) => {
    dispatch(setLoading(true));
    try {
      const res = await signupUser({
        workspace_name: values.workspaceName,
        email: values.email,
        password: values.password,
        username: values.name,
        phone: values.phone,
      });
      if (res.success) {
        toast.success("Signup successful!");
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error.message || "Oops! Something went wrong.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <main className="main d-flex align-items-center flex-column justify-content-center min-vh-100 py-5 py-xxl-0 login-bg signup-page">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-6 text-center d-none d-md-block align-self-center">
            <div className="login-img">
              <img
                src="https://ads.alendei.com/images/signup-img.webp"
                className="w-100"
                alt="Signup"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="signup-form">
              <h3 className="mb-2">Register Now</h3>
              <h1 className="form-title text-primary mb-5">
                Alendei Ad Platforms
              </h1>
              <Formik
                initialValues={{
                  workspaceName: "",
                  name: "",
                  email: "",
                  phone: "",
                  password: "",
                  confirmPassword: "",
                  acceptTerms: false,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSignup}
              >
                {({ values, setFieldValue, errors, touched }) => (
                  <Form>
                    <div className="row g-4">
                      <div className="col-md-6 col-lg-12 col-xxl-6">
                        <label className="form-label">Workspace Name</label>
                        <Field
                          type="text"
                          name="workspaceName"
                          className={`form-control ${
                            errors.workspaceName && touched.workspaceName ? "is-invalid" : ""
                          }`}
                          placeholder="Enter your Workspace Name"
                        />
                        <ErrorMessage
                          name="workspaceName"
                          component="span"
                          className="invalid-feedback"
                        />
                      </div>
                      
                      <div className="col-md-6 col-lg-12 col-xxl-6">
                        <label className="form-label">Name</label>
                        <Field
                          type="text"
                          name="name"
                          className={`form-control ${
                            errors.name && touched.name ? "is-invalid" : ""
                          }`}
                          placeholder="Enter your name"
                        />
                        <ErrorMessage
                          name="name"
                          component="span"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="col-md-6 col-lg-12 col-xxl-6">
                        <label className="form-label">E-mail</label>
                        <Field
                          type="email"
                          name="email"
                          className={`form-control ${
                            errors.email && touched.email ? "is-invalid" : ""
                          }`}
                          placeholder="Enter your email address"
                        />
                        <ErrorMessage
                          name="email"
                          component="span"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="col-md-6 col-lg-12 col-xxl-6">
                        <label className="form-label ">Phone Number</label>
                        <PhoneInput
                          defaultCountry="in"
                          value={values.phone}
                          onChange={(phone) => {
                            const numericPhone = phone.replace(/\D/g, ""); // Remove all non-numeric characters
                            setFieldValue("phone", numericPhone);
                          }}
                          className={` ${
                            errors.phone && touched.phone ? "is-invalid" : ""
                          }`}
                        />
                        <ErrorMessage
                          name="phone"
                          component="span"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="col-md-6 col-lg-12 col-xxl-6">
                        <label className="form-label">Password</label>
                        <Field
                          type="password"
                          name="password"
                          className={`form-control ${
                            errors.password && touched.password
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Enter your password"
                        />
                        <ErrorMessage
                          name="password"
                          component="span"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="col-md-6 col-lg-12 col-xxl-6">
                        <label className="form-label">Confirm Password</label>
                        <Field
                          type="password"
                          name="confirmPassword"
                          className={`form-control ${
                            errors.confirmPassword && touched.confirmPassword
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Confirm your password"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="span"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>

                    <div className="form-check mb-4 d-flex align-items-center p-0 mt-2">
                      <Field
                        type="checkbox"
                        name="acceptTerms"
                        className={`form-check-input ${
                          errors.acceptTerms && touched.acceptTerms
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      <label
                        onClick={() =>
                          setFieldValue("acceptTerms", !values.acceptTerms)
                        }
                        className="form-check-label"
                      >
                        I accept the terms of service{values.acceptTerms}
                      </label>
                    </div>
                    <ErrorMessage
                      name="acceptTerms"
                      component="span"
                      className="invalid-feedback"
                    />

                    <button
                      type="submit"
                      className="btn btn-primary btn-login w-100 mb-20"
                    >
                      Register Now
                    </button>

                    <p className="ff-semibold">
                      Already have an account?{" "}
                      <Link to="/login" className="text-primary ff-extrabold">
                        Login
                      </Link>
                    </p>
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

export default Signup;
