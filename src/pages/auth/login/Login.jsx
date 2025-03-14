import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Box,
  FormHelperText,
  TextField,
  styled,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import OTPInput from "react-otp-input";
import toast from "react-hot-toast";
import { createAPIEndPointAuth } from "../../../config/api/apiAuth";
import { createAPIEndPoint } from "../../../config/api/api";
import { logoutUser } from "../../../utils";

const StyledButton = styled(Button)(({ theme, otp }) => ({
  backgroundColor: otp?.length < 6 ? "#f0f0f0" : theme.palette.button.main,
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

const login = async (
  email,
  password,
  setTempToken,
  setShowQrCode,
  setLoading,
  setQrCodeUrl
) => {
  try {
    setLoading(true);
    const data = { email, password };
    const response = await createAPIEndPointAuth("login").create(data);
    setTempToken(response.data.temp_token);
    setShowQrCode(true);

    if (response.data.qr_code) {
      setQrCodeUrl(`data:image/png;base64,${response.data.qr_code}`);
    }

    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(
      error?.response?.data?.error || "Login failed. Please try again."
    );
  }
};

const verifyOtp = async (otp, tempToken, navigate, setCheck) => {
  try {
    setCheck(true);
    const response = await createAPIEndPointAuth("verify_2fa").create({
      token: otp,
      temp_token: tempToken,
    });
    localStorage.setItem("access_token", response.data.token);
    toast.success(response?.data?.message || "OTP verified successfully!");
  } catch (error) {
    setCheck(false);
    toast.error(error.response?.data?.error || "OTP verification failed.");
  }
};
export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [check, setCheck] = useState(false);

  const checkAuthProfile = async () => {
    const url = `auth_profile`;

    try {
      const response = await createAPIEndPointAuth(url).fetchAll();

      const data = response.data;
      localStorage.setItem("user_profile", JSON.stringify(data.profile));

      console.log("Auth Profile fetched successfully:", data);

      await checkDashboard(data);

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching auth profile:", error);
      return { success: false, error: error.message };
    }
  };

  const checkDashboard = async (profileData) => {
    try {
      const url = `dashboard/check`;
      const response = await createAPIEndPoint(url).create({
        profile: profileData.profile,
      });
      setTimeout(() => navigate("/appointments"), 1000);
      console.log("Dashboard check response:", response.data);
      getUser();
      setCheck(false);
    } catch (error) {
      setCheck(false);
      if (error.response.data.error.includes("Dashboard name does not match")) {
        toast.error("Access to this dashboard is not permitted.");
        setShowQrCode(false);
        logoutUser(navigate);
      }
      console.error("Error in checkDashboard:", error);
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length === 6) {
      try {
        await verifyOtp(otp, tempToken, navigate, setCheck).then(() => {
          checkAuthProfile();
        });
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unknown error occurred.";
        setOtpError(errorMessage);
        toast.error(errorMessage, "error");
      }
    }
  };

  useEffect(() => {
    if (otp.length === 6)
      verifyOtp(otp, tempToken, navigate, setCheck).then(() => {
        checkAuthProfile();
      });
  }, [otp]);

  const handleOtpChange = (otpValue) => {
    setOtp(otpValue);
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={Yup.object({
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
        password: Yup.string().max(255).required("Password is required"),
      })}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          await login(
            values.email,
            values.password,
            setTempToken,
            setShowQrCode,
            setLoading,
            setQrCodeUrl
          );
        } catch (error) {
          setErrors({ submit: error.message });
        }
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
          <Box
            sx={{
              boxShadow:
                "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
            }}
            className="w-full max-w-md space-y-5 rounded-xl bg-card p-8 "
          >
            <h2 className="text-3xl font-bold text-center text-primary">
              Sign In
            </h2>

            {!showQrCode && (
              <p className="text-center">
                Enter your email and password to sign in!
              </p>
            )}
            <Divider sx={{ mb: 2 }} />
            {!showQrCode ? (
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
                  <Stack spacing={1}>
                    <InputLabel>Password</InputLabel>
                    <OutlinedInput
                      size="small"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter password"
                      value={values.password}
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
                      error={Boolean(touched.password && errors.password)}
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
                    {touched.password && errors.password && (
                      <FormHelperText error>{errors.password}</FormHelperText>
                    )}
                  </Stack>
                  <Stack sx={{ width: "fit-content", mt: 2 }}>
                    <Link to="/forgot-password">
                      <Typography
                        fontSize="14px"
                        color="body1"
                        fontWeight="500"
                      >
                        Forgot password?
                      </Typography>
                    </Link>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <StyledButton type="submit">
                    {loading ? "Logging..." : "Login"}{" "}
                  </StyledButton>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={1}>
                <Grid item xs={12} textAlign="center">
                  <Typography>Scan the QR Code to Proceed</Typography>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center">
                  {loading ? (
                    <CircularProgress size={50} color="secondary" />
                  ) : (
                    qrCodeUrl && (
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        style={{ width: "65%", height: "auto" }}
                      />
                    )
                  )}
                </Grid>

                <Grid item xs={12} textAlign="center">
                  <Typography>Enter OTP</Typography>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <OTPInput
                    value={otp}
                    onChange={handleOtpChange}
                    numInputs={6}
                    separator={<span style={{ margin: "0 8px" }}>-</span>}
                    inputStyle={{
                      width: "40px",
                      height: "40px",
                      margin: "0 4px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      textAlign: "center",
                      outline: "none",
                    }}
                    isInputNum
                    shouldAutoFocus
                    renderInput={(props) => (
                      <input {...props} className="otp-input" />
                    )}
                  />
                </Grid>
                <Grid
                  item
                  xs={10}
                  mx="auto"
                  sx={{
                    // maxWidth: "288px   !important",
                    mx: "auto !important",
                  }}
                >
                  <StyledButton
                    onClick={handleOtpSubmit}
                    disabled={otp.length < 6}
                    sx={{ mt: 2 }}
                    otp={otp}
                  >
                    {check ? "Verifying OTP..." : "Submit OTP"}{" "}
                  </StyledButton>
                </Grid>
              </Grid>
            )}
          </Box>
        </form>
      )}
    </Formik>
  );
}
