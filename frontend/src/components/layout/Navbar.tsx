import React from "react";
import { Link, useNavigate } from "react-router-dom";
import StickyHeader from "../StickeyHeader";
import { logout } from "../../state/slices/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { resetState } from "../../state/store";

import WorkspaceSwitcher from "../common/navbar-common/WorkspaceSwitcher";
import ConfirmationModal from "../common/ui-common/ConfirmationModal";
import NotificationDropdown from "../common/navbar-common/NotificationDropdown";
import FacebookPageSwitcher from "../common/navbar-common/FacebookPageSwitcher";
import { getDecodedToken } from "../../utils/auth";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const decoded = getDecodedToken(localStorage.getItem("token"));

  const defaultWorkspace = useSelector(
    (state: RootState) => state.workspace.defaultWorkspace
  );
  const user = useSelector((state: RootState) => state.user.data);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
    dispatch(resetState());
  };

  return (
    <>
      <StickyHeader />

      <nav className="navbar header-navbar">
        <div className="container">
          {decoded?.isSuperAdmin ? (
            <Link to="#" className="d-inline-flex nav-logo flex-1">
              <img
                src="/assets/images/logo.svg"
                alt="Alendei"
                width="110"
                className=""
              />
            </Link>
          ) : (
            <Link to="#" className="d-inline-flex nav-logo flex-1">
              <img
                src="/assets/images/logo.svg"
                alt="Alendei"
                width="110"
                className=""
              />
            </Link>
          )}

          <div className="top-nav mx-3">
            {decoded?.isSuperAdmin ? (
              <ul className="nav">
                <li className="nav-item">
                  <Link
                    to="/admin"
                    className={`nav-link ${
                      location.pathname.startsWith("/admin") ? "active" : ""
                    }`}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="29"
                        viewBox="0 0 32 29"
                        fill="none"
                      >
                        <path
                          d="M15.6542 0.0654297C15.6542 0.0654297 6.02397 8.37862 0.642195 12.8808C0.470869 13.03 0.332845 13.2135 0.237094 13.4195C0.141343 13.6255 0.0900084 13.8493 0.0864258 14.0764C0.0864258 14.4893 0.250443 14.8853 0.542395 15.1772C0.834347 15.4692 1.23032 15.6332 1.6432 15.6332H4.75676V26.5306C4.75676 26.9435 4.92077 27.3395 5.21272 27.6314C5.50468 27.9234 5.90065 28.0874 6.31353 28.0874H10.9839C11.3967 28.0874 11.7927 27.9234 12.0847 27.6314C12.3766 27.3395 12.5406 26.9435 12.5406 26.5306V20.3035H18.7677V26.5306C18.7677 26.9435 18.9318 27.3395 19.2237 27.6314C19.5157 27.9234 19.9116 28.0874 20.3245 28.0874H24.9949C25.4077 28.0874 25.8037 27.9234 26.0957 27.6314C26.3876 27.3395 26.5516 26.9435 26.5516 26.5306V15.6332H29.6652C30.0781 15.6332 30.474 15.4692 30.766 15.1772C31.0579 14.8853 31.222 14.4893 31.222 14.0764C31.2198 13.845 31.165 13.617 31.0617 13.4099C30.9584 13.2027 30.8093 13.0218 30.6257 12.8808C25.2813 8.37862 15.6542 0.0654297 15.6542 0.0654297Z"
                          fill="#85C5A2"
                        />
                      </svg>
                    </span>
                    <span className="nav-text">Admin </span>
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="nav gap-20 flex-nowrap">
                <li className="nav-item">
                  <Link
                    to="/home"
                    className={`nav-link ${
                      location.pathname.startsWith("/home") ? "active" : ""
                    }`}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <path
                          d="M14.9998 4.01172C14.9998 4.01172 7.44624 10.5323 3.22499 14.0636C3.0906 14.1806 2.98234 14.3245 2.90724 14.4861C2.83214 14.6477 2.79187 14.8232 2.78906 15.0014C2.78906 15.3252 2.91771 15.6358 3.14671 15.8648C3.3757 16.0938 3.68629 16.2225 4.01014 16.2225H6.45228V24.77C6.45228 25.0938 6.58093 25.4044 6.80993 25.6334C7.03892 25.8624 7.34951 25.991 7.67336 25.991H11.3366C11.6604 25.991 11.971 25.8624 12.2 25.6334C12.429 25.4044 12.5577 25.0938 12.5577 24.77V19.8857H17.4419V24.77C17.4419 25.0938 17.5706 25.4044 17.7996 25.6334C18.0286 25.8624 18.3392 25.991 18.663 25.991H22.3262C22.6501 25.991 22.9607 25.8624 23.1897 25.6334C23.4187 25.4044 23.5473 25.0938 23.5473 24.77V16.2225H25.9895C26.3133 16.2225 26.6239 16.0938 26.8529 15.8648C27.0819 15.6358 27.2105 15.3252 27.2105 15.0014C27.2088 14.8198 27.1658 14.641 27.0848 14.4786C27.0038 14.3161 26.8868 14.1742 26.7429 14.0636C22.5509 10.5323 14.9998 4.01172 14.9998 4.01172Z"
                          fill="#BDD0ED"
                        />
                      </svg>
                    </span>
                    <span className="nav-text">Home </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/designs"
                    className={`nav-link ${
                      location.pathname.startsWith("/designs") ? "active" : ""
                    }`}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <path
                          d="M14.9996 5.44531C15.6458 5.44531 16.2399 5.44531 16.7889 5.44966V24.5496C16.2399 24.5539 15.6458 24.5539 14.9996 24.5539C10.9451 24.5539 8.91786 24.5539 7.52728 23.5099C7.13406 23.2146 6.78462 22.8652 6.48934 22.4719C5.44531 21.0814 5.44531 19.0541 5.44531 14.9996C5.44531 10.9451 5.44531 8.91787 6.48934 7.52815C6.78455 7.13462 7.134 6.78488 7.52728 6.48934C8.91786 5.44531 10.9451 5.44531 14.9996 5.44531ZM22.4711 23.5099C21.4913 24.2464 20.1937 24.4636 18.0917 24.527V14.131H24.5539V14.9996C24.5539 19.0541 24.5539 21.0814 23.5099 22.4719C23.2146 22.8654 22.8654 23.2146 22.4719 23.5099H22.4711ZM24.5452 12.8282H18.0917V5.47137C20.1937 5.53564 21.4913 5.75279 22.4719 6.48934C22.8652 6.78488 23.2147 7.13462 23.5099 7.52815C24.3481 8.64426 24.5122 10.1712 24.5452 12.8282Z"
                          fill="#BDD0ED"
                        />
                      </svg>
                    </span>
                    <span className="nav-text">Designs</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/grow"
                    className={`nav-link ${
                      location.pathname.startsWith("/grow") ? "active" : ""
                    }`}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <path
                          d="M7.06837 17.561H4.70522V16.702C4.69222 15.4975 5.0112 14.3128 5.62717 13.2777C6.24314 12.2426 7.1323 11.3971 8.19712 10.8341C9.24609 10.3168 10.3821 9.99934 11.5473 9.89773C11.0382 10.5277 10.5276 11.1971 10.0157 11.9061C8.86252 13.6971 7.87597 15.59 7.06837 17.561ZM18.0912 19.9774C16.3004 21.132 14.4076 22.12 12.4364 22.929V25.2921H13.2954C14.4998 25.3051 15.6846 24.9862 16.7197 24.3702C17.7548 23.7542 18.6002 22.8651 19.1633 21.8002C19.6805 20.7513 19.998 19.6152 20.0996 18.4501C19.4725 18.9569 18.8031 19.466 18.0912 19.9774ZM25.3216 7.24509C25.2073 10.9844 22.5152 14.6928 17.0905 18.5841C15.6143 19.5411 14.0569 20.3666 12.4364 21.0512V20.5676C12.4325 19.7714 12.1145 19.0089 11.5515 18.4458C10.9885 17.8828 10.226 17.5648 9.4298 17.561H8.94618C9.63159 15.9404 10.4583 14.3833 11.4167 12.9077C15.2986 7.49163 19.0009 4.79948 22.7342 4.67578C24.5949 4.67578 25.3216 5.43601 25.3216 7.24509ZM20.1675 11.9774C20.1675 11.4078 19.9412 10.8616 19.5385 10.4589C19.1357 10.0561 18.5895 9.82987 18.02 9.82987C17.4504 9.82987 16.9042 10.0561 16.5014 10.4589C16.0987 10.8616 15.8724 11.4078 15.8724 11.9774C15.8724 12.547 16.0987 13.0932 16.5014 13.4959C16.9042 13.8987 17.4504 14.1249 18.02 14.1249C18.5895 14.1249 19.1357 13.8987 19.5385 13.4959C19.9412 13.0932 20.1675 12.547 20.1675 11.9774ZM5.88551 25.1074C6.85276 24.9356 9.18499 24.4563 9.96411 23.678C10.2034 23.4387 10.3933 23.1546 10.5228 22.8419C10.6523 22.5292 10.719 22.1941 10.719 21.8556C10.719 21.5172 10.6523 21.1821 10.5228 20.8694C10.3933 20.5567 10.2034 20.2726 9.96411 20.0332C9.72479 19.7939 9.44067 19.6041 9.12799 19.4746C8.8153 19.345 8.48016 19.2784 8.14171 19.2784C7.45818 19.2784 6.80264 19.5499 6.31931 20.0332C5.54104 20.8124 5.06085 23.1446 4.88991 24.1118L4.67773 25.3196L5.88551 25.1074Z"
                          fill="#BDD0ED"
                        />
                      </svg>
                    </span>
                    <span className="nav-text">Grow</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/leads"
                    className={`nav-link ${
                      location.pathname.startsWith("/leads") ? "active" : ""
                    }`}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <path
                          d="M22.0243 4.46484H7.97677C6.02443 4.48028 4.45322 6.0735 4.46491 8.02589V18.7108C4.45322 20.6633 6.02431 22.2567 7.97677 22.2727H10.5431L13.8337 25.0822C14.4855 25.6778 15.4815 25.6866 16.1436 25.1024L19.5194 22.2718H22.0243C23.9767 22.2559 25.5478 20.6624 25.5361 18.7099V8.02589C25.5479 6.0735 23.9767 4.48028 22.0243 4.46484ZM15.0005 7.13563C19.0524 7.24275 19.0515 13.2612 15.0005 13.3692C10.9487 13.2612 10.9496 7.24535 15.0005 7.13563ZM18.731 19.5729C18.2612 19.6928 17.7831 19.4091 17.6633 18.9393C17.6627 18.9371 17.6622 18.935 17.6617 18.9329C17.2123 17.463 15.6563 16.6356 14.1864 17.085C13.3016 17.3555 12.609 18.0481 12.3385 18.9329C12.2158 19.4023 11.7359 19.6833 11.2665 19.5606C10.7972 19.438 10.5161 18.958 10.6388 18.4886C11.3177 16.0795 13.821 14.6768 16.2302 15.3557C17.7486 15.7836 18.9353 16.9702 19.3632 18.4886C19.4854 18.9622 19.2034 19.4459 18.731 19.5729Z"
                          fill="#BDD0ED"
                        />
                      </svg>
                    </span>
                    <span className="nav-text">Leads</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/business"
                    className={`nav-link ${
                      location.pathname.startsWith("/business") ? "active" : ""
                    }`}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <path
                          d="M25.1718 9.91198V13.1667C25.1718 13.8023 24.695 14.3427 24.0657 14.4317L16.908 15.3788V14.9974C16.908 14.2982 16.3359 13.7261 15.6366 13.7261H14.3653C13.666 13.7261 13.0939 14.2982 13.0939 14.9974V15.3788L5.93616 14.4317C5.30684 14.3427 4.83008 13.8023 4.83008 13.1667V9.91198C4.83008 9.21274 5.40219 8.64062 6.10144 8.64062H23.9004C24.5997 8.64062 25.1718 9.21274 25.1718 9.91198Z"
                          fill="#BDD0ED"
                        />
                        <path
                          d="M15.6366 15V16.907C15.6366 17.2567 15.3505 17.5427 15.0009 17.5427C14.6513 17.5427 14.3652 17.2567 14.3652 16.907V15H15.6366Z"
                          fill="#BDD0ED"
                        />
                        <path
                          d="M24.5352 15.6289V23.2634C24.5352 24.3123 23.677 25.1704 22.6282 25.1704H7.37188C6.32301 25.1704 5.46484 24.3123 5.46484 23.2634V15.6289C5.5602 15.6607 5.6619 15.6798 5.76361 15.6925L13.093 16.6651V16.9066C13.093 17.9555 13.9512 18.8137 15 18.8137C16.0489 18.8137 16.9071 17.9555 16.9071 16.9066V16.6651L24.2364 15.6925C24.3381 15.6798 24.4398 15.6607 24.5352 15.6289Z"
                          fill="#BDD0ED"
                        />
                        <path
                          d="M18.8126 9.91355H11.1845C10.8332 9.91355 10.5488 9.6289 10.5488 9.27787V6.73516C10.5488 5.68356 11.4043 4.82812 12.4559 4.82812H17.5413C18.5929 4.82812 19.4483 5.68356 19.4483 6.73516V9.27787C19.4483 9.6289 19.164 9.91355 18.8126 9.91355ZM11.8202 8.6422H18.177V6.73516C18.177 6.38471 17.8921 6.09948 17.5413 6.09948H12.4559C12.1051 6.09948 11.8202 6.38471 11.8202 6.73516V8.6422Z"
                          fill="#BDD0ED"
                        />
                      </svg>
                    </span>
                    <span className="nav-text">Business</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/taskspace"
                    className={`nav-link ${
                      location.pathname.startsWith("/taskspace") ? "active" : ""
                    }`}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <path
                          d="M26.0395 21.793H3.9624C3.49538 21.793 3.11328 22.1751 3.11328 22.6421C3.11328 23.1091 3.49538 23.4912 3.9624 23.4912H26.0395C26.5065 23.4912 26.8886 23.1091 26.8886 22.6421C26.8886 22.1751 26.5065 21.793 26.0395 21.793Z"
                          fill="#BDD0ED"
                        />
                        <path
                          d="M22.644 6.50781H17.5493V7.35693C17.5493 7.82394 17.1672 8.20605 16.7001 8.20605H13.3037C12.8367 8.20605 12.4546 7.82394 12.4546 7.35693V6.50781H7.35985C5.95881 6.50781 4.8125 7.65412 4.8125 9.05517V19.2446C4.8125 19.7116 5.1946 20.0937 5.66162 20.0937H24.3422C24.8092 20.0937 25.1913 19.7116 25.1913 19.2446V9.05517C25.1913 7.65412 24.045 6.50781 22.644 6.50781Z"
                          fill="#BDD0ED"
                        />
                      </svg>
                    </span>
                    <span className="nav-text">Workspace</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <ul className="navbar-nav flex-row align-items-center gap-12">
            <li className="nav-item dropdown workspace-dropdown">
              <div
                className="nav-link p-0 d-flex align-items-center p-1 rounded-pill"
                id="navbarDropdownWorkspace"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  src={
                    defaultWorkspace?.imageUrl
                      ? `${defaultWorkspace?.imageUrl}`
                      : "https://ads.alendei.com/images/workspace.webp"
                  }
                  alt="User Avatar"
                  width="33"
                  height="33"
                  className="rounded-circle me-2"
                />
                <div>
                  <span className="text-black text-capitalize f-12">
                    workspace{" "}
                  </span>
                  <div className="d-flex align-items-center">
                    <span className="ff-semibold text-black me-2 lh-1">
                      {defaultWorkspace?.name}
                    </span>
                    <img
                      src="https://ads.alendei.com/images/head-chevron-down.svg"
                      alt="Angle Down"
                      className="me-3"
                    />
                  </div>
                </div>
              </div>
              <WorkspaceSwitcher />
            </li>
            <li className="nav-item dropdown workspace-dropdown">
              <div
                className="nav-link p-0 d-flex align-items-center p-1 rounded-pill"
                id="navbarDropdownWorkspace"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  src="https://ads.alendei.com/images/fb-white.svg"
                  width="33"
                  height="33"
                  className="facebook-logo rounded-circle me-2"
                />
                <div>
                  <span className="text-black text-capitalize f-12">page </span>
                  <div className="d-flex align-items-center">
                    <span className="ff-semibold text-black me-2 lh-1">
                      {defaultWorkspace.linkedPages &&
                      defaultWorkspace?.linkedPages?.length > 0
                        ? defaultWorkspace?.linkedPages[0]?.name
                        : "Facebook Pages"}
                    </span>
                    <img
                      src="https://ads.alendei.com/images/head-chevron-down.svg"
                      alt="Angle Down"
                      className="me-3"
                    />
                  </div>
                </div>
              </div>
              <FacebookPageSwitcher />
            </li>

            {/* Notification Dropdown */}
            <NotificationDropdown />

            {/* User Dropdown */}
            <li className="nav-item dropdown">
              <Link
                to="#"
                className="nav-link p-0 d-flex align-items-center"
                id="navbarDropdownUser"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  src={
                    user?.imageUrl || "https://ads.alendei.com/images/user.webp"
                  }
                  alt="User Avatar"
                  width="45"
                  height="45"
                  className="rounded-circle"
                  style={{ border: "1px solid var(--bs-primary)" }}
                />{" "}
                {/* <span>
                <img
                  src="https://ads.alendei.com/images/head-chevron-down.svg"
                  alt="Angle Down"
                />
              </span> */}
              </Link>
              <div
                className="dropdown-menu dropdown-caret dropdown-menu-end py-0 logout-btn"
                aria-labelledby="navbarDropdownUser"
              >
                <div className="p-1">
                  <h6
                    className="dropdown-header sticky-top bg-white text-black ff-medium"
                    style={{ zIndex: 1 }}
                  >
                    {user?.username}
                  </h6>
                  <button
                    className="dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target="#logoutModal"
                  >
                    <span className="me-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 29 29"
                        fill="none"
                      >
                        <path
                          d="M3.81489 28.9326C2.95539 28.9326 2.21987 28.6268 1.60833 28.0153C0.996788 27.4038 0.690495 26.6677 0.689453 25.8072V3.92914C0.689453 3.06965 0.995746 2.33413 1.60833 1.72259C2.22092 1.11105 2.95643 0.804753 3.81489 0.803711H14.7539V3.92914H3.81489V25.8072H14.7539V28.9326H3.81489ZM21.0048 22.6817L18.856 20.4158L22.841 16.4309H10.0658V13.3054H22.841L18.856 9.32052L21.0048 7.05458L28.8184 14.8682L21.0048 22.6817Z"
                          fill="#CA3E3E"
                        />
                      </svg>
                    </span>
                    <span className="ff-medium text-danger f-16">Logout</span>
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        id="logoutModal"
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Navbar;
