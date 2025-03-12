// FilterBar.jsx
import React from "react";
import {
  Box,
  TextField,
  MenuItem,
  Grid,
  Autocomplete,
  Button,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTheme } from "@mui/material/styles";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CustomButton from "../button/CustomButton";
import { motion } from "framer-motion";

const FilterBar = ({
  // Dynamic options passed from parent
  statusOptions = [],
  locationOptions = [],
  selectedTimeFrame,
  onTimeFrameChange,
  // Controlled values
  selectedStatus = "all",
  selectedLocations = [],
  startDate = null,
  endDate = null,
  // Handlers from parent
  onStatusChange,
  onLocationChange,
  onStartDateChange,
  onEndDateChange,
  onExport,
  onResetFilters,
}) => {
  const theme = useTheme();
  // Set showFilters to true to display filters by default
  const [showFilters, setShowFilters] = React.useState(false);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Show/Hide Filters Button */}
        <button
          onClick={toggleFilters}
          className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium min-h-11 rounded-2xl px-3 border border-[#e4e4e7]"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Export CSV Button */}
        {/* <CustomButton
          bgColor="#2D9E76"
          startIcon={<Download />}
          onClick={onExport}
        >
          Export CSV
        </CustomButton> */}
      </Box>
      {/* Filters Section */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="space-y-4 p-4 border border-[#e4e4e7] rounded-lg mt-4 text-primary"
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Grid container spacing={2}>
              {/* Pre Auth Status Dropdown */}
              <Grid item xs={12} sm={4}>
                <Box>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="status"
                  >
                    Select Appointments Status
                  </label>
                  <TextField
                    select
                    id="status"
                    variant="outlined"
                    size="small"
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value)}
                    sx={{
                      width: "100%",
                      backgroundColor: "transparent",
                      borderRadius: "8px",
                      textTransform: "capitalize",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#e4e4e7" },
                        "&:hover fieldset": {
                          borderColor: theme.palette.secondary.main,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.secondary.main,
                        },
                      },
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {statusOptions.map((option) => (
                      <MenuItem
                        key={option}
                        value={option}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Grid>
              {/* TimeFrame  */}
              {/* Time Frame Dropdown */}
              <Grid item xs={12} sm={4}>
                <Box>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="time-frame"
                  >
                    Time Frame
                  </label>
                  <TextField
                    select
                    id="time-frame"
                    variant="outlined"
                    size="small"
                    value={selectedTimeFrame}
                    onChange={(e) => onTimeFrameChange(e.target.value)}
                    sx={{
                      width: "100%",
                      backgroundColor: "transparent",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#e4e4e7" },
                        "&:hover fieldset": {
                          borderColor: theme.palette.secondary.main,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.secondary.main,
                        },
                      },
                    }}
                  >
                    <MenuItem value="all">Time Frame</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="this_week">This Week</MenuItem>
                    <MenuItem value="last_week">Last Week</MenuItem>
                    <MenuItem value="this_month">This Month</MenuItem>
                    <MenuItem value="last_month">Last Month</MenuItem>
                  </TextField>
                </Box>
              </Grid>

              {/* Location Dropdown */}
              <Grid item xs={12} sm={4}>
                <Box>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="location"
                  >
                    Multi Select Location
                  </label>
                  <Autocomplete
                    multiple
                    options={locationOptions}
                    getOptionLabel={(option) => option.label}
                    value={selectedLocations}
                    onChange={(_, newValues) => onLocationChange(newValues)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        placeholder="Select locations"
                        sx={{
                          width: "100%",
                          backgroundColor: "transparent",
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#e4e4e7" },
                            "&:hover fieldset": {
                              borderColor: theme.palette.secondary.main,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: theme.palette.secondary.main,
                            },
                          },
                        }}
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                  />
                </Box>
              </Grid>

              {/* Start Date Picker */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="s-date"
                  >
                    Start Date
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={startDate}
                      onChange={onStartDateChange}
                      slotProps={{
                        textField: {
                          size: "small",
                          variant: "outlined",
                        },
                      }}
                      sx={{
                        width: "100%",
                        backgroundColor: "transparent",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#e4e4e7" },
                          "&:hover fieldset": {
                            borderColor: theme.palette.secondary.main,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: theme.palette.secondary.main,
                          },
                        },
                      }}
                      slots={{
                        openPickerIcon: CalendarTodayIcon,
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>

              {/* End Date Picker */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="e-date"
                  >
                    End Date
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={endDate}
                      onChange={onEndDateChange}
                      slotProps={{
                        textField: {
                          size: "small",
                          variant: "outlined",
                        },
                      }}
                      sx={{
                        width: "100%",
                        backgroundColor: "transparent",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#e4e4e7" },
                          "&:hover fieldset": {
                            borderColor: theme.palette.secondary.main,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: theme.palette.secondary.main,
                          },
                        },
                      }}
                      slots={{
                        openPickerIcon: CalendarTodayIcon,
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button
                variant="outlined"
                color="error" // Makes the button red
                onClick={onResetFilters}
                sx={{
                  textTransform: "capitalize",
                  mt: 2,
                  borderColor: theme.palette.error.main, // Red border
                  color: "#fff", // White text on hover
                  backgroundColor: theme.palette.error.light, // Slightly lighter red on hover
                  "&:hover": {
                    borderColor: theme.palette.error.dark, // Darker red border on hover
                    backgroundColor: theme.palette.error.dark, // Slightly lighter red on hover
                  },
                }}
              >
                Reset Filters
              </Button>
            </Box>
          </Box>
        </motion.div>
      )}
    </div>
  );
};

export default FilterBar;
