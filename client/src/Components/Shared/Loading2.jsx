import { FaSpinner } from "react-icons/fa";

const Loading2 = ({contentHeight}) => {
    return (
        <div className={`absolute flex justify-center items-center h-[calc(100vh-${contentHeight})] w-full`}>
            <FaSpinner size={28} className="animate-spin text-[#8633FF]" />
        </div>
    );
};

export default Loading2;