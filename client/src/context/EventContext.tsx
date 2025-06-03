import React, { createContext, useContext, useState } from "react";

type Filters = {
  search: string;
  category: string;
  location: string;
  price: string;
};

type EventContextType = {
  filters: Filters;
  setFilters: (f: Filters) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "",
    location: "",
    price: "",
  });

  return (
    <EventContext.Provider value={{ filters, setFilters }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEventContext() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEventContext must be inside EventProvider");
  return ctx;
}
