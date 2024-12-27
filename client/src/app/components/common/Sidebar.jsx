"use client";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowLeft,
  Task,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from '../../assets/logo.png';
import { useRouter } from "next/navigation";
import Tasks from "@/app/pages/tasks/page";
import Image from "next/image";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width:768px)");

  const router = useRouter();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  
  useEffect(() => {
    if (isLargeScreen) {
      setIsOpen(isLargeScreen);
    }
  }, [isLargeScreen]);


  //Manage Menu items
  const menuItems = [
    { text: "Tasks", icon: <Task />, route: '/' },
  ];

  //Handle Navigation Method
  const handleNavigate = (page) => {
    if (page === "logout") {
      handleLogout();
    }
    else {
      router.push(page);
    }
  };

  //Handle Logout Method
  const handleLogout = () => {
    clearToken();
    router.push("/");
  };

  return (
    <Box display="flex" sx={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        open={isOpen}
        sx={{
          width: isOpen ? 240 : 60,
          flexShrink: 0,
          transition: "width 0.3s ease-in-out",
          "& .MuiDrawer-paper": {
            width: isOpen ? 240 : 60,
            boxSizing: "border-box",
            backgroundColor: "#1a1a2e",
            color: "#ffffff",
            overflowX: "hidden"
          },
        }}
      >
        {/* Toggle Button */}
        <Box display="flex" justifyContent={isOpen ? "space-between" : "center"} p={2}>
          {isOpen && (
           <Image
           src={logo}
           alt="Logo"
           width={100}
           height={50}
         />
          )}
          <IconButton onClick={toggleDrawer} sx={{ color: "#ffffff" }}>
            {isOpen ? <ArrowLeft /> : <MenuIcon />}
          </IconButton>
        </Box>

        {/* Menu Items */}
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => handleNavigate(item.route)}
                sx={{
                  minHeight: 48,
                  justifyContent: isOpen ? "initial" : "center",
                  px: 2.5,
                  "&:hover": {
                    backgroundColor: "#0f3460",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "#ffffff",
                    minWidth: 0,
                    mr: isOpen ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: isOpen ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Content Area */}
      <Box component="main" sx={{ flexGrow: 1, overflowX: "hidden" }}>
        {window.location.pathname === "/" && <Tasks />}
      </Box>
    </Box>
  );
}

export default Sidebar;