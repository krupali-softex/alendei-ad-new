import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import routes from "./router/routes";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./components/common/ui-common/Loader.tsx";
import PageEffects from "./components/common/PageEffects";

const AppRoutes = () => {
  return useRoutes(routes);
};

const App: React.FC = () => {
  return (
    <Router>
      <Loader />
      <PageEffects />
      <AppRoutes />
    </Router>
  );
};

export default App;
