import { FaSpinner } from 'react-icons/fa';

const LoadingPage = () => {
    return (
        <div className='h-screen w-full flex gap-2 items-center justify-center text-3xl font-bold text-[#8633FF]'>
            <FaSpinner size={40} className="animate-spin text-[#8633FF]" />
            <span>Loading</span>
        </div>
    );
};

export default LoadingPage;