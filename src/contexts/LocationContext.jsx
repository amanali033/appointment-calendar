import React, { createContext, useState, useContext, useEffect } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(() => {
    // Retrieve saved location from localStorage
    const storedLocation = localStorage.getItem("selectedLocation");
    return storedLocation ? JSON.parse(storedLocation) : { id: "", name: "" };
  });

  useEffect(() => {
    // Save selected location to localStorage whenever it changes
    if (selectedLocation.id) {
      localStorage.setItem(
        "selectedLocation",
        JSON.stringify(selectedLocation)
      );
    } else {
      localStorage.removeItem("selectedLocation"); // Remove if empty
    }
  }, [selectedLocation]);

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
