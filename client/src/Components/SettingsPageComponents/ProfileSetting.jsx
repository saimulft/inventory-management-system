export default function ProfileSetting() {
  return (
    <div className=" py-10 w-full">
      <form>
        <div className="flex gap-7">
          <div className="w-full">
            <div>
              <label className="text-slate-500">Your full name</label>
              <input
                type="text"
                placeholder="Your full name"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="fullName"
                name="fullName"
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">Phone Number</label>
              <input
                type="text"
                placeholder="+1 23456789"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="phoneNumber"
                name="phoneNumber"
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">Address</label>
              <input
                type="text"
                placeholder="Street Address, P.O.Box, apartment, suit, building, floor"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="address"
                name="address"
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">State</label>
              <input
                type="text"
                placeholder="Enter state"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="state"
                name="state"
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">Country</label>
              <select
                className="select select-primary w-full mt-2 shadow-lg"
                name="country"
                id="country"
              >
                <option disabled selected>
                  Country
                </option>
                <option value="test1">Test1</option>
                <option value="test2">Test2</option>
              </select>
            </div>
          </div>

          <div className="w-full">
            <div>
              <label className="text-slate-500">Email Address*</label>
              <input
                type="text"
                placeholder="jhon@gmail.com"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="orderId"
                name="orderID"
              />
            </div>
            <div className="mt-4">
              <label className="text-slate-500">Create Password*</label>
              <input
                type="text"
                placeholder="Enter your password"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="password"
                name="password"
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">City</label>
              <input
                type="text"
                placeholder="Enter your city"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="city"
                name="city"
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">ZIP Code</label>
              <input
                type="text"
                placeholder="Enter zip code"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="zipCode"
                name="zipCode"
              />
            </div>

            <div className="mt-4">
              <label className="text-slate-500">WhatsApp</label>
              <input
                type="text"
                placeholder="Enter whatsapp number"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="whatsappNumber"
                name="whatsappNumber"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-8">
          <button className="bg-[#8633FF] flex py-3 justify-center items-center text-white capitalize rounded-lg w-72 ">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
