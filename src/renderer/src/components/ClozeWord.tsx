import { Sentence, Word } from "@renderer/views/Analyze"
import { KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { WordObject } from "./ClozeModal";
import { useStateWithCallbackLazy } from 'use-state-with-callback';

interface ClozeWordProps {
    word: WordObject;
    updateWord: Function;
    translations: string[]
}
function ClozeWord({ word, updateWord, translations }: ClozeWordProps): JSX.Element {

    const [clozed, setClozed] = useState<boolean>(word.clozed)

    const [inputValue, setInputValue] = useState(translations[0]);
    const [showInput, setShowInput] = useStateWithCallbackLazy<boolean>(true)
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    function handleEnter(event: KeyboardEvent<HTMLInputElement>): void {
        if (event.key === 'Enter') {
            updateWord({ ...word, clozed: clozed, hint: inputValue })
            setShowInput(false, () => {})
        }
    }

    function toggleClozed() {
        if (clozed == true) {
            setShowInput(false, () => {});
        } else {
            setShowInput(true, () => {inputRef.current?.focus()})
        }
        updateWord({ ...word, clozed: !clozed, hint: inputValue })
        setClozed(!clozed);
    }

    return (
        <span className="cloze-word">
            <a
                href="#"
                /* key={i} */
                className={clozed ? 'text-clozed' : 'text-black'}
                onClick={() => toggleClozed()}
            >
                {word.text}
            </a>

            {(word.text !== ' ') &&
                <input
                    ref={inputRef}
                    className='cloze-hint'
                    style={{
                        display: clozed && showInput ? 'block' : 'none'
                    }}
                    type="text"
                    placeholder="hint"
                    onChange={(e) => handleInputChange(e)}
                    onKeyDown={(e) => handleEnter(e)}
                    defaultValue={inputValue}
                />
            }
        </span>

    );
}

export default ClozeWord
