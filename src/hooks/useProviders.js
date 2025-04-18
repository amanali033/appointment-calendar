// src/hooks/useProviders.js
import { useEffect, useState, useMemo } from "react";
import { createAPIEndPointAuth } from "../config/api/apiAuth";
import { getUserData } from "../utils";


export const useProviders = () => {
    const userData = getUserData();
    const userId = userData?.id ?? null;
    const clinic_id = userData?.clinic_id ?? null;
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            try {
                const response = await createAPIEndPointAuth(`clinic_providers/get_all/${clinic_id}`
                ).fetchAll(); setProviders(response?.data?.providers || []);
            } catch (err) {
                console.error("Error loading providers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, []);

    return { providers, loading };
};

