import React, { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

interface TimePickerProps {
  id: string;
  placeholder?: string;
  defaultValue?: string;
  displayFormat?: string;  // Format shown to the user (e.g., "h:i K" → "02:30 PM")
  returnFormat?: string;   // Format stored in state (e.g., "HH:mm" → "14:30")
  onChange?: (time: string) => void;
}

const CustomTimePicker: React.FC<TimePickerProps> = ({
  id,
  placeholder = "Select time",
  defaultValue = "12:00",
  displayFormat = "h:i K",
  returnFormat = "HH:mm",
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      flatpickr(inputRef.current, {
        enableTime: true,
        noCalendar: true,
        dateFormat: displayFormat,
        time_24hr: false,
        onChange: (selectedDates) => {
          if (onChange) {
            const formattedTime = formatTime(selectedDates[0], returnFormat);
            onChange(formattedTime);
          }
        },
      });
    }
  }, [displayFormat, returnFormat, onChange]);

  // Function to format time
  const formatTime = (date: Date, format: string): string => {

    switch (format) {
      case "HH:mm":
        return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
      case "h:i K":
        return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
      default:
        return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
    }
  };

  return (
    <input
      type="text"
      ref={inputRef}
      id={id}
      className="form-control"
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  );
};

export default CustomTimePicker;
