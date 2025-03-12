import React, { useState, useRef, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { createAPIEndPointAuth } from "../config/api/apiAuth";

const Calendar = () => {
  const calendarRef = useRef(null);

  const [showEventForm, setShowEventForm] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    date: dayjs(),
    roomId: "",
  });

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "PA Lydia Cori",
      start: "2025-03-10T09:00:00",
      resourceId: "PR01",
      color: "#6c5ce7",
    },
    {
      id: 2,
      title: "PPO Destiny",
      start: "2025-03-10T09:30:00",
      resourceId: "1 XRAYS",
      color: "#e17055",
    },
    {
      id: 3,
      title: "PPO Rajputty",
      start: "2025-03-10T10:00:00",
      resourceId: "PR02",
      color: "#00b894",
    },
    {
      id: 4,
      title: "PPO ANA MARIA",
      start: "2025-03-10T11:00:00",
      resourceId: "PR03",
      color: "#e84393",
    },
  ]);

  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(newDate.format("YYYY-MM-DD"));
    }
  };

  const handleDateClick = (info) => {
    setEventData({
      ...eventData,
      date: dayjs(info.dateStr),
      roomId: info.resource.id, // Auto-detect room
    });
    setShowEventForm(true);
  };

  const handleAddEvent = () => {
    if (eventData.title.trim() && eventData.roomId) {
      setEvents([
        ...events,
        {
          id: events.length + 1,
          title: eventData.title,
          start: eventData.date.format("YYYY-MM-DDTHH:mm:ss"),
          resourceId: eventData.roomId,
        },
      ]);
      setShowEventForm(false);
      setEventData({ title: "", date: dayjs(), roomId: "" });
    }
  };

  const resources = [
    { id: "1 XRAYS", title: "1 XRAYS" },
    { id: "PR01", title: "PR01" },
    { id: "PR02", title: "PR02" },
    { id: "PR03", title: "PR03" },
    { id: "PR04", title: "PR04" },
    { id: "PR05", title: "PR05" },
    { id: "PR06", title: "PR06" },
    { id: "PR07", title: "PR07" },
    { id: "PR08", title: "PR08" },
    { id: "PR09", title: "PR09" },
    { id: "PR10", title: "PR10" },
    { id: "PR11", title: "PR11" },
    { id: "PR12", title: "PR12" },
    { id: "PR13", title: "PR13" },
    { id: "PR14", title: "PR14" },
    { id: "PR15", title: "PR15" },
    { id: "PR16", title: "PR16" },
    { id: "PR17", title: "PR17" },
    { id: "PR18", title: "PR18" },
    { id: "PR19", title: "PR19" },
    { id: "PR20", title: "PR20" },
    { id: "PR21", title: "PR21" },
  ];

  const [patientsData, setPatientsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await createAPIEndPointAuth("patient").fetchAll();
        const patients = response.data.filter((patient) => !patient.error);

        // Remove duplicates and store full patient object
        const uniquePatients = Array.from(
          new Map(
            patients.map((patient) => [patient.name?.toLowerCase(), patient])
          ).values()
        );

        setPatientsData(uniquePatients);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // ✅ Fix: Resize FullCalendar when form opens/closes
  useEffect(() => {
    if (calendarRef.current) {
      setTimeout(() => {
        calendarRef.current.getApi().updateSize();
      }, 300); // Small delay for smooth transition
    }
  }, [showEventForm]);

  // Memoized filtered suggestions
  const filteredSuggestions = useMemo(() => {
    return patientsData
      .filter((patient) =>
        patient.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
      .slice(0, searchTerm ? patientsData.length : 20); // Show only 20 initially
  }, [searchTerm, patientsData]);

  return (
    <div className="w-full  h-screen overflow-y-auto  p-4 flex">
      {/* FullCalendar Section */}
      <div
        className={`transition-all duration-500 ${
          showEventForm ? "w-[60%]" : "w-full"
        }  relative`}
      >
        <div style={{ width: "100%" }}>
          <div style={{}}>
            <FullCalendar
              ref={calendarRef}
              plugins={[
                timeGridPlugin,
                resourceTimeGridPlugin,
                interactionPlugin,
              ]}
              initialView="resourceTimeGridDay"
              allDaySlot={false}
              slotMinTime="07:00:00"
              slotMaxTime="19:00:00"
              slotDuration="00:10:00" // 10-minute steps
              snapDuration="00:10:00"
              editable={true}
              eventResizableFromStart={true}
              eventDurationEditable={true}
              events={events}
              resources={resources}
              dateClick={handleDateClick}
              slotLabelFormat={[
                {
                  hour: "numeric",
                  minute: "2-digit",
                  omitZeroMinute: false,
                  meridiem: "short",
                },
                { minute: "2-digit" },
              ]}
              slotLabelInterval="00:10:00" // Display label every 10 minutes
              headerToolbar={{
                start: "prev,next today",
                center: "title",
                end: "resourceTimeGridDay",
              }}
              titleFormat={() => ""}
            />
          </div>
        </div>
        {/* Inject DatePicker into the header */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex gap-4 items-center z-10">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} size="small" />}
              slotProps={{
                textField: {
                  size: "small",
                  variant: "outlined",
                },
              }}
              sx={{ width: "200px" }}
            />
          </LocalizationProvider>
        </div>
      </div>

      {/* Sidebar Event Form */}
      <div
        className={`transition-all duration-500 transform min-h-full ml-1.5 absolute top-0 right-0 ${
          showEventForm
            ? "translate-x-0 w-[40%] opacity-100"
            : "translate-x-full w-0 opacity-0"
        } bg-[#FAFAFA] border-l border-[#FAFAFA] shadow-md overflow-hidden`}
      >
        {showEventForm && (
          <div className="p-4 flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-2">Add Appointment</h3>

            {/* Patient Selection */}
            <Autocomplete
              fullWidth
              size="small"
              onInputChange={(event, newInputValue) =>
                setSearchTerm(newInputValue)
              }
              onChange={(event, newValue) => {
                const selectedPatient = patientsData.find(
                  (p) => p.name === newValue
                );
                if (selectedPatient) {
                  setEventData({
                    ...eventData,
                    title: selectedPatient.name,
                    roomId: eventData.roomId || resources[0]?.id, // Default to first room if none is set
                  });
                }
              }}
              options={filteredSuggestions.map((patient) => patient.name)}
              getOptionLabel={(option) => option}
              loading={loading}
              renderInput={(params) => (
                <TextField {...params} placeholder="Search patient" />
              )}
            />

            {/* Room Selection */}
            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
              <InputLabel>Room</InputLabel>
              <Select
                value={eventData.roomId}
                onChange={(e) =>
                  setEventData({ ...eventData, roomId: e.target.value })
                }
                label="Room"
              >
                {resources.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Push buttons to bottom */}
            <div className="flex-grow"></div>

            {/* Save and Cancel Buttons */}
            <div className="flex gap-2 mt-4 justify-end">
              <Button
                variant="contained"
                className="flex-1"
                onClick={handleAddEvent}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                className="flex-1"
                onClick={() => setShowEventForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
