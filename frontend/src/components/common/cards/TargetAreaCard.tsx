import React, { useState } from "react";
import { AdFormState } from "../../../types/index";
import AudienceBudget from "../ad-form-sections/AudienceBudget";
import { useRef } from "react";
import { fetchCitySuggestions } from "../../../services/apiService";

// Define the props type
interface TargetAreaCardProps {
  formData: AdFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddArea: () => void;
  handleRemoveArea: (area: string) => void;
  onInputChange: (field: React.ChangeEvent<HTMLInputElement>) => void;
  validationErrors: any;
}

const TargetAreaCard: React.FC<TargetAreaCardProps> = ({
  formData,
  handleChange,
  handleAddArea,
  handleRemoveArea,
  onInputChange,
  validationErrors,
}) => {
  const [error, setError] = useState<string>("");
  const [allCities, setAllCities] = useState<string[]>([]);
  const [previousCities, setPreviousCities] = useState<string[]>([]);

  const validate = () => {
    const trimmed = formData.targetArea.trim();
    if (!formData.targetArea.trim()) {
      setError("Please enter a target area.");
      return false;
    } else if (!previousCities.includes(trimmed)) {
      setError("Please select a valid city from the list.");
      return false;
    } else if (formData.targetAreas.includes(trimmed)) {
      setError("Area already added.");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleAdd = () => {
    if (!validate()) return;
    if (formData.targetArea.trim()) {
      handleAddArea(); // Add target area only if valid
    }
  };

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const fetchCities = async (query: string) => {
    if (!query) return;

    try {
      const data = await fetchCitySuggestions(query);
      const cityList = data.data.map((item) => `${item.city}, ${item.state}`);
      setPreviousCities(allCities);
      setAllCities(cityList);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    const value = e.target.value;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchCities(value);
    }, 300);
  };

  return (
    <div className="col-lg-7">
      <div className="campaign-card h-100">
        <div className="mb-60">
          <h3 className="card-title text-capitalize mb-12">Target areas</h3>
          <p className="text-lightgray mb-40">
            Your ad will be shown in this area. It could be a list of Local
            Area/City/State or PAN India.
          </p>

          <div>
            <label htmlFor="targetArea" className="form-label">
              Select Target Area
            </label>
            <div className="targetArea-section d-flex">
              <input
                type="text"
                className="form-control me-2"
                id="targetArea"
                placeholder="Add Target Area"
                list="cityOptions"
                value={formData.targetArea}
                onChange={handleQueryChange}
              />
              <datalist id="cityOptions">
                {allCities.map((cityState, index) => (
                  <option key={index} value={cityState} />
                ))}
              </datalist>
              <button className="btn btn-outline-primary" onClick={handleAdd}>
                <i className="fa fa-plus me-2"></i>Add
              </button>
            </div>

            {error && <p className="text-danger mt-2">{error}</p>}

            {/* Display selected target areas */}
            <div id="areaContainer" className="area-container mt-3">
              {formData.targetAreas.length > 0 ? (
                formData.targetAreas.map((area, index) => (
                  <span key={index} className="areaCard">
                    {area + "    "}
                    <i
                      className="bi bi-x fs-3 text-primary ms-2 cursor-pointer"
                      onClick={() => handleRemoveArea(area)}
                    ></i>
                  </span>
                ))
              ) : (
                <p className="text-muted">No target areas selected.</p>
              )}
            </div>
          </div>
        </div>
        <AudienceBudget
          formData={formData}
          validationErrors={validationErrors}
          onInputChange={onInputChange}
        />
      </div>
    </div>
  );
};

export default TargetAreaCard;
