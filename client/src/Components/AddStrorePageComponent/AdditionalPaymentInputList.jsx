import { useState } from "react";
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from "react-icons/ai";
import countries from "../../Utilities/countries";

import {
  cardNumber,
  expirationDate,
  cvv
} from "card-validator-es6";
import useStore from "../../hooks/useStore";

export default function AdditionalPaymentInputList({ from_index, isValidCardNumber, setIsValidCardNumber, isValidCardExp, setIsValidCardExp, isValidCardCvv, setIsValidCardCvv }) {
  const { storeDetails } = useStore()

  const [paymentFieldNumber, setPaymentFieldNumber] = useState(storeDetails?.additional_payment_details?.length > 0 ? storeDetails?.additional_payment_details[from_index - 1]?.length : 1)

  const [isOpen, setIsOpen] = useState([
    { class: "collapse-open", trackNO: 0 },
  ]);

  const aco = (e, track) => {
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

  const handleAdditionalPaymentIncrementField = () => {
    setPaymentFieldNumber(paymentFieldNumber + 1)
    setIsOpen([...isOpen, { class: "collapse-open", trackNO: isOpen.length }]);
  };

  const handleAdditionalPaymentRemoveField = (index) => {
    if (document.getElementById(`${from_index}_payment_parent_div`).children.length > 1) {
      document.getElementById(`${from_index}_payment_input_div_${index + 1}`).remove();
    }
  };

  const handleCardValid = (e, index) => {
    const numberValidation = cardNumber(e.target.value);
    if (!numberValidation.isPotentiallyValid) {
      if (isValidCardNumber.filter((element) => element == `${from_index}_payment_input_div_${index + 1}`).length == 0) {
        setIsValidCardNumber(prevState => [...prevState, `${from_index}_payment_input_div_${index + 1}`])
      }
    } else {
      setIsValidCardNumber(oldArray => {
        const removeIndex = isValidCardNumber.findIndex(a => a == `${from_index}_payment_input_div_${index + 1}`)
        return oldArray.filter((value, i) => i !== removeIndex)
      })
    }
  }

  const handleExpValid = (e, index) => {
    const numberValidation = expirationDate(e.target.value);
    if (!numberValidation.isPotentiallyValid) {
      if (isValidCardExp.filter((element) => element == `${from_index}_payment_input_div_${index + 1}`).length == 0) {
        setIsValidCardExp(prevState => [...prevState, `${from_index}_payment_input_div_${index + 1}`])
      }
    } else {
      setIsValidCardExp(oldArray => {
        const removeIndex = isValidCardExp.findIndex(a => a == `${from_index}_payment_input_div_${index + 1}`)
        return oldArray.filter((value, i) => i !== removeIndex)
      })
    }
  }

  const handleCvvValid = (e, index) => {
    const numberValidation = cvv(e.target.value);
    if (!numberValidation.isPotentiallyValid) {
      if (isValidCardCvv.filter((element) => element == `${from_index}_payment_input_div_${index + 1}`).length == 0) {
        setIsValidCardCvv(prevState => [...prevState, `${from_index}_payment_input_div_${index + 1}`])
      }
    } else {
      setIsValidCardCvv(oldArray => {
        const removeIndex = isValidCardCvv.findIndex(a => a == `${from_index}_payment_input_div_${index + 1}`)
        return oldArray.filter((value, i) => i !== removeIndex)
      })
    }
  }

  return (
    <div id={`${from_index}_payment_parent_div`}>
      {Array(paymentFieldNumber).fill().map((i, index) => {
        const decideAcoIsOpenOrClose = isOpen.find((f) => f.trackNO == index);
        return (
          <div id={`${from_index}_payment_input_div_${index + 1}`} key={index} className="relative w-full mt-6 ">
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
                        defaultValue={storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.email ? storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.email : ''}
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
                        defaultValue={storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.name_on_card ? storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.name_on_card : ''}
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
                        defaultValue={storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.card_info?.number ? storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.card_info?.number : ''}
                        onChange={(e) => { handleCardValid(e, index) }}
                      />
                      {(isValidCardNumber.filter((element) => element == `${from_index}_payment_input_div_${index + 1}`).length > 0) && <label className="text-xs text-red-500">
                        Invalid Card Number
                      </label>}
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
                          defaultValue={storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.card_info?.date ? storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.card_info?.date : ''}
                          onChange={(e) => { handleExpValid(e, index) }}
                        />
                        {(isValidCardExp.filter((element) => element == `${from_index}_payment_input_div_${index + 1}`).length > 0) && <label className="text-xs text-red-500">
                          Invalid Expire Date
                        </label>}
                      </div>
                      <div className="mt-2 w-1/2">
                        <input
                          className="border outline-[#8633FF] text-xs border-[#8633FF] rounded py-3 px-2 w-full mt-1"
                          placeholder="CVV"
                          type="text"
                          name="cvc"
                          id="cvc"
                          defaultValue={storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.card_info?.cvc ? storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.card_info?.cvc : ''}
                          onChange={(e) => { handleCvvValid(e, index) }}
                        />
                        {(isValidCardCvv.filter((element) => element == `${from_index}_payment_input_div_${index + 1}`).length > 0) && <label className="text-xs text-red-500">
                          Invalid CVV
                        </label>}
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
                          defaultValue={storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.billing_address ? storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.billing_address : ''}
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
                          defaultValue={storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.city ? storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.city : ''}
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
                          defaultValue={storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.state ? storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.state : ''}
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
                          defaultValue={storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.zip_code ? storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.zip_code : ''}
                        />
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col w-full">
                      <label className="text-sm text-slate-500">Country</label>
                      <select name="country" id="country" className="select select-primary w-full mt-2">
                        <option defaultValue={storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.country ? storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.country : 'Select country'}>
                          {storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.country ? storeDetails?.additional_payment_details?.[from_index - 1]?.[index]?.country : 'Select country'}
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
    </div>
  );
}
