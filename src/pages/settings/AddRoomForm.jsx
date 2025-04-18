import React from "react";
import {
  Box,
  Grid,
  Stack,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { createAPIEndPointAuth } from "../../config/api/apiAuth";
import { useLocation } from "../../contexts/LocationContext";
import BackButton from "../../components/back-button";
import CustomButton from "../../components/button/CustomButton";

const AddRoomForm = () => {
  const { selectedLocation } = useLocation();

  const validationSchema = Yup.object({
    room_name: Yup.string().required("Room name is required"),
    room_number: Yup.string().required("Room number is required"),
    capacity: Yup.number()
      .min(1, "Minimum capacity is 1")
      .required("Capacity is required"),
    status: Yup.string().required("Status is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      room_name: values.room_name,
      room_number: values.room_number,
      capacity: values.capacity,
      status: values.status,
    };

    try {
      const response = await createAPIEndPointAuth(
        `locations/${selectedLocation.id}/rooms`
      ).create(payload);

      toast.success("Room added successfully!");
      resetForm();
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to add room. Please try again."
      );
    }
  };

  return (
    <>
      <BackButton />
      <Formik
        initialValues={{
          room_name: "",
          room_number: "",
          capacity: "",
          status: "available",
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
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box className="w-full max-w-xl p-8 rounded-xl bg-card shadow-lg mx-auto">
              <h2 className="text-2xl font-bold text-center mb-5 text-primary">
                Add New Room
              </h2>
              <Grid container spacing={3}>
                {/* Room Name */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Room Name</InputLabel>
                    <OutlinedInput
                      size="small"
                      name="room_name"
                      placeholder="Enter room name"
                      value={values.room_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={Boolean(touched.room_name && errors.room_name)}
                    />
                    {touched.room_name && errors.room_name && (
                      <FormHelperText error>{errors.room_name}</FormHelperText>
                    )}
                  </Stack>
                </Grid>

                {/* Room Number */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Room Number</InputLabel>
                    <OutlinedInput
                      size="small"
                      name="room_number"
                      placeholder="Enter room number"
                      value={values.room_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={Boolean(touched.room_number && errors.room_number)}
                    />
                    {touched.room_number && errors.room_number && (
                      <FormHelperText error>{errors.room_number}</FormHelperText>
                    )}
                  </Stack>
                </Grid>

                {/* Capacity */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Capacity</InputLabel>
                    <TextField
                      size="small"
                      type="number"
                      name="capacity"
                      placeholder="Enter room capacity"
                      value={values.capacity}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={Boolean(touched.capacity && errors.capacity)}
                      helperText={touched.capacity && errors.capacity}
                    />
                  </Stack>
                </Grid>

                {/* Status */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      size="small"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={Boolean(touched.status && errors.status)}
                    >
                      <MenuItem value="available">Available</MenuItem>
                      <MenuItem value="occupied">Occupied</MenuItem>
                      <MenuItem value="maintenance">Under Maintenance</MenuItem>
                    </Select>
                    {touched.status && errors.status && (
                      <FormHelperText error>{errors.status}</FormHelperText>
                    )}
                  </Stack>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <CustomButton type="submit" variant="contained" fullWidth>
                    Add Room
                  </CustomButton>
                </Grid>
              </Grid>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AddRoomForm;
