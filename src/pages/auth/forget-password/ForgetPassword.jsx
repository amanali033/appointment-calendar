import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Box,
  FormHelperText,
  Divider,
  styled,
  Typography,
  IconButton,
} from "@mui/material";
import toast from "react-hot-toast";
import { createAPIEndPointAuth } from "../../../config/api/apiAuth";
import { ArrowBack } from "@mui/icons-material";

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.button.main,
  color: theme.palette.button.contrastText,
  "&:hover": {
    filter: "brightness(0.95)",
  },
  fontSize: "14px",
  fontWeight: 500,
  borderRadius: "8px",
  padding: "8px 16px",
  textTransform: "none",
  width: "100%",
}));

export default function ForgetPassword() {
  const navigate = useNavigate();

  const handleForgetPassword = async (values) => {
    try {
      const data = JSON.stringify({ email: values.email });
      const response = await createAPIEndPointAuth("forgot-password").create(
        data
      );
      toast.success(response.data.message);
      navigate("/reset-password");
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Failed to forget passowrd. Please try again."
      );
    }
  };

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={Yup.object({
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        handleForgetPassword(values);
        setSubmitting(false);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form
          onSubmit={handleSubmit}
          className="flex min-h-screen items-center justify-center bg-[#fafafa]"
        >
          <Box className="w-full max-w-md space-y-5 rounded-xl bg-card p-8 shadow-lg ">
            <h2 className="text-3xl font-bold text-center text-primary">
              Forget Password
            </h2>
            <p className="text-center">
              Enter your email to reset your password.
            </p>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel>Email Address</InputLabel>
                  <OutlinedInput
                    size="small"
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    sx={{
                      width: "100%",
                      backgroundColor: "transparent",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "#e4e4e7" },
                      "&:hover fieldset": { borderColor: "secondary.main" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1D8567 !important",
                      },
                    }}
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error>{errors.email}</FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <StyledButton
                  type="submit"
                  disabled={isSubmitting}
                  sx={{ mt: 2 }}
                >
                  {isSubmitting ? "Sending..." : "Next"}
                </StyledButton>
              </Grid>
              <Grid item xs={12}>
                <Stack
                  sx={{ textAlign: "center", alignItems: "center" }}
                  spacing={1}
                >
                  <Link
                    to="/login"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                    }}
                  >
                    <ArrowBack sx={{ mr: 1, fontSize: 18, mb: -0.25 }} />
                    <Typography fontSize="14px" color="body1" fontWeight="500">
                      Back to Login
                    </Typography>
                  </Link>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </form>
      )}
    </Formik>
  );
}
