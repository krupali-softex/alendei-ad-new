import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main className="main">
      <Sidebar />
      <div className="main-content home-bg">
        <Navbar />
        {children}
      </div>
    </main>
  );
};

export default Layout;
