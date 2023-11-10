import { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { Link } from "react-router-dom";
export default function Checkout() {
  const [isToggleActive, setIsToggleActive] = useState(true);
  const yearlyPlanData = [
    {
      category: "For individuals",
      plan: "Basic",
      plan_description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam fugit voluptatem iure, nesciunt quibusdam mollitia neque provident quo dolore cumque. ",
      offer_price: "1,499",
      regular_price: "1,788",
      features: [
        "All analytics features",
        "Up to 300 orders",
        "Normal support",
      ],
    },
    {
      category: "For startups",
      plan: "Pro",
      plan_description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam fugit voluptatem iure, nesciunt quibusdam mollitia neque provident quo dolore cumque. ",
      offer_price: "2,990",
      regular_price: "3,588",
      features: [
        "All analytics features",
        "Up to 1000 orders",
        "Premium support",
      ],
    },
    {
      category: "For big companies",
      plan: "Enterprise",
      plan_description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam fugit voluptatem iure, nesciunt quibusdam mollitia neque provident quo dolore cumque. ",
      offer_price: "Custom",
      regular_price: "Custom",
      features: [
        "All analytics features",
        "Unlimited order",
        "Dedicated support",
      ],
    },
  ];
  const monthlyPlanData = [
    {
      category: "For individuals",
      plan: "Basic",
      plan_description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam fugit voluptatem iure, nesciunt quibusdam mollitia neque provident quo dolore cumque. ",
      offer_price: "99",
      regular_price: "149",
      features: [
        "All analytics features",
        "Up to 300 orders",
        "Normal support",
      ],
    },
    {
      category: "For startups",
      plan: "Pro",
      plan_description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam fugit voluptatem iure, nesciunt quibusdam mollitia neque provident quo dolore cumque. ",
      offer_price: "199",
      regular_price: "299",
      features: [
        "All analytics features",
        "Up to 1000 orders",
        "Premium support",
      ],
    },
    {
      category: "For big companies",
      plan: "Enterprise",
      plan_description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam fugit voluptatem iure, nesciunt quibusdam mollitia neque provident quo dolore cumque. ",
      offer_price: "Custom",
      regular_price: "Custom",
      features: [
        "All analytics features",
        "Unlimited order",
        "Dedicated support",
      ],
    },
  ];
  return (
    <div className="flex justify-center items-center h-screen my-10   ">
      {isToggleActive && (
        <div
          style={{
            boxShadow: "0px 0px 40px 6px rgba(0, 0, 0, 0.2)",
          }}
          className="border-2 border-[#8633FF] w-[80%] py-6  rounded-lg mt-0"
        >
          <h3 className="text-center text-3xl font-medium my-6">Checkout</h3>
          <div className="flex gap-2 justify-center relative">
            <div className=" flex gap-2 relative">
              <p>Monthly</p>
              <div
                onClick={() => setIsToggleActive(!isToggleActive)}
                className="form-control"
              >
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={isToggleActive}
                />
              </div>
              <p>Annually</p>
              <p className="text-[#8633FF] text-sm absolute -right-48 top-[3px]">
                (2 Month Free for Yearly Only)
              </p>
            </div>
          </div>

          <div className=" flex gap-8 p-8  mt-12">
            <div className="grid grid-cols-3 gap-6">
              {yearlyPlanData.map((plan, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                    }}
                    className={`p-8 rounded-lg ${
                      plan.plan == "Pro" &&
                      "relative -top-9 bg-[#8633FF] text-white"
                    } `}
                  >
                    {plan.plan == "Basic" && (
                      <div className="flex gap-4">
                        <div className="bg-violet-100 relative w-14 h-14 flex justify-center items-center rounded-lg">
                          <div className="h-10 w-5 rounded-l-full bg-[#8633FF]"></div>
                          <div className="h-10 w-5 rounded-r-full bg-violet-300 "></div>
                        </div>
                        <div>
                          <p className="text-sm">{plan.category}</p>
                          <p className="text-xl font-medium">{plan.plan}</p>
                        </div>
                      </div>
                    )}

                    {plan.plan == "Pro" && (
                      <div className="flex gap-4">
                        <div className="bg-purple-100 relative w-14 h-14 rounded-lg flex justify-center items-center">
                          <div className="h-10 w-5  bg-purple-600"></div>
                          <div className="h-10 w-5 ">
                            <div className="bg-violet-300 h-5"></div>
                            <div className="bg-violet-200 h-5"></div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm">{plan.category}</p>
                          <p className="text-xl font-medium">{plan.plan}</p>
                        </div>
                      </div>
                    )}

                    {plan.plan == "Enterprise" && (
                      <div className="flex gap-4">
                        <div className="bg-violet-100 relative w-14 h-14 rounded-lg flex justify-center items-center">
                          <div className="h-10 w-5 ">
                            <div className="bg-purple-600 h-5"></div>
                            <div className="bg-purple-400 h-5"></div>
                          </div>
                          <div className="h-10 w-5 ">
                            <div className="bg-purple-500 h-5"></div>
                            <div className="bg-purple-300 h-5"></div>
                          </div>
                        </div>
                        <div>
                          <div>
                            <p className="text-sm">{plan.category}</p>
                            <p className="text-xl font-medium">{plan.plan}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="mt-2 text-sm">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Pariatur, iste.
                    </p>
                    <div className="flex mt-2">
                      <h1 className="text-3xl font-bold flex items-center">
                        <span
                          className={`${
                            plan.offer_price == "Custom" ? "hidden" : "block"
                          }`}
                        >
                          $
                        </span>
                        {plan.offer_price}
                      </h1>
                      <p
                        className={`mt-auto ${
                          plan.offer_price == "Custom" ? "hidden" : "block"
                        } `}
                      >
                        /Year
                      </p>
                    </div>
                    {!plan.regular_price && (
                      <p className="line-through">${plan.regular_price}</p>
                    )}
                    <p className="my-2 font-bold">What is included</p>
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => {
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className={`${
                                plan.plan == "Pro"
                                  ? "bg-white text-[#8633FF]"
                                  : "bg-[#8633FF] text-white"
                              }  h-5 w-5 flex justify-center items-center rounded-full  text-xs`}
                            >
                              <AiOutlineCheck />
                            </div>
                            <p>{feature}</p>
                          </div>
                        );
                      })}
                    </div>
                    <Link to="/dashboard/add-store/add-supplier/select-payment/checkout/checkout-form">
                      <button
                        className={` ${
                          plan.plan === "Pro"
                            ? "bg-white text-[#8633FF]"
                            : "bg-[#8633FF] text-white"
                        }  w-full mt-8 py-2 rounded font-medium`}
                      >
                        Get started
                      </button>
                      <p className="absolute bg-yellow-500 text-xs text-black py-[6px] px-4 rounded top-2 right-2 ">
                        Popular
                      </p>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!isToggleActive && (
        <div
          style={{
            boxShadow: "0px 0px 40px 6px rgba(0, 0, 0, 0.2)",
          }}
          className="border-2 border-[#8633FF] w-[80%] py-6  rounded-lg mt-0"
        >
          <h3 className="text-center text-3xl font-medium my-6">Checkout</h3>
          <div className="flex gap-2 justify-center relative">
            <div className=" flex gap-2 relative">
              <p>Monthly</p>
              <div
                onClick={() => setIsToggleActive(!isToggleActive)}
                className="form-control"
              >
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={isToggleActive}
                />
              </div>
              <p>Annually</p>
              <p className="text-[#8633FF] text-sm absolute -right-48 top-[3px]">
                (2 Month Free for Yearly Only)
              </p>
            </div>
          </div>

          <div className=" flex gap-8 p-8  mt-12">
            <div className="grid grid-cols-3 gap-6">
              {monthlyPlanData.map((plan, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                    }}
                    className={`p-8 rounded-lg ${
                      plan.plan == "Pro" &&
                      "relative -top-9 bg-[#8633FF] text-white"
                    } `}
                  >
                    {plan.plan == "Basic" && (
                      <div className="flex gap-4">
                        <div className="bg-violet-100 relative w-14 h-14 flex justify-center items-center rounded-lg">
                          <div className="h-10 w-5 rounded-l-full bg-[#8633FF]"></div>
                          <div className="h-10 w-5 rounded-r-full bg-violet-300 "></div>
                        </div>
                        <div>
                          <p className="text-sm">{plan.category}</p>
                          <p className="text-xl font-medium">{plan.plan}</p>
                        </div>
                      </div>
                    )}

                    {plan.plan == "Pro" && (
                      <div className="flex gap-4">
                        <div className="bg-purple-100 relative w-14 h-14 rounded-lg flex justify-center items-center">
                          <div className="h-10 w-5  bg-purple-600"></div>
                          <div className="h-10 w-5 ">
                            <div className="bg-violet-300 h-5"></div>
                            <div className="bg-violet-200 h-5"></div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm">{plan.category}</p>
                          <p className="text-xl font-medium">{plan.plan}</p>
                        </div>
                      </div>
                    )}

                    {plan.plan == "Enterprise" && (
                      <div className="flex gap-4">
                        <div className="bg-violet-100 relative w-14 h-14 rounded-lg flex justify-center items-center">
                          <div className="h-10 w-5 ">
                            <div className="bg-purple-600 h-5"></div>
                            <div className="bg-purple-400 h-5"></div>
                          </div>
                          <div className="h-10 w-5 ">
                            <div className="bg-purple-500 h-5"></div>
                            <div className="bg-purple-300 h-5"></div>
                          </div>
                        </div>
                        <div>
                          <div>
                            <p className="text-sm">{plan.category}</p>
                            <p className="text-xl font-medium">{plan.plan}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="mt-2 text-sm">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Pariatur, iste.
                    </p>
                    <div className="flex mt-2">
                      <h1 className="text-3xl font-bold flex items-center">
                        <span
                          className={`${
                            plan.offer_price == "Custom" ? "hidden" : "block"
                          }`}
                        >
                          $
                        </span>
                        {plan.offer_price}
                      </h1>
                      <p
                        className={`mt-auto ${
                          plan.offer_price == "Custom" ? "hidden" : "block"
                        } `}
                      >
                        /month
                      </p>
                    </div>
                    {!plan.regular_price && (
                      <p className="line-through">${plan.regular_price}</p>
                    )}
                    <p className="my-2 font-bold">What is included</p>
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => {
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className={`${
                                plan.plan == "Pro"
                                  ? "bg-white text-[#8633FF]"
                                  : "bg-[#8633FF] text-white"
                              }  h-5 w-5 flex justify-center items-center rounded-full  text-xs`}
                            >
                              <AiOutlineCheck />
                            </div>
                            <p>{feature}</p>
                          </div>
                        );
                      })}
                    </div>
                    <Link to="/dashboard/add-store/add-supplier/select-payment/checkout/checkout-form">
                      <button
                        className={` ${
                          plan.plan === "Pro"
                            ? "bg-white text-[#8633FF]"
                            : "bg-[#8633FF] text-white"
                        }  w-full mt-8 py-2 rounded font-medium`}
                      >
                        Get started
                      </button>
                      <p className="absolute bg-yellow-500 text-xs text-black py-[6px] px-4 rounded top-2 right-2 ">
                        Popular
                      </p>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
