import { BsArrowLeftCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../../hooks/useStore";

export default function SelectPayment() {
  const navigate = useNavigate()
  const { storeDetails, setStoreDetails } = useStore()

  const handleSelectPaymentOption = (option, route) => {
    setStoreDetails({ ...storeDetails, payment_option: option })
    navigate(route)
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border-2 border-[#8633FF] rounded-lg relative p-16">
        <Link to="/dashboard/add-store/add-supplier">
          <button className="py-3 px-4 absolute top-1 left-0">
            <BsArrowLeftCircle size={25} />
          </button>
        </Link>
        <div className="p-8">
          <p className="text-center text-2xl font-medium">
            Select Payment Option
          </p>
          <div className="flex flex-col gap-3 mt-10">
            <button onClick={() => handleSelectPaymentOption("yourself", "/dashboard/add-store/add-supplier/select-payment/checkout")} className="border border-[#8633FF] hover:bg-purple-200 transition-all duration-200 py-3 px-4 rounded w-full">
              Pay by yourself
            </button>

            <button onClick={() => handleSelectPaymentOption("client", "/dashboard/add-store/add-supplier/select-payment/checkout")} className="border border-[#8633FF] hover:bg-purple-200 transition-all duration-200 py-3 px-4 rounded">
              Send payment link to your client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
