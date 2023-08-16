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
        <div className='flex-column mx-6'>
            <div>
                <button className='flex-grow bg-slate-600 py-2 px-8 mb-3 rounded-md' onClick={() => submit()}>Done</button>
            </div>
            <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                className='fullscreen-input text-large text-slate-900 rounded-sm'
            />
        </div>
    );
}

export default InputText;
