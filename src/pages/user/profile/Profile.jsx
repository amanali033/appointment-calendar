import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Typography,
} from "@mui/material";
import { createAPIEndPointAuth } from "../../../config/api/apiAuth";
import { ArrowBack } from "@mui/icons-material";
import BackButton from "../../../components/back-button";
import CustomButton from "../../../components/button/CustomButton";
import TimeZoneSelect from "../../../components/time-zone-select";
import { getUserData } from "../../../utils";
import Spinner from "../../../components/spinner/Spinner";
import { useUserProfile } from "../../../contexts/UserProfileContext";
import toast from "react-hot-toast";

export default function Profile() {
  const { getUser } = useUserProfile();
  const [loading, setLoading] = useState(true);
  const userData = getUserData();
  const userId = userData?.id ?? null;

  const [user, setUser] = useState({});

  const fetchUser = async () => {
    try {
      const response = await createAPIEndPointAuth(`user`).fetchById(
        `/${userId}`
      );
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching batch:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const updateProfile = async (profileData) => {
    try {
      await createAPIEndPointAuth("user/").update(userId, profileData);
      toast.success("User updated successfully!");
    } catch (error) {
      throw error?.response?.data?.message || "Profile update failed.";
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, ""); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    if (!match) return value;

    const formatted = !match[2]
      ? match[1]
      : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`;

    return formatted.length > 14 ? formatted.slice(0, 14) : formatted; // Limit to 14 characters
  };

  return (
    <>
      {" "}
      {loading && <Spinner />}
      <BackButton />
      <Formik
        enableReinitialize
        initialValues={{
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          address: user.address || "",
          phone: user.phone || "",
          timezone: user.timezone || "",
        }}
        validationSchema={Yup.object({
          first_name: Yup.string().required("First name is required"),
          last_name: Yup.string().required("Last name is required"),
          address: Yup.string().required("Address is required"),
          phone: Yup.string()
            .matches(
              /^\(\d{3}\) \d{3}-\d{4}$/,
              "Phone number must be in format (XXX) XXX-XXXX"
            )
            .required("Phone number is required"),

          timezone: Yup.string().required("Time Zone is required"),
        })}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          try {
            await updateProfile(values);
          } catch (error) {
            setErrors({ submit: error });
          } finally {
            setSubmitting(false);
          }
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
            className="flex  items-center justify-center bg-[#fafafa]"
          >
            <Box className="w-full max-w-lg space-y-5 rounded-xl bg-card p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-center text-primary">
                Update Profile
              </h2>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>First Name</InputLabel>
                    <OutlinedInput
                      size="small"
                      name="first_name"
                      value={values.first_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your first name"
                      fullWidth
                      error={Boolean(touched.first_name && errors.first_name)}
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
                    />
                    {touched.first_name && errors.first_name && (
                      <FormHelperText error>{errors.first_name}</FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Last Name</InputLabel>
                    <OutlinedInput
                      size="small"
                      name="last_name"
                      value={values.last_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your last name"
                      fullWidth
                      error={Boolean(touched.last_name && errors.last_name)}
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
                    />
                    {touched.last_name && errors.last_name && (
                      <FormHelperText error>{errors.last_name}</FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Address</InputLabel>
                    <OutlinedInput
                      size="small"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      fullWidth
                      onBlur={handleBlur}
                      placeholder="Enter your address"
                      error={Boolean(touched.address && errors.address)}
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
                    />
                    {touched.address && errors.address && (
                      <FormHelperText error>{errors.address}</FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Phone</InputLabel>
                    <OutlinedInput
                      size="small"
                      name="phone"
                      value={values.phone}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "phone",
                            value: formatPhoneNumber(e.target.value),
                          },
                        })
                      }
                      inputProps={{ maxLength: 14 }}
                      onBlur={handleBlur}
                      placeholder="Enter your phone number"
                      fullWidth
                      error={Boolean(touched.phone && errors.phone)}
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
                    />
                    {touched.phone && errors.phone && (
                      <FormHelperText error>{errors.phone}</FormHelperText>
                    )}
                  </Stack>
                </Grid>

                <TimeZoneSelect
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  errors={errors}
                />

                <Grid item xs={12}>
                  <CustomButton fullWidth type="submit">
                    {isSubmitting ? "Updating..." : "Update Profile"}
                  </CustomButton>
                </Grid>
              </Grid>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
}
