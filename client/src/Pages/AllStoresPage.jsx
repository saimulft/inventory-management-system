import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaAmazon, FaEbay, FaShopify } from "react-icons/fa";
import { TbBrandWalmart } from "react-icons/tb";
import { AiOutlineAlibaba } from "react-icons/ai";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loading from "../Components/Shared/Loading";

export default function AllStoresPage() {
  const [isActive, setIsActive] = useState(true);
  const [allStoreData, setAllStoreData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [storeType, setStoreType] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    setIsLoading(true)
    axios.get(`/api/v1/store_api/get_all_stores?id=${user.admin_id}&storeType=${storeType}`)
      .then(res => {
        if (res.status === 200) {
          setIsLoading(false)
          setAllStoreData(res.data.data)
        }
        if(res.status === 204){
          setIsLoading(false)
        }
      })
      .catch(error => console.log(error))
  }, [storeType, user.admin_id])

  const shadowStyle = {
    boxShadow: "0px 0px 15px -8px rgba(0,0,0,0.75)",
  };

  return (
    <div className="p-20">
      <div className="flex justify-between">
        <div className="flex text-center w-1/2 ">
          <div
            onClick={() => setIsActive(true)}
            className={`px-3 rounded-s-md py-2 cursor-pointer ${isActive
              ? "bg-[#8633FF] text-white"
              : "border-2 border-[#8633FF] text-[#8633FF]"
              }  `}
          >
            Active
          </div>
          <div
            onClick={() => setIsActive(false)}
            className={`px-3 rounded-e-md py-2 cursor-pointer ${!isActive
              ? "bg-[#8633FF] text-white"
              : "border-2 border-[#8633FF] text-[#8633FF]"
              }  `}
          >
            Inactive
          </div>
        </div>
        <div className="w-1/2 gap-4 flex items-center">
          <form className="w-full flex gap-4 ">
            <select onChange={(e) => setStoreType(e.target.value)} name="storeType" id="storeType" className="border bg-white shadow-md border-[#8633FF] outline-none cursor-pointer w-1/2 py-2 rounded-md px-2 text-sm">
              <option defaultValue="All Store">
                All Store
              </option>
              <option value="Amazon">Amazon</option>
              <option value="Walmart">Walmart</option>
              <option value="Ebay">Ebay</option>
              <option value="Shopify">Shopify</option>
              <option value="Ali Express">Ali Express</option>
            </select>

            <div className="relative  w-1/2 ">
              <input
                className="border bg-white shadow-md border-[#8633FF] outline-none w-full cursor-pointer  py-2 rounded-md px-2 text-sm"
                placeholder="Search Here"
                type="text"
              />
              <div className="absolute bottom-[8px] cursor-pointer p-[2px] rounded right-[6px] bg-[#8633FF]  text-white ">
                <AiOutlineSearch size={20} />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* store info  */}
      <div className="relative grid grid-cols-4 gap-6 mb-8 mt-8">
        {isLoading ? <Loading /> : allStoreData.map((singleStore, index) => {
          return (
            <Link
              to={`/dashboard/all-stores/store-edit/${singleStore._id}`}
              style={shadowStyle}
              key={index}
            >
              <div className="flex items-center px-5 py-8 cursor-pointer gap-4 border-2 border-[#8633FF]  rounded-lg">
                <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
                  <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
                    {singleStore.store_type === 'Amazon' && <FaAmazon size={24} />}
                    {singleStore.store_type === 'Walmart' && <TbBrandWalmart size={24} />}
                    {singleStore.store_type === 'Ebay' && <FaEbay size={30} />}
                    {singleStore.store_type === 'Shopify' && <FaShopify size={24} />}
                    {singleStore.store_type === 'Ali Express' && <AiOutlineAlibaba size={30} />}
                  </div>
                </div>
                <div>
                  <p className="text-xl">{singleStore.store_name}</p>
                  <p className="text-slate-500">{singleStore.store_manager_name}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
