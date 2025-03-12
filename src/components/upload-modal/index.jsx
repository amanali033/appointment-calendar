import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { createAPIEndPoint } from "../../config/api/api";
import { getUserData } from "../../utils";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import toast from "react-hot-toast";

const UploadModal = ({ open, handleClose, pre_auth_id }) => {
  const userData = getUserData();
  const user_id = userData?.id ?? null;
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      file: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("File title is required"),
      file: Yup.mixed().required("File is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("preauth_id", pre_auth_id);
      formData.append("user_id", user_id);
      formData.append("notes", values.title);
      formData.append("file_url", values.file);
      setLoading(true);
      try {
        await createAPIEndPoint("pre_auth_request/upload_file").create(
          formData
        );
        toast.success("File uploaded successfully");
        formik.resetForm();
        setUploadSuccess(false);
        setLoading(false);
        setFile(null);
        handleClose();
      } catch (error) {
        setLoading(false);
        toast.error("Failed to upload file. Please try again.");
      }
    },
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: async (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      formik.setFieldValue("file", selectedFile);

      // Automatically upload file when dropped
      const fileFormData = new FormData();
      fileFormData.append("file", selectedFile);

      try {
        const fileResponse = await createAPIEndPoint("upload").create(
          fileFormData
        );
        const filePath = fileResponse?.data?.file_url;
        console.log("onDrop: ~ filePath:", filePath);

        formik.setFieldValue("file", filePath);
        setUploadSuccess(true); // Set success state
        toast.success("File uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload file. Please try again.");
      }
    },
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px" }, // Adjust the radius as needed
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "secondary.main",
          fontWeight: "bold",
        }}
      >
        Upload File
        <IconButton onClick={handleClose} sx={{ color: "gray" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            label="File Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            margin="dense"
            sx={{
              my: 2,
              "& .MuiFormLabel-root": {
                color: "#71717a !important",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#fff",

                "&:hover fieldset": {
                  borderColor: "secondary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "secondary.light",
                },
              },
            }}
          />

          <div
            {...getRootProps()}
            style={{
              border: "2px dashed #ecf0f1",
              padding: "20px",
              textAlign: "center",
              marginTop: "10px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <input {...getInputProps()} />
            {file ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
              >
                <Typography>{file.name}</Typography>
                {uploadSuccess && (
                  <Typography color="green" variant="body2">
                    ✅ File uploaded successfully!
                  </Typography>
                )}
              </Box>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
              >
                <CloudUploadIcon sx={{ fontSize: 30, color: "#BDBDBD" }} />
                <Typography color="textSecondary">
                  Drag and drop files here or click to select
                </Typography>
              </Box>
            )}
          </div>

          {formik.touched.file && formik.errors.file && (
            <Typography color="error" variant="body2">
              {formik.errors.file}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            sx={{
              backgroundColor: "#ecf0f1",
              color: "#707070",
              textTransform: "capitalize",
              boxShadow: "none",
              borderRadius: "10px",
            }}
            variant="contained"
          >
            Close
          </Button>
          <Button
            type="submit"
            sx={{
              backgroundColor: "secondary.main",
              color: "#fff",
              textTransform: "capitalize",
              boxShadow: "none",
              borderRadius: "10px",
            }}
            variant="contained"
            disabled={!file || loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UploadModal;
