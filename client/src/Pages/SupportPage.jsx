export default function SupportPage() {
  const boxShadowStyle = {
    boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.3)",
  };
  return (
    <div className="flex items-center justify-center h-screen px-4">
      <div
        style={boxShadowStyle}
        className="border border-[#8633FF] shadow-lg max-h-[600px] max-w-[600px] m-auto rounded-xl flex justify-center items-center py-16 md:px-10 px-4"
      >
        <form>
          <h4 className="text-xl font-bold">Create a Support Ticket</h4>
          <p className="text-slate-400 mt-2">
            Please fill out the details to create a support ticket
          </p>
          <div className="flex flex-col mt-4">
            <label className="text-slate-500">Name*</label>
            <input
              className=" border border-[#8633FF] mt-2 outline-2 outline-[#8633FF] rounded-md py-[7px]  px-4 "
              placeholder="Enter your name"
              type="text"
              id="storeName"
              name="storeName"
            />
          </div>
          <div className="flex flex-col mt-2">
            <label className="text-slate-500">Email*</label>
            <input
              className=" border border-[#8633FF] mt-2 outline-2 outline-[#8633FF] rounded-md py-[7px]  px-4"
              placeholder="Enter your email"
              type="text"
              id="storeName"
              name="storeName"
            />
          </div>

          <div className="flex flex-col mt-2">
            <label className="text-slate-500">Message*</label>
            <textarea
              id="w3review"
              name="w3review"
              rows="4"
              cols="50"
              placeholder="Type your message here..."
              className=" border border-[#8633FF] mt-2 outline-2 outline-[#8633FF] rounded-md py-2 px-2"
            ></textarea>
          </div>
          <button className="flex items-center justify-center bg-[#8633FF] w-full mt-8 py-2 rounded-md text-white">
            <p>Send</p>
          </button>
        </form>
      </div>
    </div>
  );
}
