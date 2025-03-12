import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import toast from "react-hot-toast";
import { createAPIEndPointAuth } from "../../../../config/api/apiAuth";
import { createAPIEndPoint } from "../../../../config/api/api";

const AddServiceProvider = ({ open, handleClose, pre_auth_id, fetchAgain }) => {
  const [provider, setProvider] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch staff members
  const fetchProviders = async () => {
    try {
      const response = await createAPIEndPointAuth(
        "clinic_providers"
      ).fetchAll(true);
      setProvider(response.data.providers);
    } catch (err) {
      console.error("Error fetching providers:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchProviders();
    }
  }, [open]);

  // Handle save action
  const handleSave = async () => {
    if (!selectedMember) {
      toast.error("Please select a provider.");
      return;
    }

    try {
      setLoading(true);
      await createAPIEndPoint("update_provider").create({
        pre_auth_id,
        provider_id: selectedMember,
      });
      toast.success("Provider added successfully.");
      handleClose();
      fetchAgain();
    } catch (error) {
      toast.error("Failed to add provider. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px" },
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
        Add Provider
        <IconButton onClick={handleClose} sx={{ color: "gray" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel>Select Provider</InputLabel>
          <Select
            size="small"
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            // label="Select Staff Member"
            displayEmpty
            sx={{
              mt: "8px",
              width: "100%",
              backgroundColor: "transparent",
              borderRadius: "8px",
              "& fieldset": { borderColor: "#e4e4e7" },
              "&:hover fieldset": { borderColor: "secondary.main" },
              "&.Mui-focused fieldset": {
                borderColor: "#1D8567 !important",
              },
            }}
          >
            {provider.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                {member.provider_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: "#ecf0f1",
            color: "#707070",
            textTransform: "capitalize",
            boxShadow: "none",
            borderRadius: "10px",
          }}
        >
          Close
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!selectedMember || loading}
          sx={{
            backgroundColor: "secondary.main",
            color: "#fff",
            textTransform: "capitalize",
            boxShadow: "none",
            borderRadius: "10px",
          }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddServiceProvider;
