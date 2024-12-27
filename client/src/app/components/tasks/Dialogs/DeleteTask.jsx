import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import axios from "axios";
import { setAuthHeader } from "@/app/helpers/authHelper";

const DeleteTaskDialog = ({ open, onClose, onDelete, taskId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(
        `http://localhost:5000/tasks/${taskId}`,
        setAuthHeader()
      );
      onDelete();
      onClose();
    } catch (error) {
      console.log("Error Deleting the task", error);
      setError("Failed to delete the task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      {error && <Typography color="error">{error}</Typography>}
      <DialogContent>Are you sure you want to delete this task?</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="secondary" disabled={loading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTaskDialog;
