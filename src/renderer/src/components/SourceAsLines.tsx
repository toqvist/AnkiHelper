import { useFileContext } from '@renderer/contexts/FileContext';
import React, { useEffect, useState } from 'react'
import { WordFreq } from 'src/model/tools';


export default function SourceAsLines(): JSX.Element {

    const { selectedFile } = useFileContext()
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        if (lines.length == 0)
            getLines()
    }, [])

    async function getLines() {
        setLines(await window.api.previewFile(selectedFile, Infinity))
    }

    return (
        <>
            {lines.length > 0 &&
                lines.map((line, i) => {
                    return <p key={i}>{line}</p>
                })}
        </>
    );
}