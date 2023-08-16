import React, { ChangeEvent, useRef } from 'react';
import { useFileContext } from '../contexts/FileContext';

function FileUpload(): JSX.Element {
  const { selectedFile, updateSrc, resetFile} = useFileContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file != null) {
      updateSrc(file);
    }
  };

  return (
    <div>
      {selectedFile.path === ''
        ? <div className="upload">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt, .srt"
            onChange={handleFileChange}
          />
        </div>
        : <div className='flex gap-4 items-center py-1 px-4 justify-between'>
          <p className='font-bold'>{selectedFile.name}</p>
          <button onClick={resetFile} className='bg-slate-700'>X</button>
        </div>
      }
    </div>
  );
}

export default FileUpload;
