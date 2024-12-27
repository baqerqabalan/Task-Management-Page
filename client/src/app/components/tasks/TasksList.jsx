import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  createTheme,
  CssBaseline,
  IconButton,
  Snackbar,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import { ThemeContext } from "../../context/ThemeProviderComponent";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import moment from "moment";
import UserInfo from "./Dialogs/UserInfo";
import ProjectInfo from "./Dialogs/ProjectInfo";
import EditTaskDialog from "./Dialogs/EditTask";
import DeleteTaskDialog from "./Dialogs/DeleteTask";
import { setAuthHeader } from "@/app/helpers/authHelper";

const TasksList = ({ shouldFetchData, searchTerm, filterOption }) => {
  const { mode } = useContext(ThemeContext); //Theme Context
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
  //Initializers
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);
  const tableRef = useRef();
  const [openCreatorDialog, setOpenCreatorId] = useState(false);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [openEditTaskDialog, setOpenEditTaskDialog] = useState(null);
  const [openDeleteTaskDialog, setOpenDeleteTaskDialog] = useState(false);

  //Manage Edit and Delete Dialogs
  const handleCloseEditTaskDialog = () => {
    setOpenEditTaskDialog(null);
  };
  const handleCloseDeleteTaskDialog = () => {
    setOpenDeleteTaskDialog(null);
  };
  const handleEditTask = async (id) => {
    setOpenEditTaskDialog(id);
  };
  const handleSubmitEdit = () => {
    fetchData();
  };
  const handleDeleteTask = (id) => {
    setOpenDeleteTaskDialog(id);
  };
  const handleSubmitDelete = () => {
    fetchData();
  };

  //Fetch Tasks Method
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let api = `http://localhost:5000/tasks/getTasks?page=${
        page + 1
      }&pageSize=${pageSize}`;

      // Add query parameters conditionally
      if (searchTerm) api += `&searchTerm=${searchTerm}`;
      if (filterOption) api += `&filterOption=${filterOption}`;

      const response = await axios.get(api);

      const formattedData = response.data.tasks.map((task, index) => ({
        virtualId: page * pageSize + index + 1,
        id: task.id,
        taskName: task.name,
        taskDescription: task.description,
        taskProject: task.project.name,
        taskProjectId: task.project.id,
        taskAssignedTo: `${task.assignedToUser.firstName} ${task.assignedToUser.lastName}`,
        taskAssignedToId: task.assignedToUser.id,
        taskCreatedAt: moment(task.createdAt).format("DD-MM-YYYY HH:mm"),
        taskDeadline: moment(task.deadline).format("DD-MM-YYYY HH:mm"),
        taskStatus: task.status,
        taskPriority: task.priority,
        isInWatchlist: task.isInWatchlist,
      }));

      setRows(formattedData);
      setRowCount(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm, filterOption]);

  useEffect(() => {
    fetchData();
    if (shouldFetchData) {
      fetchData();
    }
  }, [shouldFetchData, fetchData]);

  //Add to watchList Method
  const handleAddToWatchList = async (taskId) => {
    try {
      await axios.post(
        `http://localhost:5000/watchList/add/${taskId}`,
        setAuthHeader()
      );
      fetchData();
    } catch (error) {
      console.log("Failed to add or remove the task");
    }
  };

  // Define Columns
  const columns = [
    { field: "virtualId", headerName: "ID", flex: 0.5 },
    { field: "taskName", headerName: "Name" },
    { field: "taskDescription", headerName: "Description" },
    {
      field: "taskProject",
      headerName: "Project",
      flex: 1,
      renderCell: (params) => (
        <>
          <Typography
            sx={{
              textDecoration: "underline",
              color: "#009688",
              cursor: "pointer",
              paddingTop: "10px",
            }}
            onClick={() => setOpenProjectDialog(true)}
          >
            {params.value}
          </Typography>
          {openProjectDialog && (
            <ProjectInfo
              open={openProjectDialog}
              onClose={() => setOpenProjectDialog(false)}
              projectId={params.row.taskProjectId}
            />
          )}
        </>
      ),
    },
    {
      field: "taskAssignedTo",
      headerName: "Assigned To",
      flex: 1,
      renderCell: (params) => (
        <>
          <Typography
            sx={{
              textDecoration: "underline",
              color: "#009688",
              cursor: "pointer",
              paddingTop: "10px",
            }}
            onClick={() => setOpenCreatorId(true)}
          >
            {params.value}
          </Typography>
          {openCreatorDialog && (
            <UserInfo
              open={openCreatorDialog}
              onClose={() => setOpenCreatorId(false)}
              userId={params.row.taskAssignedToId}
            />
          )}
        </>
      ),
    },
    { field: "taskCreatedAt", headerName: "Assigned At", flex: 1 },
    { field: "taskDeadline", headerName: "Deadline", flex: 1 },
    { field: "taskStatus", headerName: "Status", flex: 1 },
    { field: "taskPriority", headerName: "Priority", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <ButtonGroup sx={{ marginTop: 1 }}>
            <Tooltip title="Watch List">
              <IconButton
                variant="contained"
                onClick={() => handleAddToWatchList(params.id)}
                sx={{ backgroundColor: "rgb(179, 182, 186)" }}
              >
                <RemoveRedEye
                  sx={{
                    color:
                      params.row.isInWatchlist === true
                        ? "rgb(29, 134, 245)"
                        : "white",
                  }}
                />
              </IconButton>
            </Tooltip>
            <IconButton
              variant="contained"
              sx={{ backgroundColor: "rgb(9, 94, 30)", marginLeft: 1 }}
              onClick={() => handleEditTask(params.id)}
            >
              <Edit sx={{ color: "white" }} />
            </IconButton>
            <IconButton
              variant="contained"
              onClick={() => handleDeleteTask(params.id)}
              sx={{ backgroundColor: "rgb(249, 33, 54)", marginLeft: 1 }}
            >
              <Delete sx={{ color: "white" }} />
            </IconButton>
          </ButtonGroup>
          {openEditTaskDialog === params.id && (
            <EditTaskDialog
              open={openEditTaskDialog === params.id}
              onClose={handleCloseEditTaskDialog}
              task={params.row}
              onSubmit={handleSubmitEdit}
            />
          )}
          {openDeleteTaskDialog === params.id && (
            <DeleteTaskDialog
              open={openDeleteTaskDialog === params.id}
              onClose={handleCloseDeleteTaskDialog}
              taskId={params.id}
              onDelete={handleSubmitDelete}
            />
          )}
        </>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: "80vh", width: "100%" }}>
        <Box ref={tableRef} width="100%">
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            pagination
            paginationMode="server"
            page={page}
            pageSize={pageSize}
            rowCount={rowCount}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 25]}
            disableSelectionOnClick
            sx={{
              backgroundColor: theme.palette.background.paper,
              boxShadow: 3,
              overflow: "auto",
              width: "100%",
              borderRadius: 2,
              ".MuiDataGrid-cell": { borderBottom: "1px solid #ccc" },
              ".MuiDataGrid-columnHeaders": {
                backgroundColor: "#f4f6f8",
                color: theme.palette.mode === "dark" ? "#fff" : "#333",
              },
            }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default TasksList;
