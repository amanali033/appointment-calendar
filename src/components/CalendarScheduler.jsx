// import React, { useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";

// const CalendarScheduler = () => {
//   const [events, setEvents] = useState([
//     {
//       id: 1,
//       title: "Neil Gupta (46)\nRECALL",
//       start: "2025-09-09T09:00:00",
//       resourceId: "PR01",
//       color: "#d63384",
//     },
//     {
//       id: 2,
//       title: "PA ANNALEAH ACOSTA (21)\nPerioEx",
//       start: "2025-09-09T09:00:00",
//       resourceId: "PR03",
//       color: "#d63384",
//     },
//     {
//       id: 3,
//       title: "Dr. Bhatt\nPlease book till 4pm!!!",
//       start: "2025-09-09T08:00:00",
//       end: "2025-09-09T16:00:00",
//       resourceId: "PR01",
//       color: "#888",
//     },
//   ]);

//   const resources = [
//     { id: "1 XRAYS", title: "1 XRAYS" },
//     ...Array.from({ length: 21 }, (_, i) => ({
//       id: `PR${String(i + 1).padStart(2, "0")}`,
//       title: `PR${String(i + 1).padStart(2, "0")}`,
//     })),
//   ];

//   return (
//     <div className="p-4 overflow-auto whitespace-nowrap">
//       <FullCalendar
//         schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
//         plugins={[
//           dayGridPlugin,
//           timeGridPlugin,
//           resourceTimeGridPlugin,
//           interactionPlugin,
//         ]}
//         initialView="resourceTimeGridDay"
//         headerToolbar={{
//           left: "today prev,next",
//           center: "title",
//           right: "resourceTimeGridDay",
//         }}
//         themeSystem="Simplex"
//         resources={resources}
//         events={events}
//         slotMinTime="08:00:00"
//         slotMaxTime="18:00:00"
//         editable={true}
//         selectable={true}
//         height="auto"
//       />
//     </div>
//   );
// };

// export default CalendarScheduler;












// import React, { useState } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";

// // Set up Moment.js localization
// const localizer = momentLocalizer(moment);

// const CalendarScheduler = () => {
//   const today = moment().startOf("day");

//   // Define Rooms as Resources
//   const rooms = [
//     { resourceId: "XRAYS", title: "1 XRAYS" },
//     { resourceId: "PR01", title: "PR01" },
//     { resourceId: "PR02", title: "PR02" },
//     { resourceId: "PR03", title: "PR03" },
//     { resourceId: "PR04", title: "PR04" },
//     { resourceId: "PR05", title: "PR05" },
//   ];

//   // Define Appointments (Events)
//   const [appointments, setAppointments] = useState([
//     {
//       id: 1,
//       title: "Dr. Bhatt - Please book till 4pm!",
//       start: moment(today).hour(8).toDate(),
//       end: moment(today).hour(9).toDate(),
//       resourceId: "PR01",
//       color: "#888",
//     },
//     {
//       id: 2,
//       title: "Neil Gupta (46) - RECALL",
//       start: moment(today).hour(9).toDate(),
//       end: moment(today).hour(10).toDate(),
//       resourceId: "PR01",
//       color: "#d63384",
//     },
//     {
//       id: 3,
//       title: "PA ANNALEAH ACOSTA (21) - PerioEx",
//       start: moment(today).hour(9).toDate(),
//       end: moment(today).hour(10).toDate(),
//       resourceId: "PR03",
//       color: "#d63384",
//     },
//   ]);

//   return (
//     <div style={{ padding: "20px" }}>
//       <Calendar
//         localizer={localizer}
//         events={appointments}
//         startAccessor="start"
//         endAccessor="end"
//         style={{ height: 600 }}
//         step={10} // Change interval to 10 minutes
//         timeslots={6} // Ensures 6 slots per hour (every 10 min)
//         defaultView="day"
//         views={["day"]}
//         min={new Date(today.year(), today.month(), today.date(), 7, 0)} // Start at 7:00 AM
//         max={new Date(today.year(), today.month(), today.date(), 17, 0)} // End at 5:00 PM
//         formats={{
//           timeGutterFormat: (date) =>
//             moment(date).minute() === 0
//               ? moment(date).format("h:mm A") // Full format at top of hour
//               : moment(date).format("mm"), // Show only minutes for other slots
//         }}
//       />
//     </div>
//   );
// };

// export default CalendarScheduler;
