import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store";
import { resetState } from "../../state/store";
import { useSession } from "../../hooks/session/useSession";
import { getDecodedToken } from "../../utils/auth";




const PageEffects = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const { fetchSession, fetchAdminSession } = useSession();

     const decoded = getDecodedToken(localStorage.getItem("token"));



    // Design Effects

    useEffect(() => {
        const pageClasses: Record<string, string> = {
            "/login": "login-bg",
            "/signup": "login-bg",
        };

        const bodyClass = isAuthenticated ? "home-bg" : pageClasses[location.pathname] || "landing-bg";

        document.body.classList.remove("home-bg", "login-bg", "landing-bg");
        document.body.classList.add(bodyClass);

        return () => {
            document.body.classList.remove(bodyClass);
        };

    }, [location, isAuthenticated]);



    // Background API Calls

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && isAuthenticated) {
            if (decoded?.isSuperAdmin) {
                // Admin Background api calls

                fetchAdminSession()

            } else {
                // API calls for user session

                fetchSession()
            }
        }
    }, [isAuthenticated,decoded]);

    // Logout Effects

    useEffect(() => {
        const handleLogout = () => {
            dispatch(resetState());
            navigate("/login", { replace: true });
        };
        window.addEventListener("logoutEvent", handleLogout);
        return () => {
            window.removeEventListener("logoutEvent", handleLogout);
        };
    }, []);

    return null;
};

export default PageEffects;
