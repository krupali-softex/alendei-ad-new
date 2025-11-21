
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import { setAgeRange, setGender, setBudget, setWebsiteURL, setBudgetType } from "../../../state/slices/adFormSlice";
import { AdFormState } from "../../../types/index";



const ageOptionsAscending = Array.from({ length: 48 }, (_, i) => 18 + i); // 18 to 65
const ageOptionsDescending = ["65+", ...ageOptionsAscending.reverse().slice(1)]; // "65+", 64 to 18

interface AudienceBudgetProps {
    formData: AdFormState;
    onInputChange: (field: React.ChangeEvent<HTMLInputElement>) => void;
    validationErrors: any;
}

const AudienceBudget: React.FC<AudienceBudgetProps> = ({ onInputChange, validationErrors }) => {
    const dispatch = useDispatch();
    const { ageRange, gender, budget, websiteURL, campaignType } = useSelector((state: RootState) => state.adForm);

    return (
        <div className="audience-block">
            <h3 className="card-title gradient-title mb-4">Audience & Budget</h3>

            <div className="mb-40">
                <label htmlFor="age" className="form-label mb-3">Age</label>
                <div className="select-group">
                    <select
                        className="form-select w-30"
                        value={ageRange[0]}
                        onChange={(e) => dispatch(setAgeRange([Number(e.target.value), ageRange[1]]))}
                    >
                        {ageOptionsAscending.map((age) => (
                            <option key={age} value={age}>{age}</option>
                        ))}
                    </select>

                    <select
                        className="form-select w-30"
                        value={ageRange[1]}
                        onChange={(e) => dispatch(setAgeRange([ageRange[0], Number(e.target.value)]))}
                    >
                        {ageOptionsDescending.map((age) => (
                            <option key={age} value={age}>{age}</option>
                        ))}
                    </select>

                </div>
            </div>

            <div className="mb-40 d-flex align-items-center gap-5">
                {["All", "Male", "Female"].map((g) => (
                    <div key={g} className="form-check">
                        <input
                            className="form-check-input me-10 mt-0"
                            type="radio"
                            id={g}
                            name="gender"
                            value={g}
                            checked={gender === g}
                            onChange={() => dispatch(setGender(g as "All" | "Male" | "Female"))}
                        />
                        <label className="form-check-label ff-semibold" htmlFor={g}>{g}</label>
                    </div>
                ))}
            </div>

            <div className="mb-40">
                <label htmlFor="Budget" className="form-label mb-3">Budget</label>
                <div className="select-group">
                    <select
                        className="form-select w-30 align-self-start"
                        onChange={(e) => dispatch(setBudgetType(e.target.value as "daily_budget" | "lifetime_budget"))}
                    >
                        <option value="daily_budget" >Daily Budget</option>
                        <option value="lifetime_budget">Life Time Budget</option>
                    </select>
                    <div className="input-group w-70">
                        <input
                            type="number"
                            id="budget"
                            min="0"
                            className={`form-control ${validationErrors.budget ? "is-invalid" : ""}`}
                            placeholder="₹1000.00"
                            value={budget ? budget : ''}
                            onKeyDown={(e) => {
                                // Prevent typing negative sign or "e" or "+" for safety
                                if (["-", "e", "+"].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                dispatch(setBudget(Number(e.target.value)));
                                onInputChange(e)
                            }}
                        />

                        <span className="input-group-text text-body">INR</span>
                        {validationErrors.budget && (
                            <div className="invalid-feedback">{validationErrors.budget}</div>
                        )}
                    </div>
                </div>
            </div>

            {campaignType === "Traffic" && (
                <div>
                    <label htmlFor="Website URL" className="form-label mb-3">Website URL</label>
                    <div className={`input-group ${validationErrors.websiteURL ? "is-invalid" : ""}`}>
                        <span className="input-group-text"><i className="bi bi-link"></i></span>
                        <input
                            type="text"
                            className={`form-control `}
                            value={websiteURL}
                            onChange={(e) => dispatch(setWebsiteURL(e.target.value))}
                            placeholder="www.example.com"
                        />

                    </div>
                    {validationErrors.websiteURL && (
                        <div className="invalid-feedback">{validationErrors.websiteURL}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AudienceBudget;
