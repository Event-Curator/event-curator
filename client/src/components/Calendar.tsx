import { DayPicker } from "react-day-picker";
import { enUS } from "date-fns/locale";
import "react-day-picker/dist/style.css";

interface CalendarProps {
  selectedDates: Date[] | undefined;
  setSelectedDates: (selectedDates: Date[] | undefined) => void;
}

export default function Calendar({
  selectedDates,
  setSelectedDates,
}: CalendarProps) {
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

  return (
    <>
      <button
        popoverTarget="rdp-popover"
        className="input input-border"
        style={{ anchorName: "--rdp" } as React.CSSProperties}
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
      <div
        popover="auto"
        id="rdp-popover"
        className="dropdown"
        style={{ positionAnchor: "--rdp" } as React.CSSProperties}
      >
        <DayPicker
          className="react-day-picker"
          mode="multiple"
          selected={selectedDates}
          onSelect={setSelectedDates}
          min={1}
          max={2}
          required={false}
          locale={enUS}
        />
      </div>
    </>
  );
}
