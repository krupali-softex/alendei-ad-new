// src/hooks/useSession.ts
import { useDispatch } from "react-redux";
import { setDefaultWorkspace, setAllWorkspaces } from "../../state/slices/workspaceSlice";
import { resetState } from "../../state/store";
import { logout } from "../../state/slices/authSlice";
import { setUser } from "../../state/slices/userSlice";
import { setLoading } from "../../state/slices/loadingSlice";
import { getSessionData, getAdminSessionData } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useSession = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchSession = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getSessionData();
      dispatch(setUser(response.user));
      dispatch(setDefaultWorkspace(response.defaultWorkspace));
      dispatch(setAllWorkspaces(response.workspaces));
    } catch (error) {
      toast.error("Oops! Something went wrong.");
      dispatch(resetState());
      dispatch(logout());
      navigate("/login", { replace: true });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchAdminSession = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAdminSessionData();
      // Needs to be updated from backend
      const user = {
        id: 0,
        email: response.data.email,
        username: response.data.name,
      }
      dispatch(setUser(user));
    } catch (error) {
      toast.error("Oops! Something went wrong.");
      dispatch(resetState());
      dispatch(logout());
      navigate("/login", { replace: true });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { fetchSession, fetchAdminSession };
};
