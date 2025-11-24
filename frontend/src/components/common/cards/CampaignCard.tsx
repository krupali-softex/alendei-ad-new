import React from "react";
import { AdFormState } from "../../../types/index"; 


// Define the type for the form data
interface CampaignCardProps {
  formData: AdFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ formData, handleChange }) => {
    return (
        <div className="campaign-card mb-20">
            <h3 className="card-title mb-40">Ad Campaign Type</h3>

            <div className="form-check m-0 d-flex align-items-center mb-4">
                <input
                    className="form-check-input me-10"
                    id="Awareness"
                    type="radio"
                    name="campaignType"
                    checked={formData.campaignType === "Awareness"}
                    onChange={handleChange}
                    value="Awareness"
                />
                <label className="form-check-label ff-semibold" htmlFor="Awareness">
                    <img src="https://ads.alendei.com/images/awareness.svg" className="me-10" alt="Awareness" />
                    Awareness
                </label>
            </div>

            <div className="form-check m-0 d-flex align-items-center mb-4">
                <input
                    className="form-check-input me-10"
                    id="Traffic"
                    type="radio"
                    name="campaignType"
                    checked={formData.campaignType === "Traffic"}
                    onChange={handleChange}
                    value="Traffic"
                />
                <label className="form-check-label ff-semibold" htmlFor="Traffic">
                    <img src="https://ads.alendei.com/images/traffic.svg" className="me-10" alt="Traffic" />
                    Traffic
                </label>
            </div>

            <div className="form-check m-0 d-flex align-items-center mb-4">
                <input
                    className="form-check-input me-10"
                    id="Engagement"
                    type="radio"
                    name="campaignType"
                    checked={formData.campaignType === "Engagement"}
                    onChange={handleChange}
                    value="Engagement"
                />
                <label className="form-check-label ff-semibold" htmlFor="Engagement">
                    <img src="https://ads.alendei.com/images/engagement.svg" className="me-10" alt="Engagement" />
                    Engagement
                </label>
            </div>

            <div className="form-check m-0 d-flex align-items-center mb-4">
                <input
                    className="form-check-input me-10"
                    id="Leads"
                    type="radio"
                    name="campaignType"
                    checked={formData.campaignType === "Leads"}
                    onChange={handleChange}
                    value="Leads"
                />
                <label className="form-check-label ff-semibold" htmlFor="Leads">
                    <img src="https://ads.alendei.com/images/leads.svg" className="me-10" alt="Leads" />
                    Leads
                </label>
            </div>

            <div className="form-check m-0 d-flex align-items-center mb-4">
                <input
                    className="form-check-input me-10"
                    id="App_promotion"
                    type="radio"
                    name="campaignType"
                    checked={formData.campaignType === "App_promotion"}
                    onChange={handleChange}
                    value="App_promotion"
                />
                <label className="form-check-label ff-semibold" htmlFor="App_promotion">
                    <img src="https://ads.alendei.com/images/promotion.svg" className="me-10" alt="App promotion" />
                    App promotion
                </label>
            </div>

            <div className="form-check m-0 d-flex align-items-center">
                <input
                    className="form-check-input me-10"
                    id="Sales"
                    type="radio"
                    name="campaignType"
                    checked={formData.campaignType === "Sales"}
                    onChange={handleChange}
                    value="Sales"
                />
                <label className="form-check-label ff-semibold" htmlFor="Sales">
                    <img src="https://ads.alendei.com/images/sales.svg" className="me-10" alt="Sales" />
                    Sales
                </label>
            </div>
        </div>
    );
};

export default CampaignCard;
