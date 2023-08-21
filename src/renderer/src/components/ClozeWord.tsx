import CheckIcon from '@heroicons/react/24/solid/CheckIcon'
import { Word } from '@renderer/views/Analyze'
import { KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'

interface ClozeWordProps {
  word: Word
  updateWord: Function
  translations: string[]
}
function ClozeWord({ word, updateWord, translations }: ClozeWordProps): JSX.Element {
  const [clozed, setClozed] = useState<boolean>(word.clozed)

  const [inputValue, setInputValue] = useState(translations[0])
  const [showInput, setShowInput] = useState<boolean>(true)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleInputChange = (event) => {
    updateWord({ ...word, clozed: clozed, hint: event.target.value })
    setInputValue(event.target.value)
  }

  function handleEnter(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      updateWord({ ...word, clozed: clozed, hint: inputValue })
      setShowInput(false)
    }
  }

  function hideInput() {
    setShowInput(false)
  }

  function toggleClozed() {
    if (clozed == true) {
      setShowInput(false)
    } else {
      setShowInput(true)
    }
    updateWord({ ...word, clozed: !clozed, hint: inputValue })
    setClozed(!clozed)
  }

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus()
    }
  }, [clozed])

  return (
    <span className="cloze-word">
      <a
        href="#"
        key={word.text}
        className={`text-3xl ${clozed ? 'text-clozed' : 'text-slate-950'}`}
        onClick={() => toggleClozed()}
      >
        {word.text}
      </a>

      {word.text !== ' ' && (
        <div className={`cloze-hint ${clozed && showInput ? 'flex' : 'hidden'}`}>
          <div className="flex items-center m-0">
            <input
              className="text-slate-950 border-2 border-slate-200 text-sm z-50 rounded-w-md h-7 py-0"
              ref={inputRef}
              type="text"
              placeholder="hint"
              onChange={(e) => handleInputChange(e)}
              onKeyDown={(e) => handleEnter(e)}
              defaultValue={inputValue}
            />
            <button
              onClick={() => hideInput()}
              className="bg-slate-200 border-slate-200 border-2 text-slate-950 p-1 rounded-e-md text-sm hover:bg-slate-300 hover:border-slate-300 m-0"
            >
              <CheckIcon className="w-6 h-4 stroke-slate-950" />
            </button>
            {/* {translations.length > 1 &&
                        <select name="" id="">
                            {translations.map((translation) => {
                                return <option value={translation}>{translation}</option>
                            })}
                        </select>
                    } */}
          </div>
        </div>
      )}
    </span>
  )
}

export default ClozeWord
