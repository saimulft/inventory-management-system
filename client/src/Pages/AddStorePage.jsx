import { BsArrowRightShort } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import useStore from "../hooks/useStore";
import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import SearchDropdown from "../Utilities/SearchDropdown";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

export default function AddStorePage() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
  };
  const [errorMessage, setErrorMessage] = useState('')
  const { storeDetails, setStoreDetails, setStoreOwners } = useStore()
  const navigate = useNavigate()
  const {user} = useAuth()
  const [storeOwnerOption, setStoreOwnerOption] = useState(null)

  const { data: allStoreOwner = [], isLoading: storeOwnerLoading } = useQuery({
    queryKey: ['get_all_store_owner'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/store_owner_api/get_all_store_owner?id=${user.admin_id}`)
        if (res.status === 200) {
          return res.data.data;
        }
        return [];
      } catch (error) {
        console.log(error);
        return [];
      }
    }
  })

  const storeOwnerIDs = []
  storeOwnerOption?.map(storeOwner => storeOwnerIDs.push(storeOwner.value))

  const handleNext = (event) => {
    event.preventDefault()
    const form = event.target;
    const storeName = form.storeName.value;
    const storeManagerName = form.storeManagerName.value;
    const storeType = form.storeType.value;
    const storeStatus = form.storeStatus.value;

    if (storeType && storeType === 'Pick Store Type') {
      return setErrorMessage('Please select store type')
    }
    if (storeStatus && storeStatus === 'Select Status') {
      return setErrorMessage('Please select store status')
    }

    const data = { store_name: storeName, slug: storeName, store_manager_name: storeManagerName, store_type: storeType, store_status: storeStatus }
    setStoreDetails(data)
    setStoreOwners(storeOwnerIDs)

    navigate("/dashboard/add-store/add-supplier")
  }

  return (
    <div className="p-20 rounded-lg">
      <div
        style={boxShadowStyle}
        className="border border-[#8633FF] shadow-lg h-fit w-fit m-auto rounded-xl flex justify-center items-center"
      >
        <div className="lg:py-20 lg:px-28 p-10 max-w-[700px] w-[600px]">
          <form onSubmit={handleNext}>
            <h4 className="text-2xl font-bold">Add New Store</h4>
            <p className="text-slate-400 mt-2">
              Please fill out the details to add a new store
            </p>

            <div className="flex flex-col mt-6 w-full">
              <label className="text-slate-500">Store name*</label>
              <input
                type="text"
                placeholder="Enter store name"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="storeName"
                name="storeName"
                defaultValue={storeDetails?.store_name ? storeDetails?.store_name : ''}
                required
              />
            </div>

            <div className="flex flex-col mt-4 w-full">
              <label className="text-slate-500">Store manager name*</label>
              <input
                type="text"
                placeholder="Enter store manager name"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="storeManagerName"
                name="storeManagerName"
                defaultValue={storeDetails?.store_manager_name ? storeDetails?.store_manager_name : ''}
                required
              />
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-slate-500">Store owner*</label>
              <SearchDropdown isLoading={storeOwnerLoading} isMulti={true} option={storeOwnerOption} optionData={allStoreOwner} placeholder="Select Store" setOption={setStoreOwnerOption} />
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-slate-500">Store type*</label>
              <select
                className="select select-primary w-full mt-2 shadow-lg"
                name="storeType"
                id="storeType"
                defaultValue={storeDetails?.store_type ? storeDetails?.store_type : ''}
                required
              >
                <option defaultValue="Pick Store Type">
                  {storeDetails?.store_type ? storeDetails?.store_type : 'Pick Store Type'}
                </option>
                <option value="Amazon">Amazon</option>
                <option value="Walmart">Walmart</option>
                <option value="Ebay">Ebay</option>
                <option value="Shopify">Shopify</option>
                <option value="Ali Express">Ali Express</option>
              </select>
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-slate-500">Store status*</label>
              <select
                className="select select-primary w-full mt-2 shadow-lg"
                name="storeStatus"
                id="storeStatus"
                required
              >
                <option defaultValue="Select Status">
                  {storeDetails?.store_status ? storeDetails?.store_status : 'Select Status'}
                </option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              {errorMessage && <p className="w-full mt-5 flex gap-1 items-center justify-center text-center text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded"><MdErrorOutline size={20} /> {errorMessage}</p>}
            </div>

            <div className="flex items-center justify-center mt-8 bg-[#8633FF] rounded-lg">
              <button type="submit" className="flex py-[10px] justify-center items-center text-white w-full capitalize">
                Next
                <BsArrowRightShort className="mt-[2px]" size={28} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
