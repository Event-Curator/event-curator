import { useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { enUS } from "date-fns/locale";
import "react-day-picker/dist/style.css";

interface CalendarProps {
  selectedDates: Date[] | undefined;
  setSelectedDates: (selectedDates: Date[] | undefined) => void;
  popoverRef?: React.RefObject<HTMLDivElement>;
}

export default function Calendar({
  selectedDates,
  setSelectedDates,
  popoverRef,
}: CalendarProps) {
  // Use passed popoverRef if provided, otherwise create local
  const localPopoverRef = useRef<HTMLDivElement>(null);
  const refToUse = popoverRef || localPopoverRef;

  // Track popover open state
  const [open, setOpen] = useState(false);

  let displayDates = "";
  if (selectedDates === undefined) {
    displayDates = "Choose your dates";
  } else if (selectedDates[1] === undefined) {
    displayDates = `${selectedDates[0].toLocaleDateString()}`;
  } else {
    displayDates = `${selectedDates[0].toLocaleDateString()} — ${selectedDates[1].toLocaleDateString()}`;
  }

  function handleClearDates() {
    setSelectedDates(undefined);
  }

  function handleSelect(dates: Date[] | undefined) {
    setSelectedDates(dates);
    // Close the calendar if two dates are selected and both are not undefined
    if (
      dates &&
      dates.length === 2 &&
      dates[0] !== undefined &&
      dates[1] !== undefined
    ) {
      setOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="input input-border"
        style={{ anchorName: "--rdp" } as React.CSSProperties}
        onClick={() => setOpen(true)}
      >
        {displayDates}
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleClearDates}
      >
        Clear
      </button>
      {open && (
        <div
          className="absolute z-50 bg-white rounded shadow-lg mt-2"
          ref={refToUse}
          style={{ minWidth: 320 }}
        >
          <DayPicker
            className="react-day-picker"
            mode="multiple"
            selected={selectedDates}
            onSelect={handleSelect}
            min={1}
            max={2}
            required={false}
            locale={enUS}
          />
          <div className="flex justify-end p-2">
            <button
              className="btn btn-sm"
              onClick={() => setOpen(false)}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}