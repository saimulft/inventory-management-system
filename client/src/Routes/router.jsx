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
import StoreEditPage from "../Pages/StoreEditPage";
import LoginPage from "../Pages/LoginPage";
import SignUPPage from "../Pages/SignUpPage";
import ProtectedRoute from "./ProtectedRoute";
import VerifyEmail from "../Pages/verifyEmail";
import ResetPassword from "../Pages/ResetPassword";
import UpdatePassword from "../Pages/UpdatePassword";
import StoreAllStockTable from "../Components/ManagementPageComponent/StoreManagementTable/StoreAllStockTable";
import StorePreparingRequestTable from "../Components/ManagementPageComponent/StoreManagementTable/StorePreparingRequestTable";
import StorePendingArrivalTable from "../Components/ManagementPageComponent/StoreManagementTable/StorePendingArrivalTable";
import StoreReadyToShipTable from "../Components/ManagementPageComponent/StoreManagementTable/StoreReadyToShipTable";
import StoreShippedTable from "../Components/ManagementPageComponent/StoreManagementTable/StoreShippedTable";
import StoreOutOfStockTable from "../Components/ManagementPageComponent/StoreManagementTable/StoreOutOfStockTable";
import StoreMissingArrivalTable from "../Components/ManagementPageComponent/StoreManagementTable/StoreMissingArrivalTable";
import StoreTotalASINTable from "../Components/ManagementPageComponent/StoreManagementTable/StoreTotalASINTable";
import InventoryAllStockTable from "../Components/ManagementPageComponent/InventoryManagementTable/InventoryAllStockTable";
import InventoryPendingArrivalTable from "../Components/ManagementPageComponent/InventoryManagementTable/InventoryPendingArrivalTable";
import InventoryPreparingRequestTable from "../Components/ManagementPageComponent/InventoryManagementTable/InventoryPreparingRequestTable";
import InventoryReadyToShipTable from "../Components/ManagementPageComponent/InventoryManagementTable/InventoryReadyToShipTable";
import InventoryShippedTable from "../Components/ManagementPageComponent/InventoryManagementTable/InventoryShippedTable";
import InventoryOutOfStockTable from "../Components/ManagementPageComponent/InventoryManagementTable/InventoryOutOfStockTable";
import InventoryMissingArrivalTable from "../Components/ManagementPageComponent/InventoryManagementTable/InventoryMissingArrivalTable";
import InventoryTotalASINTable from "../Components/ManagementPageComponent/InventoryManagementTable/InventoryTotalASINTable";
import AllAdminUsers from "../Pages/SettingPages/AllAdminUsers";
import StoreManagerVAPage from "../Pages/SettingPages/StoreManagerVAPage";
import WarehouseManagerVAPage from "../Pages/SettingPages/WarehouseManagerVAPage";
import AuthRoute from "./AuthRoute";
import AdminRoute from "./AdminRoute";
import StoreManagerRoute from "./StoreManagerRoute";
import StoreOwnerRoute from "./StoreOwnerRoute";
import ProfitTrackerStatsPage from "../Pages/ProfitTrackerStatsPage";

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
        element: <AdminRoute><DashboardPage /></AdminRoute>,
      },
      {
        path: "/dashboard/management",
        element: <ManagementPage />,
      },
      //store management tables route
      {
        path: "/dashboard/management/store/all-stock",
        element: <StoreAllStockTable />,
      },
      {
        path: "/dashboard/management/store/pending-arrival",
        element: <StorePendingArrivalTable />,
      },
      {
        path: "/dashboard/management/store/preparing-request",
        element: <StorePreparingRequestTable />,
      },
      {
        path: "/dashboard/management/store/ready-to-ship",
        element: <StoreReadyToShipTable />,
      },
      {
        path: "/dashboard/management/store/shipped",
        element: <StoreShippedTable />,
      },
      {
        path: "/dashboard/management/store/shipped",
        element: <StoreShippedTable />,
      },
      {
        path: "/dashboard/management/store/out-of-stock",
        element: <StoreOutOfStockTable />,
      },
      {
        path: "/dashboard/management/store/missing-arrival",
        element: <StoreMissingArrivalTable />,
      },
      {
        path: "/dashboard/management/store/total-asin",
        element: <StoreTotalASINTable />,
      },

      // inventory management table

      {
        path: "/dashboard/management/inventory/all-stock",
        element: <InventoryAllStockTable />,
      },
      {
        path: "/dashboard/management/inventory/pending-arrival",
        element: <InventoryPendingArrivalTable />,
      },
      {
        path: "/dashboard/management/inventory/preparing-request",
        element: <InventoryPreparingRequestTable />,
      },
      {
        path: "/dashboard/management/inventory/ready-to-ship",
        element: <InventoryReadyToShipTable />,
      },
      {
        path: "/dashboard/management/inventory/shipped",
        element: <InventoryShippedTable />,
      },
      {
        path: "/dashboard/management/inventory/shipped",
        element: <InventoryShippedTable />,
      },
      {
        path: "/dashboard/management/inventory/out-of-stock",
        element: <InventoryOutOfStockTable />,
      },
      {
        path: "/dashboard/management/inventory/missing-arrival",
        element: <InventoryMissingArrivalTable />,
      },
      {
        path: "/dashboard/management/inventory/total-asin",
        element: <InventoryTotalASINTable />,
      },

      {
        path: "/dashboard/all-stores",
        element: <AdminRoute><AllStoresPage /></AdminRoute>,
      },
      {
        path: "/dashboard/all-stores/store-edit/:id",
        element: <AdminRoute><StoreEditPage /></AdminRoute>,
      },
      {
        path: "/dashboard/add-store",
        element: <AdminRoute><AddStorePage /></AdminRoute>,
      },
      {
        path: "/dashboard/profit-tracker",
        element: <StoreOwnerRoute><ProfitTrackerPage /></StoreOwnerRoute>,
      },
      {
        path: "/dashboard/profit-tracker/store/:id",
        element: <StoreOwnerRoute><ProfitTrackerStatsPage /></StoreOwnerRoute>,
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
        element: <StoreManagerRoute><ArrivalFormPage /></StoreManagerRoute>,
      },
      {
        path: "/dashboard/preparing-request-from",
        element: <StoreManagerRoute><PreparingFormPage /></StoreManagerRoute>,
      },
      {
        path: "/dashboard/add-ASIN-UPC-from",
        element: <StoreManagerRoute><AddASINForm /></StoreManagerRoute>,
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
            path: "/dashboard/settings/add-users/admin-va",
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
            path: "/dashboard/settings/add-users/store-manager-va",
            element: <StoreManagerVAPage />,
          },
          {
            path: "/dashboard/settings/add-users/warehouse-admin",
            element: <WareHouseAdminPage />,
          },
          {
            path: "/dashboard/settings/add-users/warehouse-manager-va",
            element: <WarehouseManagerVAPage />,
          },

          {
            path: "/dashboard/settings/all-users",
            element: <AllUsersPage />,
          },

          {
            path: "/dashboard/settings/all-admin-users",
            element: <AllAdminUsers />,
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
    element: <AuthRoute><LoginPage /></AuthRoute>,
  },
  {
    path: "/signup",
    element: <AuthRoute><SignUPPage /></AuthRoute>,
  },
  {
    path: "/verify_email",
    element: <AuthRoute><VerifyEmail /></AuthRoute>,
  },
  {
    path: "/reset_password",
    element: <AuthRoute><ResetPassword /></AuthRoute>,
  },
  {
    path: "/update_password",
    element: <AuthRoute><UpdatePassword /></AuthRoute>,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard/home"></Navigate>
  }
]);
