import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import ManagementPage from "../Pages/ManagementPage";
import AllStoresPage from "../Pages/AllStoresPage";
import AddStorePage from "../Pages/AddStorePage";
import AddSupplier from "../Components/AddStrorePageComponent/AddSupplier";

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
        path: "/allstores",
        element: <AllStoresPage />,
      },
      {
        path: "/addstore",
        element: <AddStorePage />,
      },
      {
        path: "/addsupplier",
        element: <AddSupplier />,
      },
    ],
  },
]);
