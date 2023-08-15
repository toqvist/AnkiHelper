import { useFileContext } from '@renderer/contexts/FileContext';
import { useEffect, useState } from 'react'
import ClickableSentences from './ClickableSentences';
import { Sentence } from '@renderer/views/Analyze';

interface SourceAsLinesProps {
    onClick: Function;
    disabled: boolean;
}

export default function SourceAsLines({ onClick, disabled }: SourceAsLinesProps): JSX.Element {

    const { selectedFile } = useFileContext()
    const [sentences, setSentences] = useState<Sentence[]>([]);

    useEffect(() => {
        if (sentences.length == 0)
            getSentences()
    }, [])

    async function getSentences() {
        setSentences(await window.api.readFileAsSentences(selectedFile, Infinity))
    }

    return (
        <>
            <h2>Source content</h2>
            {sentences.length > 0 &&
                <ClickableSentences sentences={sentences} onClick={onClick} disabled={disabled} />
            }
        </>
    );
}