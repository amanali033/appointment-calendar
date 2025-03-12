import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Box,
  FormHelperText,
  TextField,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import toast from "react-hot-toast";
import CustomButton from "../../button/CustomButton";
import BackButton from "../../back-button";
import { createAPIEndPoint } from "../../../config/api/api";
import { getUserData } from "../../../utils";
import { createAPIEndPointAuth } from "../../../config/api/apiAuth";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export default function NewAppointment() {
  const navigate = useNavigate();
  const userData = getUserData();
  const userId = userData?.id ?? null;

  const validationSchema = Yup.object({
    name: Yup.string().required("Patient name is required"),
    phone: Yup.string()
      .matches(
        /^\(\d{3}\) \d{3}-\d{4}$/,
        "Phone number must be in format (XXX) XXX-XXXX"
      )
      .required("Phone number is required"),
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    location: Yup.string().required("Location is required"),
    provider: Yup.string().required("Provider is required"),
    // date: Yup.date()
    //   .nullable()
    //   .required("Date is required")
    //   .min(new Date(), "Date cannot be in the past"),
    details: Yup.string().nullable(),
  });

  const [locations, setLocations] = useState([]);
  const [providersData, setProvidersData] = useState([]);

  useEffect(() => {
    fetchLocations();
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await createAPIEndPointAuth(
        "clinic_providers"
      ).fetchAll();
      setProvidersData(response.data.providers); // Ensure providersData is set properly
    } catch (err) {
      console.error("Error fetching providers:", err);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await createAPIEndPointAuth(
        "clinic_locations"
      ).fetchAll();
      setLocations(response.data.locations || []); // Ensure locations are set properly
    } catch (err) {
      console.error("Error fetching locations:", err);
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

  const handleSubmit = async (values) => {
    const payload = {
      phone: values.phone,
      name: values.name,
      date_of_birth: values.date
        ? dayjs(values.date).format("YYYY-MM-DD")
        : null,
      location_id: values.location,
      email: values.email,
      insurance_provider: values.insuranceProvider,
      insurance_number: values.insuranceNumber,
      details: values.details,
      clinic_id: userData?.clinic_id ?? 1,
      user_id: userId,
    };

    console.log("Submitting Payload:", payload);

    try {
      const response = await createAPIEndPoint("appointment/create").create(
        payload
      );
      navigate("/appointments");
      console.log("API Response:", response);
      toast.success("New appointment created successfully!");
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.error ||
        "An unknown error occurred while creating the appointment.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <BackButton />
      <Formik
        initialValues={{
          name: "",
          phone: "",
          email: "",
          location: "",
          provider: "",
          insuranceNumber: "",
          date: null,
          details: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit, // Shadowing Formik's handleSubmit here
          setFieldValue,
        }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Starting handlePreAuthSubmit");
              handleSubmit(e);
            }}
            className="flex items-center justify-center"
          >
            <Box className="w-full max-w-2xl p-8 rounded-xl bg-card shadow-lg">
              <Grid item xs={12}>
                {" "}
                <h2 className="text-3xl font-bold text-center text-primary z-50 mb-5">
                  Create Appointment
                </h2>
              </Grid>
              <Grid container spacing={3}>
                {/*  Phone */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel> Phone</InputLabel>
                    <OutlinedInput
                      size="small"
                      inputProps={{ maxLength: 14 }}
                      name="phone"
                      placeholder="Enter patient phone"
                      value={values.phone}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "phone",
                            value: formatPhoneNumber(e.target.value),
                          },
                        })
                      }
                      onBlur={handleBlur}
                      fullWidth
                      sx={{
                        width: "100%",
                        backgroundColor: "transparent",

                        "& fieldset": { borderColor: "#e4e4e7" },
                        "&:hover fieldset": { borderColor: "secondary.main" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1D8567 !important",
                        },
                      }}
                      error={Boolean(touched.phone && errors.phone)}
                    />
                    {touched.phone && errors.phone && (
                      <FormHelperText error>{errors.phone}</FormHelperText>
                    )}
                  </Stack>
                </Grid>

                {/* Name */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Name</InputLabel>
                    <OutlinedInput
                      size="small"
                      name="name"
                      placeholder="Enter patient name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      sx={{
                        width: "100%",
                        backgroundColor: "transparent",

                        "& fieldset": { borderColor: "#e4e4e7" },
                        "&:hover fieldset": { borderColor: "secondary.main" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1D8567 !important",
                        },
                      }}
                      error={Boolean(touched.name && errors.name)}
                    />
                    {touched.name && errors.name && (
                      <FormHelperText error>{errors.name}</FormHelperText>
                    )}
                  </Stack>
                </Grid>
                {/* Email  */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Email</InputLabel>
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

                {/* Date */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Date of birth</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={values.date}
                        onChange={(value) => setFieldValue("date", value)}
                        maxDate={dayjs()} // Disable future dates
                        slotProps={{
                          textField: {
                            size: "small",
                            variant: "outlined",
                          },
                        }}
                        sx={{
                          width: "100%",
                          backgroundColor: "transparent",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#e4e4e7",
                            },
                            "&:hover fieldset": {
                              borderColor: "secondary.main",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "secondary.main",
                            },
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            size="small"
                            {...params}
                            fullWidth
                            error={Boolean(touched.date && errors.date)}
                            helperText={touched.date && errors.date}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Stack>
                </Grid>

                {/* Insurance Provider */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Provider</InputLabel>
                    <Autocomplete
                      size="small"
                      options={providersData}
                      getOptionLabel={(option) => option.provider_name}
                      value={
                        providersData.find(
                          (prov) => prov.id === values.provider
                        ) || null
                      }
                      onChange={(_, newValue) =>
                        setFieldValue("provider", newValue ? newValue.id : "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select a provider"
                          error={Boolean(touched.provider && errors.provider)}
                          helperText={touched.provider && errors.provider}
                        />
                      )}
                    />
                  </Stack>
                </Grid>
                {/*  Insurance Number */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Insurance Number</InputLabel>
                    <OutlinedInput
                      size="small"
                      inputProps={{ maxLength: 14 }}
                      name="insuranceNumber"
                      placeholder="Enter insurance number"
                      value={values.insuranceNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      sx={{
                        width: "100%",
                        backgroundColor: "transparent",

                        "& fieldset": { borderColor: "#e4e4e7" },
                        "&:hover fieldset": { borderColor: "secondary.main" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1D8567 !important",
                        },
                      }}
                      error={Boolean(
                        touched.insuranceNumber && errors.insuranceNumber
                      )}
                    />
                    {touched.insuranceNumber && errors.insuranceNumber && (
                      <FormHelperText error>
                        {errors.insuranceNumber}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

                {/* Location */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Location</InputLabel>
                    <Autocomplete
                      size="small"
                      options={locations}
                      getOptionLabel={(option) => option.location_name}
                      value={
                        locations.find((loc) => loc.id === values.location) ||
                        null
                      }
                      onChange={(_, newValue) =>
                        setFieldValue("location", newValue ? newValue.id : "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select a location"
                          error={Boolean(touched.location && errors.location)}
                          helperText={touched.location && errors.location}
                        />
                      )}
                    />
                  </Stack>
                </Grid>

                {/* Details */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Details</InputLabel>
                    <OutlinedInput
                      name="details"
                      placeholder="Enter any details"
                      value={values.details}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      multiline
                      rows={4}
                      sx={{
                        width: "100%",
                        backgroundColor: "transparent",

                        "& fieldset": { borderColor: "#e4e4e7" },
                        "&:hover fieldset": { borderColor: "secondary.main" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1D8567 !important",
                        },
                      }}
                    />
                  </Stack>
                </Grid>
                {/* Submit Button */}
                <Grid item xs={12}>
                  <CustomButton type="submit" variant="contained" fullWidth>
                    Submit
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
