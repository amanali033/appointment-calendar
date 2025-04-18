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
import { useLocation } from "../contexts/LocationContext";
import { createAPIEndPoint } from "../config/api/api";
import moment from "moment";
import { getUserData } from "../utils";
import { useProviders } from "../hooks/useProviders";

const Calendar = () => {
  const userData = getUserData();
  const clinic_id = userData?.clinic_id ?? null;
  const { selectedLocation } = useLocation();
  console.log(" Calendar ~ selectedLocation:", selectedLocation);
  const calendarRef = useRef(null);
  const [searchProviderTerm, setSearchProviderTerm] = useState("");
  const { providers, loading: loadingProviders } = useProviders();

  // Memoized filtered suggestions for providers
  const filteredProviders = useMemo(() => {
    return providers
      .filter((prov) =>
        prov.provider_name
          ?.toLowerCase()
          ?.includes(searchProviderTerm?.toLowerCase())
      )
      .slice(0, searchProviderTerm ? providers.length : 20);
  }, [searchProviderTerm, providers]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventData, setEventData] = useState({
    title: "",
    date: dayjs(),
    roomId: "",
    providerId: null,
    dob: null,
    phone: "",
    details: "",
  });

  console.log(" Calendar ~ eventData:", eventData);

  // Handle event selection for editing
  const handleEventClick = (info) => {
    console.log(" handleEvessntClick ~ info:", info.event);
    setEditingEventId(info.event.id); // Track which event is being edited
    setEventData({
      title: info.event.title,
      date: dayjs(info.event.start),
      roomId: info.event.resourceIds[0],
    });
    setShowEventForm(true);
  };

  const [events, setEvents] = useState([]);
  console.log(" Calendar ~ events:", events);

  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    if (calendarRef.current) {
      calendarRef?.current?.getApi().gotoDate(newDate.format("YYYY-MM-DD"));
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

  // Add or update event
  const handleAddEvent = async () => {
    if (selectedPatient && eventData.date && eventData.roomId) {
      const payload = {
        phone: selectedPatient.phone,
        name: selectedPatient.name,
        date_of_birth: selectedPatient.date_of_birth ?? "2000-01-01", // fallback if missing
        location_id: selectedLocation?.id,
        room_id: eventData.roomId,
        email: selectedPatient.email ?? "test@example.com", // fallback if missing
        insurance_provider: selectedPatient.insurance_provider ?? "N/A",
        insurance_number: selectedPatient.insurance_number ?? "N/A",
        details: eventData.details || "N/A",
        clinic_id: clinic_id,
        user_id: userData?.id,
      };

      try {
        const response = await createAPIEndPoint("appointment/create").create(
          payload
        );
        console.log("✅ Appointment created", response.data);
        setEvents([
          ...events,
          {
            id: response.data.appointment_id || events.length + 1,
            title: selectedPatient.name,
            start: eventData.date.format("YYYY-MM-DDTHH:mm:ss"),
            resourceId: eventData.roomId,
          },
        ]);
        setSelectedPatient(null);
        setEventData({
          title: "",
          date: dayjs(),
          roomId: "",
          providerId: null,
        });
        setEditingEventId(null);
        setShowEventForm(false);
      } catch (error) {
        console.error(
          "❌ Failed to create appointment:",
          error.response?.data || error
        );
      }
    } else {
      console.warn("Missing required appointment info");
    }
  };

  const [patientsData, setPatientsData] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  console.log(" Calendar ~ selectedPatient:", selectedPatient);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await createAPIEndPointAuth(
          `patient/get_all/${clinic_id}`
        ).fetchAll();
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

  const [resources, setResources] = useState([]);

  const fetchLocationsRooms = async () => {
    try {
      const response = await createAPIEndPointAuth(
        `locations/${selectedLocation?.id}/rooms`
      ).fetchAll();

      // Map API response to FullCalendar format
      const formattedRooms = response.data.rooms.map((room) => ({
        id: room.id, // Keep ID for event resource matching
        title: room.room_name, // Display name in the calendar
      }));

      setResources(formattedRooms);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  useEffect(() => {
    fetchLocationsRooms();
  }, [selectedLocation]);

  const fetchLAppointments = async () => {
    try {
      const response = await createAPIEndPoint(
        `appointment/get_calendar/${selectedLocation?.id}`
      ).fetchAll();

      const calendarData = response?.data?.calendar;
      // Extract and map rooms
      // const formattedRooms = Object.keys(calendarData).map((roomId) => ({
      //   id: roomId,
      //   title: calendarData[roomId].room_name,
      // }));
      // setResources(formattedRooms);

      // Extract and map appointments
      Object.keys(calendarData).forEach((roomId) => {
        console.log(`Room ID: ${roomId}`, calendarData[roomId]);
        console.log(
          `Appointments for Room ${roomId}:`,
          calendarData[roomId]?.appointments
        );
      });

      const formattedEvents = Object.keys(calendarData).flatMap((roomId) => {
        const appointments = calendarData[roomId]?.appointments;
        if (!Array.isArray(appointments)) {
          console.warn(
            `⚠️ Appointments for room ${roomId} is not an array!`,
            appointments
          );
          return []; // Return empty array if invalid
        }
        return appointments.map((appointment) => ({
          id: appointment?.appointment_id,
          title: appointment?.patient_name || "Unnamed Appointment",
          start: appointment?.created_at
            ? dayjs(appointment.created_at).toISOString()
            : null,
          resourceId: roomId,
          location_name: appointment?.location_name || "Unnamed Appointment",
          comments: appointment?.comments || "Unnamed Appointment",
          status: appointment?.status || "N/A",
          createdAt: appointment?.created_at || "N/A",
        }));
      });
      console.log("Formatted Events:", formattedEvents);

      setEvents(formattedEvents);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const [patientDetails, setPatientDetails] = useState({});
  console.log(" Calendar ~ patientDetails:", patientDetails);
  const [isPatientLoading, setIsPatientLoading] = useState(false);

  const getPatientDetails = async () => {
    try {
      setIsPatientLoading(true);
      const response = await createAPIEndPointAuth(`patient`).fetchById(
        `/${selectedPatient.id}`
      );
      const patient = response.data;

      setPatientDetails(patient);

      setIsPatientLoading(false);
    } catch (error) {
      setIsPatientLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPatient) {
      getPatientDetails();
    }
  }, [selectedPatient]);

  const renderEventContent = (eventInfo) => {
    console.log(" renderEventContent ~ eventInfo:", eventInfo);
    console.log("Event Info:", eventInfo.event.extendedProps); // ✅ Debugging log

    const { event } = eventInfo;
    const { timeText } = eventInfo;
    const { location_name, status, details, comments, createdAt } =
      event.extendedProps || {};

    return (
      <div className="p-2  rounded-md text-sm">
        <div className="flex justify-between items-center">
          <span className="text-white font-semibold">{event.title}</span>
          <span className="text-xs text-white">{timeText}</span>
        </div>
        <p className="text-xs text-white mt-1">{location_name || "Unknown"}</p>
        <p className="text-xs text-white">
          {createdAt ? moment(createdAt).format("MM/DD/YYYY") : "N/A"}
        </p>
        <p className="text-xs text-white">
          <span className="font-semibold text-white capitalize">
            {status || "Pending"}
          </span>
        </p>
        {comments && (
          <p className="text-xs text-white italic border-t mt-2 pt-1">
            {comments}
          </p>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchLAppointments();
  }, [selectedLocation]);

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

  const handleDatesSet = (info) => {
    setSelectedDate(dayjs(info.start)); // Set to the first visible day
  };

  return (
    <div className="w-full p-1 overflow-y-auto  flex">
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
              eventClick={handleEventClick} // Opens the event in the form when clicked
              plugins={[
                timeGridPlugin,
                resourceTimeGridPlugin,
                interactionPlugin,
              ]}
              eventClassNames={() => ["custom-event"]}
              initialView="resourceTimeGridDay"
              allDaySlot={false}
              slotMinTime="12:00:00" // Start at 12 PM
              slotMaxTime="23:00:00" // Ensure full visibility of 11 PM slot
              slotDuration="00:10:00" // 10-minute steps
              snapDuration="00:10:00"
              editable={true}
              eventResizableFromStart={true}
              eventDurationEditable={true}
              // aspectRatio={1.5} // Adjusts height dynamically
              // handleWindowResize={true} // Ensures it resizes
              events={events} // ✅ Corrected
              resources={resources} // ✅ Corrected
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
              datesSet={handleDatesSet} // 🔥 Update selectedDate when date changes
              eventContent={renderEventContent} // ✅ Custom Event Renderer
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
        className={`create-appointment-form transition-all duration-500 transform  ml-1.5 absolute top-0 right-0 mt-[65px] ${
          showEventForm
            ? "translate-x-0 w-[40%] opacity-100 block z-[99]"
            : "translate-x-full w-0 opacity-0 hidden"
        } bg-[#fff] border-l border-[#FAFAFA] shadow-md overflow-hidden`}
      >
        {showEventForm && (
          <div className="p-4 flex flex-col h-[calc(100vh-66px)]">
            <h3 className="text-2xl text-primary font-semibold mb-4">
              Create Appointment
            </h3>

            {/* Patient Selection */}
            <Autocomplete
              fullWidth
              size="small"
              value={eventData.title || null}
              onInputChange={(event, newInputValue) =>
                setSearchTerm(newInputValue)
              }
              onChange={(event, newValue) => {
                const selectedPatient = patientsData.find(
                  (p) => p.name === newValue
                );
                if (selectedPatient) {
                  setSelectedPatient(selectedPatient);
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

            {/* Dob Selection */}
            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={eventData.dob}
                  onChange={(newValue) =>
                    setEventData({ ...eventData, dob: newValue })
                  }
                  maxDate={dayjs()}
                  slotProps={{
                    textField: {
                      size: "small",
                      variant: "outlined",
                    },
                  }}
                />
              </LocalizationProvider>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              type="tel"
              label="Phone"
              placeholder="Enter phone"
              value={eventData.phone}
              onChange={(e) =>
                setEventData({ ...eventData, phone: e.target.value })
              }
              sx={{ my: 2 }}
            />

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
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

            <Autocomplete
              size="small"
              options={filteredProviders}
              getOptionLabel={(option) => option.provider_name}
              onInputChange={(event, newInputValue) =>
                setSearchProviderTerm(newInputValue)
              }
              onChange={(_, newValue) =>
                setEventData({
                  ...eventData,
                  providerId: newValue ? newValue.id : null,
                })
              }
              loading={loadingProviders}
              renderInput={(params) => (
                <TextField {...params} placeholder="Search provider" />
              )}
            />

            {/* Details */}
            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={3}
                label="Details"
                placeholder="Appointment details"
                value={eventData.details}
                onChange={(e) =>
                  setEventData({ ...eventData, details: e.target.value })
                }
              />
            </FormControl>

            {/* Push buttons to bottom */}
            <div className="flex-grow"></div>

            {/* Save and Cancel Buttons */}
            <div className="flex gap-2 mt-4 justify-start">
              <Button
                variant="contained"
                sx={{
                  textTransform: "capitalize",
                  minWidth: "120px",
                }}
                // className="flex-1"
                onClick={handleAddEvent}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                sx={{
                  textTransform: "capitalize",
                  minWidth: "120px",
                }}
                // className="flex-1"
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
