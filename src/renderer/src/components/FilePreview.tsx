import { useFileContext } from '../contexts/FileContext';

function FilePreview(): JSX.Element {

    const { preview, selectedFile } = useFileContext();

    
    return (
        <>
            {(preview.length > 0) &&
                <div>
                    {preview.map((line, i) => {
                        return <p key={"previewline" + i}>{line}</p>
                    })}
                </div>}
        </>
    )
}

export default FilePreview
