export default function CheckoutForm() {
  return (
    <div className="relative w-full  h-full flex justify-center items-center py-16 ">
      <div className=" border border-[#8633FF] rounded-lg px-16 bg-white">
        <div>
          <h3 className="text-center text-3xl font-medium pt-10 ">Checkout</h3>
          <form className="py-10">
            {/* email address  */}
            <div className="mt-2">
              <label className="text-sm text-slate-500">Email Address*</label>
              <input
                className="border outline-[#8633FF] text-xs border-gray-400 rounded py-3 px-2 w-full mt-1"
                placeholder="Enter email address"
                type="text"
                name="email"
              />
            </div>

            {/* name on card  */}
            <div className="mt-2">
              <label className="text-sm text-slate-500">Name on card</label>
              <input
                className="border outline-[#8633FF] text-xs border-gray-400 rounded py-3 px-2 w-full mt-1"
                placeholder="Name"
                type="text"
                name="cartName"
              />
            </div>

            {/* cart information  */}
            <div className="mt-2">
              <label className="text-sm text-slate-500">Card Information</label>
              <input
                className="border outline-[#8633FF] text-xs border-gray-400 rounded py-3 px-2 w-full mt-1"
                placeholder="0000 0000 0000 0000"
                type="text"
                name="cardInfo"
              />
            </div>

            {/* MM/YY and CVC  */}
            <div className="flex gap-2 mt-1">
              <div className="mt-2 w-1/2">
                <input
                  className="border outline-[#8633FF] text-xs border-gray-400 rounded py-3 px-2 w-full mt-1"
                  placeholder="MM/YY"
                  type="text"
                  name="date"
                />
              </div>
              <div className="mt-2 w-1/2">
                <input
                  className="border outline-[#8633FF] text-xs border-gray-400 rounded py-3 px-2 w-full mt-1"
                  placeholder="CVC"
                  type="text"
                  name="cvc"
                />
              </div>
            </div>

            {/* billing address and city  */}
            <div className="md:flex gap-2">
              <div className="mt-2 md:w-1/2">
                <label className="text-sm text-slate-500">
                  Billing address
                </label>
                <input
                  className="border outline-[#8633FF] text-xs border-gray-400 rounded py-3 px-2 w-full mt-1"
                  placeholder="Billing address"
                  type="text"
                  name="billingAddress"
                />
              </div>
              <div className="mt-2 md:w-1/2">
                <label className="text-sm text-slate-500">City</label>
                <input
                  className="border outline-[#8633FF] text-xs border-gray-400 rounded py-3 px-2 w-full mt-1"
                  placeholder="Enter your city"
                  type="text"
                  name="city"
                />
              </div>
            </div>

            {/* state and zip code  */}
            <div className="md:flex gap-2">
              <div className="mt-2 md:w-1/2">
                <label className="text-sm text-slate-500">State</label>
                <input
                  className="border outline-[#8633FF] text-xs border-gray-400 rounded py-3 px-2 w-full mt-1"
                  placeholder="Enter your state"
                  type="text"
                  name="state"
                />
              </div>
              <div className="mt-2 md:w-1/2">
                <label className="text-sm text-slate-500">ZIP Code</label>
                <input
                  className="border outline-[#8633FF] text-xs border-gray-400 rounded py-3 px-2 w-full mt-1"
                  placeholder="Enter your zip code"
                  type="text"
                  name="zipCode"
                />
              </div>
            </div>
            <div className="mt-2 flex flex-col w-full">
              <label className="text-sm text-slate-500">Country</label>
              <select className="border border-gray-400 px-2 py-2 mt-2 rounded">
                <option selected>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div className="mt-8 flex items-center gap-2">
              <input
                type="checkbox"
                id="demoCheckbox"
                name="checkbox"
                value="1"
              />
              <label className="text-sm">
                Accept our terms & condition and non refundable policy
              </label>
            </div>
            <button className="bg-[#8633FF] w-full py-2 mt-4 text-white rounded">
              Pay $99/monthly
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
