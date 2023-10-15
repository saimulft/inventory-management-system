import { Navigate, createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import ManagementPage from "../Pages/ManagementPage";
import AllStoresPage from "../Pages/AllStoresPage";
import AddStorePage from "../Pages/AddStorePage";
import ArrivalFormPage from "../Pages/ArrivalFormPage";
import PreparingFormPage from "../Pages/PreparingFormPage";
import AddASINForm from "../Pages/AddASINForm";
import AddSupplier from "../Components/AddStrorePageComponent/AddSupplier";
import SelectPayment from "../Components/AddStrorePageComponent/SelectPayment";
import Checkout from "../Components/AddStrorePageComponent/Checkout";
import CheckoutForm from "../Components/AddStrorePageComponent/CheckoutForm";
import SendPaymentLink from "../Components/AddStrorePageComponent/SendPaymentLink";
import SupportPage from "../Pages/SupportPage";
import SettingsPage from "../Pages/SettingsPage";
import MyPlan from "../Components/SettingsPageComponents/BillingAndSubscription.jsx/MyPlan";
import ChangeCard from "../Components/SettingsPageComponents/BillingAndSubscription.jsx/ChangeCard";
import ProfitTrackerPage from "../Pages/ProfitTrackerPage";
import ProfilePage from "../Pages/SettingPages/ProfilePage";
import AddUsersPage from "../Pages/SettingPages/AddUsersPage";
import AllUsersPage from "../Pages/SettingPages/AllUsersPage";
import PendingUsersPage from "../Pages/SettingPages/PendingUserPage";
import BillingAndSubscriptionPage from "../Pages/SettingPages/BillingAndSubscriptionPage";
import AdminVRPage from "../Pages/SettingPages/AdminVRPage";
import StoreOwnerPage from "../Pages/SettingPages/StoreOwnerPage";
import StoreManagerAdminPage from "../Pages/SettingPages/StoreManagerAdminPage";
import WareHouseAdminPage from "../Pages/SettingPages/WarehouseAdminPage";
import DashboardPage from "../Pages/DashboardPage";
import AllStockTable from "../Components/ManagementPageComponent/ManagementTable/AllStockTable";
import PreparingRequestTable from "../Components/ManagementPageComponent/ManagementTable/PreparingRequestTable";
import ReadyToShipTable from "../Components/ManagementPageComponent/ManagementTable/ReadyToShipTable";
import ShippedTable from "../Components/ManagementPageComponent/ManagementTable/ShippedTable";
import OutOfStockTable from "../Components/ManagementPageComponent/ManagementTable/OutOfStockTable";
import MissingArrivalTable from "../Components/ManagementPageComponent/ManagementTable/MissingArrivalTable";
import TotalASINTable from "../Components/ManagementPageComponent/ManagementTable/TotalASINTable";
import PendingArrivalTable from "../Components/ManagementPageComponent/ManagementTable/PendingArrivalTable";
import StoreEditPage from "../Pages/StoreEditPage";
import LoginPage from "../Pages/LoginPage";
import SignUPPage from "../Pages/SignUpPage";
import ProtectedRoute from "./ProtectedRoute";
import VerifyEmail from "../Pages/verifyEmail";
import ResetPassword from "../Pages/ResetPassword";
import UpdatePassword from "../Pages/UpdatePassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard/home"></Navigate>,
      },
      {
        path: "/dashboard/home",
        element: <DashboardPage />,
      },
      {
        path: "/dashboard/management",
        element: <ManagementPage />,
      },
      // management tables route
      {
        path: "/dashboard/management/all-stock",
        element: <AllStockTable />,
      },
      {
        path: "/dashboard/management/pending-arrival",
        element: <PendingArrivalTable />,
      },
      {
        path: "/dashboard/management/preparing-request",
        element: <PreparingRequestTable />,
      },
      {
        path: "/dashboard/management/ready-to-ship",
        element: <ReadyToShipTable />,
      },
      {
        path: "/dashboard/management/shipped",
        element: <ShippedTable />,
      },
      {
        path: "/dashboard/management/shipped",
        element: <ShippedTable />,
      },
      {
        path: "/dashboard/management/out-of-stock",
        element: <OutOfStockTable />,
      },
      {
        path: "/dashboard/management/missing-arrival",
        element: <MissingArrivalTable />,
      },
      {
        path: "/dashboard/management/total-asin",
        element: <TotalASINTable />,
      },

      {
        path: "/dashboard/all-stores",
        element: <AllStoresPage />,
      },
      {
        path: "/dashboard/all-stores/store-edit",
        element: <StoreEditPage />,
      },
      {
        path: "/dashboard/add-store",
        element: <AddStorePage />,
      },
      {
        path: "/dashboard/profit-tracker",
        element: <ProfitTrackerPage />,
      },
      {
        path: "/dashboard/support",
        element: <SupportPage />,
      },

      {
        path: "/dashboard/settings/billing-subscription/plan",
        element: <MyPlan />,
      },
      {
        path: "/dashboard/settings/charge-payment",
        element: <ChangeCard />,
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
      },
      {
        path: "/dashboard/add-store/add-supplier",
        element: <AddSupplier />,
      },
      {
        path: "/dashboard/add-store/add-supplier/select-payment",
        element: <SelectPayment />,
      },
      {
        path: "/dashboard/add-store/add-supplier/select-payment/checkout",
        element: <Checkout />,
      },
      {
        path: "/dashboard/add-store/add-supplier/select-payment/checkout/checkout-form",
        element: <CheckoutForm />,
      },
      {
        path: "/dashboard/add-store/add-supplier/select-payment/send-payment-link",
        element: <SendPaymentLink />,
      },
      {
        path: "/dashboard/settings",
        element: <SettingsPage />,
        children: [
          {
            path: "/dashboard/settings/profile",
            element: <ProfilePage />,
          },
          {
            path: "/dashboard/settings/add-users",
            element: <AddUsersPage />,
          },

          {
            path: "/dashboard/settings/add-users/admin-vr",
            element: <AdminVRPage />,
          },
          {
            path: "/dashboard/settings/add-users/store-owner",
            element: <StoreOwnerPage />,
          },
          {
            path: "/dashboard/settings/add-users/store-manager-admin",
            element: <StoreManagerAdminPage />,
          },
          {
            path: "/dashboard/settings/add-users/warehouse-admin",
            element: <WareHouseAdminPage />,
          },

          {
            path: "/dashboard/settings/all-users",
            element: <AllUsersPage />,
          },

          {
            path: "/dashboard/settings/pending-users",
            element: <PendingUsersPage />,
          },
          {
            path: "/dashboard/settings/billing-subscription",
            element: <BillingAndSubscriptionPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUPPage />,
  },
  {
    path: "/verify_email",
    element: <VerifyEmail />,
  },
  {
    path: "/reset_password",
    element: <ResetPassword />,
  },
  {
    path: "/update_password",
    element: <UpdatePassword />,
  },
]);
