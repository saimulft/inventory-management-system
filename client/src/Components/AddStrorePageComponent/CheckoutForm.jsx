import Swal from "sweetalert2";

export default function CheckoutForm() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
  };

  const handlePayment = (e) => {
    e.preventDefault();
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  return (
    <div className="relative w-full  h-full flex justify-center items-center py-16 ">
      <div
        style={boxShadowStyle}
        className=" border-2 border-[#8633FF] rounded-lg px-16 bg-white"
      >
        <div>
          <h3 className="text-center text-3xl font-medium pt-10 ">Checkout</h3>
          <form className="py-10">
            {/* email address  */}
            <div className="mt-2">
              <label className="text-slate-500">Email Address</label>
              <input
                type="text"
                placeholder="Enter Email"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="email"
                name="email"
              />
            </div>

            {/* name on card  */}

            <div className="mt-2">
              <label className="text-slate-500">Name on card</label>
              <input
                type="text"
                placeholder="Card name"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="cardName"
                name="cardName"
              />
            </div>
            {/* cart information  */}
            <div className="mt-2">
              <label className="text-slate-500">Card Information</label>
              <input
                type="text"
                placeholder="Card info"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="cardInfo"
                name="cardInfo"
              />
            </div>

            {/* MM/YY and CVC  */}
            <div className="flex gap-2 mt-2">
              <div className="w-1/2">
                <label className="text-slate-500">Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="date"
                  name="date"
                />
              </div>
              <div className="w-1/2">
                <label className="text-slate-500">CVC</label>
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
            <div className="flex gap-2 mt-2">
              <div className="w-1/2">
                <label className="text-slate-500">Billing address</label>
                <input
                  type="text"
                  placeholder="Billing address"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="billingAddress"
                  name="billingAddress"
                />
              </div>
              <div className="w-1/2">
                <label className="text-slate-500">City</label>
                <input
                  type="text"
                  placeholder="Enter your city"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="city"
                  name="city"
                />
              </div>
            </div>

            {/* state and zip code  */}
            <div className="flex gap-2 mt-2">
              <div className="w-1/2">
                <label className="text-slate-500">State</label>
                <input
                  type="text"
                  placeholder="Enter your state"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="state"
                  name="state"
                />
              </div>
              <div className="w-1/2">
                <label className="text-slate-500">ZIP Code</label>
                <input
                  type="text"
                  placeholder="Enter your zip code"
                  className="input input-bordered input-primary w-full mt-2 shadow-lg"
                  id="zipCode"
                  name="zipCode"
                />
              </div>
            </div>

            <div className="mt-2 flex flex-col w-full">
              <label className="text-sm text-slate-500">Country</label>
              <select className="select select-primary w-full mt-2">
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
            <button
              onClick={(e) => handlePayment(e)}
              className="bg-[#8633FF] w-full py-2 mt-4 text-white rounded"
            >
              Pay $99/monthly
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
