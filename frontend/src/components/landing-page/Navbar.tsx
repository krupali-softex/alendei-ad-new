import React from "react";
import { Link } from "react-router-dom";
import StickyHeader from "../StickeyHeader";

const Navbar: React.FC = () => {
  return (
    <>
      <StickyHeader />
      <header className="navbar navbar-top navbar-expand-lg">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between w-100 w-lg-auto">
            <div className="d-flex align-items-center">
              <button
                className="navbar-toggler me-3 border-0 p-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <Link to="/" className="d-inline-flex nav-logo">
                <img
                  src="https://ads.alendei.com/images/logo.webp"
                  alt="Alendei"
                  width="157"
                  className=""
                />
              </Link>
            </div>
            <Link
              to="/login"
              className="btn btn-outline-secondary btn-login-mobile d-flex d-lg-none"
            >
              Log In
            </Link>
          </div>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="nav navbar-nav align-items-center">
              <div className="px-3 mb-3 align-items-center mobileMenuHead">
                <button
                  className="btn-close me-20"
                  type="button"
                  aria-label="Close"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                ></button>
                <Link to="/" className="d-inline-flex nav-logo">
                  <img
                    src="https://ads.alendei.com/images/logo.webp"
                    alt="Alendei"
                    width="157"
                    className=""
                  />
                </Link>
              </div>
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  Pricing
                </Link>
              </li>
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  Contact
                </Link>
              </li>
              <li className="nav-item d-flex gap-3">
                <Link
                  to="/login"
                  className="btn btn-outline-secondary d-none d-lg-flex"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  type="button"
                  className="btn btn-primary px-3"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
