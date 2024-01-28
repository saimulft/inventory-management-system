import axios from "axios"
import { useState } from "react"
import { FaSpinner } from "react-icons/fa"
import ToastMessage from "../Components/Shared/ToastMessage"

export default function SupportPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const handleTicketSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    const name = form.name.value
    const email = form.email.value
    const message = form.message.value
    const date = new Date();

    const ticketInfo = { name, email, message, date: date.toISOString() }

    setLoading(true)
    axios.post('/api/v1/global_api/send_support_email', ticketInfo)
      .then(res => {
        if (res.status === 200) {
          setMessage("Support ticket email sent, We'll be in Touch Soon!")
          form.reset()
        }
      })
      .catch(err => {
        setErrorMessage('Something went wrong to sending email')
        console.log(err);

      })
      .finally(() => setLoading(false))
  }
  const boxShadowStyle = {
    boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.3)",
  };
  return (
    <div className="flex items-center justify-center p-20">
      <div style={boxShadowStyle} className="border border-[#8633FF] shadow-lg h-fit max-w-[700px] w-[600px] m-auto rounded-xl lg:py-20 lg:px-28 p-10">
        <form onSubmit={handleTicketSubmit}>
          <h4 className="text-2xl font-bold">Create a Support Ticket</h4>
          <p className="text-slate-400 mt-2">
            Please fill out the details to create a support ticket
          </p>
          <div className="mt-6">
            <label className="text-slate-500">Name*</label>
            <input type="text" placeholder="Enter name" className="input input-bordered input-primary w-full mt-2 shadow-lg" id="name" name="name" required />
          </div>
          <div className="mt-4">
            <label className="text-slate-500">Email*</label>
            <input type="email" placeholder="Enter email" className="input input-bordered input-primary w-full mt-2 shadow-lg" id="email" name="email" required />
          </div>

          <div className="flex flex-col mt-4">
            <label className="text-slate-500">Message*</label>
            <textarea name="messsage" id="message" rows={4} required className="textarea textarea-primary mt-2 focus:outline-none shadow-lg text-base" placeholder="Type your message"></textarea>
          </div>
          <ToastMessage successMessage={message} errorMessage={errorMessage} />
          <button disabled={loading} type="submit" className="flex items-center justify-center bg-[#8633FF] w-full mt-8 py-3 rounded-md text-white">
            {loading ? <FaSpinner size={20} className="animate-spin" />
              :
              <span>Send</span>
            }

          </button>
        </form>
      </div>
    </div>
  );
}
