import React, { useState } from "react";
import { Member } from "../../../types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { inviteUserToWorkSpace } from "../../../services/apiService";
import { toast } from "react-toastify";
import { setLoading } from "../../../state/slices/loadingSlice";
import { useDispatch } from "react-redux";
import { deleteWorkspaceMember } from "../../../services/apiService";
import { setDefaultWorkspaceMembers } from "../../../state/slices/workspaceSlice";
import ConfirmationModal from "../ui-common/ConfirmationModal";

type MembersTabProps = {
  members: Member[];
};

const MembersTab: React.FC<MembersTabProps> = ({ members }) => {
  const dispatch = useDispatch();

  const [showInviteForm, setShowInviteForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const inviteSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string().required("Role is required"),
  });

  const onInviteMember = async (email: string, role: string) => {
    const data = {
      email,
      roleName: role,
    };
    try {
      dispatch(setLoading(true));
      const response = await inviteUserToWorkSpace(data);
      if (response.success) {
        dispatch(setDefaultWorkspaceMembers(response.defaultWorkspace));
        toast.success("Member invited successfully");
        setShowInviteForm(false);
      }
    } catch (error: any) {
      toast.error(
        error.response.data.message
          ? error.response.data.message
          : "Error inviting member"
      );
    } finally {
      setShowInviteForm(false);
      dispatch(setLoading(false));
    }
  };

  const handleMemberDelete = (memberId: number) => {
    return async () => {
      try {
        dispatch(setLoading(true));
        const response = await deleteWorkspaceMember(memberId);
        if (
          response.success &&
          response.defaultWorkspace &&
          response.defaultWorkspace.members
        ) {
          dispatch(setDefaultWorkspaceMembers(response.defaultWorkspace));
          toast.success(response.message);
        }
      } catch (error: any) {
        toast.error(
          error.response.data.message
            ? error.response.data.message
            : "Error deleting member"
        );
      } finally {
        dispatch(setLoading(false));
      }
    };
  };

  return (
    <div className="tab-pane" id="MembersTab">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="card-subtitle">
          Workspace Members{" "}
          <span className="text-primary">({members.length})</span>
        </h3>
        {!showInviteForm && (
          <button
            className={`btn d-flex align-items-center ${
              showInviteForm ? "btn-outline-danger" : "btn-primary"
            }`}
            onClick={() => setShowInviteForm(!showInviteForm)}
          >
            {showInviteForm ? "Cancel" : "+ Invite Member"}
          </button>
        )}
      </div>

      {showInviteForm && (
        <div className="mt-4">
          <Formik
            initialValues={{ email: "", role: "member" }}
            validationSchema={inviteSchema}
            onSubmit={(values, { resetForm }) => {
              onInviteMember(values.email, values.role);
              resetForm();
            }}
          >
            {() => (
              <Form>
                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">Email</label>
                    <Field
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="Enter email to invite"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger f-14"
                    />
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <Field as="select" name="role" className="form-select">
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </Field>
                      <ErrorMessage
                        name="role"
                        component="div"
                        className="text-danger f-14"
                      />
                    </div>
                  </div>

                  <div className="col-auto">
                    <div className="d-flex align-items-center gap-3 mt-4">
                      <button type="submit" className="btn btn-primary">
                        Send Invite
                      </button>
                      <button
                        type="submit"
                        onClick={() => setShowInviteForm(!showInviteForm)}
                        className="btn btn-outline-danger"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered mt-5">
          <thead>
            <tr>
              {/* <th className="text-start">
                <div className="form-check form-check-inline p-0">
                  <input
                    className="form-check-input small me-0 lead-checkAll"
                    type="checkbox"
                    id=""
                    value=""
                  />
                </div>
              </th> */}
              {/* <th className="text-start"></th> */}
              <th className="text-start">Name</th>
              <th className="text-start">Email</th>
              <th className="text-start">Role</th>
              <th className="text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                {/* <td className="text-start">
                  <div className="form-check form-check-inline p-0">
                    <input
                      className="form-check-input small me-0 lead-check"
                      type="checkbox"
                      id=""
                      value=""
                    />
                  </div>
                </td> */}

                <td className="text-start fw-bold">
                  <img
                    src={
                      member.imageUrl
                        ? member.imageUrl
                        : "https://ads.alendei.com/images/user.webp"
                    }
                    alt="profile"
                    width="36"
                    height="36"
                    className="rounded-circle me-2"
                  />
                  {member.name}
                </td>
                <td className="text-start">{member.email}</td>
                <td className="text-start text-capitalize">{member.role}</td>
                <td className="text-start text-capitalize">
                  <div className="d-flex align-items-center gap-2">
                    {/* <a href="#" className="tbl-action">
                      <i className="bi bi-telephone-fill text-primary"></i>
                    </a>
                    <a href="#" className="tbl-action">
                      <i className="bi bi-chat-left-text-fill text-primary"></i>
                    </a>
                    <a href="#" className="tbl-action">
                      <i className="bi bi-whatsapp text-primary"></i>
                    </a> */}

                    <a
                      href="#"
                      className="tbl-action"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedMember(member);
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#deleteMemberModal"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 29 29"
                        fill="none"
                      >
                        <path
                          d="M3.81489 28.9326C2.95539 28.9326 2.21987 28.6268 1.60833 28.0153C0.996788 27.4038 0.690495 26.6677 0.689453 25.8072V3.92914C0.689453 3.06965 0.995746 2.33413 1.60833 1.72259C2.22092 1.11105 2.95643 0.804753 3.81489 0.803711H14.7539V3.92914H3.81489V25.8072H14.7539V28.9326H3.81489ZM21.0048 22.6817L18.856 20.4158L22.841 16.4309H10.0658V13.3054H22.841L18.856 9.32052L21.0048 7.05458L28.8184 14.8682L21.0048 22.6817Z"
                          fill="#CA3E3E"
                        />
                      </svg>
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        id="deleteMemberModal"
        title="Remove Confirmation"
        message={`Are you sure you want to Remove ${selectedMember?.name}?`}
        onConfirm={async () => {
          if (selectedMember) {
            await handleMemberDelete(selectedMember.id)();
            setSelectedMember(null);
          }
        }}
        confirmText="Yes, Remove"
      />
    </div>
  );
};

export default MembersTab;
