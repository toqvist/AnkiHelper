import { ChangeEvent, useState } from 'react';
import { useFileContext } from '../contexts/FileContext';

function FileUpload(): JSX.Element {

    const { selectedFile, setSelectedFile } = useFileContext();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if(file != null) {
            setSelectedFile(file.name);
        }
    };

    const handleFileUpload = () => {
        if (!selectedFile) return;
    };

    return (
        <div>
            <input type="file" accept=".txt, .srt" onChange={handleFileChange} />
            {/* <button onClick={handleFileUpload}>Upload</button> */}
            {selectedFile && <p>{selectedFile}</p>}
        </div>

    )
}

export default FileUpload
