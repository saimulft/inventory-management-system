import { useState } from "react";
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";

export default function AdditionalPaymentInputList() {
  const [additionalPaymentInputList, setAdditionalPaymentInputList] = useState([
    {
      email: "",
      cardName: "",
      cardInfo: "",
      date: "",
      cvc: "",
      billingAddress: "",
      city: "",
      state: "",
      zipCode: "",
    },
  ]);

  const handleAdditionalPaymentInputChange = (event, index) => {
    const { name, value } = event.target;
    const list = [...additionalPaymentInputList];
    list[index][name] = value;
    setAdditionalPaymentInputList(list);
  };

  const handleAdditionalPaymentIncrementField = () => {
    setAdditionalPaymentInputList([
      ...additionalPaymentInputList,
      {
        email: "",
        cardName: "",
        cardInfo: "",
        date: "",
        cvc: "",
        billingAddress: "",
        city: "",
        state: "",
        zipCode: "",
      },
    ]);
  };

  const handleAdditionalPaymentRemoveField = (index) => {
    const list = [...additionalPaymentInputList];
    if (index > 0 && index < list.length) {
      list.splice(index, 1);
    }
    setAdditionalPaymentInputList(list);
  };

  return (
    <>
      {additionalPaymentInputList.map((a, index) => {
        return (
          <div key={index} className="relative w-full md:mt-6 ">
            <div className=" border border-[#8633FF] rounded-lg">
              <div className="collapse  collapse-arrow bg-white ">
                <input type="checkbox" />
                <div className="collapse-title text-xs md:text-xl font-medium flex items-center gap-2 ">
                  Additional payment Details
                  <span className="text-xs md:text-sm text-slate-400">
                    (Optional)
                  </span>
                </div>
                <div className="collapse-content">
                  <form>
                    {/* email address  */}
                    <div className="mt-2">
                      <label className="text-sm text-slate-500">
                        Email Address*
                      </label>
                      <input
                        className="border outline-[#8633FF] text-xs border-gray-400 rounded py-3 px-2 w-full mt-1"
                        placeholder="Enter email address"
                        type="text"
                        name="email"
                        onChange={(e, i) =>
                          handleAdditionalPaymentInputChange(e, i)
                        }
                      />
                    </div>

                    {/* name on card  */}
                    <div className="mt-2">
                      <label className="text-sm text-slate-500">
                        Name on card
                      </label>
                      <input
                        className="border outline-[#8633FF] text-xs border-gray-400 rounded py-3 px-2 w-full mt-1"
                        placeholder="Name"
                        type="text"
                        name="cartName"
                        onChange={(e, i) =>
                          handleAdditionalPaymentInputChange(e, i)
                        }
                      />
                    </div>

                    {/* cart information  */}
                    <div className="mt-2">
                      <label className="text-sm text-slate-500">
                        Card Information
                      </label>
                      <input
                        className="border outline-[#8633FF] text-xs border-gray-400 rounded py-3 px-2 w-full mt-1"
                        placeholder="0000 0000 0000 0000"
                        type="text"
                        name="cardInfo"
                        onChange={(e, i) =>
                          handleAdditionalPaymentInputChange(e, i)
                        }
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
                          onChange={(e, i) =>
                            handleAdditionalPaymentInputChange(e, i)
                          }
                        />
                      </div>
                      <div className="mt-2 w-1/2">
                        <input
                          className="border outline-[#8633FF] text-xs border-gray-400 rounded py-3 px-2 w-full mt-1"
                          placeholder="CVC"
                          type="text"
                          name="cvc"
                          onChange={(e, i) =>
                            handleAdditionalPaymentInputChange(e, i)
                          }
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
                          onChange={(e, i) =>
                            handleAdditionalPaymentInputChange(e, i)
                          }
                        />
                      </div>
                      <div className="mt-2 md:w-1/2">
                        <label className="text-sm text-slate-500">City</label>
                        <input
                          className="border outline-[#8633FF] text-xs border-gray-400 rounded py-3 px-2 w-full mt-1"
                          placeholder="Enter your city"
                          type="text"
                          name="city"
                          onChange={(e, i) =>
                            handleAdditionalPaymentInputChange(e, i)
                          }
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
                          onChange={(e, i) =>
                            handleAdditionalPaymentInputChange(e, i)
                          }
                        />
                      </div>
                      <div className="mt-2 md:w-1/2">
                        <label className="text-sm text-slate-500">
                          ZIP Code
                        </label>
                        <input
                          className="border outline-[#8633FF] text-xs border-gray-400 rounded py-3 px-2 w-full mt-1"
                          placeholder="Enter your zip code"
                          type="text"
                          name="zipCode"
                          onChange={(e, i) =>
                            handleAdditionalPaymentInputChange(e, i)
                          }
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* plus btn  */}

            <div
              onClick={handleAdditionalPaymentIncrementField}
              style={{
                boxShadow: "-1px 3px 8px 0px rgba(0, 0, 0, 0.2)",
              }}
              className="w-7 h-7 rounded-full shadow-2xl flex justify-center items-center  absolute bg-white right-[50%] translate-x-1/2 -translate-y-1/2"
            >
              <button className="text-[#8633FF] hover:text-[#6519cf] transition-all duration-100">
                <AiOutlinePlusCircle size={24} />
              </button>
            </div>

            {/* delete btn  */}
            <button
              onClick={() => handleAdditionalPaymentRemoveField(index)}
              className="text-slate-400 hover:text-slate-500 transition-all duration-100 hover:cursor-pointer absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-white"
            >
              <AiOutlineCloseCircle size={20} />
            </button>
          </div>
        );
      })}
    </>
  );
}
