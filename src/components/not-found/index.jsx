import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CustomButton from "../button/CustomButton";
import { Stack } from "@mui/material";

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      bgcolor="#f9f9f9"
    >
      <Stack
        spacing={2}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="secondary"
          gutterBottom
        >
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" color="body1" gutterBottom>
          Sorry, the page you are looking for does not exist.
        </Typography>
        <CustomButton onClick={goHome}>Go to Homepage</CustomButton>
      </Stack>
    </Box>
  );
};

export default NotFound;
