import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentStatusPage = () => {
    const navigate = useNavigate();
    const Path = useLocation();
    const [success, setSuccess] = useState(null);
    const [canceled, setCanceled] = useState(null);
    const [portalURL, setPortalUrl] = useState(null);
    const [isLoading, setIsloading] = useState(true);

    useEffect(() => {
        setIsloading(true)
        const searchParams = new URLSearchParams(Path.search);
        const success = searchParams.get('success');
        setSuccess(success)
        const canceled = searchParams.get('canceled');
        setCanceled(canceled)
        const session_id = searchParams.get('session_id');
        if (success && session_id) {
            axios.post('/api/v1/payment_api/create-portal-session', { session_id: session_id })
                .then(function (response) {
                    setPortalUrl(response.data)
                    setIsloading(false)
                })
                .catch(function (error) {
                    console.error(error);  // Handle any error that occurs
                })

        } else {
            setIsloading(false)
        }
    }, [Path])
    const gotoShops = () => {
        navigate('/dashboard/all-stores', { replace: true })
    }
    const gotoPortal = () => {
        window.open(portalURL, '_blank');
    }
    return (
        <div>
            <div className='flex justify-center items-center mt-20 flex-col'>
                {isLoading && <span className="loading loading-spinner loading-lg"></span>}
                {!isLoading && <div className='flex justify-center items-center mt-20 flex-col'>
                    {success && <img className='md:w-40 w-full' src="https://img.icons8.com/color/480/ok--v1.png" alt="ok--v1" />}
                    {canceled && <img className='md:w-40 w-full' src="https://img.icons8.com/color/480/cancel.png" alt="ok--v1" />}
                    {success && <p className='font-bold text-3xl'>Payment Success</p>}
                    {canceled && <p className='font-bold text-3xl'>Payment Canceled</p>}
                    {success && <p className='mt-2'>Your Store Successfully Added</p>}
                    {canceled && <p className='mt-2'>Your Store Not Added</p>}
                    <div className='flex gap-2'>
                        {Path.pathname == '/dashboard/payment-status' && <button onClick={gotoShops} className="bg-[#8633FF] flex gap-2 py-3 justify-center items-center text-white rounded-lg w-fit px-5 mt-5">
                            Go Back to All Shop
                        </button>}
                        {success && <button onClick={gotoPortal} className="bg-[#8633FF] flex gap-2 py-3 justify-center items-center text-white rounded-lg w-fit px-5 mt-5">
                            Go to Payment Portal
                        </button>}
                    </div>
                </div>}
            </div>
        </div>
    );
};

export default PaymentStatusPage;