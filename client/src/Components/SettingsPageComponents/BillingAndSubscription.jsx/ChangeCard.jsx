export default function ChangeCard() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
  };
  return (
    <div className="md:w-[40%] w-full mx-auto md:flex justify-center items-center py-20">
      <form
        style={boxShadowStyle}
        className="bg-white px-4 md:px-20 py-14 rounded-lg  md:h-fit"
      >
        <h5 className="text-xl font-medium mb-6 ">Change Payment Method</h5>
        {/* email address  */}
        <div className="mt-2">
          <label className="text-slate-500">Email Address</label>
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
          <label className="text-slate-500">Name on card</label>
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
          <label className="text-slate-500">Card Information</label>
          <input
            type="text"
            placeholder="Card information"
            className="input input-bordered input-primary w-full mt-2 shadow-lg"
            id="cardInfo"
            name="cardInfo"
          />
        </div>

        {/* MM/YY and CVC  */}
        <div className="flex gap-2">
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
        <div className="flex  gap-2">
          <div className="mt-2 md:w-1/2">
            <label className="text-slate-500">Billing Address</label>
            <input
              type="text"
              placeholder="Billing address"
              className="input input-bordered input-primary w-full mt-2 shadow-lg"
              id="billingAddress"
              name="billingAddress"
            />
          </div>

          <div className="mt-2 md:w-1/2">
            <label className="text-slate-500">City</label>
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
        <div className="md:flex gap-2">
          <div className="mt-2 md:w-1/2">
            <label className="text-slate-500">State</label>
            <input
              type="text"
              placeholder="Enter your state"
              className="input input-bordered input-primary w-full mt-2 shadow-lg"
              id="state"
              name="state"
            />
          </div>
          <div className="mt-2 md:w-1/2">
            <label className="text-slate-500">ZIP code</label>
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
          <label className="text-slate-500">Country</label>
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
  );
}
