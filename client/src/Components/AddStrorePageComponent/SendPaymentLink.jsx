import { BsArrowLeftCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function SendPaymentLink() {
  const handleSendPaymentLink = (e) => {
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
    <div className="flex justify-center items-center h-[calc(100vh-74px)]">
      <div className="border-2 border-[#8633FF] rounded-lg relative p-16">
        <Link to="/dashboard/add-store/add-supplier/select-payment">
          <button className="py-3 px-4 absolute top-1 left-0">
            <BsArrowLeftCircle size={25} />
          </button>
        </Link>
        <div className="p-8 w-3/4 mx-auto ">
          <h3 className=" text-2xl font-medium ">Send payment link</h3>
          <p className="mt-2 text-slate-400">
            Please fill out this form to send a payment link to your client
          </p>
          <form className="flex flex-col gap-3 mt-10">
            <div className="flex flex-col">
              <label className="text-slate-700" htmlFor="">
                What is your name?
              </label>

              <input
                type="text"
                placeholder="Your name"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="name"
                name="name"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-slate-700" htmlFor="">
                Email
              </label>
              <input
                type="text"
                placeholder="Your email"
                className="input input-bordered input-primary w-full mt-2 shadow-lg"
                id="email"
                name="email"
              />
            </div>
            <button
              onClick={(e) => handleSendPaymentLink(e)}
              className="bg-[#8633FF] py-3 rounded text-white mt-4"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
