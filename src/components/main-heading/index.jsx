import { Typography } from "@mui/material";
import React from "react";

const MainHeading = ({ children }) => {
  return (
    <Typography
      variant="h1"
      color="secondary.main"
      sx={{ fontSize: "24px", fontWeight: "bold" }}
    >
      {children}
    </Typography>
  );
};

export default MainHeading;
