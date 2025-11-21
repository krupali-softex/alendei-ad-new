import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { DefaultWorkspace } from "../../../types";
import { deleteWorkspace } from "../../../services/apiService";
import { setLoading } from "../../../state/slices/loadingSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setAllWorkspaces } from "../../../state/slices/workspaceSlice";
import { useWorkspaceSwitcher } from "../../../hooks/workspace/useWorkspaceSwitcher";
import { uploadImage } from "../../../services/apiService";
import { updateWorkspace } from "../../../services/apiService";
import * as Types from "../../../types";

import { useSession } from "../../../hooks/session/useSession";
import ConfirmDeleteModal from "../ui-common/ConfirmDeleteModal";

type defaultWorkspaceProps = {
  defaultWorkspace: DefaultWorkspace;
}

const DefaultWorkspaceProfile: React.FC<defaultWorkspaceProps> = ({ defaultWorkspace }) => {
  const dispatch = useDispatch();
  const { fetchSession } = useSession();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { SwitchToNewWorkspaceWithRes } = useWorkspaceSwitcher();
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<string>("https://ads.alendei.com/images/workspace.webp");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);

  const initialValues = {
    workspaceName: defaultWorkspace?.name || "",
  };

  useEffect(() => {
    if (defaultWorkspace?.imageUrl) {
      setImage(defaultWorkspace.imageUrl);
    }
  }, [defaultWorkspace]);


  const saveChanges = async (data: Types.DefaultWorkspaceFormData) => {
    let isSessionNeedsUpdate = false;
    try {
      dispatch(setLoading(true));
      try {
        if (imageFile) {
          const res = await uploadImage(imageFile, "upload-workspace-pic");
          if (res.success) {
            setImage(res.imageUrl);
          }
        }
        const res = await updateWorkspace({ workspace_name: data.workspaceName });
        if (res.success) {
          toast.success("Workspace updated successfully.");
          isSessionNeedsUpdate = true;
        } else {
          toast.error(res.message || "Failed to update profile.");
        }
      } catch (error: any) {
        console.error("Error updating workspace:", error);
        toast.error(error.response?.data?.message || "Error while updating profile.");
      }

    } finally {
      dispatch(setLoading(false));
      imageFile && setImageFile(null);
      setIsEditing(false);
      isSessionNeedsUpdate && fetchSession();

    }
  };


  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imgURL = URL.createObjectURL(event.target.files[0]);
      setImage(imgURL);
      setImageFile(event.target.files[0]);
    }
  };


  const validationSchema = Yup.object({
    workspaceName: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be less than 50 characters")
      .required("Name is required"),

  });
  const confirmDelete = () => {
    if (!selectedWorkspaceId) return;
    handleDeleteWorkspace(selectedWorkspaceId);
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      dispatch(setLoading(true));
      const res = await deleteWorkspace(workspaceId);
      if (res.success) {
        toast.success(res.message ? res.message : "Workspace deleted successfully.");
        if (res.defaultWorkspace) {
          SwitchToNewWorkspaceWithRes(res);
        } else {
          dispatch(setAllWorkspaces(res.workspaces));
        }
      } else {
        toast.error(res.message ? res.message : "Oops! Something went wrong.");
      }
    } catch (error: any) {
      toast.error(error.response.data.message ? error.response.data.message : "Oops! Something went wrong.");
    } finally {
      dispatch(setLoading(false));
    }
  }
  return (
    <>
      <div
        className={`p-5 p-lg-3 table-card text-center ${isEditing ? "shadow-lg" : ""}`}
      >
        <div className="user-profile position-relative mb-30">
          <img src={image} alt="user" />
          {isEditing && (
            <>
              <label htmlFor="fileInput" className="edit-overlay">
                <i className="bi bi-pencil-fill edit-icon"></i>
              </label>
              <input
                type="file"
                id="fileInput"
                className="d-none"
                accept="image/*"
                onChange={handleImageChange}
              />
            </>
          )}
        </div>

        {isEditing ? (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(touched) => {
              setIsEditing(false);
              saveChanges(touched);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="mb-3">
                  <Field
                    type="text"
                    name="workspaceName"
                    className={`form-control text-center ${touched.workspaceName && errors.workspaceName ? "is-invalid" : ""}`}
                    placeholder="Enter Name"
                  />
                  <ErrorMessage name="workspaceName" component="div" className="invalid-feedback" />
                </div>

                <button type="submit" className="btn btn-sm btn-outline-primary d-inline-flex align-items-center">
                  <i className="bi bi-check"></i>
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="btn btn-sm btn-outline-danger ms-2 d-inline-flex align-items-center"
                >
                  <i className="bi bi-x" onClick={() =>{ 
                    setImage(defaultWorkspace.imageUrl || "https://ads.alendei.com/images/workspace.webp");
                    setIsEditing(false)}} ></i>
                </button>

              </Form>
            )}
          </Formik>
        ) : (
          <div>
            <h3 className="username mb-3">{initialValues.workspaceName}</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-outline-primary d-inline-flex"
            >
              Edit
            </button>
          </div>
        )}

      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-outline-danger d-inline-block mt-3"
          onClick={() => {
            setSelectedWorkspaceId(defaultWorkspace.id);
            setShowDeleteModal(true);
          }}
        >
          Delete WorkSpace
        </button>
      </div>


      {/* Render the modal outside the map */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        workspaceName={defaultWorkspace?.name}
      />
    </>
  );
};

export default DefaultWorkspaceProfile;
