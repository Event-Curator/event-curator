import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
