import { SlSocialDropbox } from "react-icons/Sl";
import { Link } from "react-router-dom";

export default function BillingAndSubscription() {
  return (
    <div className="py-20 space-y-4 flex justify-center items-center flex-col">
      <Link to="/dashboard/settings/plan">
        <div className="flex items-center px-2 py-6 gap-4 border-2 border-[#8633FF] rounded-md w-64">
          <div className="border border-[#8633FF] w-14 h-14 rounded-full flex justify-center items-center shadow-lg">
            <div className="bg-[#8633FF] w-12 h-12 rounded-full text-white flex justify-center items-center">
              <SlSocialDropbox size={24} />
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
            <SlSocialDropbox size={24} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xl font-medium">Change Card</p>
          <p className="text-sm">Change payment method</p>
        </div>
      </div>

      {/* modal  */}
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <div className=" w-full mx-auto md:flex justify-center items-center">
            <form
              // style={boxShadowStyle}
              className="bg-white px-4 rounded-lg  md:h-fit"
            >
              <h5 className="text-xl font-medium mb-4 ">
                Change Payment Method
              </h5>
              {/* email address  */}
              <div className="mt-2">
                <label className="text-slate-500 text-sm">Email Address</label>
                <input
                  type="text"
                  placeholder="Enter email address"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg py-0"
                  id="email"
                  name="email"
                />
              </div>

              {/* name on card  */}
              <div className="mt-2">
                <label className="text-slate-500 text-sm">Name on card</label>
                <input
                  type="text"
                  placeholder="Name"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="cartName"
                  name="cartName"
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
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="cardInfo"
                  name="cardInfo"
                />
              </div>

              {/* MM/YY and CVC  */}
              <div className="flex gap-4">
                <div className="mt-2 md:w-1/2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="date"
                    name="date"
                  />
                </div>
                <div className="mt-2 md:w-1/2">
                  <input
                    type="text"
                    placeholder="CVC"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="cvc"
                    name="cvc"
                  />
                </div>
              </div>

              {/* billing address and city  */}
              <div className="flex  gap-4">
                <div className="mt-2 md:w-1/2">
                  <label className="text-slate-500 text-sm">
                    Billing Address
                  </label>
                  <input
                    type="text"
                    placeholder="Billing address"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="billingAddress"
                    name="billingAddress"
                  />
                </div>

                <div className="mt-2 md:w-1/2">
                  <label className="text-slate-500 text-sm">City</label>
                  <input
                    type="text"
                    placeholder="City"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="city"
                    name="city"
                  />
                </div>
              </div>

              {/* state and zip code  */}
              <div className="md:flex gap-4">
                <div className="mt-2 md:w-1/2">
                  <label className="text-slate-500 text-sm">State</label>
                  <input
                    type="text"
                    placeholder="Enter your state"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="state"
                    name="state"
                  />
                </div>
                <div className="mt-2 md:w-1/2">
                  <label className="text-slate-500 text-sm">ZIP code</label>
                  <input
                    type="text"
                    placeholder="ZIP code"
                    className="input input-bordered input-primary w-full mt-2 shadow-lg"
                    id="zipCode"
                    name="zipCode"
                  />
                </div>
              </div>

              {/* warehouse  */}
              <div className="mt-2">
                <label className="text-slate-500 text-sm">Country</label>
                <select
                  className="select select-primary w-full mt-2 shadow-lg"
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
