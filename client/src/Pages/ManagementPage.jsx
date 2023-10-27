import { useQuery } from "@tanstack/react-query";
import InventoryManagement from "../Components/ManagementPageComponent/InventoryManagement";
import StoreManagement from "../Components/ManagementPageComponent/StoreManagement";
import useAuth from "../hooks/useAuth";
import axios from "axios";

export default function ManagementPage() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.2)",
  };
  const { user } = useAuth()

  const { data = {} } = useQuery({
    queryKey: ['collections-docs-counts'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/global_api/collections-docs-counts?admin_id=${user.admin_id}&creator_email=${user.email}&role=${user.role}`)
        if (res.status === 200) {
          return res.data.data;
        }
        return {}
      } catch (error) {
        console.log(error)
        return {}
      }
    }
  })

  return (
    <div className="space-y-8 my-10 mx-8">
      {
        user?.role === 'Admin' || user?.role === 'Admin VA' || user?.role === 'Store Manager Admin' || user?.role === 'Store Manager VA' ?
          <div style={boxShadowStyle} className="p-16 bg-white rounded-lg">
            <StoreManagement documentCounts={data} />
          </div> : ''
      }

      {
        user?.role === 'Admin' || user?.role === 'Admin VA' || user?.role === 'Warehouse Admin' || user?.role === 'Warehouse Manager VA' ?
          <div style={boxShadowStyle} className="p-16 bg-white rounded-lg">
            <InventoryManagement documentCounts={data} />
          </div> : ''
      }
    </div >
  );
}
