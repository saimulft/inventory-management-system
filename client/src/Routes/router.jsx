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

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Navigate to="/dashboard/home"></Navigate>,
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
        path: "/dashboard/profit-tracker",
        element: <ProfitTrackerPage />,
      },
      {
        path: "/dashboard/support",
        element: <SupportPage />,
      },

      {
        path: "/dashboard/settings/plan",
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
]);
