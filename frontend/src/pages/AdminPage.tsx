import { useState, useEffect } from "react";
import * as Types from "../types/index";
import {
  fetchAdminDashboard,
  adminUpdateGlobalSettings,
  adminDeleteWorkspace,
  adminUpdateWorkspaceSettings,
} from "../services/apiService";
import Pagination from "../components/common/ui-common/Pagination";
import { setLoading } from "../state/slices/loadingSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../components/common/ui-common/ConfirmDeleteModal";

export default function SuperAdminSettings() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<Types.AdminWorkspace[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [globalSettings, setGlobalSettings] = useState({
    yield: "",
    globalMaxUserPerWorkspace: 0,
  });
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    id: string | null;
    name: string;
  }>({
    show: false,
    id: null,
    name: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadDashboard = async () => {
    try {
      const res = await fetchAdminDashboard(page, limit);
      setWorkspaces(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [page, limit]);

  const toggleExpand = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };
  const handleUpdateYield = async () => {
    if (!globalSettings) return;
    try {
      dispatch(setLoading(true));
      const res = await adminUpdateGlobalSettings({
        yield: globalSettings.yield,
        globalMaxUserPerWorkspace: globalSettings.globalMaxUserPerWorkspace,
      });
      if (res.success) {
        toast.success("Global yield updated successfully");
        loadDashboard();
      }
    } catch (err) {
      console.error("Failed to update yield:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleNavigate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/admin/members/${id}`);
  };

  const handleDeleteWorkspace = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      dispatch(setLoading(true));
      const res = await adminDeleteWorkspace(id);
      if (res.success) {
        toast.success("Workspace deleted successfully");
        // refresh list
        loadDashboard();
      }
    } catch (err: any) {
      console.error("Failed to delete workspace:", err);
      toast.error(
        err.response?.data?.message
          ? err.response?.data?.message
          : "Failed to delete workspace"
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdateWorkspaceYield = async (
    id: string,
    newYield: string,
    maxUserPerWorkspace: number
  ) => {
    if (!newYield || !maxUserPerWorkspace) return;
    try {
      dispatch(setLoading(true));
      const payload = {
        yield: newYield,
        globalMaxUserPerWorkspace: maxUserPerWorkspace,
      };
      const res = await adminUpdateWorkspaceSettings(id, payload);
      if (res.success) {
        toast.success("Workspace yield updated successfully");
        loadDashboard(); // refresh list with updated yield
      }
    } catch (err) {
      console.error("Failed to update workspace yield:", err);
      toast.error("Failed to update workspace yield");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="admin-container">
      <div className="content p-0 my-5">
        <div className="container">
          <div className="table-card">
            <div className="table-head d-flex align-items-center justify-content-between">
              <h3 className="card-subtitle">Super Admin Settings</h3>

              <div className="d-flex gap-3">
                <div className="d-flex flex-column">
                  <h3 className="ff-medium f-22">Workspace User Limit</h3>
                  <p className="ff-regular f-14 text-lightgray text-end">
                    Maximum number of users allowed per workspace
                  </p>
                </div>
                <input
                  type="number"
                  className="form-control w-auto"
                  placeholder="e.g 10"
                  value={globalSettings.globalMaxUserPerWorkspace}
                  onChange={(e) =>
                    setGlobalSettings({
                      ...globalSettings,
                      globalMaxUserPerWorkspace: Number(e.target.value),
                    })
                  }
                />
                <div className="d-flex flex-column">
                  <h3 className="ff-medium f-22">Yield Management</h3>
                  <p className="ff-regular f-14 text-lightgray text-end">
                    Global Yield Percentage(%)
                  </p>
                </div>
                <input
                  type="number"
                  className="form-control w-auto"
                  placeholder="e.g 10"
                  value={globalSettings.yield}
                  onChange={(e) =>
                    setGlobalSettings({
                      ...globalSettings,
                      yield: e.target.value,
                    })
                  }
                />
                <button className="btn btn-primary" onClick={handleUpdateYield}>
                  Update
                </button>
              </div>
            </div>

            <div className="table-subhead d-flex justify-content-between align-items-center">
              <h3 className="ff-medium f-20">Workspace-Specific Yield</h3>
              <div className="search-box">
                <form className="position-relative">
                  <input
                    className="form-control search-input"
                    type="search"
                    placeholder="Search..."
                  />
                  <span className="search-box-icon text-primary-hover">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.60424 1.35709C6.52565 0.974987 7.51321 0.77832 8.51054 0.77832C9.50786 0.77832 10.4954 0.974987 11.4168 1.35709C12.3382 1.7392 13.1755 2.29925 13.8807 3.00529C14.5859 3.71133 15.1453 4.54951 15.527 5.47199C15.9086 6.39448 16.1051 7.38319 16.1051 8.38167C16.1051 9.38016 15.9086 10.3689 15.527 11.2913C15.2769 11.8956 14.9507 12.4637 14.5571 12.9822L17.4463 15.8748C17.8471 16.2761 17.8471 16.9266 17.4463 17.3279C17.0455 17.7291 16.3957 17.7291 15.995 17.3279L13.1058 14.4353C11.7918 15.435 10.1795 15.985 8.51054 15.985C6.49634 15.985 4.56465 15.184 3.1404 13.7581C1.71615 12.3321 0.916016 10.3982 0.916016 8.38167C0.916016 6.36514 1.71615 4.4312 3.1404 3.00529C3.84562 2.29925 4.68283 1.7392 5.60424 1.35709ZM8.51054 2.83323C7.78275 2.83323 7.06209 2.97675 6.38971 3.25558C5.71732 3.53442 5.10638 3.94311 4.59176 4.45833C3.55243 5.49887 2.96854 6.91013 2.96854 8.38167C2.96854 9.85321 3.55243 11.2645 4.59176 12.305C5.63108 13.3455 7.04071 13.9301 8.51054 13.9301C9.98036 13.9301 11.39 13.3455 12.4293 12.305C12.9439 11.7898 13.3522 11.1781 13.6307 10.505C13.9092 9.8318 14.0525 9.1103 14.0525 8.38167C14.0525 7.65304 13.9092 6.93154 13.6307 6.25838C13.3522 5.58521 12.9439 4.97355 12.4293 4.45833C11.9147 3.94311 11.3038 3.53442 10.6314 3.25558C9.95898 2.97675 9.23832 2.83323 8.51054 2.83323Z"
                        fill="#9DB8E2"
                      />
                    </svg>
                  </span>
                </form>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-start ps-5">No.</th>
                    <th className="text-start" style={{ minWidth: "200px" }}>
                      Workspace Name
                    </th>
                    <th className="text-start" style={{ minWidth: "200px" }}>
                      Owner
                    </th>
                    <th className="text-start" style={{ minWidth: "200px" }}>
                      Current Yield (%)
                    </th>
                    <th className="text-start" style={{ minWidth: "150px" }}>
                      Members
                    </th>
                    <th className="text-start" style={{ minWidth: "200px" }}>
                      Actions
                    </th>
                    <th
                      className="text-start"
                      style={{ minWidth: "100px" }}
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {workspaces.map((item, index) => (
                    <>
                      <tr
                        key={item.id}
                        onClick={() => toggleExpand(item.id)}
                        className={
                          expandedRow === item.id ? "accordion-open" : ""
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td className="ps-5 position-relative checkbox-cell">
                          {index + 1}
                        </td>
                        <td className="fw-bold">{item.name}</td>
                        <td>{item.ownerName}</td>
                        <td>{item.yield}</td>
                        <td>{item.totalMembers}</td>
                        <td>
                          <div className="d-flex flex-wrap gap-2">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={(e) => handleNavigate(e, item.id)}
                            >
                              Manage Members
                            </button>
                            <a
                              href="#"
                              className="tbl-action"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeleteModal({
                                  show: true,
                                  id: item.id,
                                  name: item.name,
                                });
                              }}
                            >
                              <i className="bi bi-trash-fill text-danger"></i>
                            </a>
                          </div>
                        </td>
                        <td className="text-end">
                          <span className="accordion-icon">
                            {expandedRow === item.id ? (
                              <i className="bi bi-chevron-up" />
                            ) : (
                              <i className="bi bi-chevron-down" />
                            )}
                          </span>
                        </td>
                      </tr>
                      {expandedRow === item.id && (
                        <tr className="bg-light">
                          <td colSpan={7}>
                            <div className="px-7">
                              <h5 className="f-20 ff-semibold mb-4">
                                Advance Controls
                              </h5>
                              <div className="row gy-4">
                                <div className="col-md-4">
                                  <label className="form-label">
                                    Max workspace per user
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    defaultValue={
                                      item.maxUserPerWorkspace ?? ""
                                    }
                                    onChange={(e) =>
                                      setWorkspaces((prev) =>
                                        prev.map((w) =>
                                          w.id === item.id
                                            ? {
                                                ...w,
                                                maxUserPerWorkspace: Number(
                                                  e.target.value
                                                ),
                                              }
                                            : w
                                        )
                                      )
                                    }
                                  />
                                </div>

                                <div className="col-md-4">
                                  <label className="form-label">
                                    Current Yield (%)
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    defaultValue={item.yield ?? ""}
                                    onChange={(e) =>
                                      setWorkspaces((prev) =>
                                        prev.map((w) =>
                                          w.id === item.id
                                            ? {
                                                ...w,
                                                yield: Number(e.target.value),
                                              }
                                            : w
                                        )
                                      )
                                    }
                                  />
                                </div>

                                <div className="col-md-4 align-self-end">
                                  <div className="d-flex justify-content-end">
                                    <button
                                      className="btn btn-primary min-w-125"
                                      onClick={() =>
                                        handleUpdateWorkspaceYield(
                                          item.id,
                                          String(item.yield),
                                          item.maxUserPerWorkspace
                                        )
                                      }
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-foot d-flex align-items-center justify-content-between">
              <div className="table-entries d-flex align-items-center selectpicker-sm">
                Showing{" "}
                <span className="text-primary ff-bold ms-1 me-1">
                  {workspaces.length}
                </span>{" "}
                Entries
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        show={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null, name: "" })}
        onConfirm={() => {
          if (deleteModal.id) {
            handleDeleteWorkspace(
              { stopPropagation: () => {} } as any,
              deleteModal.id
            );
          }
        }}
        workspaceName={deleteModal.name}
      />
    </div>
  );
}
