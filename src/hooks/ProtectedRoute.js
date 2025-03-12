// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import React, { useState, useEffect, useRef } from "react";

function ProtectedRoute({ children }) {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const accessToken = localStorage.getItem("access_token");
    const toastShown = useRef(false); // Track if toast has been shown

    useEffect(() => {
        if (!accessToken && !toastShown.current) {
            toast.error("Access denied. Please log in.");
            toastShown.current = true; // Mark toast as shown
            setTimeout(() => setShouldRedirect(true), 100);
        }
    }, [accessToken]);

    if (shouldRedirect) {
        return React.createElement(Navigate, { to: "/login", replace: true });
    }

    return accessToken ? children : null;
}

export default ProtectedRoute;
