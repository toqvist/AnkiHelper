import React, { ChangeEvent, useRef } from 'react';
import { useFileContext } from '../contexts/FileContext';
import { XMarkIcon } from '@heroicons/react/24/solid'


function FileUpload(): JSX.Element {
  const { selectedFile, updateSrc, resetFile } = useFileContext();

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
        ? <div className="upload border-2 border-slate-600 border-dotted ">
          <input
            className="block w-full text-sm text-slate-400
            file:mr-4 file:py-2 file:px-4
            file:border-0
            file:text-sm file:font-semibold
          file:bg-slate-600 file:text-white
           hover:file:bg-slate-500
           "
            ref={fileInputRef}
            type="file"
            accept=".txt, .srt"
            onChange={handleFileChange}
          />
        </div>
        : <div className='flex gap-4 items-center py-1 px-4 justify-between border-2 border-slate-600 border-dotted'>
          <p className='font-bold'>{selectedFile.name}</p>
          <button onClick={resetFile} className='bg-slate-700'>
            <XMarkIcon className='h-6 w-6 stroke-slate-200' />
          </button>
        </div>
      }
    </div>
  );
}

export default FileUpload;
