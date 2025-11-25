import React from "react";
import { AdFormState } from "../../../types/index";

// Define the type for the form data
interface CampaignCardProps {
  formData: AdFormState;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="col-lg-4">
      <div className="campaign-card h-100">
        <h3 className="card-title mb-40">Ad Campaign Type</h3>

        <div className="form-check m-0 d-flex align-items-center mb-4">
          <input
            className="form-check-input me-4"
            id="Awareness"
            type="radio"
            name="campaignType"
            checked={formData.campaignType === "Awareness"}
            onChange={handleChange}
            value="Awareness"
          />
          <label className="form-check-label ff-semibold" htmlFor="Awareness">
            <img
              src="/assets/images/awareness.svg"
              className="me-10"
              alt="Awareness"
              style={{ height: "50px" }}
            />
            Awareness
          </label>
        </div>

        <div className="form-check m-0 d-flex align-items-center mb-4">
          <input
            className="form-check-input me-4"
            id="Traffic"
            type="radio"
            name="campaignType"
            checked={formData.campaignType === "Traffic"}
            onChange={handleChange}
            value="Traffic"
          />
          <label className="form-check-label ff-semibold" htmlFor="Traffic">
            <img
              src="/assets/images/traffic.svg"
              className="me-10"
              alt="Traffic"
              style={{ height: "50px" }}
            />
            Traffic
          </label>
        </div>

        <div className="form-check m-0 d-flex align-items-center mb-4">
          <input
            className="form-check-input me-4"
            id="Engagement"
            type="radio"
            name="campaignType"
            checked={formData.campaignType === "Engagement"}
            onChange={handleChange}
            value="Engagement"
          />
          <label className="form-check-label ff-semibold" htmlFor="Engagement">
            <img
              src="/assets/images/engagement.svg"
              className="me-10"
              alt="Engagement"
              style={{ height: "50px" }}
            />
            Engagement
          </label>
        </div>

        <div className="form-check m-0 d-flex align-items-center mb-4">
          <input
            className="form-check-input me-4"
            id="Leads"
            type="radio"
            name="campaignType"
            checked={formData.campaignType === "Leads"}
            onChange={handleChange}
            value="Leads"
          />
          <label className="form-check-label ff-semibold" htmlFor="Leads">
            <img
              src="/assets/images/leads.svg"
              className="me-10"
              alt="Leads"
              style={{ height: "50px" }}
            />
            Leads
          </label>
        </div>

        <div className="form-check m-0 d-flex align-items-center mb-4">
          <input
            className="form-check-input me-4"
            id="App_promotion"
            type="radio"
            name="campaignType"
            checked={formData.campaignType === "App_promotion"}
            onChange={handleChange}
            value="App_promotion"
          />
          <label
            className="form-check-label ff-semibold"
            htmlFor="App_promotion"
          >
            <img
              src="/assets/images/promotion.svg"
              className="me-10"
              alt="App promotion"
              style={{ height: "50px" }}
            />
            App promotion
          </label>
        </div>

        <div className="form-check m-0 d-flex align-items-center">
          <input
            className="form-check-input me-4"
            id="Sales"
            type="radio"
            name="campaignType"
            checked={formData.campaignType === "Sales"}
            onChange={handleChange}
            value="Sales"
          />
          <label className="form-check-label ff-semibold" htmlFor="Sales">
            <img
              src="/assets/images/sales.svg"
              className="me-10"
              alt="Sales"
              style={{ height: "50px" }}
            />
            Sales
          </label>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
