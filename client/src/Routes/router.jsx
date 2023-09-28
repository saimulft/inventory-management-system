import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";

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
        path: "/check2",
        element: <div>check2</div>,
      },
    ],
  },
]);
