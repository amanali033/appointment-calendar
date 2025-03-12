import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Grid,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Box,
  FormHelperText,
  styled,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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

export default function ResetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async (values) => {
    try {
      const data = {
        otp: values.otp,
        new_password: values.newPassword,
      };
      const response = await createAPIEndPointAuth("verify-otp").create(data);
      toast.success(response.data.message || "Password updated successfully");
      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Failed to reset password. Please try again."
      );
    }
  };

  return (
    <Formik
      initialValues={{ otp: "", newPassword: "" }}
      validationSchema={Yup.object({
        otp: Yup.string()
          .length(6, "OTP must be 6 digits")
          .required("OTP is required"),
        newPassword: Yup.string()
          .min(8, "Password must be at least 8 characters")
          .required("New Password is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        handleResetPassword(values);
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
          <Box className="w-full max-w-md space-y-5 rounded-xl bg-card p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-center text-primary">
              Reset Password{" "}
            </h2>

            <h2 className="text-center">
              Enter OTP and your new password to reset your account.
            </h2>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel>OTP</InputLabel>
                  <OutlinedInput
                    size="small"
                    name="otp"
                    placeholder="Enter OTP"
                    value={values.otp}
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
                    error={Boolean(touched.otp && errors.otp)}
                  />
                  {touched.otp && errors.otp && (
                    <FormHelperText error>{errors.otp}</FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel>New Password</InputLabel>
                  <OutlinedInput
                    size="small"
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    value={values.newPassword}
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
                    error={Boolean(touched.newPassword && errors.newPassword)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {touched.newPassword && errors.newPassword && (
                    <FormHelperText error>{errors.newPassword}</FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <StyledButton
                  type="submit"
                  disabled={isSubmitting}
                  sx={{ mt: 2 }}
                >
                  {isSubmitting ? "Reseting..." : "Reset Password"}
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
