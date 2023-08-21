import { Sentence } from '@renderer/views/Analyze'

interface ClickableSentencesProps {
  sentences: Sentence[]
  onClick: Function
  disabled: boolean
}

export default function ClickableSentences({
  sentences,
  onClick,
  disabled
}: ClickableSentencesProps): JSX.Element {
  return (
    <>
      {sentences.map((sentence, i) => {
        return (
          <div className="sentence" key={i}>
            {disabled ? (
              <a href="#" onClick={() => onClick(sentence)}>
                {' • '}
                {sentence.words.map((word, i) => {
                  return <span key={i}>{word.text} </span>
                })}
              </a>
            ) : (
              <p>
                {' • '}
                {sentence.words.map((word, i) => {
                  return <span key={i}>{word.text} </span>
                })}
              </p>
            )}
          </div>
        )
      })}
    </>
  )
}
