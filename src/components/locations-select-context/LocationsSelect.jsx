import React, { useEffect, useState } from "react";
import { createAPIEndPointAuth } from "../../config/api/apiAuth";
import { useNavigate } from "react-router-dom";
import { getUserData, logoutUser } from "../../utils";
import { useLocation } from "../../contexts/LocationContext";
import { TextField, Autocomplete } from "@mui/material";

const LocationsSelect = ({ isSmall = false }) => {
  const userData = getUserData();
  const user_id = userData?.id ?? null;
  const clinic_id = userData?.clinic_id ?? null;

  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { selectedLocation, setSelectedLocation } = useLocation();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await createAPIEndPointAuth(
          `clinic_locations/get_all/${clinic_id}`
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

  const updateLocation = async (locationId) => {
    const payload = {
      user_id,
      location: locationId,
    };

    console.log(payload, "Payloooooad");

    try {
      const response = await createAPIEndPointAuth(`set-location`).create(
        payload
      );
      console.log("Response after location update:", response);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to update location.");
    }
  };

  const handleSelectLocation = (event, newValue) => {
    if (newValue) {
      setSelectedLocation({ id: newValue.id, name: newValue.location_name });
      updateLocation(newValue.id);
      setSearchTerm("");
    }
  };

  return (
    <Autocomplete
      options={locations}
      getOptionLabel={(option) => option.location_name}
      value={locations.find((loc) => loc.id === selectedLocation.id) || null}
      onChange={handleSelectLocation}
      inputValue={searchTerm}
      onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
      sx={{
        border: "none",
        outline: "none",
        boxShadow: "none",

        minWidth: isSmall ? "150px" : "200px",
        maxWidth: isSmall ? "150px" : "200px",
        "& fieldset": { border: "none" },
        "&:hover fieldset": { border: "none" },
        "&.Mui-focused fieldset": { border: "none" },
        "& .MuiOutlinedInput-root": {
          padding: "6px 12px",
        },
        "& .MuiInputBase-root, .MuiAutocomplete-input": {
          paddingLeft: "0px !important",
          color:"#71717A",
        },
        "& .MuiSelect-select": {
          padding: isSmall ? "0px" : "6px 12px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          placeholder="Search locations..."
          fullWidth
          onClick={(event) => event.stopPropagation()} // Prevent MenuItem from closing
        />
      )}
    />
  );
};

export default LocationsSelect;
