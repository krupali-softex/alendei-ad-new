// hooks/useWorkspaceSwitcher.ts
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { switchWorkspace } from "../../services/apiService"; // your API function
import { useSession } from "../session/useSession";
import { setLoading } from "../../state/slices/loadingSlice";
import { login } from "../../state/slices/authSlice";
import { toast } from "react-toastify";
import { SwitchWorkspaceResponse } from "../../types"; // your types
import { resetState } from "../../state/store"; // action to reset state

export const useWorkspaceSwitcher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fetchSession } = useSession();
  const handleSwitchWorkspace = async (workspaceId: string) => {
    try {
      dispatch(setLoading(true));

      const res = await switchWorkspace(workspaceId);

      if (res.success) {
        dispatch(resetState());
        dispatch(login({ token: res.token }));
        fetchSession();
        navigate("/home");
        toast.success(`Switched to workspace "${res.defaultWorkspace.name}" successfully.`);
      } else {
        throw new Error("Oops! Something went wrong.");
      }
    } catch (err) {
      toast.error("Oops! Something went wrong.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const SwitchToNewWorkspaceWithRes = async (res: SwitchWorkspaceResponse) => {
    try {
      dispatch(setLoading(true));
      if (res.success) {
        // Reset the state to clear all previous data
        dispatch(resetState());
        dispatch(login({ token: res.token }));
        fetchSession();
        navigate("/home");
        toast.success(`Switched to workspace "${res.defaultWorkspace.name}" successfully.`);
      } else {
        throw new Error("Oops! Something went wrong.");
      }
    } catch (err) {
      toast.error("Oops! Something went wrong.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleSwitchWorkspace, SwitchToNewWorkspaceWithRes };
};
