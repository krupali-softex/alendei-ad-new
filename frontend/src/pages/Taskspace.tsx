import React, { useState } from "react";
import DefaultWorkspaceProfileCard from "../components/common/cards/DefaultWorkspaceProfileCard";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import MembersTab from "../components/common/taskspace-common/MembersTab";
import WorkspacesList from "../components/common/taskspace-common/WorkspacesList";
import UserProfile from "../components/common/cards/UserProfileCard";
import { Formik, Form, Field } from "formik";
import { updateWorkspaceSettings } from "../services/apiService";
import { toast } from "react-toastify";
import { setLoading } from "../state/slices/loadingSlice";
import { useDispatch } from "react-redux";
import { useSession } from "../hooks/session/useSession";

type TaskspaceProps = {};

const Taskspace: React.FC<TaskspaceProps> = ({}) => {
  const defaultWorkspace = useSelector(
    (state: RootState) => state.workspace.defaultWorkspace
  );
  const user = useSelector((state: RootState) => state.user.data);
  const allWorkspaces = useSelector(
    (state: RootState) => state.workspace.allWorkspaces
  );
  const members =
    useSelector(
      (state: RootState) => state.workspace.defaultWorkspace?.members
    ) || [];
  const dispatch = useDispatch();
  const { fetchSession } = useSession();

  const BUSINESS_CATEGORIES = [
    "E-commerce",
    "Retail",
    "Education",
    "Healthcare",
    "Real Estate",
    "Technology",
    "Finance",
    "Hospitality",
    "Manufacturing",
    "Marketing",
    "Other",
  ];

  const handleSettingsUpdate = async (values: any) => {
    let isSessionNeedsUpdate = false;
    try {
      dispatch(setLoading(true));
      const payload = {
        business_category: values.business_category,
        currency: values.currency,
        timezone: values.timezone,
        financial_year: values.financial_year,
        enable_notification: values.enable_notification,
      };
      const res = await updateWorkspaceSettings(payload);
      if (res.success) {
        toast.success(res.message);
        isSessionNeedsUpdate = true;
      } else {
        toast.error("Failed to update workspace settings.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      dispatch(setLoading(false));
      isSessionNeedsUpdate && fetchSession();
    }
  };

  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="content p-0 my-5">
      <div className="container">
        <div className="row g-20">
          <div className="col-md-12">
            <div className="taskspace-details">
              <ul className=" nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    data-bs-toggle="tab"
                    data-bs-target="#ProfileTab"
                  >
                    <span className="nav-link-icon me-2">
                      <img
                        src="assets/images/profile.svg"
                        className="icon-default"
                        style={{ height: "32px", width: "32px"}}
                      />
                      <img
                        src="assets/images/profile-hover.svg"
                        className="icon-hover"
                        style={{ height: "32px", width: "32px"}}
                      />
                    </span>
                    Profile
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#MembersTab"
                  >
                    <span className="nav-link-icon me-2">
                      <img
                        src="assets/images/members.svg"
                        className="icon-default"
                        style={{ height: "32px", width: "32px"}}
                      />
                      <img
                        src="assets/images/members-hover.svg"
                        className="icon-hover"
                        style={{ height: "32px", width: "32px"}}
                      />
                    </span>
                    Members
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#SettingsTab"
                  >
                    <span className="nav-link-icon me-2">
                      <img
                        src="assets/images/settings.svg"
                        className="icon-default"
                        style={{ height: "32px", width: "32px"}}
                      />
                      <img
                        src="assets/images/settings-hover.svg"
                        className="icon-hover"
                        style={{ height: "32px", width: "32px"}}
                      />
                    </span>
                    Settings
                  </button>
                </li>
              </ul>

              <div className="tab-content">
                {/* Profile Tab */}
                <div className="tab-pane active" id="ProfileTab">
                  <div className="row g-20">
                    <div className="col-lg-3">
                     
                      {user && <UserProfile user={user} />}
                    </div>
                    <div className="col-lg-9">
                      <div className="d-flex align-items-center justify-content-between flex-wrap mb-4">
                        <h3 className="card-subtitle">Your Workspaces</h3>
                        <button
                          className={`btn d-flex align-items-center w-20 h-20 ${
                            showAddForm
                              ? "btn-outline-danger"
                              : "btn-primary"
                          }`}
                          onClick={() => setShowAddForm(!showAddForm)}
                        >
                          {showAddForm ? "Cancel" : "+ Add Workspace"}
                        </button>
                      </div>
                      <WorkspacesList
                        workspaces={allWorkspaces}
                        showForm={showAddForm}
                        setShowForm={setShowAddForm}
                      />
                    </div>
                  </div>
                </div>

                {/* Members Tab */}
                <MembersTab members={members} />
                <div className="tab-pane" id="SettingsTab">
                  {/* <div className="mb-5">
                    <h3 className="card-subtitle">Workspace Settings</h3>
                  </div> */}
                  <div className="row g-20">
                    <div className="col-lg-3">
                      <DefaultWorkspaceProfileCard
                        defaultWorkspace={defaultWorkspace}
                      />
                    </div>
                    <div className="col-lg-9">
                      <div className="col-lg-9">
                        <Formik
                          enableReinitialize
                          initialValues={{
                            business_category:
                              defaultWorkspace?.settings?.business_category ||
                              "",
                            currency:
                              defaultWorkspace?.settings?.currency || "",
                            timezone:
                              defaultWorkspace?.settings?.timezone || "",
                            financial_year:
                              defaultWorkspace?.settings?.financial_year || "",
                            enable_notification:
                              defaultWorkspace?.settings?.enable_notification ??
                              true,
                          }}
                          onSubmit={(values) => {
                            handleSettingsUpdate(values);
                            // TODO: call update settings API here
                          }}
                        >
                          {({ values }) => (
                            <Form>
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="mb-30">
                                    <label className="form-label">
                                      Business Category
                                    </label>
                                    <Field
                                      as="select"
                                      name="business_category"
                                      className="form-select"
                                    >
                                      <option value="">Select category</option>
                                      {BUSINESS_CATEGORIES.map((category) => (
                                        <option key={category} value={category}>
                                          {category}
                                        </option>
                                      ))}
                                    </Field>
                                  </div>

                                  <div className="mb-30">
                                    <label className="form-label">
                                      Currency
                                    </label>
                                    <Field
                                      as="select"
                                      name="currency"
                                      className="form-select"
                                    >
                                      <option value="">Select currency</option>
                                      <option value="INR">INR</option>
                                      <option value="USD">USD</option>
                                      <option value="EUR">EUR</option>
                                      {/* add more if needed */}
                                    </Field>
                                  </div>

                                  <div className="mb-30">
                                    <label className="form-label">
                                      Timezone
                                    </label>
                                    <Field
                                      type="text"
                                      name="timezone"
                                      className="form-control"
                                      placeholder="e.g., Asia/Kolkata"
                                    />
                                  </div>
                                </div>

                                <div className="col-md-6 ps-5">
                                  <div className="mb-30">
                                    <label className="form-label">
                                      Financial Year
                                    </label>
                                    <Field
                                      type="text"
                                      name="financial_year"
                                      className="form-control"
                                      placeholder="e.g., 2024-2025"
                                    />
                                  </div>

                                  <div className="mb-30">
                                    <label className="form-label d-block mb-4">
                                      Enable Notification
                                    </label>
                                    <div className="form-check ps-0">
                                      <Field
                                        className="form-check-input me-2"
                                        type="checkbox"
                                        name="enable_notification"
                                        checked={values.enable_notification}
                                      />
                                      <label className="form-check-label">
                                        {values.enable_notification
                                          ? "Enabled"
                                          : "Disabled"}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 d-flex align-items-center flex-wrap gap-3">
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                >
                                  Save
                                </button>
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Taskspace;
