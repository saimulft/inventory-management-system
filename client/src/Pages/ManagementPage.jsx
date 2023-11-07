import { useQuery } from "@tanstack/react-query";
import InventoryManagement from "../Components/ManagementPageComponent/InventoryManagement";
import StoreManagement from "../Components/ManagementPageComponent/StoreManagement";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { useEffect, useState } from "react";
import useGlobal from "../hooks/useGlobal";
import Loading2 from "../Components/Shared/Loading2";

export default function ManagementPage() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.2)",
  };
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { countsRefetch, setCountsRefetch } = useGlobal()

  const { data = {}, refetch, isLoading } = useQuery({
    queryKey: ['collections-docs-counts'],
    queryFn: async () => {
      try {
        const res = await axios.post(`/api/v1/global_api/collections-docs-counts`, { user })
        if (res.status === 200) {
          setLoading(false)
          return res.data.data;
        }
        return {}
      } catch (error) {
        console.log(error)
        return {}
      }
    }
  })

  // refetch documentCounts when countRefetch value is true
  useEffect(() => {
    if (countsRefetch) {
      setLoading(true)
      refetch()
      setCountsRefetch(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countsRefetch]);

  return (
    <div className="relative">
      {
        loading || isLoading ? <Loading2 contentHeight="74px" /> : <div className="space-y-8 my-10 mx-8">
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
        </div>
      }
    </div>
  );
}
