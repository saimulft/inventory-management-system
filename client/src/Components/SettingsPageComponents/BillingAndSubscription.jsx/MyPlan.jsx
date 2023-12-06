import { useQuery } from "@tanstack/react-query";
import { AiOutlineCheck } from "react-icons/ai";
import { BsArrowLeftCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function MyPlan() {
  const boxShadowStyle = { boxShadow: "2px 2px 22px 2px rgba(0,0,0,0.2)" };
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)

  const { data: plans = [] } = useQuery({
    queryKey: ['my_plans'],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/payment_api/get_all_stores_subscriptions?adminId=${user.admin_id}`)

        if (res.status === 200) {
          return res.data.data;
        }
        if (res.status === 204) {
          return []
        }
      } catch (error) {
        console.log(error);
        return [];
      }
    }
  })

  const handleManageSubscription = (session_id) => {
    setLoading(true)
    setSessionId(session_id)

    axios.post('/api/v1/payment_api/create-portal-session', { session_id: session_id })
      .then(response => {
        window.open(response.data, '_blank')
        setLoading(false)
        setSessionId(null)
      })
      .catch(error => {
        setLoading(false)
        setSessionId(null)
        console.log(error)
      })
  }

  return (
    <div style={boxShadowStyle} className="flex flex-col justify-center h-full my-16 rounded-lg max-w-[80%] mx-auto py-12 px-20 bg-white shadow-lg">
      <div>
        <div className="flex items-center gap-3 border-b-2 pb-4 mb-8">
          <Link to="/dashboard/settings/billing-subscription">
            <BsArrowLeftCircle size={24} />
          </Link>
          <h3 className="text-2xl font-medium text-slate-700">
            Billing - My Plan & Subscriptions
          </h3>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {
          plans.map((plan, index) => <div key={index}
            style={{ boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)", }} className="p-8 rounded-lg">
            <div className="flex gap-4">
              {
                plan.subscription_plan === 'Basic' ?
                  <div className="bg-violet-100 relative w-14 h-14 flex justify-center items-center rounded-lg">
                    <div className="h-10 w-5 rounded-l-full bg-[#8633FF]"></div>
                    <div className="h-10 w-5 rounded-r-full bg-violet-300 "></div>
                  </div>
                  : plan.subscription_plan === 'Pro' ? <div className="bg-purple-100 relative w-14 h-14 rounded-lg flex justify-center items-center">
                    <div className="h-10 w-5  bg-purple-600"></div>
                    <div className="h-10 w-5 ">
                      <div className="bg-violet-300 h-5"></div>
                      <div className="bg-violet-200 h-5"></div>
                    </div>
                  </div>
                    : <div className="bg-violet-100 relative w-14 h-14 rounded-lg flex justify-center items-center">
                      <div className="h-10 w-5 ">
                        <div className="bg-purple-600 h-5"></div>
                        <div className="bg-purple-400 h-5"></div>
                      </div>
                      <div className="h-10 w-5 ">
                        <div className="bg-purple-500 h-5"></div>
                        <div className="bg-purple-300 h-5"></div>
                      </div>
                    </div>
              }
              <div>
                <p className="text-sm">For {plan.store_name}</p>
                <p className="text-xl font-medium">{plan.subscription_plan}</p>
              </div>
            </div>
            <p className="mt-2 text-sm">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur,
              iste.
            </p>
            <div className="flex mt-2">
              <h1 className="text-3xl font-bold">${plan.subscription_plan === 'Basic' && plan.subscription_type === 'monthly' ? '99' : plan.subscription_plan === 'Basic' && plan.subscription_type === 'yearly' ? '1,499' : plan.subscription_plan === 'Pro' && plan.subscription_type === 'monthly' ? '199' : plan.subscription_plan === 'Pro' && plan.subscription_type === 'yearly' ? '2,990' : ''}</h1>

              <p className="mt-auto">/{plan.subscription_type === 'monthly' ? 'Month' : 'Year'}</p>
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
            <button disabled={loading} onClick={() => handleManageSubscription(plan.session_id)} className="bg-[#8633FF] font-medium flex justify-center items-center gap-2 text-white w-full mt-8 py-2 rounded">
              {loading && sessionId === plan.session_id ? <FaSpinner size={20} className="animate-spin" /> : ''}
              <span>Manage Subscription</span>
            </button>
          </div>)
        }
      </div>
    </div>
  );
}
