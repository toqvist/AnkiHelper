import { Word } from "@renderer/views/Analyze"
import { randomUUID } from "crypto";
import { KeyboardEvent, useRef, useState } from 'react'
import { useStateWithCallbackLazy } from 'use-state-with-callback';

interface ClozeWordProps {
    word: Word;
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
            setShowInput(false, () => { })
        }
    }

    function toggleClozed() {
        if (clozed == true) {
            setShowInput(false, () => { });
        } else {
            setShowInput(true, () => { inputRef.current?.focus() })
        }
        updateWord({ ...word, clozed: !clozed, hint: inputValue })
        setClozed(!clozed);
    }

    return (
        <span className="cloze-word">
            <a
                href="#"
                key={word.text}
                className={clozed ? 'text-clozed' : 'text-black'}
                onClick={() => toggleClozed()}
            >
                {word.text}
            </a>

            {(word.text !== ' ') &&
                <div
                    className='cloze-hint'
                    style={{
                        display: clozed && showInput ? 'flex' : 'none'
                    }}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="hint"
                        onChange={(e) => handleInputChange(e)}
                        onKeyDown={(e) => handleEnter(e)}
                        defaultValue={inputValue}
                    />
                    {translations.length > 1 &&
                        <select name="" id="">
                            {translations.map((translation) => {
                                return <option value={translation}>{translation}</option>
                            })}
                        </select>
                    }
                </div>
            }
        </span>

    );
}

export default ClozeWord
