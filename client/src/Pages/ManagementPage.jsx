import InventoryManagement from "../Components/ManagementPageComponent/InventoryManagement";
import StoreManagement from "../Components/ManagementPageComponent/StoreManagement";

export default function ManagementPage() {
  return (
    <div className="space-y-8">
      <StoreManagement />
      <InventoryManagement />
    </div>
  );
}
