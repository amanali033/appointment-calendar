import React from "react";
import { CircularProgress, Box } from "@mui/material";

const Loader = ({ size = 40, thickness = 4, color = "secondary" }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100px"
    >
      <CircularProgress size={size} thickness={thickness} color={color} />
    </Box>
  );
};

export default Loader;
