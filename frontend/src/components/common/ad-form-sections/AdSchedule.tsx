import React from "react";
import { useDispatch } from "react-redux";
import { AdFormState } from "../../../types/index";
import CustomDatePicker from "../date-picker/CustomDatePicker";
import CustomTimePicker from "../date-picker/CustomTimePicker";
import { setAdFormData } from "../../../state/slices/adFormSlice";

type AdScheduleProps = {
  formData: AdFormState;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (field: keyof AdFormState, date: string) => void;
  handleTimeChange: (field: keyof AdFormState, time: string) => void;
  validationErrors: any;
  onInputChange: (field: keyof AdFormState) => void;
};

const timezoneOptions = ["IST", "UTC", "EST", "PST"];

const AdSchedule: React.FC<AdScheduleProps> = ({
  formData,
  handleCheckboxChange,
  handleDateChange,
  handleTimeChange,
  validationErrors,
  onInputChange,
}) => {
  const dispatch = useDispatch();

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setAdFormData({ ...formData, timezone: e.target.value }));
    onInputChange("timezone");
  };

  return (
    <div className="col-lg-5">
      <div className="campaign-card h-100">
        <h3 className="card-title mb-40">Schedule</h3>

        <label htmlFor="ScheduleStartDate" className="form-label">
          Start Date
        </label>
        <div className="row g-20 mb-40">
          <div className="col-xl-6">
            <div className="input-group date">
              <span className="input-group-text">
                <i className="bi bi-calendar-fill"></i>
              </span>
              <CustomDatePicker
                className={`${
                  validationErrors.scheduleStartDate ? "is-invalid" : ""
                }`}
                id="ScheduleStartDate"
                displayFormat="M dd, yyyy"
                returnFormat="dd/mm/yyyy"
                onChange={(date) => {
                  handleDateChange("scheduleStartDate", date);
                  onInputChange("scheduleStartDate");
                }}
                value={formData.scheduleStartDate}
                disableDates={(date) =>
                  date < new Date(new Date().setDate(new Date().getDate() - 1))
                } // Disable past dates
              />
              {validationErrors.scheduleStartDate && (
                <div className="invalid-feedback">
                  {validationErrors.scheduleStartDate}
                </div>
              )}
            </div>
          </div>
          <div className="col-xl-6">
            <div className="input-group time">
              <CustomTimePicker
                id="ScheduleStartTime"
                displayFormat="h:i K"
                returnFormat="HH:mm"
                onChange={(time) => {
                  handleTimeChange("scheduleStartTime", time);
                  onInputChange("scheduleStartTime");
                }}
              />
              <span className="input-group-text">
                <i className="bi bi-clock-fill"></i>
              </span>
              <select
                className={`form-select ${
                  validationErrors.timezone ? "is-invalid" : ""
                }`}
                value={formData.timezone}
                onChange={handleTimezoneChange}
              >
                {timezoneOptions.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
            {validationErrors.timezone && (
              <div className="invalid-feedback">
                {validationErrors.timezone}
              </div>
            )}
          </div>
        </div>

        <label htmlFor="ScheduleEndDate" className="form-label mb-3">
          End Date
        </label>
        <div className="form-check mb-4 ps-0 d-flex align-items-center">
          <input
            className="form-check-input"
            type="checkbox"
            name="setEndDate"
            id="setEndDate"
            checked={formData.setEndDate}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="setEndDate">
            Set an end date
          </label>
        </div>

        {formData.setEndDate && (
          <div className="row g-20 mb-40">
            <div className="col-xl-6">
              <div className="input-group date">
                <span className="input-group-text">
                  <i className="bi bi-calendar-fill"></i>
                </span>
                <CustomDatePicker
                  id="ScheduleEndDate"
                  displayFormat="M dd, yyyy"
                  returnFormat="dd/mm/yyyy"
                  onChange={(date) => {
                    handleDateChange("scheduleEndDate", date);
                    onInputChange("scheduleEndDate");
                  }}
                  value={formData.scheduleEndDate}
                  disableDates={(date) => {
                    const startDateString = formData.scheduleStartDate;
                    const [day, month, year] = startDateString
                      .split("/")
                      .map(Number);
                    const startDate = new Date(year, month - 1, day); // Convert to Date object

                    return date < startDate; // Disable dates before the start date
                  }}
                />
              </div>
              {validationErrors.scheduleEndDate && (
                <div className="invalid-feedback">
                  {validationErrors.scheduleEndDate}
                </div>
              )}
            </div>
            <div className="col-xl-6">
              <div className="input-group time">
                <CustomTimePicker
                  id="ScheduleEndTime"
                  displayFormat="h:i K"
                  returnFormat="HH:mm"
                  onChange={(time) => {
                    handleTimeChange("scheduleEndTime", time);
                    onInputChange("scheduleEndTime");
                  }}
                />
                <span className="input-group-text">
                  <i className="bi bi-clock-fill"></i>
                </span>
                <select
                  className={`form-select ${
                    validationErrors.timezone ? "is-invalid" : ""
                  }`}
                  value={formData.timezone}
                  onChange={handleTimezoneChange}
                >
                  {timezoneOptions.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
              {validationErrors.timezone && (
                <div className="invalid-feedback">
                  {validationErrors.timezone}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdSchedule;
