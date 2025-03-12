import React, { useState } from "react";
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
  IconButton,
} from "@mui/material";
import toast from "react-hot-toast";
import { createAPIEndPointAuth } from "../../../config/api/apiAuth";
import { ArrowBack } from "@mui/icons-material";
import BackButton from "../../../components/back-button";
import CustomButton from "../../../components/button/CustomButton";
import { getUserData } from "../../../utils";

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const userData = getUserData();
  const userId = userData?.id ?? null;

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const data = JSON.stringify({
        old_password: values.currentPassword,
        new_password: values.newPassword,
      });
      await createAPIEndPointAuth(`user/change_password/`).update(userId, data);

      toast.success("Password updated successfully");
      resetForm(); // Reset form after successful response
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Failed to change password. Please try again."
      );
    } finally {
      setSubmitting(false); // Ensure this runs even if API call fails
    }
  };

  return (
    <>
      <BackButton />
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          currentPassword: Yup.string().required(
            "Current password is required"
          ),
          newPassword: Yup.string()
            .min(8, "New password must be at least 8 characters")
            .required("New password is required"),
        })}
        onSubmit={handleSubmit}
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
            className="flex py-5 items-center justify-center bg-[#fafafa]"
          >
            <Box className="w-full max-w-md space-y-5 rounded-xl bg-card p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-center text-primary">
                Change Password
              </h2>

              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Current Password</InputLabel>
                    <OutlinedInput
                      size="small"
                      type="passowrd"
                      name="currentPassword"
                      placeholder="Enter current password"
                      value={values.currentPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={Boolean(
                        touched.currentPassword && errors.currentPassword
                      )}
                    />
                    {touched.currentPassword && errors.currentPassword && (
                      <FormHelperText error>
                        {errors.currentPassword}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>New Password</InputLabel>
                    <OutlinedInput
                      size="small"
                      type="password"
                      name="newPassword"
                      placeholder="Enter new password"
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={Boolean(touched.newPassword && errors.newPassword)}
                    />
                    {touched.newPassword && errors.newPassword && (
                      <FormHelperText error>
                        {errors.newPassword}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <CustomButton
                    type="submit"
                    disabled={isSubmitting}
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    {isSubmitting ? "Changing..." : "Change Password"}
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
