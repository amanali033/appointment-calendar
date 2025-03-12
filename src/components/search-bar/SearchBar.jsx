import React from "react";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const Search = ({
  placeholder = "Search...",
  onChange,
  width = { xs: "100%", md: 324 },
  value = "",
  sx = {},
}) => {
  // Function to handle clearing the input
  const handleClear = () => {
    onChange({ target: { value: "" } }); // Clear the value by updating the state
  };

  return (
    <Box sx={{ width: "100%", ml: { xs: 0, md: 1 }, ...sx }}>
      <FormControl sx={{ width, maxWidth: { xs: "100%", md: "325px" } }}>
        <OutlinedInput
          size="small"
          value={value}
          onChange={onChange}
          id="search-input"
          startAdornment={
            <InputAdornment position="start" sx={{ mr: 1 }}>
              <SearchIcon color="secondary" sx={{ fontSize: "1.2rem" }} />{" "}
              {/* Adjust the font size here */}
            </InputAdornment>
          }
          endAdornment={
            value && (
              <InputAdornment position="end">
                <CloseIcon
                  sx={{ cursor: "pointer", color: "#999" }}
                  onClick={handleClear} // Clear the input on click
                />
              </InputAdornment>
            )
          }
          aria-describedby="search-helper-text"
          inputProps={{
            "aria-label": "search",
          }}
          placeholder={placeholder}
          sx={{
            backgroundColor: "transparent",
            borderRadius: "16px", // Correctly apply rounded corners
            minHeight: "40.5px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#dfe4ea", // Default border color
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "secondary.main", // Border color on hover
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "secondary.main", // Border color when focused
            },
          }}
        />
      </FormControl>
    </Box>
  );
};

// Define prop types for the component
Search.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  value: PropTypes.string,
  sx: PropTypes.object,
};

export default Search;
