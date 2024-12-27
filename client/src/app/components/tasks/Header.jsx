import React, { useContext, useMemo, useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  createTheme,
  CssBaseline,
  Tooltip,
  Button,
} from "@mui/material";
import { AccountCircle, RemoveRedEyeRounded } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@mui/system";
import { ThemeContext } from "../../context/ThemeProviderComponent";
import { clearToken, setAuthHeader } from "../../helpers/authHelper";
import WatchListDialog from "./Dialogs/ViewWatchList";

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const [openWatchList, setOpenWatchList] = useState(false);

  const { mode, toggleTheme } = useContext(ThemeContext);

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenWatchList = () => {
    setOpenWatchList(true);
  };

  const handleClose = () => {
    setOpenWatchList(false);
  };

  //Handle Logout
  const handleLogout = () => {
    clearToken();
    setAuthHeader();
    router.push("/");
    window.location.reload();
    handleUserMenuClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          backgroundColor: "#1a1a2e",
          color: "white",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ padding: "5px 15px" }}>
          <Typography color="white" variant="h5">
            Tasks
          </Typography>
        </Box>

        {/*WatchList Button*/}
        <Box display="flex" justifyContent="space-between" alignItems="end">
          <Tooltip Tooltip title="View WatchList">
            <IconButton sx={{ color: "white" }} onClick={handleOpenWatchList}>
              <RemoveRedEyeRounded />
            </IconButton>
            {openWatchList && (
              <WatchListDialog open={openWatchList} onClose={handleClose} />
            )}
          </Tooltip>

          {/*Toggle Theme Button */}
          <Button
            variant="text"
            color="white"
            onClick={toggleTheme}
            startIcon={
              mode === "dark" ? (
                <img
                  width="25px"
                  src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='20' width='20' viewBox='0 0 20 20'><path fill='%23fff' d='M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z'/></svg>"
                  alt="Sun Icon"
                />
              ) : (
                <img
                  width="25px"
                  src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='20' width='20' viewBox='0 0 20 20'><path fill='%23fff' d='M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z'/></svg>"
                  alt="Moon Icon"
                />
              )
            }
          ></Button>

          {/* User Menu */}
          <IconButton onClick={handleUserMenuOpen} sx={{ color: "white" }}>
            <AccountCircle />
          </IconButton>
        </Box>
        {/* User Menu Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleUserMenuClose}
          sx={{ mt: "45px" }}
        >
          <MenuItem onClick={handleLogout}>
            <Typography sx={{ width: "100%" }}>Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  );
}

export default Header;
