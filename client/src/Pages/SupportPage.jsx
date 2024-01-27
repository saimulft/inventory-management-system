export default function SupportPage() {
  const handleTicketSubmit = (e)=>{
    e.preventDefault()
    const form = e.target
    const name = form.name.value
    const email = form.email.value
    const message = form.message.value
    const date  =new Date()
    const ticketData = {name,email,message,date}
    console.log(ticketData);
  }
  const boxShadowStyle = {
    boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.3)",
  };
  return (
    <div className="flex items-center justify-center p-20">
      <div style={boxShadowStyle} className="border border-[#8633FF] shadow-lg h-fit max-w-[700px] w-[600px] m-auto rounded-xl lg:py-20 lg:px-28 p-10">
        <form onClick={handleTicketSubmit}>
          <h4 className="text-2xl font-bold">Create a Support Ticket</h4>
          <p className="text-slate-400 mt-2">
            Please fill out the details to create a support ticket
          </p>
          <div className="mt-6">
            <label className="text-slate-500">Name*</label>
            <input type="text" placeholder="Enter name" className="input input-bordered input-primary w-full mt-2 shadow-lg" id="name" name="name" />
          </div>
          <div className="mt-4">
            <label className="text-slate-500">Email*</label>
            <input type="email" placeholder="Enter email" className="input input-bordered input-primary w-full mt-2 shadow-lg" id="email" name="email" />
          </div>

          <div className="flex flex-col mt-4">
            <label className="text-slate-500">Message*</label>
            <textarea name="messsage" id="message" rows={4} className="textarea textarea-primary mt-2 focus:outline-none shadow-lg text-base" placeholder="Type your message"></textarea>
          </div>
          <button type="submit" className="flex items-center justify-center bg-[#8633FF] w-full mt-8 py-3 rounded-md text-white">
            <p>Send</p>
          </button>
        </form>
      </div>
    </div>
  );
}
