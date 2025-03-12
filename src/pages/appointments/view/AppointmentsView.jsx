import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  IconButton,
  TableHead,
  TableRow,
  Paper,
  Stack,
  TextField,
  Popover,
  MenuItem,
  Menu,
  ListItemIcon,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MainHeading from "../../../components/main-heading";
import CustomButton from "../../../components/button/CustomButton";
import UploadModal from "../../../components/upload-modal";
import AddNoteModal from "../../../components/add-note-modal";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../components/back-button";
import { createAPIEndPointAuth } from "../../../config/api/apiAuth";
import toast from "react-hot-toast";
import { createAPIEndPoint } from "../../../config/api/api";
import { getUserData, logoutUser } from "../../../utils";
import Spinner from "../../../components/spinner/Spinner";
import moment from "moment/moment";
import AddServiceProvider from "./components/AddServiceProvider";
import UpdateAdditionalComments from "./components/UpdateAdditionalComments";
import PreAuthFiles from "./components/PreAuthFiles";

const AppointmentsView = () => {
  const { id } = useParams();
  const userData = getUserData();
  const user_id = userData?.id ?? null;
  const navigate = useNavigate();
  const [status, setStatus] = useState("");

  // const reusableCardStyle = {
  //   boxShadow: "none",
  //   borderRadius: "8px",
  //   overflow: "hidden",
  //   backgroundColor: "transparent !important",
  //   border: "1px solid #e4e4e7",
  //   minHeight: "100%",
  // };

  const reusableCardStyle = {
    boxShadow: "none",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#fff !important",
    // backgroundColor: "transparent !important",
    boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
    // border: "1px solid #e4e4e7",
    minHeight: "100%",
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const opnMenu = Boolean(anchorEl);
  const [open, setOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false); // Separate state for Add Note modal
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false); // Separate state for Add Note modal
  const [isUpdateComments, setIsUpdateComments] = useState(false); // Separate state for Add Note modal

  const handleOpenNote = () => {
    setIsAddNoteOpen(true);
    handleClose();
  };

  const handleOpenServiceProvider = () => {
    setIsAddProviderOpen(true);
    handleClose();
  };

  const handleOpenUpdateComments = () => {
    setIsUpdateComments(true);
    handleClose();
  };

  const handleOpenUpload = () => {
    setOpen(true);
    handleClose();
  };

  const [appointmentDetails, setAppointmentDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [preauthStatus, setPreauthStatus] = useState(
    appointmentDetails?.status ?? ""
  );

  const [statuses, setStatuses] = useState([]);
  console.log("AppointmentsView ~ statuses:", statuses);

  // Fetch PreAuth Statuses
  const getPreAuthStatuses = async () => {
    try {
      const response = await createAPIEndPointAuth(
        "pre_auth_status"
      ).fetchAll();
      setStatuses(response.data.enabled_statuses ?? []);
    } catch (error) {
      console.log(error?.response?.data?.error || "Error fetching statuses");
    }
  };

  const [preauthNotes, setPreauthNotes] = useState([]);
  console.log("AppointmentsView ~ preauthNotes:", preauthNotes);

  const getPreauthNotes = async () => {
    try {
      const response = await createAPIEndPoint(
        "pre_auth_request/get_note/"
      ).fetchById(id);
      console.log("🚀 ~ getPreauthNotes ~ response:", response);
      setPreauthNotes(response.data.pre_auth_notes || []);
    } catch (error) {
      console.log(error?.response?.data?.error || "Error fetching notes");
    }
  };

  const [providerDetails, setProviderDetails] = useState({});
  console.log("AppointmentsView ~ providerDetails:", providerDetails);

  const getProviderDetails = async () => {
    try {
      const response = await createAPIEndPoint(
        "get_provider_details/"
      ).fetchById(id);
      setProviderDetails(response.data.data.provider);
    } catch (error) {
      console.log(
        error?.response?.data?.error || "Error fetching provider details"
      );
    }
  };

  const getPreAuth = async (isPending = false) => {
    try {
      if (!isPending) {
        setLoading(true);
      }
      const response = await createAPIEndPoint(
        "pre_auth_request/details"
      ).fetchById(`/${id}`);
      setAppointmentDetails(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.error || "Error fetching appointments details"
      );
      if (error?.response?.data?.error.includes("Bearer token")) {
        logoutUser(navigate);
      }
    }
  };

  useEffect(() => {
    getProviderDetails();
    getPreauthNotes();
    getPreAuthStatuses();
    getPreAuth();
  }, [id]);

  const handleUpdatePreAuth = async (status) => {
    try {
      const payload = {
        status: status,
        user_id,
      };

      const response = await createAPIEndPoint(`pre_auth_request/`).update(
        id,
        payload
      );
      getPreAuth(true);
      toast.success("Appointment updated successfully");
      // setPreauthStatus(response?.data?.data[0].status);
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Failed to update Appointment. Please try again."
      );
    }
  };

  const [insuranceNumber, setInsuranceNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleUpdateInsuranceNumber = async () => {
    if (!insuranceNumber.trim()) {
      return toast.error("Insurance number is required");
    }

    setSubmitting(true);
    try {
      const data = {
        insurance_number: insuranceNumber,
        pre_auth_id: id,
      };

      await createAPIEndPoint("pre_auth_request/update_insurance/").update(
        id,
        data
      );
      getPreAuth(true);
      toast.success("Insurance number updated successfully");
      setInsuranceNumber(""); // Clear the input field after successful update
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Failed to update insurance number. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="space-y-6 view_page">
      {/* {loading && <Spinner />} */}
      <BackButton />
      <Stack spacing={3}>
        {/* <MainHeading>Appointment Details</MainHeading> */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <MainHeading>Appointment Details</MainHeading>

          <Box display="flex" gap={2} flexWrap="wrap">
            <CustomButton onClick={handleOpenUpload}>Upload Files</CustomButton>
            <CustomButton onClick={handleOpenNote}>Add Notes</CustomButton>
          </Box>
        </Box>

        <Box>
          <Tabs
            value={activeTab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Information" />
            <Tab label="Appointment Files" />
          </Tabs>

          <Box className="mt-4">
            {activeTab === 0 && (
              <div>
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12}>
                    <Card sx={reusableCardStyle}>
                      <CardContent>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                          // flexDirection={{ xs: "column", md: "row" }} // Stacks on mobile, row on desktop
                          spacing={2}
                        >
                          {/* Left Side: PreAuth Details */}
                          <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                              <strong>Date:</strong>{" "}
                              {appointmentDetails?.date || <>N/A</>}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Time:</strong>{" "}
                              {appointmentDetails?.time || <>N/A</>}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Service Type:</strong>{" "}
                              {appointmentDetails?.service?.type || <>N/A</>}
                            </Typography>
                          </Grid>

                          {/* Right Side: Status Select & Buttons */}
                          <Grid
                            item
                            xs={12}
                            md={6}
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-end"
                            flexWrap="wrap"
                            gap={2}
                          >
                            {/* Status Selection Dropdown */}
                            <TextField
                              select
                              size="small"
                              label="Select Status"
                              value={preauthStatus}
                              onChange={(e) => setPreauthStatus(e.target.value)}
                              variant="outlined"
                              sx={{
                                minWidth: 200,
                                "& .MuiFormLabel-root": {
                                  color: "#71717a !important",
                                  textTransform: "capitalize",
                                },
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                  backgroundColor: "#fff",
                                  "& fieldset": { borderColor: "#dfe4ea" },
                                  "&:hover fieldset": {
                                    borderColor: "secondary.main",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "secondary.light",
                                  },
                                },
                              }}
                            >
                              {statuses.length > 0 ? (
                                statuses.map(({ id, status }) => (
                                  <MenuItem key={id} value={status}>
                                    {status.charAt(0).toUpperCase() +
                                      status.slice(1).toLowerCase()}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem disabled>
                                  No statuses available
                                </MenuItem>
                              )}
                            </TextField>

                            {/* Update Status Button */}
                            <CustomButton
                              onClick={() => handleUpdatePreAuth(preauthStatus)}
                            >
                              Update Status
                            </CustomButton>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  {/*  Modals  */}
                  <UploadModal
                    open={open}
                    handleClose={() => setOpen(false)}
                    pre_auth_id={id}
                  />{" "}
                  <AddNoteModal
                    open={isAddNoteOpen}
                    handleClose={() => setIsAddNoteOpen(false)}
                    pre_auth_id={id}
                  />
                  {/* Auth Request Information */}
                  <Grid item xs={12} md={6}>
                    <Card sx={reusableCardStyle}>
                      <CardContent>
                        <Typography variant="h6" color="secondary" gutterBottom>
                          Patient Details
                        </Typography>
                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Patient Name:</strong>{" "}
                              {appointmentDetails?.patient?.name ?? "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Phone No:</strong>{" "}
                              {appointmentDetails?.patient?.phone ?? "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Date of Birth:</strong>{" "}
                              {appointmentDetails?.patient?.date_of_birth
                                ? moment(
                                    appointmentDetails?.patient.date_of_birth
                                  ).format("MM/DD/YYYY")
                                : "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Address:</strong>{" "}
                              {appointmentDetails?.patient?.address ?? "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Email:</strong>{" "}
                              {appointmentDetails?.patient?.email ?? "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>State:</strong>{" "}
                              {appointmentDetails?.patient?.state ?? "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Postal Code:</strong>{" "}
                              {appointmentDetails?.patient?.postal_code ??
                                "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Insurance Provider Name:</strong>{" "}
                              {appointmentDetails?.patient
                                ?.insurance_provider_name ?? "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Plan Name:</strong>{" "}
                              {appointmentDetails?.patient?.plan_name ?? "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Plan Type:</strong>{" "}
                              {appointmentDetails?.patient?.plan_type ?? "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography>
                              <strong>Member ID:</strong>{" "}
                              {appointmentDetails?.patient?.member_id ?? "N/A"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <UpdateAdditionalComments
                    open={isUpdateComments}
                    handleClose={() => setIsUpdateComments(false)}
                    pre_auth_id={id}
                    initialComments={
                      appointmentDetails?.additional_comments || ""
                    }
                    fetchAgain={getPreAuth}
                  />
                  <Grid item xs={12} md={3}>
                    <Card sx={reusableCardStyle}>
                      <CardContent sx={{ position: "relative" }}>
                        <IconButton
                          sx={{ position: "absolute", top: 8, right: 8 }}
                          // onClick={onEditLocation}
                        >
                          <EditIcon />
                        </IconButton>
                        <Typography variant="h6" color="secondary" gutterBottom>
                          Location Details
                        </Typography>
                        <Typography>
                          <strong>Location:</strong>{" "}
                          {appointmentDetails?.location?.location_name || (
                            <>N/A</>
                          )}
                        </Typography>
                        <Typography>
                          <strong>Address:</strong>{" "}
                          {appointmentDetails?.location?.address || <>N/A</>}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card sx={reusableCardStyle}>
                      <CardContent>
                        <Typography variant="h6" color="secondary" gutterBottom>
                          Creation Info
                        </Typography>
                        <Typography>
                          <strong>Created At:</strong>{" "}
                          {moment(appointmentDetails.created_at).format(
                            "MM/DD/YYYY"
                          )}
                        </Typography>
                        <Typography>
                          <strong>Created By:</strong>{" "}
                          {appointmentDetails.user_name || "N/A"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  {/* Staff Member */}
                  <Grid item xs={12}>
                    <Card sx={reusableCardStyle}>
                      <CardContent>
                        <Typography variant="h6" color="secondary" gutterBottom>
                          Staff Members
                        </Typography>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                {["Name", "Email", "Phone", "Designation"].map(
                                  (header) => (
                                    <TableCell
                                      key={header}
                                      sx={{
                                        // backgroundColor: "#FAFAFA",
                                        borderBottom: "1px solid #E4E4E7",
                                        color: "#71717A",
                                      }}
                                    >
                                      {header}
                                    </TableCell>
                                  )
                                )}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell
                                  sx={{
                                    borderBottom: "1px solid #E4E4E7",
                                    color: "#71717A",
                                  }}
                                >
                                  {`${providerDetails?.first_name ?? "N/A"} ${
                                    providerDetails?.last_name ?? ""
                                  }`}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderBottom: "1px solid #E4E4E7",
                                    color: "#71717A",
                                  }}
                                >
                                  {providerDetails?.email ?? "N/A"}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderBottom: "1px solid #E4E4E7",
                                    color: "#71717A",
                                  }}
                                >
                                  {providerDetails?.phone ?? "N/A"}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    borderBottom: "1px solid #E4E4E7",
                                    color: "#71717A",
                                  }}
                                >
                                  {providerDetails?.designation ?? "N/A"}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <CustomButton
                          sx={{ mt: 2 }}
                          onClick={handleOpenServiceProvider}
                        >
                          {providerDetails &&
                          Object.values(providerDetails).length > 0
                            ? "Edit Staff Member"
                            : "Add Staff Member"}
                        </CustomButton>
                      </CardContent>
                    </Card>
                  </Grid>
                  {/* Modal  */}
                  <AddServiceProvider
                    open={isAddProviderOpen}
                    handleClose={() => setIsAddProviderOpen(false)}
                    pre_auth_id={id}
                    fetchAgain={getProviderDetails}
                  />
                  {/* Insurance appointment Number */}
                  <Grid item xs={12} md={6}>
                    <Card sx={reusableCardStyle}>
                      <CardContent>
                        <Typography variant="h6" color="secondary" gutterBottom>
                          Insurance Appointment Number
                        </Typography>
                        <Typography variant="body1">
                          Insurance number:{" "}
                          {appointmentDetails.insurance_number ?? "N/A"}
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          label="Enter Insurance Number"
                          placeholder="Enter Insurance Number"
                          variant="outlined"
                          value={insuranceNumber}
                          onChange={(e) => setInsuranceNumber(e.target.value)}
                          sx={{
                            my: 2,
                            "& .MuiFormLabel-root": {
                              color: "#71717a !important",
                            },
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#fff",
                              "& fieldset": {
                                borderColor: "#dfe4ea",
                              },
                              "&:hover fieldset": {
                                borderColor: "secondary.main",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "secondary.light",
                              },
                            },
                          }}
                          disabled={submitting}
                        />

                        <CustomButton
                          onClick={handleUpdateInsuranceNumber}
                          disabled={submitting}
                        >
                          {submitting
                            ? "Updating..."
                            : "Add/Update Insurance Number"}
                        </CustomButton>
                      </CardContent>
                    </Card>
                  </Grid>
                  {/* Appointment Notes */}
                  <Grid item xs={12} md={6}>
                    <Card sx={reusableCardStyle}>
                      <CardContent>
                        <Typography variant="h6" color="secondary" gutterBottom>
                          Notes
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {preauthNotes.length > 0 ? (
                          preauthNotes.map((note) => (
                            <Box key={note.id} sx={{ mb: 2 }}>
                              <Typography
                                variant="subtitle1"
                                color="primary"
                                fontWeight={600}
                              >
                                PreAuth Admin
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                              >
                                {note.note}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.disabled"
                              >
                                {new Date(note.created_at).toLocaleString()}
                              </Typography>
                              <Divider sx={{ mt: 1 }} />
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No notes available.
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            )}
            {activeTab === 1 && (
              <div>
                {/* Preauth Files */}
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={12}>
                    <Card sx={reusableCardStyle}>
                      <PreAuthFiles id={id} />
                    </Card>
                  </Grid>
                </Grid>
              </div>
            )}
          </Box>
        </Box>
      </Stack>
    </div>
  );
};

export default AppointmentsView;
