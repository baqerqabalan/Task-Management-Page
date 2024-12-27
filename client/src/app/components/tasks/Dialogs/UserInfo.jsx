import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Person } from "@mui/icons-material";

const UserInfo = ({ open, onClose, userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/users/getUser/${userId}`
      );
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch the user information");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUserInfo();
    }
  }, [open]);

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" p={3}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Typography variant="h6" color="error" align="center" p={2}>
            {error}
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">User Info</Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Typography variant="body1">
            <strong>Full Name:</strong> {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body1">
            <strong>Phone Number:</strong> {user?.phoneNumber}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {user?.email}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserInfo;
