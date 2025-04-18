import { useEffect, useState } from "react";
import { IconButton, Popover, Box, Grid, Typography } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import LockIcon from "@mui/icons-material/Lock"; // For Auth
import VpnKeyIcon from "@mui/icons-material/VpnKey"; // For Panacea Credentials
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"; // For Appointments
import KeyIcon from "@mui/icons-material/Key"; // For Credentials

import panaceaLogo from "../../assets/app-menu-logos/panacea-logo.png";
import preAuthLogo from "../../assets/app-menu-logos/360-solution.png";
import toast from "react-hot-toast";
import { getUserData } from "../../utils";
import { Link } from "react-router-dom";
import { createAPIEndPointAuth } from "../../config/api/apiAuth";
import { primaryColor } from "../../utils/common";

const icons = [
  { icon: LockIcon, label: "Auth", color: "#1976d2" }, // Blue
  { icon: VpnKeyIcon, label: "Panacea", color: "#8bc34a", logo: panaceaLogo }, // Green
  { icon: LocalHospitalIcon, label: "Appointments", color: "#f44336" }, // Red
  { icon: KeyIcon, label: "Credentials", color: "#8e24aa" }, // Purple
  // { icon: 'img', label: "Pre Auth", color: "#f57c00", logo: preAuthLogo }, // Orange (Pre Auth logo)
];

const AppMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const userData = getUserData();
  const userId = userData?.id ?? null;

  const [apps, setApps] = useState([]);
  console.log("AppMenu ~ apps:", apps);

  const fetchUserApps = async () => {
    try {
      const response = await createAPIEndPointAuth(
        "user_dashboards/"
      ).fetchById(userId);
      setApps(response.data.dashboards || []);
    } catch (err) {
      console.log(err?.response?.data?.error || "Error fetching dashboards");
    }
  };

  useEffect(() => {
    fetchUserApps();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  return (
    <Box display="flex" alignItems="center">
      {/* Apps Button */}
      <IconButton
        onClick={handleClick}
        sx={{
          backgroundColor: "#F4F4F5",
          fontSize: "1px",
          marginRight: 2,
          marginLeft: 0,
          outline: "none",
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <AppsIcon sx={{ fontSize: "20px", color: "#707070" }} />
      </IconButton>

      {/* Popover Menu */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{
          mt: 1,
          "& .MuiPaper-root": {
            borderRadius: 5,
            maxWidth: "300px",
            padding: "0.45rem",
            position: "relative",
            background: "linear-gradient(to right, lightgray, darkgray)",
          },
        }}
      >
        <Box
          p={2}
          bgcolor="white"
          color="black"
          borderRadius={4}
          maxWidth={344}
          overflow="hidden"
        >
          <Grid container spacing={2} justifyContent="f">
            {apps && apps.length > 0 ? (
              apps.map((app, index) => (
                <Grid item xs={6} md={4} key={index}>
                  <Link
                    to={app.dashboard_url || "#"}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                  >
                    {app?.image === "image" ? (
                      <img
                        src={app.image}
                        alt={app.name}
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          margin: "0 auto",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          backgroundColor: "#E5F9F8",
                          color: primaryColor,
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 15px auto",
                          textTransform: "uppercase",
                        }}
                      >
                        {app?.name?.charAt(0) || "?"}
                      </Box>
                    )}
                    <Typography
                      fontSize="sm"
                      color="#8F9BBA"
                      fontWeight="500"
                      textTransform="capitalize"
                      textAlign="center"
                      mt={1}
                    >
                      {app?.name || "Unknown"}
                    </Typography>
                  </Link>
                </Grid>
              ))
            ) : (
              <Typography color="#71717a" mt={2}>
                No apps found
              </Typography>
            )}
          </Grid>
        </Box>
      </Popover>
    </Box>
  );
};

export default AppMenu;

// import { useState } from "react";
// import { IconButton, Popover, Box, Grid, Typography } from "@mui/material";
// import AppsIcon from "@mui/icons-material/Apps";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import SearchIcon from "@mui/icons-material/Search";
// import MapIcon from "@mui/icons-material/Map";
// import YouTubeIcon from "@mui/icons-material/YouTube";
// import EmailIcon from "@mui/icons-material/Email";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

// const icons = [
//   { icon: AccountCircleIcon, label: "Profile", color: "#1976d2" }, // Blue
//   { icon: SearchIcon, label: "Search", color: "#388e3c" }, // Green
//   { icon: MapIcon, label: "Maps", color: "#f57c00" }, // Orange
//   { icon: YouTubeIcon, label: "YouTube", color: "#d32f2f" }, // Red
//   { icon: EmailIcon, label: "Email", color: "#7b1fa2" }, // Purple
//   { icon: CalendarTodayIcon, label: "Calendar", color: "#0288d1" }, // Light Blue
// ];

// const AppMenu = () => {
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleClick = (event) => {
//     setAnchorEl(anchorEl ? null : event.currentTarget);
//   };

//   return (
//     <Box display="flex" alignItems="center">
//       {/* Apps Button */}
//       <IconButton onClick={handleClick} size="large">
//         <AppsIcon />
//       </IconButton>

//       {/* Popover Menu */}
//       <Popover
//         open={Boolean(anchorEl)}
//         anchorEl={anchorEl}
//         onClose={() => setAnchorEl(null)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//         transformOrigin={{ vertical: "top", horizontal: "left" }}
//         sx={{
//           mt: 1,
//           "& .MuiPaper-root": {
//             borderRadius: 5, // Add border radius here
//             maxWidth: "250px",
//             padding: "0.45rem",
//             position: "relative",
//             background: "linear-gradient(to right, lightgray, darkgray)",
//           },
//         }}
//       >
//         <Box
//           p={2}
//           bgcolor="white"
//           color="black"
//           // border="5px solid #ccc"
//           borderRadius={4}
//           maxWidth={322}
//           overflow="hidden"
//         >
//           <Grid container spacing={2} justifyContent="center">
//             {icons.map(({ icon: Icon, label, color }, index) => (
//               <Grid
//                 item
//                 xs={4}
//                 key={index}
//                 display="flex"
//                 flexDirection="column"
//                 alignItems="center"
//               >
//                 <IconButton sx={{ color }}>
//                   <Icon />
//                 </IconButton>
//                 <Typography variant="caption">{label}</Typography>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       </Popover>
//     </Box>
//   );
// };

// export default AppMenu;
