function FilePreview({previewLines}): JSX.Element {
    
    return (
        <>
            {(previewLines.length > 0) &&
                <div>
                    {previewLines.map((line, i) => {
                        return <p key={"previewline" + i}>{line}</p>
                    })}
                </div>}
        </>
    )
}

export default FilePreview
