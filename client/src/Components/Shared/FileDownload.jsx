import axios from "axios";

function FileDownload({ fileName }) {

    const handleDownload = () => {

        if (fileName.startsWith('file')) {
            axios.get(`http://localhost:5000/api/v1/global_api/download/${fileName}`, {
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
        else {
            const downloadImageFromUrl = (fileName) => {
                axios.get(fileName, {
                    responseType: 'blob',
                })
                    .then(response => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `product_image.png`;
                        a.click();
                        window.URL.revokeObjectURL(url);
                    })
                    .catch(error => {
                        console.error('Image download error:', error);
                    });
            };
            downloadImageFromUrl(fileName)

        }

    };

    return (
        <div>
            <button className="bg-[#8633FF] text-white px-3 py-1 text-xs" onClick={handleDownload}>Download</button>
        </div>
    );
}

export default FileDownload;
