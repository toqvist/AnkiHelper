import React, { useState } from 'react';
import { useFileContext } from '../contexts/FileContext';

function InputText(): JSX.Element {
    const { inputToSource } = useFileContext();

    const [text, setText] = useState<string>('');

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = event.target.value;
        setText(newText);
    };

    function submit() {
        inputToSource(text)
    }

    return (
        <div className='flex-column'>
            <div className='display-flex'>
                <button className='flex-grow' onClick={() => submit()}>Done</button>
            </div>
            <textarea
                value={text}
                onChange={handleTextChange}
                className='fullscreen-input text-large'
            />
        </div>
    );
}

export default InputText;