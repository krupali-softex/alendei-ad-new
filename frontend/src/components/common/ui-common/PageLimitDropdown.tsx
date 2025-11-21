import React from "react";
import CustomDatePicker from "../date-picker/CustomDatePicker";

interface FilterState {
  startDate: string;
  endDate: string;
  limit: number;
  page: number;
}

interface TableFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const TableFilters: React.FC<TableFiltersProps> = ({ filters, setFilters }) => {
  return (
    <div className="table-head d-flex align-items-center justify-content-between mb-3">
      <div className="d-flex gap-2">
        <CustomDatePicker
        id={"start-date-picker"}
          value={filters.startDate}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, startDate: value }))
          }
          placeholder="Start Date"
        />

        <CustomDatePicker
                id={"end-date-picker"}
          value={filters.endDate}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, endDate: value }))
          }
          placeholder="End Date"
           disableDates={(date) => {
                  const startDateString = filters.startDate;
                  const [year, month, day] = startDateString
                    .split("-")
                    .map(Number);
                  const startDate = new Date(year, month - 1, day); // Convert to Date object
                  return date < startDate; // Disable dates before the start date
                }}
        />

        <select
          className="form-select"
          value={filters.limit}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              limit: parseInt(e.target.value, 10),
              page: 1, // reset to page 1 on limit change
            }))
          }
        >
          {[10, 20, 50].map((num) => (
            <option key={num} value={num}>
              {num} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TableFilters;
