import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import { setAuthHeader } from "@/app/helpers/authHelper";
import moment from "moment";

const EditTaskDialog = ({ open, onClose, onSubmit, task }) => {
  const [form, setForm] = useState({
    name: task.taskName,
    description: task.taskDescription,
    deadline: moment(task.taskDeadline, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DDTHH:mm'),
    priority: task.taskPriority,
    project: task.taskProjectId,
    assignedToUser: task.taskAssignedToId,
  });

  
  const [errors, setErrors] = useState({});
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/tasks/getPorjectAndUserNames`
        );
        setProjects(response.data.projects);
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching projects or users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchProjectsAndUsers();
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value === "" ? null : value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Task name is required";
    if (!form.description)
      newErrors.description = "Task description is required";
    if (!form.deadline) {
      newErrors.deadline = "Task deadline is required";
    } else if (new Date(form.deadline) < Date.now()) {
      newErrors.deadline = "Task deadline must be in future";
    }
    if (!form.priority) newErrors.priority = "Task priority is required";
    if (!form.project) newErrors.project = "Task project is required";
    if (!form.assignedToUser)
      newErrors.assignedToUser = "Task assignee is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        name: form.name,
        description: form.description,
        deadline: form.deadline,
        priority: form.priority,
        project: parseInt(form.project, 10), 
        assignedToUser: parseInt(form.assignedToUser, 10),
      };

      await axios.patch(`http://localhost:5000/tasks/${task.id}`, payload, setAuthHeader());
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error editing task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={2}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              error={!!errors.description}
              helperText={errors.description}
            />
            <TextField
              label="Deadline"
              name="deadline"
              type="datetime-local"
              value={form.deadline}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              error={!!errors.deadline}
              helperText={errors.deadline}
            />
            <TextField
              select
              label="Priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.priority}
              helperText={errors.priority}
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </TextField>
            <TextField
              select
              label="Project"
              name="project"
              value={form.project || " "}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.project}
              helperText={errors.project}
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Assigned To"
              name="assignedToUser"
              value={form.assignedToUser || " "}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.assignedToUser}
              helperText={errors.assignedToUser}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {`${user.firstName} ${user.lastName}`}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="warning" disabled={loading}>
          Edit Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskDialog;
