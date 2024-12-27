import {
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
import moment from "moment";
  
  const ProjectInfo = ({ open, onClose, projectId }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [project, setProject] = useState(null);
  
    const fetchProjectInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/projects/getProject/${projectId}`
        );
        setProject(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch the project information");
        setLoading(false);
      }
    };
  
    useEffect(() => {
      if (open) {
        fetchProjectInfo();
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
          <Typography variant="h6">Project Info</Typography>
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
          <Box display="flex" flexDirection="column"  mb={2}>
            <Typography variant="body1">
              <strong>Name:</strong> {project?.name}
            </Typography>
            <Typography variant="body1">
              <strong>Description:</strong> {project?.description}
            </Typography>
            <Typography variant="body1">
              <strong>Deadline:</strong> {moment(project?.deadline).format('YYYY-MM-DD HH:MM')}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default ProjectInfo;  