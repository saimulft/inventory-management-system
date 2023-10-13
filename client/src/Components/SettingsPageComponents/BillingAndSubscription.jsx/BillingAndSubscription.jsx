import { SiMicrostrategy } from "react-icons/si";
import { BsCreditCard2Back } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../../../Providers/GlobalProviders";

export default function BillingAndSubscription() {
  const { isSidebarOpen } = useContext(GlobalContext);
  const marginLeft = isSidebarOpen ? "8%" : "2%";
  return (
    <div className="py-20 space-y-4 flex justify-center items-center flex-col">
      <Link to="/dashboard/settings/billing-subscription/plan">
        <div className="flex items-center px-2 py-6 gap-4 border-2 border-[#8633FF] rounded-md w-64">
          <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
            <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
              <SiMicrostrategy size={24} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-medium">My Plan</p>
            <p className="text-sm">View all information</p>
          </div>
        </div>
      </Link>

      <div
        onClick={() => document.getElementById("my_modal_2").showModal()}
        className="flex items-center px-2 py-6 gap-4 border-2 border-[#8633FF] rounded-md w-64"
      >
        <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
          <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
            <BsCreditCard2Back size={24} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xl font-medium">Change Card</p>
          <p className="text-sm">Change payment method</p>
        </div>
      </div>

      {/* modal  */}
      <dialog style={{ marginLeft }} id="my_modal_2" className="modal">
        <div className="modal-box py-10">
          <div className=" w-full mx-auto flex justify-center items-center">
            <form className="bg-white px-4 rounded-lg  h-fit">
              <h5 className="text-xl font-medium mb-4 ">
                Change Payment Method
              </h5>
              {/* email address  */}
              <div className="mt-2">
                <label className="text-sm text-slate-500">Email Address*</label>
                <input
                  className="border border-[#8633FF] outline-[#8633FF] text-xs  rounded py-3 px-2 w-full mt-1"
                  placeholder="Enter email address"
                  type="text"
                  name="email"
                  id="email"
                />
              </div>

              {/* name on card  */}
              <div className="mt-2">
                <label className="text-slate-500 text-sm">Name on card</label>
                <input
                  className="border border-[#8633FF] outline-[#8633FF] text-xs  rounded py-3 px-2 w-full mt-1"
                  placeholder="Card name"
                  type="text"
                  name="cardName"
                  id="cardName"
                />
              </div>

              {/* cart information  */}
              <div className="mt-2">
                <label className="text-slate-500 text-sm">
                  Card Information
                </label>
                <input
                  type="text"
                  placeholder="Card information"
                  className="border border-[#8633FF] outline-[#8633FF] text-xs  rounded py-3 px-2 w-full mt-1"
                  id="cardInfo"
                  name="cardInfo"
                />
              </div>

              {/* MM/YY and CVC  */}
              <div className="flex mt-2 gap-4">
                <div className="mt-2 w-1/2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="border border-[#8633FF] outline-[#8633FF] text-xs  rounded py-3 px-2 w-full mt-1"
                    id="date"
                    name="date"
                  />
                </div>
                <div className="mt-2 w-1/2">
                  <input
                    type="text"
                    placeholder="CVC"
                    className="border border-[#8633FF] outline-[#8633FF] text-xs  rounded py-3 px-2 w-full mt-1"
                    id="cvc"
                    name="cvc"
                  />
                </div>
              </div>

              {/* billing address and city  */}
              <div className="flex  gap-4">
                <div className="mt-2 w-1/2">
                  <label className="text-slate-500 text-sm">
                    Billing Address
                  </label>
                  <input
                    type="text"
                    placeholder="Billing address"
                    className="border border-[#8633FF] outline-[#8633FF] text-xs  rounded py-3 px-2 w-full mt-1"
                    id="billingAddress"
                    name="billingAddress"
                  />
                </div>

                <div className="mt-2 w-1/2">
                  <label className="text-slate-500 text-sm">City</label>
                  <input
                    type="text"
                    placeholder="City"
                    className="border border-[#8633FF] outline-[#8633FF] text-xs  rounded py-3 px-2 w-full mt-1"
                    id="city"
                    name="city"
                  />
                </div>
              </div>

              {/* state and zip code  */}
              <div className="flex gap-4">
                <div className="mt-2 w-1/2">
                  <label className="text-slate-500 text-sm">State</label>
                  <input
                    type="text"
                    placeholder="Enter your state"
                    className="border border-[#8633FF] outline-[#8633FF] text-xs  rounded py-3 px-2 w-full mt-1"
                    id="state"
                    name="state"
                  />
                </div>
                <div className="mt-2 w-1/2">
                  <label className="text-slate-500 text-sm">ZIP code</label>
                  <input
                    type="text"
                    placeholder="ZIP code"
                    className="border border-[#8633FF] outline-[#8633FF] text-xs  rounded py-3 px-2 w-full mt-1"
                    id="zipCode"
                    name="zipCode"
                  />
                </div>
              </div>

              {/* warehouse  */}
              <div className="mt-2">
                <label className="text-slate-500 text-sm">Country</label>
                <select
                  className="border border-[#8633FF] outline-[#8633FF] text-xs  rounded py-3 px-2 w-full mt-1"
                  name="warehouse"
                  id="warehouse"
                >
                  <option disabled selected>
                    Select Warehouse
                  </option>
                  <option value="test1">Test1</option>
                  <option value="test2">Test2</option>
                </select>
              </div>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
