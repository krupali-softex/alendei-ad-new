import React from "react";
import { AdFormState } from "../../../types/index";

type AdPlatformSelectionProps = {
  formData: AdFormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationErrors: any; // Accept validation errors prop
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Prop to handle clearing validation error
};

const AdPlatformSelection: React.FC<AdPlatformSelectionProps> = ({
  formData,
  onChange,
  validationErrors,
  onInputChange, // Added prop
}) => {
  const handlePlatformChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e); // Handle the form data change
    onInputChange(e); // Handle clearing validation error
  };

  return (
    <div className="col-lg-3">
      <div className="campaign-card d-flex flex-column h-100">
        <h3 className="card-title text-capitalize mb-40">Select Platform for Ad</h3>

        <div className="d-flex align-items-center gap-2 gap-md-4 flex-wrap">
          <div className="form-check d-flex align-items-center mb-0 ps-0">
            <label htmlFor="Facebook" className="radio-card cursor-pointer">
              <input
                type="radio"
                name="select_platform"
                id="Facebook"
                checked={formData.selectPlatform === "Facebook"}
                onChange={handlePlatformChange}
                value="Facebook"
              />
              <div className="card-content-wrapper">
                <img
                  src="https://ads.alendei.com/images/fb-round.svg"
                  alt="Facebook"
                  className="me-3"
                />
                Facebook
              </div>
            </label>
          </div>
          <div className="form-check d-flex align-items-center mb-0 ps-0">
            <label htmlFor="Instagram" className="radio-card cursor-pointer">
              <input
                type="radio"
                name="select_platform"
                id="Instagram"
                checked={formData.selectPlatform === "Instagram"}
                onChange={handlePlatformChange}
                value="Instagram"
              />
              <div className="card-content-wrapper">
                <img
                  src="https://ads.alendei.com/images/insta-round.svg"
                  alt="Instagram"
                  className="me-3"
                />
                Instagram
              </div>
            </label>
          </div>
          <div className="form-check d-flex align-items-center mb-0 ps-0">
            <label
              htmlFor="BothPlatforms"
              className="radio-card cursor-pointer"
            >
              <input
                type="radio"
                name="select_platform"
                id="BothPlatforms"
                checked={formData.selectPlatform === "Instagram, Facebook"}
                onChange={handlePlatformChange}
                value="Instagram, Facebook"
              />
              <div className="card-content-wrapper justify-content-center">
                Both Platforms
              </div>
            </label>
          </div>
        </div>

        {/* Display validation error message if there's an error */}
        {validationErrors.selectPlatform && (
          <div className="invalid-feedback d-block">
            {validationErrors.selectPlatform}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdPlatformSelection;
