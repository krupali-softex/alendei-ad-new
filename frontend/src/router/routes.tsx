import { RouteObject } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../components/layout/Home";
import ProtectedRoute from "./ProtectedRoute";
import CreateAdWithAI from "../components/common/CreateAdWithAI";
import CreateAdManually from "../components/common/CreateAdManually";
import DesignEditor from "../components/common/theme-components/DesignEditor";
import Designs from "../components/common/theme-components/Designs";
import PaymentPage from "../pages/PaymentPage";
import Leads from "../pages/Leads";
import SectionWrapper from "../pages/SectionWrapper";
import Business from "../pages/Business";
import Taskspace from "../pages/Taskspace";
import Grow from "../pages/Grow";
import TermsAndConditions from "../pages/TermsAndConditions";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import AdminPage from "../pages/AdminPage";
import AdminWorkspaceMembers from "../components/common/admin-components/AdminWorkspaceMembers";

export type AppRoute = RouteObject & {
  name: string;
};

const routes: AppRoute[] = [
  { path: "/login", element: <Login />, name: "Login" },
  { path: "/signup", element: <Signup />, name: "Signup" },
  { path: "/terms", element: <TermsAndConditions />, name: "Terms" },
  { path: "/privacy", element: <PrivacyPolicy />, name: "Privacy" },
  {
    path: "/",
    element: <ProtectedRoute />,
    name: "RootRoute",
    children: [
      {
        path: "admin",
        element: <SectionWrapper />,
        children: [
          { path: "", element: <AdminPage /> },
         { path: "members/:workspaceId", element: <AdminWorkspaceMembers /> },
        ],
      },
      {
        path: "home",
        element: <SectionWrapper />,
        children: [
          { path: "", element: <Home /> },
          { path: "create-ad-with-AI", element: <CreateAdWithAI /> },
          { path: "create-ad-manually", element: <CreateAdManually /> },
          { path: "payment-page", element: <PaymentPage /> },
        ],
      },
      {
        path: "designs",
        element: <SectionWrapper />,
        children: [
          { path: "", element: <Designs /> },
          { path: "editor", element: <DesignEditor /> },
        ],
      },
      { path: "leads", element: <Leads /> },
      { path: "grow", element: <Grow /> },
      { path: "business", element: <Business /> },
      { path: "taskspace", element: <Taskspace /> },
    ],
  },

];

export default routes;
