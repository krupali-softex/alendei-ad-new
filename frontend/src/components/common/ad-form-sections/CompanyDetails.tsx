import React from "react";
import { AdFormState } from "../../../types/index";

type CompanyDetailsProps = {
  formData: AdFormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationErrors: any; // Add validation errors prop
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // New prop to handle input changes
};

const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  formData,
  onChange,
  validationErrors,
  onInputChange, // Add onInputChange handler
}) => {
  return (
    <div className="col-lg-12">
      <div className="campaign-card">
        <h3 className="card-title mb-40">Campaign details</h3>
        <div className="row g-20">
          <div className="col-md-6">
            <label htmlFor="companyName" className="form-label">
              Campaign Name
            </label>
            <input
              type="text"
              className={`form-control ${
                validationErrors.companyName ? "is-invalid" : ""
              }`}
              id="companyName"
              placeholder="Enter your company name"
              value={formData.companyName}
              onChange={(e) => {
                onChange(e); // Update form data
                onInputChange(e); // Clear validation error
              }}
            />
            {validationErrors.companyName && (
              <div className="invalid-feedback">
                {validationErrors.companyName}
              </div>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="campaignMessage" className="form-label">
              Campaign Message
            </label>
            <input
              type="text"
              className={`form-control ${
                validationErrors.campaignMessage ? "is-invalid" : ""
              }`}
              id="campaignMessage"
              placeholder="Enter your Campaign Message"
              value={formData.campaignMessage}
              onChange={(e) => {
                onChange(e); // Update form data
                onInputChange(e); // Clear validation error
              }}
            />
            {validationErrors.campaignMessage && (
              <div className="invalid-feedback">
                {validationErrors.campaignMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
