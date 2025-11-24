import React, { useEffect, useState } from "react";

import { fetchAdLeads } from "../services/apiService";
import type { FlatLead, LeadFormEntry } from "../types/index.d.ts";
import WhatsappModal from "../components/common/ui-common/WhatsappModal.tsx";
import NotesModal from "../components/common/ui-common/NotesModal.tsx";

// --- Helpers ---
const flattenLeads = (data: LeadFormEntry[]): FlatLead[] => {
  return data.flatMap((entry) =>
    entry.leads.map((lead) => {
      const map: Record<string, string> = {};
      lead.field_data.forEach((f) => {
        map[f.name] = f.values[0] ?? "";
      });

      return {
        leadFormId: entry.leadFormId,
        id: lead.id,
        created_time: lead.created_time,
        full_name: map["full_name"],
        phone_number: map["phone_number"],
        email: map["email"],
        inbox_url: map["inbox_url"],
      };
    })
  );
};

// --- Fetch function (replace with actual API) ---

// --- Component ---
const Leads: React.FC = () => {
  const [leads, setLeads] = useState<FlatLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<{
    name: string;
    phone: string;
  }>({ name: "", phone: "" });
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedNoteLead, setSelectedNoteLead] = useState<{
    name: string;
    id: string;
  }>({ name: "", id: "" });

  useEffect(() => {
    setLoading(true);
    fetchAdLeads()
      .then((res) => {
        setLeads(flattenLeads(res.data));
      })
      .catch((err) => {
        console.error("Error fetching leads", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="content p-0 my-5">
      <div className="container">
        <div className="table-card">
          <div className="table-head d-flex align-items-center justify-content-between">
            <div className="search-box">
              <form className="position-relative">
                <input
                  className="form-control search-input"
                  type="search"
                  placeholder="Search by name"
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
            <a href="#" className="btn btn-outline-primary">
              Filters
            </a>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th></th>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Last Action</th>
                  <th>Created Time</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : leads.length > 0 ? (
                  leads.map((lead, index) => (
                    <tr key={lead.id}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>{index + 1}</td>
                      <td className="ff-bold">{lead.full_name}</td>
                      <td>{lead.phone_number}</td>
                      <td>
                        <span className="badge bg-warning">New Lead</span>
                      </td>
                      <td>-</td>
                      <td>
                        {new Date(lead.created_time).toLocaleDateString()}
                      </td>
                      <td>
                        {/* <a href="#" className="tbl-action">
                        <i className="bi bi bi-file-earmark-text text-danger"></i>
                      </a> */}
                        <a
                          href="#"
                          className="tbl-action"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedNoteLead({
                              name: lead.full_name ? lead.full_name : "",
                              id: lead.id,
                            });
                            setShowNoteModal(true);
                          }}
                        >
                          <i className="bi bi-file-earmark-text text-danger"></i>
                        </a>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <a href="#" className="tbl-action">
                            <i className="bi bi-telephone-fill text-primary"></i>
                          </a>
                          <a href="#" className="tbl-action">
                            <i className="bi bi-chat-left-text-fill text-primary"></i>
                          </a>
                          <a
                            href="#"
                            className="tbl-action"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedLead({
                                name: lead.full_name ? lead.full_name : "",
                                phone: lead.phone_number
                                  ? lead.phone_number
                                  : "",
                              });
                              setShowModal(true);
                            }}
                          >
                            <i className="bi bi-whatsapp text-primary"></i>
                          </a>

                          <a href="#" className="tbl-action">
                            <i className="bi bi-trash-fill text-danger"></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <WhatsappModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            name={selectedLead.name}
            phone={selectedLead.phone}
          />

          <NotesModal
            isOpen={showNoteModal}
            onClose={() => setShowNoteModal(false)}
            leadName={selectedNoteLead.name}
            onSave={(note) => {
              console.log("Saved note:", note);
              // TODO: Optionally save to backend
            }}
          />

          <div className="table-foot d-flex justify-content-between">
            <div className="table-entries d-flex align-items-center selectpicker-sm">
              Showing{" "}
              <span className="text-primary ff-bold ms-1 me-1">
                {leads.length}
              </span>{" "}
              Entries
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leads;
