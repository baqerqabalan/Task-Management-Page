// index.js
"use client";
import LoginPage from "./pages/login";
import Sidebar from "./components/common/Sidebar";
import { isAuthenticated } from "./helpers/authHelper";

export default function Home() {
  return isAuthenticated() ? <Sidebar /> : <LoginPage />;
}