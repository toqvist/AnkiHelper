import { useFileContext } from '@renderer/contexts/FileContext';
import { Sentence } from '@renderer/views/Analyze';
import React, { useEffect, useState } from 'react'
import { WordFreq } from 'src/model/tools';


interface ClickableSentencesProps {
    sentences: Sentence[];
    onClick: Function;
}

export default function ClickableSentences({ sentences, onClick }: ClickableSentencesProps): JSX.Element {

    /*    const { selectedFile } = useFileContext()
       const [lines, setLines] = useState<string[]>([]);
   
       useEffect(() => {
           if (lines.length == 0)
               getLines()
       }, [])
   
       async function getLines() {
           setLines(await window.api.previewFile(selectedFile, Infinity))
       }
    */
    return (
        <>
            {sentences.map((sentence, i) => {
                return <div className="sentence" key={i}>
                    <a href="#" onClick={() => onClick(sentence)}>
                        {" • "}
                        {sentence.words.map((word, i) => {
                            return <span>{word.text} </span>
                        })}
                    </a>
                </div>
            })}
        </>
    );
}