/// <reference types="jquery" />
import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";

// Extend jQuery to recognize `.datepicker()`
declare global {
  interface JQuery {
    datepicker(options?: any): JQuery;
  }
}

interface DatePickerProps {
  id: string;
  placeholder?: string;
  value: string; // Controlled input value in return format
  displayFormat?: string; // Display format (e.g., "M dd, yyyy")
  returnFormat?: string; // Return format (e.g., "yyyy-mm-dd")
  onChange?: (date: string) => void;
  className?: string;
  disableDates?: (date: Date) => boolean; // Function to disable dates
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
  id,
  placeholder = "Select Date",
  value,
  displayFormat = "M dd, yyyy",
  returnFormat = "yyyy-mm-dd",
  onChange,
  className = "",
  disableDates,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    if (inputRef.current) {
      const $input = $(inputRef.current) as any;

      // Initialize Bootstrap Datepicker
      $input.datepicker("destroy").datepicker({
        format: displayFormat,
        autoclose: true,
        todayHighlight: true,
        todayBtn: "linked",
        clearBtn: true,
        beforeShowDay: (date: Date) => {
          if (disableDates) {
            return disableDates(date) ? false : true; // Disable specific dates
          }
          return true;
        },
      }).on("changeDate", (e: any) => {
        if (onChange) {
          const formattedDate = formatDate(e.date, returnFormat);
          setDisplayValue(formatDate(e.date, displayFormat)); // Update UI display
          onChange(formattedDate); // Send formatted value to parent
        }
      });
    }
  }, [displayFormat, returnFormat, onChange, disableDates]);

  useEffect(() => {
    // Convert value to display format when prop changes
    if (value) {
      const date = parseDate(value, returnFormat);
      setDisplayValue(date ? formatDate(date, displayFormat) : "");
    } else {
      setDisplayValue("");
    }
  }, [value, returnFormat, displayFormat]);

  // Convert Date object to specified format
  const formatDate = (date: Date, format: string): string => {
    const options: Intl.DateTimeFormatOptions = {};

    switch (format) {
      case "yyyy/mm/dd":
        return date.toISOString().split("T")[0]; // Returns "2025-02-04"
      case "dd/mm/yyyy":
        return date.toLocaleDateString("en-GB"); // Returns "04/02/2025"
      case "mm/dd/yyyy":
        return date.toLocaleDateString("en-US"); // Returns "02/04/2025"
      case "M dd, yyyy":
        options.month = "short";
        options.day = "2-digit";
        options.year = "numeric";
        return date.toLocaleDateString("en-US", options);
      default:
        return date.toISOString().split("T")[0];
    }
  };

  // Convert string to Date object based on format
  const parseDate = (dateStr: string, format: string): Date | null => {
    const parts = dateStr.split(/[\/\-\s]+/);
    let day, month, year;

    switch (format) {
      case "yyyy/mm/dd":
        [year, month, day] = parts.map(Number);
        break;
      case "dd/mm/yyyy":
        [day, month, year] = parts.map(Number);
        break;
      case "mm/dd/yyyy":
        [month, day, year] = parts.map(Number);
        break;
      default:
        return new Date(dateStr);
    }

    return new Date(year, month - 1, day);
  };

  return (
    <input
      type="text"
      ref={inputRef}
      className={`form-control ${className}`}
      id={id}
      placeholder={placeholder}
      value={displayValue} // ✅ Shows the display format value
      onChange={()=>{}}
    />
  );
};

export default CustomDatePicker;
