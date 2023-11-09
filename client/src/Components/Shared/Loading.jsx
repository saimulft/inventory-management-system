import { FaSpinner } from "react-icons/fa";

const Loading = ({top}) => {
    console.log(top)
    return (
        <div className={`absolute top-[${top ? top : '260px'}] flex justify-center items-center w-full`}>
            <FaSpinner size={28} className="animate-spin text-[#8633FF]" />
        </div>
    );
};

export default Loading;