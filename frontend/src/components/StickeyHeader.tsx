// import React, { useEffect } from 'react';

// const StickyHeader: React.FC = () => {
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY || 0; // Get scroll position

//       // Check if .header-navbar exists and toggle class
//       const headerNavbar = document.querySelector('.header-navbar');
//       if (headerNavbar) {
//         if (scrollTop > 105) {
//           headerNavbar.classList.add('sticky-top');
//         } else {
//           headerNavbar.classList.remove('sticky-top');
//         }
//       }

//       // Check if .navbar-top exists and toggle class
//       const navbarTop = document.querySelector('.navbar-top');
//       if (navbarTop) {
//         if (scrollTop > 105) {
//           navbarTop.classList.add('sticky-top');
//         } else {
//           navbarTop.classList.remove('sticky-top');
//         }
//       }
//     };

//     // Add event listener
//     window.addEventListener('scroll', handleScroll);

//     // Cleanup on component unmount
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   return null; // This component doesn't render anything itself
// };

// export default StickyHeader;

import React, { useEffect } from "react";

const StickyHeader: React.FC = () => {
  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop = window.scrollY || 0;
      const headerNavbar = document.querySelector(".header-navbar");
      const navbarTop = document.querySelector(".navbar-top");

      const isScrollingUp = scrollTop < lastScrollTop;

      if (headerNavbar || navbarTop) {
        if (scrollTop > 105 && isScrollingUp) {
          headerNavbar?.classList.add("sticky-top", "visible-header");
          navbarTop?.classList.add("sticky-top", "visible-header");
        } else if (scrollTop > 105 && !isScrollingUp) {
          headerNavbar?.classList.remove("visible-header");
          navbarTop?.classList.remove("visible-header");
        } else if (scrollTop <= 105) {
          headerNavbar?.classList.remove("sticky-top", "visible-header");
          navbarTop?.classList.remove("sticky-top", "visible-header");
        }
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
};

export default StickyHeader;
