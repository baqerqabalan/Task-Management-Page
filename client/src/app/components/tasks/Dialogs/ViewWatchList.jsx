import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Slide,
  Typography,
  Box,
  CircularProgress,
  Link,
  ThemeProvider,
  CssBaseline,
  createTheme,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { ThemeContext } from "../../../context/ThemeProviderComponent";
import { setAuthHeader } from "../../../helpers/authHelper";

const SlideTransition = React.forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

function Row({ index, row }) {
  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>
          {row.task.assignedToUser?.firstName} {row.task.assignedToUser?.lastName}
        </TableCell>
        <TableCell>{row?.task.name}</TableCell>
        <TableCell>{row?.task.status}</TableCell>
      </TableRow>
    </>
  );
}
const WatchListDialog = ({ open, onClose }) => {
  const { mode } = useContext(ThemeContext);
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchWatchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/watchlist`,
        setAuthHeader()
      );
      setRows(response.data);
      setError(null);
    } catch (error) {
      setError("Error fetching the watchlsit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchList();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={SlideTransition}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            borderRadius: "16px 0 0 16px",
            boxShadow: theme.shadows[5],
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Watch List</Typography>
            <IconButton
              onClick={onClose}
              sx={{ color: theme.palette.text.primary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              wordBreak: "break-word",
            }}
          />
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box textAlign="center">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" textAlign="center">
              {error}{" "}
              <Link onClick={() => fetchWatchList()}>Please try again</Link>
            </Typography>
          ) : (
            <>
              <TableContainer
                component={Paper}
                sx={{
                  width: "100%",
                  overflow: "auto",
                  boxShadow: 3,
                  backgroundColor: mode === "light" ? "#ffffff" : "#1d1d1d",
                }}
              >
                <Table aria-label="collapsible table" sx={{ width: "100%" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Assignee Name</TableCell>
                      <TableCell>Task Name</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody key={index}>
                    {rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => (
                        <Row key={row.id} index={index} row={row} />
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    mt: 2,
                    ".MuiTablePagination-toolbar": { justifyContent: "center" },
                    color: "#009688",
                  }}
                />
              </TableContainer>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default WatchListDialog;
