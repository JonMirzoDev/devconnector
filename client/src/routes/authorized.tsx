import { Navigate } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import AddEducation from "../components/profile-forms/AddEducation";
import AddExperience from "../components/profile-forms/AddExperience";
import CreateProfile from "../components/profile-forms/CreateProfile";
import EditProfile from "../components/profile-forms/EditProfile";
import Profiles from "../components/profiles/Profiles";
import postRoutes from "./postRoutes";
import profileRoutes from "./profileRoutes";

export const authorizedRoutes = [
  {
    path: "",
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/", element: <Navigate replace to="/dashboard" /> },
      { path: "/create-profile", element: <CreateProfile /> },
      { path: "/edit-profile", element: <EditProfile /> },
      { path: "/add-experience", element: <AddExperience /> },
      { path: "/add-education", element: <AddEducation /> },
      { ...profileRoutes },
      { ...postRoutes },
      { path: "*", element: <Navigate replace to="/" /> },
    ],
  },
];
