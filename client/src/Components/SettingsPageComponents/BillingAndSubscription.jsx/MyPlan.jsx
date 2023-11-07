import { AiOutlineCheck } from "react-icons/ai";
import { BsArrowLeftCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function MyPlan() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
  };

  const handleAlert = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText:
          '<span style="padding: 6px 20px; margin: 5px; background: #8633FF; color: white; border-radius: 4px;">Yes</span>',
        cancelButtonText:
          '<span style="padding: 6px 20px; margin: 5px; background: #F1F3F4; border-radius: 4px;">No</span>',
        showConfirmButton: true,

        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            "Deleted!",
            "Your file has been deleted.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your imaginary file is safe :)",
            "error"
          );
        } else if (result.dismiss === Swal.DismissReason.ok) {
          // Handle the OK button action
        }
      });
  };

  return (
    <div
      style={boxShadowStyle}
      className="flex flex-col justify-center h-full my-20  rounded-lg  max-w-[34%] mx-auto px-12  bg-white shadow-lg"
    >
      <div className="pt-12">
        <div className="flex items-center gap-3 border-b-2 pb-4">
          <Link to="/dashboard/settings/billing-subscription">
            <BsArrowLeftCircle size={24} />
          </Link>
          <h3 className="text-2xl font-medium text-slate-700">
            Billing - My Plan
          </h3>
        </div>
        <h4 className="text-center py-6 text-xl font-medium">Current Plan</h4>
      </div>
      <div
        style={{
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
        }}
        className=" p-8 mb-8 rounded-lg"
      >
        <div className="flex gap-4">
          <div className="bg-violet-100 relative w-14 h-14 flex justify-center items-center rounded-lg">
            <div className="h-10 w-5 rounded-l-full bg-[#8633FF]"></div>
            <div className="h-10 w-5 rounded-r-full bg-violet-300 "></div>
          </div>
          <div>
            <p className="text-sm">For individuals</p>
            <p className="text-xl font-medium">Basic</p>
          </div>
        </div>
        <p className="mt-2 text-sm">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur,
          iste.
        </p>
        <div className="flex mt-2">
          <h1 className="text-3xl font-bold">$1,499</h1>
          <p className="mt-auto">/Year</p>
        </div>
        <p className="line-through">$1,788</p>
        <p className="my-2 font-bold">What is included</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="bg-[#8633FF] h-5 w-5 flex justify-center items-center rounded-full text-white text-xs">
              <AiOutlineCheck />
            </div>
            <p>All analytics feature</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#8633FF] h-5 w-5 flex justify-center items-center rounded-full text-white text-xs">
              <AiOutlineCheck />
            </div>
            <p>All analytics feature</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#8633FF] h-5 w-5 flex justify-center items-center rounded-full text-white text-xs">
              <AiOutlineCheck />
            </div>
            <p>All analytics feature</p>
          </div>
        </div>
        <button className="bg-[#8633FF] font-medium text-white w-full mt-8 py-2 rounded">
          Get started
        </button>
        <button
          onClick={handleAlert}
          className="border-2 border-[#8633FF] text-[#8633FF] font-medium w-full mt-2 py-2 rounded"
        >
          Cancel Subscription
        </button>
      </div>
    </div>
  );
}
