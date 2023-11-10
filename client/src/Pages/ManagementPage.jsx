import InventoryManagement from "../Components/ManagementPageComponent/InventoryManagement";
import StoreManagement from "../Components/ManagementPageComponent/StoreManagement";
import useAuth from "../hooks/useAuth";

export default function ManagementPage() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.2)",
  };
  const {user} = useAuth()

  return (
    <div className="space-y-8 my-10 mx-8">
      {
        user?.role === 'Admin' || user?.role === 'Admin VA' || user?.role === 'Store Manager Admin' || user?.role === 'Store Manager VA' ?
        <div style={boxShadowStyle} className="p-16 bg-white rounded-lg">
          <StoreManagement />
        </div> : ''
      }

      {
        user?.role === 'Admin' || user?.role === 'Admin VA' || user?.role === 'Warehouse Admin' || user?.role === 'Warehouse Manager VA' ?
        <div style={boxShadowStyle} className="p-16 bg-white rounded-lg">
          <InventoryManagement />
        </div> : ''
      }
    </div>
  );
}
