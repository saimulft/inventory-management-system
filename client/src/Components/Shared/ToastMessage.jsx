import { BsCheck2Circle } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";

const ToastMessage = ({ successMessage, errorMessage }) => {
    return (
        <div>
            {successMessage && <p className="w-full mt-5 flex gap-2 items-center justify-center text-center text-sm font-medium text-green-600 bg-green-100 border py-2 px-4 rounded"><BsCheck2Circle size={28} /> {successMessage}</p>}

            {errorMessage && <p className="w-full mt-5 flex gap-1 items-center justify-center text-center text-sm font-medium text-rose-600 bg-rose-100 border py-2 px-4 rounded"><MdErrorOutline size={20} /> {errorMessage}</p>}
        </div>
    );
};

export default ToastMessage;