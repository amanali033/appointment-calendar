import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { createAPIEndPointAuth } from "../../config/api/apiAuth";
import { getUserData } from "../../utils";
import { createAPIEndPoint } from "../../config/api/api";
import toast from "react-hot-toast";

const AddNoteModal = ({ open, handleClose, pre_auth_id }) => {
  const userData = getUserData();
  const user_id = userData?.id ?? null;

  const [note, setNote] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mentionList, setMentionList] = useState([]);
  const [showMentions, setShowMentions] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await createAPIEndPointAuth(
        "clinic_team/preauth"
      ).fetchAll();
      setUsers(response.data.team_members);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNote(value);

    const match = value.match(/@([a-zA-Z]*)$/);
    if (match) {
      const search = match[1].toLowerCase();
      const filteredUsers = users.filter(
        (user) =>
          user.first_name.toLowerCase().includes(search) ||
          user.last_name.toLowerCase().includes(search)
      );
      setMentionList(filteredUsers);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionClick = (user) => {
    // const updatedNote = note.replace(
    //   /@([a-zA-Z]*)$/,
    //   `@${user.first_name}${user.last_name} `
    // );

    const updatedNote = note.replace(
      /@([a-zA-Z]*)$/,
      `@${user.first_name} ${user.last_name} `
    );

    setNote(updatedNote);
    setShowMentions(false);
  };

  const handleSave = async () => {
    if (!note.trim()) return;
    try {
      setLoading(true);
      await createAPIEndPoint("pre_auth_request/add_note").create({
        note,
        user_id,
        pre_auth_id,
      });
      toast.success("Note added successfully");
      setLoading(false);
      handleClose();
    } catch (error) {
      setLoading(false);
      toast.error("Failed to add notes. Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px" }, // Adjust the radius as needed
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
        Add Note
        <IconButton onClick={handleClose} sx={{ color: "gray" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Type '@' to mention users..."
          value={note}
          onChange={handleInputChange}
          sx={{
            my: 2,
            "& .MuiFormLabel-root": {
              color: "#71717a !important",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#fff",
              "&:hover fieldset": {
                borderColor: "secondary.main",
              },
              "&.Mui-focused fieldset": {
                borderColor: "secondary.light",
              },
            },
          }}
        />
        {showMentions && (
          <List sx={{ overflowY: "auto", maxHeight: "250px" }}>
            {mentionList.map((user, idx) => (
              <ListItem key={user.id} disablePadding>
                <ListItemButton onClick={() => handleMentionClick(user)}>
                  <ListItemText
                    primary={`${idx + 1}) ${user.first_name} ${user.last_name}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
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
          disabled={!note.trim() || loading}
          sx={{
            backgroundColor: "secondary.main",
            color: "#fff",
            textTransform: "capitalize",
            boxShadow: "none",
            borderRadius: "10px",
          }}
        >
          {loading ? "Saving..." : "Save Notes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNoteModal;
