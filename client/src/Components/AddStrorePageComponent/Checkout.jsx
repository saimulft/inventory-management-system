import { AiOutlineCheck } from "react-icons/ai";
export default function Checkout() {
  return (
    <div className="flex justify-center items-center h-screen my-10   ">
      <div
        style={{
          boxShadow: "0px 0px 40px 6px rgba(0, 0, 0, 0.2)",
        }}
        className="md:border-2 md:border-[#8633FF] md:w-[80%]  rounded-lg mt-[480px] md:mt-0"
      >
        <h3 className="text-center text-3xl font-medium my-6">Checkout</h3>
        <div className="flex gap-2 justify-center">
          <p>Monthly</p>
          <div className="form-control">
            <input type="checkbox" className="toggle toggle-primary" checked />
          </div>
          <p>Annually</p>
        </div>

        <div className=" md:flex gap-8 space-y-4 md:space-y-0 p-4  md:p-8 mt-12">
          <div>
            <div
              style={{
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
              }}
              className=" p-8 rounded-lg"
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
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Pariatur, iste.
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
              <button className="bg-[#8633FF] text-white w-full mt-8 py-2 rounded">
                Get started
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-[#8633FF] text-white p-8 rounded-lg">
              <div className="flex gap-4">
                <div className="bg-purple-100 relative w-14 h-14 rounded-lg flex justify-center items-center">
                  <div className="h-10 w-5  bg-purple-600"></div>
                  <div className="h-10 w-5 ">
                    <div className="bg-violet-300 h-5"></div>
                    <div className="bg-violet-200 h-5"></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm">For individuals</p>
                  <p className="text-xl font-medium">Basic</p>
                </div>
              </div>
              <p className="mt-2 text-sm">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Pariatur, iste.
              </p>
              <div className="flex mt-2">
                <h1 className="text-3xl font-bold">$1,499</h1>
                <p className="mt-auto">/Year</p>
              </div>
              <p className="line-through">$1,788</p>
              <p className="my-2 font-bold">What is included</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-white h-5 w-5 flex justify-center items-center rounded-full text-[#8633FF] text-xs">
                    <AiOutlineCheck />
                  </div>
                  <p>All analytics feature</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white h-5 w-5 flex justify-center items-center rounded-full text-[#8633FF] text-xs">
                    <AiOutlineCheck />
                  </div>
                  <p>All analytics feature</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white h-5 w-5 flex justify-center items-center rounded-full text-[#8633FF] text-xs">
                    <AiOutlineCheck />
                  </div>
                  <p>All analytics feature</p>
                </div>
              </div>
              <button className="bg-white w-full text-black mt-8 py-2 rounded">
                Get started
              </button>
              <p className="absolute bg-yellow-500 text-black py-1 px-4 rounded top-4 right-4 ">
                Popular
              </p>
            </div>
          </div>
          <div>
            <div
              style={{
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
              }}
              className=" p-8 rounded-lg"
            >
              <div className="flex gap-4">
                <div className="bg-violet-100 relative w-14 h-14 rounded-lg flex justify-center items-center">
                  <div className="h-6 w-8  bg-violet-300 "></div>
                </div>
                <div>
                  <p className="text-sm">For individuals</p>
                  <p className="text-xl font-medium">Basic</p>
                </div>
              </div>
              <p className="mt-2 text-sm">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Pariatur, iste.
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
              <button className="bg-[#8633FF] text-white w-full mt-8 py-2 rounded">
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}