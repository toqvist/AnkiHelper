import { Sentence } from '@renderer/views/Analyze';

interface ClickableSentencesProps {
    sentences: Sentence[];
    onClick: Function;
    disabled: boolean;
}
//TODO: Disable clicking if no deck is selected
export default function ClickableSentences({ sentences, onClick, disabled }: ClickableSentencesProps): JSX.Element {
    return (
        <>
            {sentences.map((sentence, i) => {
                return <div className="sentence" key={i}>
                    {disabled
                        ? <a href="#" onClick={() => onClick(sentence)}>
                            {" • "}
                            {sentence.words.map((word, i) => {
                                return <span>{word.text} </span>
                            })}
                        </a>
                        : <p>
                            {sentence.words.map((word, i) => {
                                return <span>{word.text} </span>
                            })}
                        </p>
                    }
                </div>
            })}
        </>
    );
}