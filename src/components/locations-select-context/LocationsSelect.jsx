import React, { useEffect, useState } from "react";
import { Select, MenuItem } from "@mui/material";
import { createAPIEndPointAuth } from "../../config/api/apiAuth";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../utils";
import { useLocation } from "../../contexts/LocationContext";

const LocationsSelect = () => {
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const { selectedLocation, setSelectedLocation } = useLocation();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await createAPIEndPointAuth(
          "clinic_locations"
        ).fetchAll();
        setLocations(response.data.locations || []);
      } catch (err) {
        console.error("Error fetching locations:", err);
        if (err?.response?.data?.error?.includes("Bearer token has expired.")) {
          logoutUser(navigate);
        }
      }
    };

    fetchLocations();
  }, []);

  const handleChange = (event) => {
    const selectedId = event.target.value;
    const selectedLoc = locations.find((loc) => loc.id === selectedId);

    if (selectedLoc) {
      setSelectedLocation({
        id: selectedLoc.id,
        name: selectedLoc.location_name,
      });
    }
  };

  return (
    <Select
      size="small"
      name="location"
      value={selectedLocation.id}
      onChange={handleChange}
      fullWidth
      displayEmpty
      sx={{
        minWidth: "155px",
        border: "none",
        fontSize: 15,
        outline: "none",
        "& fieldset": { border: "none" },
        "&:focus, &:active": {
          outline: "none",
          boxShadow: "none",
        },
      }}
    >
      <MenuItem value="" disabled>
        Select a location
      </MenuItem>
      {locations.map((loc) => (
        <MenuItem key={loc.id} value={loc.id}>
          {loc.location_name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LocationsSelect;
