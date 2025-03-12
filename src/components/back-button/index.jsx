import React from "react";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// Component to render the back button
const BackButton = () => {
  const navigate = useNavigate();

  // Handle the back navigation
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <IconButton
      color="primary.main"
      onClick={handleBack}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "fit-content",
        padding: "8px",
        marginBottom: "8px",
        backgroundColor: "primary.main", // Light grey background
        "&:hover": {
          backgroundColor: "#51A58A", // Darker grey on hover
        },
      }}
    >
      <ChevronLeftIcon color="#fff" sx={{ fontSize: "24px", color: "#fff" }} />
    </IconButton>
  );
};

export default BackButton;
