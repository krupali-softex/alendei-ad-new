import React, { useState } from "react";
import { Workspace, CreateWorkSpaceParams } from "../../../types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createWorkSpace, deleteWorkspace } from "../../../services/apiService";
import { setLoading } from "../../../state/slices/loadingSlice";
import { toast } from "react-toastify";
import { useWorkspaceSwitcher } from "../../../hooks/workspace/useWorkspaceSwitcher";
import { useDispatch } from "react-redux";
import { setAllWorkspaces } from "../../../state/slices/workspaceSlice";
import ConfirmDeleteModal from "../ui-common/ConfirmDeleteModal";

type WorkspacesListProps = {
  workspaces: Workspace[];
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const WorkspaceSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Workspace name must be at least 3 characters.")
    .max(50, "Workspace name must be at most 50 characters.")
    .required("Workspace name is required."),
});

const WorkspacesList: React.FC<WorkspacesListProps> = ({
  workspaces,
  showForm,
  setShowForm,
}) => {
  // const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  );

  const { handleSwitchWorkspace, SwitchToNewWorkspaceWithRes } =
    useWorkspaceSwitcher();

  const onAddWorkspace = async (name: string) => {
    try {
      const params: CreateWorkSpaceParams = {
        workspace_name: name,
      };
      const res = await createWorkSpace(params);
      if (res.success && res.workspaceId) {
        handleSwitchWorkspace(res.workspaceId);
        toast.success("Workspace created successfully");
      } else {
        toast.error("Failed to create workspace");
      }
    } catch (error: any) {
      toast.error(
        error.response.data.message
          ? error.response.data.message
          : "Oops! Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedWorkspace) return;

    try {
      dispatch(setLoading(true));
      const res = await deleteWorkspace(selectedWorkspace.id);
      if (res.success) {
        toast.success(res.message ?? "Workspace deleted successfully.");
        if (res.defaultWorkspace) {
          SwitchToNewWorkspaceWithRes(res);
        } else {
          dispatch(setAllWorkspaces(res.workspaces));
        }
      } else {
        toast.error(res.message ?? "Oops! Something went wrong.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "Oops! Something went wrong."
      );
    } finally {
      dispatch(setLoading(false));
      setSelectedWorkspace(null);
    }
  };

  return (
    <div className="workspace-container">
      {/* <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <h1 className="mb-0 section-title gradient-primary">Your Workspaces</h1>
      </div> */}

      {showForm && (
        <div className="mb-4">
          <Formik
            initialValues={{ name: "" }}
            validationSchema={WorkspaceSchema}
            onSubmit={(values) => {
              onAddWorkspace(values.name.trim());
              setShowForm(false);
            }}
          >
            {() => (
              <Form>
                <div className="row">
                  <div className="col">
                    <div className="mb-2">
                      <label className="form-label">New Workspace Name</label>
                      <Field
                        name="name"
                        className="form-control"
                        placeholder="Enter workspace name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>
                  </div>

                  <div className="col-auto mt-30">
                    <button type="submit" className="btn btn-primary">
                      Create
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      <div className="row">
        {workspaces.map((workspace) => (
          <div
            className="col-lg-6 col-md-6 col-xl-4 col-xxl-3 mb-4"
            key={workspace.id}
          >
            <div className="card text-center h-100 workspace-card">
              <div className="d-flex justify-content-center align-items-center mb-4">
                <div className="logo-wrapper bg-white">
                  <img
                    src={
                      workspace.imageUrl
                        ? `${workspace.imageUrl}`
                        : "https://ads.alendei.com/images/mysql.webp"
                    }
                    alt="MySQL"
                  />
                </div>
              </div>
              <h5 className="fw-bold mb-1">{workspace.name}</h5>
              <p className="text-primary mb-4 text-capitalize">
                {workspace.role}
              </p>

              <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <button
                  className="btn btn-outline-success fw-semibold text-primary"
                  onClick={() => handleSwitchWorkspace(workspace.id)}
                >
                  Open{" "}
                  <span className="ms-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="13"
                      viewBox="0 0 8 13"
                      fill="none"
                    >
                      <path
                        d="M0.000908787 1.4879L4.83395 6.3315L0.000908363 11.1751L1.48881 12.663L7.82031 6.3315L1.48881 -2.76759e-07L0.000908787 1.4879Z"
                        fill="var(--bs-primary)"
                      />
                    </svg>
                  </span>
                </button>

                <button
                  className="btn btn-outline-success px-3"
                  onClick={() => {
                    setSelectedWorkspace(workspace);
                    setShowDeleteModal(true);
                  }}
                >
                  <img src="/assets/images/delete-icon.svg" alt="delete" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Render the modal outside the map */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        workspaceName={selectedWorkspace?.name}
      />
    </div>
  );
};

export default WorkspacesList;
