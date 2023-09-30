import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import ManagementPage from "../Pages/ManagementPage";
import AllStoresPage from "../Pages/AllStoresPage";
import AddStorePage from "../Pages/AddStorePage";
import ArrivalFormPage from "../Pages/ArrivalFormPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "/",
        element: <div>hello</div>,
      },
      {
        path: "/management",
        element: <ManagementPage />,
      },
      {
        path: "/all-stores",
        element: <AllStoresPage />,
      },
      {
        path: "/add-store",
        element: <AddStorePage />,
      },
      {
        path: "/pending-arrival-from",
        element: <ArrivalFormPage />,
      },
    ],
  },
]);
