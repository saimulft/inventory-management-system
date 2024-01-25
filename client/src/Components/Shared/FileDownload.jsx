import axios from "axios";
import { Link } from "react-router-dom";

function FileDownload({ fileName }) {

    const handleDownload = () => {

        if (fileName.startsWith('file')) {
            axios.get(`/api/v1/global_api/download/${fileName}`, {
                responseType: 'blob', // Set the response type to 'blob' for downloading files
            })
                .then(response => {
                    // Create a blob URL and trigger the download
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('File download error:', error);
                });
        }

    };

    return (
        <div>
            {fileName.startsWith('file') ? <button className="bg-[#8633FF] w-[80px] text-white px-3 py-1 text-xs" onClick={handleDownload}>Download</button> : <Link target="_blank" to={fileName} ><button className="bg-[#8633FF] w-[80px] text-white px-3 py-1 text-xs">Visit Link</button></Link>}
        </div>
    );
}

export default FileDownload;
