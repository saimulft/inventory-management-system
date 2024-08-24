import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaAmazon, FaEbay, FaShopify } from "react-icons/fa";
import { TbBrandWalmart } from "react-icons/tb";
import { AiOutlineAlibaba } from "react-icons/ai";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useGlobal from "../hooks/useGlobal";
import { useQuery } from "@tanstack/react-query";
import Loading2 from "../Components/Shared/Loading2";

export default function AllStoresPage() {
  const [tab, setTab] = useState('Active')
  const [loading, setLoading] = useState(false)
  const [storeType, setStoreType] = useState('')
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchError, setSearchError] = useState('')
  const { user } = useAuth()
  const { storeRefetch, setStoreRefetch, isSidebarOpen } = useGlobal()

  const { data: allStoreData = [], refetch, isLoading } = useQuery({
    queryKey: ['all_stores'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/store_api/get_all_stores?id=${user.admin_id}&storeType=${storeType}&storeStatus=${tab}`)
        if (res.status === 200) {
          setLoading(false)
          return res.data.data;
        }
        if (res.status === 204) {
          setLoading(false)
          return []
        }
      } catch (error) {
        console.log(error)
        return []
      }
    }
  })

  // refetch all stores when streRefetch value is true
  useEffect(() => {
    if (storeRefetch) {
      setLoading(true)
      refetch()
      setStoreRefetch(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeRefetch, storeType, tab]);

  const shadowStyle = {
    boxShadow: "0px 0px 15px -8px rgba(0,0,0,0.75)",
  };

  const handleSearch = (event) => {
    event.preventDefault()
    setSearchError('')

    if (!searchText) {
      return;
    }

    setLoading(true)

    const filteredData = allStoreData.filter(item => (item.store_name?.toLowerCase().includes(searchText.toLowerCase()) || item.store_manager_name?.toLowerCase().includes(searchText.toLowerCase())));
    if (!filteredData.length) {
      setLoading(false)
      setSearchError(`Store not found for "${searchText}"`)
      return
    }
    setTimeout(() => {
      setLoading(false)
      setSearchResults(filteredData)
    }, 200);
  }

  const marginLeft = isSidebarOpen ? "18.5%" : "6%";

  const handleAmazonAuthModal = () => {

    document.getElementById("amazon_auth_modal").showModal()

    // <a rel="noreferrer" href="" target="_blank" >Connect</a>
  }
  const handleConnectAmazon = async (event) => {
    event.preventDefault()
    const form = event.target
    const marketplaceId = form.marketplaceId.value
    const storeId = form.storeId.value
    if (!marketplaceId || !storeId) {
      return
    }
    window.location.href = `https://sellercentral.amazon.com.mx/apps/authorize/consent?application_id=amzn1.sp.solution.9e7e8d8a-e2a8-45ae-aa19-21a7e5cb7ce3&state=${storeId}-${marketplaceId}&version=beta`

  }
  return (
    <>
      <div className="p-10">
        <div className="p-14 rounded-lg min-h-[calc(100vh-154px)] max-h-full" style={{ boxShadow: "2px 2px 22px 2px rgba(0,0,0,0.2)" }}>
          {/* <h1 className="text-center text-3xl font-medium mb-8">All Stores</h1> */}
          <div className="flex items-center justify-between">
            <div className="flex gap-4 w-1/2">
              <div className="flex text-center">
                <div
                  onClick={() => {
                    setTab('Active')
                    setStoreRefetch(true)
                  }}
                  className={`px-3 rounded-s-md py-2 cursor-pointer ${tab === 'Active' ? "bg-[#8633FF] text-white"
                    : "border-2 border-[#8633FF] text-[#8633FF]"}`}
                >
                  Active
                </div>
                <div
                  onClick={() => {
                    setTab('Inactive')
                    setStoreRefetch(true)
                  }}
                  className={`px-3 rounded-e-md py-2 cursor-pointer ${tab === 'Inactive' ? "bg-[#8633FF] text-white"
                    : "border-2 border-[#8633FF] text-[#8633FF]"}`}
                >
                  Inactive
                </div>
              </div>
              <button onClick={handleAmazonAuthModal} className="px-3 rounded-md py-2 cursor-pointer bg-[#8633FF] text-white">Connect with Amazon</button>
            </div>

            <div className="w-1/2 gap-4 flex items-center">
              <form onSubmit={handleSearch} className="w-full flex gap-4 ">
                <select onChange={(e) => {
                  setStoreType(e.target.value)
                  setStoreRefetch(true)
                }} name="storeType" id="storeType" className="border bg-white shadow-md border-[#8633FF] outline-none cursor-pointer w-1/2 py-2 rounded-md px-2 text-sm">
                  <option defaultValue="All Store">
                    All Store
                  </option>
                  <option value="Amazon">Amazon</option>
                  <option value="Walmart">Walmart</option>
                  <option value="Ebay">Ebay</option>
                  <option value="Shopify">Shopify</option>
                  <option value="Ali Express">Ali Express</option>
                </select>

                <div className="relative w-1/2 border bg-white shadow-md border-[#8633FF] outline-none py-2 rounded-md px-2 text-sm">
                  <input
                    className="w-[calc(100%-82px)]"
                    placeholder="Search Here"
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />

                  <button type="submit" className="absolute bottom-[6px] cursor-pointer p-[2px] rounded right-[6px] bg-[#8633FF]  text-white ">
                    <AiOutlineSearch size={20} />
                  </button>

                  {searchResults.length || searchError ? <button onClick={() => {
                    setSearchResults([])
                    setSearchText('')
                    setSearchError('')
                  }} className="absolute bottom-[6px] cursor-pointer py-[2px] px-2 rounded right-[36px] bg-[#8633FF] text-white text-sm"> Clear </button> : ''}
                </div>
              </form>
            </div>
          </div>

          {/* store info  */}
          <div className="relative grid grid-cols-4 gap-6 mb-8 mt-8">
            {
              loading || isLoading ? <Loading2 contentHeight="342px" /> :
                searchError ? <div className="absolute flex items-center justify-center w-full h-[calc(100vh-342px)] text-xl font-medium text-rose-500">{searchError}</div> :
                  !allStoreData.length ? <div className="absolute flex items-center justify-center w-full h-[calc(100vh-342px)] text-xl font-medium text-rose-500">No store added yet!</div> :
                    searchResults.length ? searchResults.map((singleStore, index) => {
                      return (
                        <Link
                          to={`/dashboard/all-stores/store-edit/${singleStore._id}`}
                          style={shadowStyle}
                          key={index} >
                          <div className="flex relative items-center px-5 py-8 cursor-pointer gap-4 border-2 border-[#8633FF]  rounded-lg">
                          {singleStore.refresh_token && <p className="absolute right-5 top-2 bg-[#8633FF] text-white px-2 py-1 rounded text-sm">Connected</p>}
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
                    }) : allStoreData.map((singleStore, index) => {
                      return (
                        <Link
                          to={`/dashboard/all-stores/store-edit/${singleStore._id}`}
                          style={shadowStyle}
                          key={index}
                        >
                          <div className="flex relative items-center px-5 py-8 cursor-pointer gap-4 border-2 border-[#8633FF]  rounded-lg">
                            {singleStore.refresh_token && <p className="absolute right-5 top-2 bg-[#8633FF] text-white px-2 py-1 rounded text-sm">Connected</p>}
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
                    })
            }
          </div>
        </div>
      </div>

      {/* amazon authentication modal  */}
      <dialog id="amazon_auth_modal" className="modal">
        <div style={{ marginLeft, maxWidth: '500px' }} className="modal-box py-10 px-10">
          <form onSubmit={handleConnectAmazon} className="flex justify-center flex-col">
            <h1 className="text-xl text-slate-500 font-bold mb-5">Connect your amazon store!</h1>
            <label className="font-bold text-slate-500 mt-4">Select Marketplace*</label>
            <select
              className="select select-primary w-full mt-2"
              name="marketplaceId"
              id="marketplaceId"
            >
              <option value="">
                Select Marketplace*
              </option>
              <option value="A2EUQ1WTGCTBG2">Canada</option>
              <option value="ATVPDKIKX0DER">United States of America</option>
              <option value="A1AM78C64UM0Y8">Mexico</option>
              <option value="A2Q3Y263D00KWC">Brazil</option>
              <option value="A1RKKUPIHCS9HS">Spain</option>
              <option value="A1F83G8C2ARO7P">United Kingdom</option>
              <option value="A13V1IB3VIYZZH">France</option>
              <option value="AMEN7PMS3EDWL">Belgium</option>
              <option value="A1805IZSGTT6HS">Netherlands</option>
              <option value="A1PA6795UKMFR9">Germany</option>
              <option value="APJ6JRA9NG5V4">Italy</option>
              <option value="A2NODRKZP88ZB9">Sweden</option>
              <option value="AE08WJ6YKNBMC">South Africa</option>
              <option value="A1C3SOZRARQ6R3">Poland</option>
              <option value="ARBP9OOSHTCHU">Egypt</option>
              <option value="A33AVAJ2PDY3EV">Turkey</option>
              <option value="A17E79C6D8DWNP">Saudi Arabia</option>
              <option value="A2VIGQ35RCS4UG">United Arab Emirates</option>
              <option value="A21TJRUUN4KGV">India</option>
              <option value="A19VAU5U5O7RUS">Singapore</option>
              <option value="A39IBJ37TRP1C6">Australia</option>
              <option value="A1VC38T7YXB528">Japan</option>
            </select>
            <label className="font-bold text-slate-500 mt-4">Select Store*</label>
            <select
              className="select select-primary w-full mt-2"
              name="storeId"
              id="storeId"

            >
              <option value="">
                Select Store
              </option>
              {allStoreData.map((store, index) => {
                // only type amazon 
                if (store.store_type !== 'Amazon') {
                  return;
                }
                if (store.refresh_token) return;
                return (
                  <option key={index} value={store._id}>
                    {store.store_name}
                  </option>
                );
              })}
            </select>
            <button type="submit" disabled={loading} className="bg-[#8633FF] mt-4 flex gap-2 py-2 justify-center items-center text-white rounded-lg w-full">
              Connect
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
