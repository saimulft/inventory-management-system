import { Navigate, createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import ManagementPage from "../Pages/ManagementPage";
import AllStoresPage from "../Pages/AllStoresPage";
import AddStorePage from "../Pages/AddStorePage";
import ArrivalFormPage from "../Pages/ArrivalFormPage";
import PreparingFormPage from "../Pages/PreparingFormPage";
import AddASINForm from "../Pages/AddASINForm";

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Navigate to='/dashboard/home'></Navigate>,
      },
      {
        path: "/dashboard/home",
        element: <div>hello</div>,
      },
      {
        path: "/dashboard/management",
        element: <ManagementPage />,
      },
      {
        path: "/dashboard/all-stores",
        element: <AllStoresPage />,
      },
      {
        path: "/dashboard/add-store",
        element: <AddStorePage />,
      },
      {
        path: "/dashboard/pending-arrival-from",
        element: <ArrivalFormPage />,
      },
      {
        path: "/dashboard/preparing-request-from",
        element: <PreparingFormPage />,
      },
      {
        path: "/dashboard/add-ASIN-UPC-from",
        element: <AddASINForm />,
      }
    ],
  },
]);
