import { ChangeEvent, useState } from 'react';
import { useFileContext } from '../contexts/FileContext';

function FileUpload(): JSX.Element {

    const { selectedFile, setSelectedFile, updatePreview } = useFileContext();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if(file != null) {
            setSelectedFile(file.name);
            updatePreview(file.name);
        }
    };
    
    return (
        <div>
            <input type="file" accept=".txt, .srt" onChange={handleFileChange} />
            {selectedFile && <p>{selectedFile}</p>}
        </div>

    )
}

export default FileUpload
