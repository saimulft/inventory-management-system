import { FaSpinner } from "react-icons/fa";

const Loading = () => {
    return (
        <div className="absolute top-[200px] flex justify-center items-center w-full">
            <FaSpinner size={28} className="animate-spin text-[#8633FF]" />
        </div>
    );
};

export default Loading;