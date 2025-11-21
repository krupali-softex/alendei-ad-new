import React, { useEffect, useState } from "react";
import {
  adminChangeUserRole,
  getWorkspaceMembers,
} from "../../../services/apiService";
import type {
  AdminWorkspaceMember,
  PaginationState,
} from "../../../types/index.d.ts";
import Pagination from "../../../components/common/ui-common/Pagination";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../state/slices/loadingSlice";

const AdminWorkspaceMembers: React.FC = () => {
  const [data, setData] = useState<AdminWorkspaceMember[]>([]);
  const [loading, setLoadingState] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [filters, setFilters] = useState({
    limit: 10,
    page: 1,
  });

  const dispatch = useDispatch();

  const { workspaceId } = useParams<{ workspaceId: string }>();
  const fetchMembers = async () => {
    if (!workspaceId) return;
    setLoadingState(true);
    try {
      const response = await getWorkspaceMembers(workspaceId);
      setData(response.data || []);
      setPagination((prev) => ({
        ...prev,
        page: filters.page,
        limit: filters.limit,
        total: response.data.length || 0,
      }));
    } catch (error) {
      console.error("Failed to fetch workspace members", error);
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [workspaceId, filters]);

  const handleRoleChange = async (
    userId: number,
    newRole: "owner" | "admin" | "member"
  ) => {
    if (!workspaceId) return;
    try {
      dispatch(setLoading(true));
      const res = await adminChangeUserRole({
        workspaceId,
        userId,
        newRole,
      });
      // refresh list
      if (res.success) {
        toast.success("Role updated successfully");
        fetchMembers();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update role");
      console.error("Failed to update role", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="content p-0 my-5">
      <div className="container">
        <div className="toolbar d-flex align-items-center flex-wrap gap-10">
          <Link to="/admin" className="btn btn-outline-primary btn-toolbar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
            >
              <path
                d="M4.28594 9.79541L9.88594 15.3954L8.46094 16.7954L0.460938 8.79541L8.46094 0.79541L9.88594 2.19541L4.28594 7.79541H16.4609V9.79541H4.28594Z"
                fill="#069B49"
              />
            </svg>
          </Link>
        </div>
        <div className="table-card">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="text-start">#</th>
                  <th className="text-start">Name</th>
                  <th className="text-start">Role</th>
                  <th className="text-start">Joined At</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No members found
                    </td>
                  </tr>
                ) : (
                  data.map((member, index) => (
                    <tr key={member.id}>
                      <td>{index + 1}</td>
                      <td className="text-start d-flex align-items-center gap-2">
                        <img
                          src={member.profilePic || "/default-avatar.png"}
                          alt={member.name}
                          className="rounded-circle"
                          width={32}
                          height={32}
                        />
                        {member.name}
                      </td>
                      <td className="text-start">
                        {member.role === "owner" ? (
                          // Owner stays fixed (no change allowed)
                          <span className="badge bg-success">Owner</span>
                        ) : (
                          <select
                            value={member.role}
                            onChange={(e) =>
                              handleRoleChange(
                                member.id,
                                e.target.value as "owner" | "admin" | "member"
                              )
                            }
                            className="form-select form-select-sm"
                          >
                            {/* If current role = admin → allow "member" or "owner" */}
                            {member.role === "admin" && (
                              <>
                                <option value="admin">Admin</option>
                                <option value="member">Member</option>
                                <option value="owner">Owner</option>
                              </>
                            )}

                            {/* If current role = member → allow "admin" or "owner" */}
                            {member.role === "member" && (
                              <>
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                                <option value="owner">Owner</option>
                              </>
                            )}
                          </select>
                        )}
                      </td>

                      <td className="text-start">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-foot d-flex justify-content-between">
            <div className="table-entries d-flex align-items-center selectpicker-sm">
              Showing{" "}
              <span className="text-primary ff-bold ms-1 me-1">
                {data.length}
              </span>{" "}
              Entries
            </div>
            <Pagination
              page={filters.page}
              totalPages={pagination.total}
              onPageChange={(newPage) =>
                setFilters((prev) => ({ ...prev, page: newPage }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWorkspaceMembers;
