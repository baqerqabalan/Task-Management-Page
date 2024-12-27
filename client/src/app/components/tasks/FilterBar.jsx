import React, { useContext, useMemo, useState } from "react";
import { ThemeContext } from "../../context/ThemeProviderComponent";
import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
} from "@mui/material";
import { Add, Search as SearchIcon } from "@mui/icons-material";
import AddTaskDialog from "./Dialogs/AddTaskDialog";

const FilterBar = ({ onSearch, onFilterChange, onTaskAdded }) => {
  const { mode } = useContext(ThemeContext);
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
  const [openAddTaskDialog, setOpenTaskDialog] = useState(false);

  //Manage Add Task Dialog
  const handleOpenDialog = () => {
    setOpenTaskDialog(true);
  };
  const handleClose = () => {
    setOpenTaskDialog(false);
  };
  const handleSubmit = () => {
    onTaskAdded();
  };

  // Define filters
  const getFilterOptions = () => {
    return [
      { value: "all", label: "All" },
      { value: "Open", label: "Open" },
      { value: "In Progress", label: "In Progress" },
      { value: "Exceeds Deadline", label: "Exceeds Deadline" },
      { value: "Done", label: "Done" },
    ];
  };

  // State management for filter and search term
  const [filter, setFilter] = useState(getFilterOptions()[0].value);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(searchTerm);
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    onFilterChange(e.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        p={3}
        pt={0}
        bgcolor="#1a1a2e"
        boxShadow={3}
      >
        {/* Search and Filter Section */}
        <Box
          display="flex"
          gap={3}
          mt={2}
          justifyContent="space-between"
          alignItems="center"
        >
          {" "}
          {/* Search Bar */}
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#009860" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                bgcolor: "#ffffff",
                "&:hover fieldset": {
                  borderColor: "#009860",
                },
              },
              "& .MuiInputBase-input": {
                fontSize: "1rem",
                paddingLeft: "2rem",
                color: "#333",
              },
            }}
          />
          {/* Filter Options */}
          <TextField
            select
            label="Filter"
            value={filter}
            onChange={handleFilterChange}
            variant="outlined"
            sx={{
              minWidth: 150,
              borderRadius: "8px",
              bgcolor: "#ffffff",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
              "&:hover fieldset": {
                borderColor: "#009860",
              },
            }}
          >
            {getFilterOptions().map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {/* Add Task Button */}
          <Button
            variant="contained"
            sx={{
              bgcolor: "#009860",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#007b50",
              },
              padding: "8px 16px",
            }}
            onClick={handleOpenDialog}
          >
            <Add sx={{ mr: 1 }} /> Add Task
          </Button>
        </Box>

        {/* Add Task Dialog */}
        {openAddTaskDialog && (
          <AddTaskDialog
            open={openAddTaskDialog}
            onClose={handleClose}
            onSubmit={handleSubmit}
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default FilterBar;
