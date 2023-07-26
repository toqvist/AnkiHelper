import { useState } from 'react';
import { useFileContext } from '../contexts/FileContext';
import FilePreview from './FilePreview';

interface Action {
    label: string,
    function: Function
}

function FileActions(): JSX.Element {

    /* const [actions, setActions] = useState<Action[]>([]); */
    const { selectedFile, setSelectedFile } = useFileContext();
    const [result, setResult] = useState<string>("");

    function getFileExtension(filename: string): string {
        const dotIndex = filename.lastIndexOf('.');
        if (dotIndex === -1 || dotIndex === filename.length - 1) {
            return "No file extension found";
        } else {
            return filename.substring(dotIndex + 1);
        }
    }

    const srtActions = [
        { label: "Trim timestamps", function: window.api.trimSRTFile },
        { label: "Save", function: window.api.openSaveDialog}
    ]

    var actions: Action[] = [];
    switch (getFileExtension(selectedFile)) {
        case "srt":
            actions = srtActions;
            break;
        default:
    }

    return (
        <>
            <div>
                {actions.map((action, i) => {
                    return <button onClick={async () => {
                        var result: string = await action.function(selectedFile);
                        setResult(result);
                    }}>
                        {action.label}
                    </button>
                })}
            </div>
            {result != "" &&
                <div>
                    <p>{result}</p>
                    <FilePreview previewLines={result}/>
                </div>
            }
        </>
    )
}

export default FileActions
