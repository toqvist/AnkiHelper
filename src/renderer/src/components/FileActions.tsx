import { useState } from 'react';
import { useFileContext } from '../contexts/FileContext';

interface Action {
    label: string,
    function: Function
}

function FileActions(): JSX.Element {

    const [actions, setActions] = useState<Action[]>([]);
    const { selectedFile, setSelectedFile } = useFileContext();

    function getFileExtension(filename) {
        const dotIndex = filename.lastIndexOf('.');
        if (dotIndex === -1 || dotIndex === filename.length - 1) {
            return "No file extension found";
        } else {
            return filename.substring(dotIndex + 1);
        }
    }

    //SRT
    //Trim srt

    const srtActions = [
        { label: "Trim timestamps", function: window.api.trimSRT },
    ]


    getFileExtension(selectedFile);

    return (
        <>
            <div>
                {srtActions.map((action, i) => {
                    return <button onClick={() => action.function()}>
                        {action.label}
                    </button>
                })}
            </div>
        </>
    )
}

export default FileActions
