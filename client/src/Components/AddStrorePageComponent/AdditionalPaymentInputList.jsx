import { useState } from "react";
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import useStore from "../../hooks/useStore";
import countries from "../../Utilities/countries";

export default function AdditionalPaymentInputList() {
  const [isOpen, setIsOpen] = useState([
    { class: "collapse-open", trackNO: 0 },
  ]);

  const aco = (e, track) => {
    // console.log(e.target);
    e.stopPropagation();
    if (e.target.id == "aco") {
      isOpen.map((singleAco) => {
        if (singleAco.trackNO == track) {
          const withOutTargetArray = isOpen.filter((f) => f.trackNO != track);
          if (singleAco.class == "collapse-open") {
            const newTargetObj = { class: "collapse-close", trackNO: track };
            setIsOpen([...withOutTargetArray, newTargetObj]);
          } else {
            const newTargetObj = { class: "collapse-open", trackNO: track };
            setIsOpen([...withOutTargetArray, newTargetObj]);
          }
        }
      });
    }
  };

  const { additionalPaymentInputList, setAdditionalPaymentInputList } = useStore()

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
        card_name: "",
        card_info: "",
        date: "",
        cvc: "",
        billing_address: "",
        city: "",
        state: "",
        zip_code: "",
        country: ""
      },
    ]);
    setIsOpen([...isOpen, { class: "collapse-open", trackNO: isOpen.length }]);
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
      {additionalPaymentInputList.map((i, index) => {
        const decideAcoIsOpenOrClose = isOpen.find((f) => f.trackNO == index);

        return (
          <div key={index} className="relative w-full mt-6 ">
            <div className=" border border-[#8633FF] rounded-lg">
              <div
                id="aco"
                onClick={(e) => aco(e, index)}
                className={`collapse ${decideAcoIsOpenOrClose?.class} collapse-arrow bg-white `}
              >
                <input
                  type="checkbox"
                  id="aco"
                  onClick={(e) => aco(e, index)}
                />
                <div className="collapse-title text-xl font-medium flex items-center gap-2 ">
                  Additional payment Details
                  <span className="text-sm text-slate-400">(Optional)</span>
                </div>

                <div className="collapse-content">
                  <form>
                    {/* email address  */}
                    <div className="mt-2">
                      <label className="text-sm text-slate-500">
                        Email Address*
                      </label>
                      <input
                        className="border outline-[#8633FF] text-xs border-[#8633FF] rounded py-3 px-2 w-full mt-1"
                        placeholder="Enter email address"
                        type="text"
                        name="email"
                        onChange={(e) =>
                          handleAdditionalPaymentInputChange(e, index)
                        }
                        defaultValue={i?.email}
                      />
                    </div>

                    {/* name on card  */}
                    <div className="mt-2">
                      <label className="text-sm text-slate-500">
                        Name on card
                      </label>
                      <input
                        className="border outline-[#8633FF] text-xs border-[#8633FF] rounded py-3 px-2 w-full mt-1"
                        placeholder="Card Name"
                        type="text"
                        name="card_name"
                        id="card_name"
                        onChange={(e) =>
                          handleAdditionalPaymentInputChange(e, index)
                        }
                        defaultValue={i?.card_name}
                      />
                    </div>

                    {/* cart information  */}
                    <div className="mt-2">
                      <label className="text-sm text-slate-500">
                        Card Information
                      </label>
                      <input
                        className="border outline-[#8633FF] text-xs border-[#8633FF] rounded py-3 px-2 w-full mt-1"
                        placeholder="0000 0000 0000 0000"
                        type="text"
                        name="card_info"
                        id="card_info"
                        onChange={(e) =>
                          handleAdditionalPaymentInputChange(e, index)
                        }
                        defaultValue={i?.card_info}
                      />
                    </div>

                    {/* MM/YY and CVC  */}
                    <div className="flex gap-2 mt-1">
                      <div className="mt-2 w-1/2">
                        <input
                          className="border outline-[#8633FF] text-xs border-[#8633FF] rounded py-3 px-2 w-full mt-1"
                          placeholder="MM/YY"
                          type="text"
                          name="date"
                          id="date"
                          onChange={(e) =>
                            handleAdditionalPaymentInputChange(e, index)
                          }
                          defaultValue={i?.date}
                        />
                      </div>
                      <div className="mt-2 w-1/2">
                        <input
                          className="border outline-[#8633FF] text-xs border-[#8633FF] rounded py-3 px-2 w-full mt-1"
                          placeholder="CVC"
                          type="text"
                          name="cvc"
                          id="cvc"
                          onChange={(e) =>
                            handleAdditionalPaymentInputChange(e, index)
                          }
                          defaultValue={i?.cvc}
                        />
                      </div>
                    </div>

                    {/* billing address and city  */}
                    <div className="flex gap-2">
                      <div className="mt-2 w-1/2">
                        <label className="text-sm text-slate-500">
                          Billing address
                        </label>
                        <input
                          className="border outline-[#8633FF] text-xs border-[#8633FF] rounded py-3 px-2 w-full mt-1"
                          placeholder="Billing address"
                          type="text"
                          name="billing_address"
                          id="billing_address"
                          onChange={(e) =>
                            handleAdditionalPaymentInputChange(e, index)
                          }
                          defaultValue={i?.billing_address}
                        />
                      </div>
                      <div className="mt-2 w-1/2">
                        <label className="text-sm text-slate-500">City</label>
                        <input
                          className="border outline-[#8633FF] text-xs border-[#8633FF] rounded py-3 px-2 w-full mt-1"
                          placeholder="Enter your city"
                          type="text"
                          name="city"
                          id="city"
                          onChange={(e) =>
                            handleAdditionalPaymentInputChange(e, index)
                          }
                          defaultValue={i?.city}
                        />
                      </div>
                    </div>

                    {/* state and zip code  */}
                    <div className="flex gap-2">
                      <div className="mt-2 w-1/2">
                        <label className="text-sm text-slate-500">State</label>
                        <input
                          className="border outline-[#8633FF] text-xs border-[#8633FF] rounded py-3 px-2 w-full mt-1"
                          placeholder="Enter your state"
                          type="text"
                          name="state"
                          id="state"
                          onChange={(e) =>
                            handleAdditionalPaymentInputChange(e, index)
                          }
                          defaultValue={i?.state}
                        />
                      </div>
                      <div className="mt-2 w-1/2">
                        <label className="text-sm text-slate-500">
                          ZIP Code
                        </label>
                        <input
                          className="border outline-[#8633FF] text-xs border-[#8633FF] rounded py-3 px-2 w-full mt-1"
                          placeholder="Enter your zip code"
                          type="text"
                          name="zip_code"
                          id="zip_code"
                          onChange={(e) =>
                            handleAdditionalPaymentInputChange(e, index)
                          }
                          defaultValue={i?.zip_code}
                        />
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col w-full">
                      <label className="text-sm text-slate-500">Country</label>
                      <select onChange={(e) => handleAdditionalPaymentInputChange(e, index)} defaultValue={i?.country} name="country" id="country" className="select select-primary w-full mt-2">
                        <option defaultValue="Select your country">
                          Select your country
                        </option>
                        {countries}
                      </select>
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
