import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { createAPIEndPointAuth } from "../../../../config/api/apiAuth";

const UpdateAdditionalComments = ({ open, handleClose, pre_auth_id }) => {
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle save action
  const handleSave = async () => {
    if (!comments.trim()) {
      toast.error("Please enter additional comments.");
      return;
    }

    try {
      setLoading(true);
      await createAPIEndPointAuth("pre_auth_request/update_comments/").update(
        pre_auth_id,
        { additional_comments: comments }
      );
      toast.success("Additional comments updated successfully.");
      handleClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Failed to update additional comments. Please try again."
      );
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
        Update Additional Comments
        <IconButton onClick={handleClose} sx={{ color: "gray" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          multiline
          minRows={3}
          size="small"
          label="Additional Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          sx={{
            my: 2,
            "& .MuiFormLabel-root": {
              color: "#71717a !important",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#fff",
              "& fieldset": {
                borderColor: "#e4e4e7",
              },
              "&:hover fieldset": {
                borderColor: "secondary.main",
              },
              "&.Mui-focused fieldset": {
                borderColor: "secondary.light",
              },
            },
          }}
        />
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
          disabled={!comments.trim() || loading}
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

export default UpdateAdditionalComments;
