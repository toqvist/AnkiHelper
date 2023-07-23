import { ChangeEvent, useState } from 'react';

function FileUpload(): JSX.Element {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        setSelectedFile(file);
    };

    const handleFileUpload = () => {
        if (!selectedFile) return;
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
            {selectedFile && <p>{selectedFile.name}</p>}
        </div>

    )
}

export default FileUpload
