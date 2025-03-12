// PreAuth.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import CustomButton from "../../components/button/CustomButton";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MainHeading from "../../components/main-heading";
import Search from "../../components/search-bar/SearchBar";
import StatusBadge from "../../components/status-badge";
import FilterBar from "../../components/filter-bar";
import FilterButtons from "../../components/filter-buttons";
import { useNavigate } from "react-router-dom";
import { createAPIEndPoint } from "../../config/api/api";
import toast from "react-hot-toast";
import Loader from "../../components/loader";
import ErrorMessage from "../../components/error-message";
import { saveAs } from "file-saver";
import { logoutUser } from "../../utils";

const Appointments = () => {
  const navigate = useNavigate();

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // API data & loading state
  const [preAuths, setPreAuths] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search query
  const [searchQuery, setSearchQuery] = useState("");

  // FilterButtons state (e.g. filter by status via buttons)
  const [selectedFilters, setSelectedFilters] = useState([]);

  // FilterBar states
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("all");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchPreAuths = async () => {
    try {
      const response = await createAPIEndPoint(
        "appointment/get_all"
      ).fetchAll();
      setPreAuths(response.data.appointments || []);
      console.log("fetchPreAuths ~ response.data:", response.data);
    } catch (err) {
      console.log("fetchPreAuths ~ err:", err.response);
      toast.error(err?.response?.data?.error || "Error fetching appointments");
      // if (err?.response?.data?.error.includes("Bearer token has expired.")) {
      //   logoutUser(navigate);
      // }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreAuths();
  }, []);

  // Derive dynamic filters for FilterButtons and FilterBar from the API data
  const dynamicFilters = useMemo(() => {
    return Array.from(new Set(preAuths.map((item) => item.status)));
  }, [preAuths]);

  const dynamicStatusOptions = useMemo(() => {
    return Array.from(new Set(preAuths.map((item) => item.status)));
  }, [preAuths]);

  const handleTimeFrameChange = (value) => {
    setSelectedTimeFrame(value);
  };

  const dynamicLocationOptions = useMemo(() => {
    // Assuming each pre-auth has a property called `location_name`
    const uniqueLocations = Array.from(
      new Set(preAuths.map((item) => item.location_name))
    );
    return uniqueLocations.map((loc) => ({ label: loc, value: loc }));
  }, [preAuths]);

  // Combined filtering logic (search, FilterButtons, FilterBar)
  const filteredPreAuths = useMemo(() => {
    return preAuths.filter((item) => {
      const id = item?.id?.toString().toLowerCase() || "";
      const locationName = item?.location_name?.toLowerCase() || "";
      const patientName = item?.patient_details?.name?.toLowerCase() || "";
      const status = item?.status || "";
      const searchLower = searchQuery.toLowerCase();

      // Search filtering
      const matchesSearch =
        id.includes(searchLower) ||
        locationName.includes(searchLower) ||
        patientName.includes(searchLower);

      // FilterButtons filtering: if any button filters are selected, match status against them
      const matchesButtonFilter = selectedFilters.length
        ? selectedFilters.includes(status)
        : true;

      // FilterBar: status filter (if not "all")
      const matchesStatus =
        selectedStatus !== "all" ? status === selectedStatus : true;

      // FilterBar: location filter (if any location is selected)
      const matchesLocation = selectedLocations.length
        ? selectedLocations.some(
            (loc) => loc.value.toLowerCase() === locationName
          )
        : true;

      // FilterBar: date filter based on created_at date
      const createdDate = new Date(item.created_at);
      const matchesDate =
        (!startDate || createdDate >= new Date(startDate)) &&
        (!endDate || createdDate <= new Date(endDate));

      return (
        matchesSearch &&
        matchesButtonFilter &&
        matchesStatus &&
        matchesLocation &&
        matchesDate
      );
    });
  }, [
    preAuths,
    searchQuery,
    selectedFilters,
    selectedStatus,
    selectedLocations,
    startDate,
    endDate,
  ]);

  // Map filtered data into table rows
  const rows = filteredPreAuths.map((item, index) => ({
    id: index + 1,
    date: item?.date || "N/A",
    time: item?.time || "N/A",
    patientName: item?.patient_name || "N/A",
    location: item?.location_name || "N/A",
    createdDate: item?.created_at,
    status: item.status,
  }));

  const onResetFilters = () => {
    setSearchQuery("");
    setSelectedFilters([]);
    setSelectedStatus("all");
    setSelectedLocations([]);
    setStartDate(null);
    setEndDate(null);
    setSelectedTimeFrame("all");
  };

  const handleExportCSV = () => {
    if (!rows || rows.length === 0) {
      console.warn("No data available to export.");
      return;
    }

    // Define correct headers based on available row properties
    const headers = [
      "#",
      "Pre Auth ID",
      "Location Name",
      "Patient Name",
      "Status",
      "Created By",
      "Created Date",
      "Updation Info",
    ];

    const csvRows = [];

    // Add headers to CSV
    csvRows.push(headers.join(","));

    // Add data rows
    rows.forEach((row, index) => {
      const values = [
        index + 1,
        row.preAuthID || "",
        row.locationName || "",
        row.patientName || "",
        row.status || "",
        row.createdBy || "",
        row.createdDate || "",
        row.updationInfo || "",
      ];
      csvRows.push(values.join(","));
    });

    // Convert to CSV Blob and trigger download
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    saveAs(blob, "pre_auth_requests.csv");
  };

  return (
    <div className="space-y-6">
      <Stack spacing={3}>
        {/* Header Section */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
          sx={{
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: { xs: "flex-start", md: "space-between" },
          }}
        >
          <MainHeading>Appointments</MainHeading>
          <Box
            sx={{
              ml: "auto",
              width: { xs: "100%", md: "auto" },
              mb: { xs: 2, md: 0 },
            }}
          >
            <Search
              placeholder="Search by ID, clinic, or patient name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>
          <CustomButton
            onClick={() => navigate("/appointments/add-new-appointment")}
            startIcon={<AddRoundedIcon />}
            sx={{
              width: { xs: "100%", md: "auto" },
              mt: { xs: 2, md: 0 },
              alignSelf: { xs: "flex-start", md: "center" },
            }}
          >
            New Appointment
          </CustomButton>
        </Box>

        {/* FilterButtons (using dynamic filters from API) */}
        <Box>
          <FilterButtons
            filters={dynamicFilters}
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
          />
        </Box>

        {/* FilterBar (using dynamic options & controlled state) */}
        <Box>
          <FilterBar
            statusOptions={dynamicStatusOptions}
            locationOptions={dynamicLocationOptions}
            selectedTimeFrame={selectedTimeFrame}
            onTimeFrameChange={handleTimeFrameChange}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedLocations={selectedLocations}
            onLocationChange={setSelectedLocations}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            onExport={handleExportCSV}
            onResetFilters={onResetFilters}
          />
        </Box>

        {/* Data Table */}
        <Box sx={{ overflowX: "auto" }}>
          <Paper sx={{ border: "1px solid #E4E4E7", boxShadow: "none" }}>
            <TableContainer sx={{ maxHeight: "65vh" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {[
                      "#",
                      "Date",
                      "Time",
                      "Patient Name",
                      "Location",
                      "Created Date",
                      "Status",
                      "Actions",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        sx={{ backgroundColor: "#FAFAFA", color: "#71717A" }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Loader />
                      </TableCell>
                    </TableRow>
                  ) : rows.length === 0 ? (
                    <ErrorMessage source="appointments" span={8} />
                  ) : (
                    rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.time}</TableCell>
                          <TableCell>{row.patientName}</TableCell>
                          <TableCell>{row.location}</TableCell>
                          <TableCell>{row.createdDate}</TableCell>
                          <TableCell>
                            <StatusBadge status={row.status} />
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() =>
                                navigate(`/pre-auth/details/${row.id}`)
                              }
                              className="cursor-pointer inline-flex items-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 transition"
                            >
                              View
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 20]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </Paper>
        </Box>
      </Stack>
    </div>
  );
};

export default Appointments;
