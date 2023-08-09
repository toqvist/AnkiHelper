import React, { useState, useRef, useEffect } from 'react';
import { useFileContext } from '../contexts/FileContext';

function InputText(): JSX.Element {
    const { inputToSource } = useFileContext();
    const [text, setText] = useState<string>('');

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = event.target.value;
        setText(newText);
    };

    function submit() {
        inputToSource(text);
    }

    // Automatically adjust the textarea's height based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    return (
        <div className='flex-column'>
            <div className='display-flex'>
                <button className='flex-grow' onClick={() => submit()}>Done</button>
            </div>
            <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                className='fullscreen-input text-large'
            />
        </div>
    );
}

export default InputText;
