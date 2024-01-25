import { Link } from "react-router-dom";

const ViewImage = ({fileName}) => {
    return (
        <div className="w-fit">
            {fileName.startsWith('file') ?
                <Link target="_blank" to={`${import.meta.env.VITE_BASE_URL}/uploads/${fileName}`} >
                    <img src={`${import.meta.env.VITE_BASE_URL}/uploads/${fileName}`} className="h-10 w-10 object-cover" alt="product image" />
                </Link> :
                <Link target="_blank" to={fileName} >
                    <img src={fileName} className="h-10 w-10 object-cover" alt="product image" />
                </Link>}
        </div>
    );
};

export default ViewImage;