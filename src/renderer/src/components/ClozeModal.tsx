import { Sentence, Word } from "@renderer/views/Analyze"
import { useState } from 'react'

export interface ClozeModalProps {
  sentence: Sentence
}


function ClozeModal({ sentence }: ClozeModalProps): JSX.Element {

  const [words, setWords] = useState<Word[]>(sentence.words);
  console.log(words)

  function toggleClozed(wordToToggle: Word) {
    setWords(prevWords => prevWords.map(word => {
      if (word === wordToToggle) {
        return { ...word, clozed: !word.clozed };
      } else {
        return word;
      }
    }));
  }

  return (
    <div className="modal-content">
      <div className="modal-card">
        <p>
          {words.map((word, i) => {
            if (word.clozed) {
              return <a className="text-clozed" href="#" onClick={() => toggleClozed(word)}>{word.text + ' '}</a>
            } else {
              return <a className="text-black" href="#" onClick={() => toggleClozed(word)}>{word.text + ' '}</a>
            }
          })}
        </p>
        <button>Add</button>
        <i></i>
      </div>
    </div>
  )
}

export default ClozeModal