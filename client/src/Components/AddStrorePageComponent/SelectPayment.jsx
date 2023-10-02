import { BsArrowLeftCircle } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function SelectPayment() {
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
            <Link to="/dashboard/add-store/add-supplier/select-payment/checkout">
              <button className="border border-[#8633FF] hover:bg-purple-200 transition-all duration-200 py-3 px-4 rounded w-full">
                Pay by yourself
              </button>
            </Link>
            <Link to="/dashboard/add-store/add-supplier/select-payment/send-payment-link">
              <button className="border border-[#8633FF] hover:bg-purple-200 transition-all duration-200 py-3 px-4 rounded">
                Send payment link to your client
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
