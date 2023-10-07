import InventoryManagement from "../Components/ManagementPageComponent/InventoryManagement";
import StoreManagement from "../Components/ManagementPageComponent/StoreManagement";

export default function ManagementPage() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.2)",
  };
  return (
    <div className="space-y-8 my-10 mx-8">
      <div style={boxShadowStyle} className="p-16 bg-white rounded-lg">
        <StoreManagement />
      </div>
      <div style={boxShadowStyle} className="p-16 bg-white rounded-lg">
        <InventoryManagement />
      </div>
    </div>
  );
}
